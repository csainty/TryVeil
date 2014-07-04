using System;
using Newtonsoft.Json;
using TryVeil.ViewModels;

namespace TryVeil
{
    public class SingletonViewModel
    {
        public static readonly AlbumViewModel Instance = new AlbumViewModel
        {
            AlbumName = "F♯ A♯ ∞",
            Artist = new ArtistViewModel
            {
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

        public static readonly Lazy<string> InstanceJson = new Lazy<string>(() =>
        {
            return JsonConvert.SerializeObject(Instance, Formatting.Indented);
        });
    }
}