using Newtonsoft.Json;
using System.IO;

namespace API.App_Start {
    public static class EnvironmentConfig {
        public static Config Read() {
            var path = System.Web.Hosting.HostingEnvironment.MapPath(@"~/App_Data");
            var jsonFile = Path.Combine(path, "environment.json");
            if (!File.Exists(jsonFile)) return null;

            var file = File.ReadAllText(jsonFile);
            return JsonConvert.DeserializeObject<Config>(file);
        }
    }

    public class Config {
        public string ConnectionString { get; set; }
        public string CorsUrls { get; set; }
    }
}