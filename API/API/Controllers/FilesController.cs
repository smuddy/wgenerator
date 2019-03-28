using API.Database;
using API.Models;
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
        [Route("api/songs/{songId}/files/{fileId}", Order = 1)]
        public async Task<HttpResponseMessage> Get(long songId, long fileId) {
            var response = new HttpResponseMessage(HttpStatusCode.OK);
            fileGarbageCollectionService.Collect(dataPath);

            var file = await dataContext.Files.FindAsync(fileId);
            if (file == null || file.Song.ID != songId) return new HttpResponseMessage(HttpStatusCode.NotFound);
            var reference = file.ReferenceFile;

            var stream = fileService.Load(dataPath, reference.ToString());
            response.Content = new StreamContent(stream);
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
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
            song.Files.Add(new File {
                Name = file.FileName,
                ReferenceFile = filename
            });
            await dataContext.SaveChangesAsync(c);

            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        [Route("api/songs/{songId}/files/{fileId}/edit"), HttpGet]
        public async Task<HttpResponseMessage> Edit(long songId, long fileId, string Name, FileType FileType, CancellationToken c) {
            var file = await dataContext.Files.FindAsync(fileId);
            if (file == null || file.Song.ID != songId) return new HttpResponseMessage(HttpStatusCode.NotFound);

            file.Name = Name;
            file.FileType = FileType;
            await dataContext.SaveChangesAsync();

            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        [Route("api/songs/{songId}/files/{fileId}/delete"), HttpGet]
        public async Task<HttpResponseMessage> Delete(long songId, long fileId, CancellationToken c) {
            var file = await dataContext.Files.FindAsync(fileId);
            if (file == null || file.Song.ID != songId) return new HttpResponseMessage(HttpStatusCode.NotFound);

            dataContext.Files.Remove(file);
            await dataContext.SaveChangesAsync();
            fileGarbageCollectionService.Collect(dataPath);

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
