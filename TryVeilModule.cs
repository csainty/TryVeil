using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Nancy;
using Newtonsoft.Json;
using Veil;

namespace TryVeil
{
    public class TryVeilModule : NancyModule
    {
        private static readonly VeilEngine Engine = new VeilEngine();

        private static readonly AlbumViewModel StaticAlbumViewModel = new AlbumViewModel
        {
            AlbumName = "F♯ A♯ ∞",
            Artist = new ArtistViewModel {
                ArtistName = "Godspeed You! Black Emperor"
            },
            IsAvailableOnVinyl = true,
            WasUSNumberOne = false,
            Tracks = new[] {
                new TrackViewModel { TrackName = "The Dead Flag Blues", Length = TimeSpan.FromSeconds(16*60+27) },
                new TrackViewModel { TrackName = "East Hastings", Length = TimeSpan.FromSeconds(17*60+58) },
                new TrackViewModel { TrackName = "Providence", Length = TimeSpan.FromSeconds(29*60+02) }
            },
            Reviews = new ReviewViewModel[0]
        };

        private static readonly Lazy<string> ViewModelJson = new Lazy<string>(() =>
        {
            return JsonConvert.SerializeObject(StaticAlbumViewModel, Formatting.Indented);
        });

        public TryVeilModule()
        {
            Get["/"] = _ => View["HomePage", ViewModelJson.Value];

            Post["/{parserKey}"] = _ =>
            {
                string parserKey = _.parserKey;

                try
                {
                    using (var reader = new StreamReader(Request.Body))
                    {
                        var template = Engine.Compile<AlbumViewModel>(parserKey, reader);

                        return new Response()
                        {
                            StatusCode = HttpStatusCode.OK,
                            ContentType = "text/html",
                            Contents = s =>
                            {
                                using (var writer = new StreamWriter(s, Encoding.UTF8))
                                {
                                    template(writer, StaticAlbumViewModel);
                                }
                            }
                        };
                    }
                }
                catch (Exception e)
                {
                    return Response.AsText(e.Message);
                }
            };
        }
    }

    public class AlbumViewModel
    {
        public string AlbumName { get; set; }

        public ArtistViewModel Artist { get; set; }

        public ICollection<TrackViewModel> Tracks { get; set; }

        public bool IsAvailableOnVinyl { get; set; }

        public bool WasUSNumberOne { get; set; }

        public ICollection<ReviewViewModel> Reviews { get; set; }
    }

    public class ArtistViewModel
    {
        public string ArtistName { get; set; }
    }

    public class TrackViewModel
    {
        public string TrackName { get; set; }

        public TimeSpan Length { get; set; }
    }

    public class ReviewViewModel
    {
        public string Text { get; set; }
    }
}