using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace API.Services {
    public interface IFileService {
        Task<Guid> Save(HttpPostedFile file, string path, CancellationToken c);
    }

    public class FileService : IFileService {
        private const int bufferSize = 4096;

        public async Task<Guid> Save(HttpPostedFile file, string path, CancellationToken c) {
            var filename = Guid.NewGuid();
            var fullPath = Path.Combine(path, filename.ToString());
            using (var fs = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.None, bufferSize, true)) {
                await file.InputStream.CopyToAsync(fs, bufferSize, c);
            }

            return filename;
        }

    }
}