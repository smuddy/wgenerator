using API.Database;
using API.Models;
using System;

namespace API.Services {
    public class Logger {
        private readonly DataContext db;

        public Logger(DataContext db) {
            this.db = db;
        }

        public void Log(string method) {
            var log = new Log {
                Date = DateTime.Now,
                Method = method
            };
            db.Logs.Add(log);
            db.SaveChanges();
        }
    }
}