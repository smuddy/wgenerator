using API.Controllers;
using API.Database;
using API.Services;
using Autofac;
using Autofac.Integration.WebApi;
using ProductService.Controllers;
using System.Web.Http;

namespace API.App_Start {
    /// <remarks>
    /// https://autofaccn.readthedocs.io/en/latest/integration/webapi.html#quick-start
    /// </remarks>
    public static class DependencyInjectionConfig {
        public static void RegisterDependecyInjection(this HttpConfiguration config) {
            var builder = new ContainerBuilder();
            builder.RegisterControllers();
            builder.RegisterWebApiFilterProvider(config);
            builder.RegisterWebApiModelBinderProvider();

            builder.RegisterServices();
            builder.RegisterDataProvider();

            var container = builder.Build();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }

        private static void RegisterControllers(this ContainerBuilder builder) {
            builder.RegisterType<SongsController>().InstancePerRequest();
            builder.RegisterType<FilesController>().InstancePerRequest();
        }

        private static void RegisterServices(this ContainerBuilder builder) {
            builder.RegisterType<Logger>();

            builder.RegisterType<FileService>().As<IFileService>().SingleInstance();
            builder.RegisterType<FileGarbageCollectionService>().As<IFileGarbageCollectionService>();
        }

        private static void RegisterDataProvider(this ContainerBuilder builder) {
            builder.RegisterType<DataContext>().InstancePerRequest();
        }

    }
}