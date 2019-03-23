using API.Database;
using API.Services;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace API.Controllers {
    public class FilesController : ApiController {
        private readonly DataContext dataContext;
        private readonly IFileService fileService;

        public FilesController(
            DataContext dataContext,
            IFileService fileService
            ) {
            this.dataContext = dataContext;
            this.fileService = fileService;
        }

        // GET: api/Files/5
        [Route("api/songs/{songId}/files/{fileId}")]
        public string Get(int id) {
            return "value";
        }

        // POST: api/Files
        [Route("api/songs/{songId}/files")]
        public async Task<IHttpActionResult> Post(long songId, CancellationToken c) {
            // get file from network input
            var files = HttpContext.Current.Request.Files;
            if (files.Count != 1) return BadRequest();
            var file = HttpContext.Current.Request.Files[0];

            // find song in database
            var song = dataContext.Songs.Find(songId);
            if (song == null) return NotFound();

            // save file in App_Data
            var path = System.Web.Hosting.HostingEnvironment.MapPath(@"~/App_Data");
            var filename = await fileService.Save(file, path, c);

            // attach file reference to song
            song.Files.Add(new Models.File {
                Name = file.FileName,
                ReferenceFile = filename
            });
            await dataContext.SaveChangesAsync(c);

            return Ok();
        }






        //// PUT: api/Files/5
        //public void Put(int id, [FromBody]string value) {
        //}

        //// DELETE: api/Files/5
        //public void Delete(int id) {
        //}
    }
}
