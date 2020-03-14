﻿using API.App_Start;
using API.Models;
using Microsoft.AspNet.OData.Builder;
using Microsoft.AspNet.OData.Extensions;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.Cors;

namespace API {
    public static class WebApiConfig {
        public static void Register(HttpConfiguration config) {

            // CORS
            var cors = new EnableCorsAttribute(EnvironmentConfig.Read()?.CorsUrls ?? "http://localhost:4200", "*", "*") {
                SupportsCredentials = true
            };
            config.EnableCors(cors);

            // Web API configuration and services
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));

            // Web API routes
            config.MapHttpAttributeRoutes();
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // Web API oData configuration
            var builder = new ODataConventionModelBuilder();
            builder.EntitySet<Song>("songs");
            config.Count().Filter().OrderBy().Expand().Select().MaxTop(null);
            config.MapODataServiceRoute(
                routeName: "songs",
                routePrefix: "odata",
                model: builder.GetEdmModel());

            config.RegisterDependecyInjection();

        }
    }
}