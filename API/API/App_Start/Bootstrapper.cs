using Autofac;
using Autofac.Integration.WebApi;
using System.Reflection;
using System.Web.Http;

namespace API.App_Start
{
    /// <remarks>
    /// https://autofaccn.readthedocs.io/en/latest/integration/webapi.html#quick-start
    /// </remarks>
    public class Bootstrapper
    {
        public void InitContainer() {
            var config = GlobalConfiguration.Configuration;
            var builder = new ContainerBuilder();
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
            builder.RegisterWebApiFilterProvider(config);
            builder.RegisterWebApiModelBinderProvider();

            RegisterServices(builder);

            var container = builder.Build();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }

        private void RegisterServices(ContainerBuilder builder) {
            // ... builder.RegisterType<object>();
        }

    }
}