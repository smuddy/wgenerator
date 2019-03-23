using API.Database;
using System.Linq;

namespace API.Services {
    public interface IFileGarbageCollectionService {
        void Collect(string path);
    }
    public class FileGarbageCollectionService : IFileGarbageCollectionService {
        private readonly IFileService fileService;
        private readonly DataContext dataContext;
        private readonly string[] fileExcludes;

        public FileGarbageCollectionService(
            IFileService fileService,
            DataContext dataContext
        ) {
            this.fileService = fileService;
            this.dataContext = dataContext;
            fileExcludes = new[] { "environment.json" };
        }

        public void Collect(string path) {
            var filesInStoreage = fileService.ListFiles(path);
            var filesInDatabase = dataContext.Files.Select(_ => _.ReferenceFile.ToString());
            var filesWithoutReference = filesInStoreage
                .Except(filesInDatabase)
                .Except(fileExcludes);

            foreach (var file in filesWithoutReference) {
                fileService.Delete(path, file);
            }
        }
    }
}