using System;
using System.Collections.Generic;
using System.IO;
using Nancy;
using Newtonsoft.Json;
using Veil;

namespace TryVeil
{
    public class TryVeilModule : NancyModule
    {
        private static readonly VeilEngine Engine = new VeilEngine();

        private static readonly ViewModel ViewModel = new ViewModel
        {
            AlbumName = "F♯A♯∞",
            Artist = "Godspeed You! Black Emperor",
            Tracks = new[] {
                new TrackViewModel { TrackName = "The Dead Flag Blues", Length = TimeSpan.FromSeconds(16*60+27) },
                new TrackViewModel { TrackName = "East Hastings", Length = TimeSpan.FromSeconds(17*60+58) },
                new TrackViewModel { TrackName = "Providence", Length = TimeSpan.FromSeconds(29*60+02) }
            }
        };

        private static readonly Lazy<string> ViewModelJson = new Lazy<string>(() =>
        {
            return JsonConvert.SerializeObject(ViewModel, Formatting.Indented);
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
                        var template = Engine.Compile<ViewModel>(parserKey, reader);

                        return new Response()
                        {
                            StatusCode = HttpStatusCode.OK,
                            ContentType = "text/html",
                            Contents = s =>
                            {
                                using (var writer = new StreamWriter(s))
                                {
                                    template(writer, ViewModel);
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

    public class ViewModel
    {
        public string AlbumName { get; set; }

        public string Artist { get; set; }

        public IEnumerable<TrackViewModel> Tracks { get; set; }
    }

    public class TrackViewModel
    {
        public string TrackName { get; set; }

        public TimeSpan Length { get; set; }
    }
}