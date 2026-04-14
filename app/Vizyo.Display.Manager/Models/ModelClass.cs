using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vizyo.Display.Manager.Models
{
    public class MediaModel
    {
        public string Type { get; set; }
        public string Source { get; set; }
        public int Duration { get; set; } // ms
    }

    public class RegionModel
    {
        public string Id { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public List<MediaModel> Medias { get; set; }
    }

    public class PageModel
    {
        public string Id { get; set; }
        public int Duration { get; set; }
        public List<RegionModel> Regions { get; set; }
    }

    public class LayoutModel
    {
        public double Width { get; set; }
        public double Height { get; set; }
        public string BackgroundColor { get; set; }
        public string BackgroundImage { get; set; }
        public List<PageModel> Pages { get; set; }
    }

    public class RootLayout
    {
        public LayoutModel Layout { get; set; }
    }
}
