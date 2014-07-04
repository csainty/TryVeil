using System;
using System.IO;
using System.Text;
using Nancy;
using TryVeil.ViewModels;
using Veil;

namespace TryVeil
{
    public class TryVeilModule : NancyModule
    {
        private static readonly VeilEngine Engine = new VeilEngine();

        public TryVeilModule()
        {
            Get["/"] = _ => View["HomePage", SingletonViewModel.InstanceJson.Value];

            Post["/{parserKey}"] = _ =>
            {
                string parserKey = _.parserKey;

                try
                {
                    using (var reader = new StreamReader(Request.Body))
                    {
                        var template = Engine.Compile<AlbumViewModel>(parserKey, reader);

                        return new Response
                        {
                            StatusCode = HttpStatusCode.OK,
                            ContentType = "text/plain; charset=utf-8",
                            Contents = s =>
                            {
                                using (var writer = new StreamWriter(s, Encoding.UTF8))
                                {
                                    template(writer, SingletonViewModel.Instance);
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
}