using API.Database;
using API.Services;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace API.Controllers {
    public class FilesController : ApiController {
        private readonly DataContext dataContext;
        private readonly IFileService fileService;
        private readonly IFileGarbageCollectionService fileGarbageCollectionService;
        private readonly string dataPath;

        public FilesController(
            DataContext dataContext,
            IFileService fileService,
            IFileGarbageCollectionService fileGarbageCollectionService
            ) {
            this.dataContext = dataContext;
            this.fileService = fileService;
            this.fileGarbageCollectionService = fileGarbageCollectionService;
            dataPath = System.Web.Hosting.HostingEnvironment.MapPath(@"~/App_Data");
        }

        // GET: api/Files/5
        [Route("api/songs/{songId}/files/{fileId}")]
        public HttpResponseMessage Get(long songId, long fileId) {
            var response = new HttpResponseMessage(HttpStatusCode.OK);
            fileGarbageCollectionService.Collect(dataPath);

            var file = dataContext.Files.Find(fileId);
            if (file == null || file.Song.ID != songId) return new HttpResponseMessage(HttpStatusCode.NotFound);
            var reference = file.ReferenceFile;
            var filename = file.Name;

            var stream = fileService.Load(dataPath, reference.ToString());
            response.Content = new StreamContent(stream);
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment") {
                FileName = filename
            };
            return response;
        }

        // POST: api/Files
        [Route("api/songs/{songId}/files")]
        public async Task<HttpResponseMessage> Post(long songId, CancellationToken c) {
            fileGarbageCollectionService.Collect(dataPath);

            // get file from network input
            var files = HttpContext.Current.Request.Files;
            if (files.Count != 1) return new HttpResponseMessage(HttpStatusCode.BadRequest);
            var file = HttpContext.Current.Request.Files[0];

            // find song in database
            var song = dataContext.Songs.Find(songId);
            if (song == null) return new HttpResponseMessage(HttpStatusCode.NotFound);

            // save file in App_Data
            var stream = file.InputStream;
            var filename = await fileService.Save(stream, dataPath, c);

            // attach file reference to song
            song.Files.Add(new Models.File {
                Name = file.FileName,
                ReferenceFile = filename
            });
            await dataContext.SaveChangesAsync(c);

            return new HttpResponseMessage(HttpStatusCode.OK);
        }






        //// PUT: api/Files/5
        //public void Put(int id, [FromBody]string value) {
        //}

        //// DELETE: api/Files/5
        //public void Delete(int id) {
        //}
    }
}
