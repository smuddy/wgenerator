using API.Database;
using API.Database.Model;
using Microsoft.AspNet.OData;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
namespace ProductService.Controllers {
    public class SongsController : ODataController {

        public SongsController(DataContext db) {
            this.db = db;
        }

        private readonly DataContext db;

        private bool ProductExists(int key) {
            return db.Songs.Any(p => p.ID == key);
        }

        [EnableQuery]
        public IQueryable<Song> Get() {
            return db.Songs;
        }

        [EnableQuery]
        public SingleResult<Song> Get([FromODataUri] int key) {
            var result = db.Songs.Where(p => p.ID == key);
            return SingleResult.Create(result);
        }

        public async Task<IHttpActionResult> Post(Song song) {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            db.Songs.Add(song);
            await db.SaveChangesAsync();
            return Created(song);
        }

        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Song> product) {
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


    }
}