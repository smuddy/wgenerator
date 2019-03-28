using API.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Simple.OData.Client;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using File = System.IO.File;

namespace API.Client.Test {
    [TestClass]
    public class OdataTests {

        private const string TEST_CASE_IDENTIFIER = "TESTCASE";
        private static Song testSong;


        [ClassInitialize]
        public static async Task TestInitialize(TestContext tc) {
            var client = new Client();
            var newSong = new Song {
                Name = Guid.NewGuid().ToString(),
                Text = TEST_CASE_IDENTIFIER
            };

            testSong = await client.Post(newSong);
        }

        [ClassCleanup]
        public static async Task ClassCleanup() {
            var client = new Client();
            var itemsToDelete = await client.Get(_ => _.Text == TEST_CASE_IDENTIFIER);
            foreach (var item in itemsToDelete) {
                await client.Delete(item.ID);
            }
        }

        [TestMethod]
        public async Task GetList() {
            var client = new Client();
            var data = await client.Get();

            Assert.IsTrue(data.Any(_ => _.ID == testSong.ID));
        }

        [TestMethod]
        public async Task GetItem() {
            var client = new Client();
            var item = await client.Get(testSong.ID);

            Assert.AreEqual(testSong.Name, item.Name);
        }

        [TestMethod]
        public async Task PostItem() {
            var client = new Client();
            var newSong = new Song {
                Name = Guid.NewGuid().ToString(),
                Text = TEST_CASE_IDENTIFIER
            };

            var response = await client.Post(newSong);
            var insertedSong = await client.Get(response.ID);

            Assert.AreEqual(newSong.Name, insertedSong.Name);
        }

        [TestMethod]
        public async Task PatchItem() {
            var client = new Client();
            var newSong = new Song {
                Name = Guid.NewGuid().ToString(),
                Text = TEST_CASE_IDENTIFIER,
                Comments = "Item to Patch"
            };

            var response = await client.Post(newSong);
            try {
                var patchedSong = await client.Patch(response.ID, new { Comments = "patched" });
            } catch (WebRequestException ex) {
                File.WriteAllText("error.html", ex.Response);
                throw;
            }
            var insertedSong = await client.Get(response.ID);

            Assert.AreEqual("patched", insertedSong.Comments);
            Assert.AreEqual(newSong.Name, insertedSong.Name);
            Assert.AreEqual(TEST_CASE_IDENTIFIER, insertedSong.Text);
        }

        [TestMethod]
        public async Task DeleteItem() {
            var client = new Client();
            var newSong = new Song {
                Name = Guid.NewGuid().ToString(),
                Text = TEST_CASE_IDENTIFIER
            };

            var response = await client.Post(newSong);
            var insertedSong = await client.Get(response.ID);
            Assert.AreEqual(newSong.Name, insertedSong.Name);
            try {

                var count = await client.Delete(response.ID);
                Assert.AreEqual(1, count);
            } catch (WebRequestException ex) {
                File.WriteAllText("error.html", ex.Response);
                throw;
            }

            try {
                await client.Get(response.ID);
                Assert.Fail("WebRequestException not thrown");
            } catch (WebRequestException ex) {
                Assert.AreEqual(HttpStatusCode.NotFound, ex.Code);
            }

        }


    }
}
