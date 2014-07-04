using System.Collections.Generic;

namespace TryVeil.ViewModels
{
    public class AlbumViewModel
    {
        public string AlbumName { get; set; }

        public ArtistViewModel Artist { get; set; }

        public ICollection<TrackViewModel> Tracks { get; set; }

        public bool IsAvailableOnVinyl { get; set; }

        public bool WasUSNumberOne { get; set; }

        public ICollection<ReviewViewModel> Reviews { get; set; }
    }
}