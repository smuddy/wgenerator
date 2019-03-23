using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace API.Services {
    public interface IFileService {
        Task<Guid> Save(Stream file, string path, CancellationToken c);
        Stream Load(string path, string filename);
    }

    public class FileService : IFileService {
        private const int bufferSize = 4096;

        public async Task<Guid> Save(Stream inputStream, string path, CancellationToken c) {
            var filename = Guid.NewGuid();
            var fullPath = Path.Combine(path, filename.ToString());
            using (var fileStream = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.None, bufferSize, true)) {
                await inputStream.CopyToAsync(fileStream, bufferSize, c);
            }

            return filename;
        }
        
        public Stream Load(string path, string filename) {
            var fullPath = Path.Combine(path, filename.ToString());
            var fileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.None, bufferSize, true);
            return fileStream;
        }

    }
}