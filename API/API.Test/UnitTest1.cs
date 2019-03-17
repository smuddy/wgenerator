using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Data.Entity.Core.EntityClient;
using System.Data.SqlClient;

namespace API.Test {
    [TestClass]
    public class SqlConnectionBuilder {
        [TestMethod]
        public void Build() {
            var serverName = "localhost\\SQLEXPRESS";
            var databaseName = "wgenerator";
            var user = "sa";
            var pass = "sa";

            // Initialize the connection string builder for the
            // underlying provider.
            var sqlBuilder =
                new SqlConnectionStringBuilder {

                    // Set the properties for the data source.
                    DataSource = serverName,
                    InitialCatalog = databaseName,
                    IntegratedSecurity = true,
                    UserID= user,
                    Password = pass,
                };

            // Build the SqlConnection connection string.
            var providerString = sqlBuilder.ToString();


            Console.WriteLine(providerString.ToString());

            using (var conn =
                new SqlConnection(providerString.ToString())) {
                conn.Open();
                Console.WriteLine("Just testing the connection.");
                conn.Close();
            }
        }
    }
}
