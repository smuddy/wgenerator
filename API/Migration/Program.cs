using API.Client;
using API.Models;
using Data;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Migration {
    internal class Program {
        private static void Main(string[] args) {
            var path = @"d:\Documents\Worship Generator\";

            for (var i = 0; i < 500; i++) {
                var xmlFile = Path.Combine(path, i.ToString() + ".xml");
                if (!System.IO.File.Exists(xmlFile)) continue;

                var ds = new SongDataset();
                ds.ReadXml(xmlFile);

                var source = ds.SONGLIST[0];

                var song = new Song {
                    Name = source.NAME.TrimEnd('\r', '\n'),
                    Number = source.NUMBER,
                    SongType = MapSongType(source),
                    Tempo = source.IsSPEEDNull() ? (int?)null : source.SPEED,
                    Key = MapKey(source),
                    Text = source.IsPREVIEWNull() ? null : source.PREVIEW,
                    Comments = source.IsCOMMENTNull() ? null : source.COMMENT,
                    Final = source.IsFINALNull() ? false : source.FINAL
                };
                Console.WriteLine(song.Name);

                var client = new Client();
                Task.WaitAll(new[] { client.Post(song) });
            }

            Console.ReadKey();

        }
        private static SongType MapSongType(SongDataset.SONGLISTRow source) {
            if (source.IsKINDNull()) return SongType.None;
            switch (source.KIND) {
                case "Lobpreis": return SongType.Praise;
                case "Anbetung": return SongType.Worship;
                default: return SongType.None;
            }
        }

        private static string MapKey(SongDataset.SONGLISTRow source) {
            if (source.IsHARMONICNull()) return null;

            switch (source.HARMONIC) {
                case "D": return KeysSMaj.D;
                case "a": return KeysSMin.A;
                case "d": return KeysSMin.D;
                case "G": return KeysSMaj.G;
                case "E": return KeysSMaj.E;
                case "C": return KeysSMaj.C;
                case "A": return KeysSMaj.A;
                case "e": return KeysSMin.E;
                case "fis": return KeysSMin.FS;
                default: return null;
            }
        }
    }
}
