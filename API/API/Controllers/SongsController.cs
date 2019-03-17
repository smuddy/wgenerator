using API.Database;
using API.Models;
using API.Services;
using Microsoft.AspNet.OData;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
namespace ProductService.Controllers {
    public class SongsController : ODataController {

        public SongsController(
            DataContext db,
            Logger logger
            ) {
            this.db = db;
            this.logger = logger;
        }

        private readonly DataContext db;
        private readonly Logger logger;

        private bool ProductExists(int key) {
            logger.Log($"{nameof(SongsController)}.{nameof(ProductExists)}({key})");
            return db.Songs.Any(p => p.ID == key);
        }

        [EnableQuery]
        public IQueryable<Song> Get() {
            logger.Log($"{nameof(SongsController)}.{nameof(Get)}()");
            return db.Songs;
        }

        [EnableQuery]
        public SingleResult<Song> Get([FromODataUri] int key) {
            logger.Log($"{nameof(SongsController)}.{nameof(Get)}({key})");
            var result = db.Songs.Where(p => p.ID == key);
            return SingleResult.Create(result);
        }

        public async Task<IHttpActionResult> Post(Song song) {
            logger.Log($"{nameof(SongsController)}.{nameof(Post)}()");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            db.Songs.Add(song);
            await db.SaveChangesAsync();
            return Created(song);
        }

        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Song> product) {
            logger.Log($"{nameof(SongsController)}.{nameof(Patch)}({key})");
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }
            var entity = await db.Songs.FindAsync(key);
            if (entity == null) return NotFound();

            product.Patch(entity);
            try {
                await db.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException) {
                if (!ProductExists(key)) return NotFound();

                throw;

            }
            return Updated(entity);
        }

        public async Task<IHttpActionResult> Put([FromODataUri] int key, Song update) {
            logger.Log($"{nameof(SongsController)}.{nameof(Put)}({key})");
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (key != update.ID) return BadRequest();

            db.Entry(update).State = EntityState.Modified;
            try {
                await db.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException) {
                if (!ProductExists(key)) return NotFound();

                throw;

            }
            return Updated(update);
        }

        public async Task<IHttpActionResult> Delete([FromODataUri] int key) {
            logger.Log($"{nameof(SongsController)}.{nameof(Delete)}({key})");
            var product = await db.Songs.FindAsync(key);
            if (product == null) {
                return NotFound();
            }
            db.Songs.Remove(product);
            await db.SaveChangesAsync();
            return StatusCode(HttpStatusCode.NoContent);
        }

    }
}