
using API.Models;
using Simple.OData.Client;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace API.Client {
    public class Client {
        private static string url = ConfigurationManager.AppSettings["url"] + "/odata";
        
        public async Task<IEnumerable<Song>> Get() {
            var client = new ODataClient(url).For<Song>();
            var songs = await client.FindEntriesAsync();
            return songs;
        }
               
        public async Task<IEnumerable<Song>> Get(Expression<Func<Song, bool>> filterExpression) {
            var client = new ODataClient(url).For<Song>();
            var songs = await client.Filter(filterExpression).FindEntriesAsync();
            return songs;
        }

        public async Task<Song> Get(long id) {
            var client = new ODataClient(url).For<Song>();
            var song = await client.Key(id).FindEntryAsync();
            return song;
        }

        public async Task<Song> Post(Song song) {
            var client = new ODataClient(url).For<Song>();
            var insertedSong = await client.Set(song).InsertEntryAsync();
            return insertedSong;
        }

        public async Task<int> Delete(long id) {
            var client = new ODataClient(url).For<Song>();
            var count = await client.Key(id).DeleteEntriesAsync();
            return count;
        }
    }


}
