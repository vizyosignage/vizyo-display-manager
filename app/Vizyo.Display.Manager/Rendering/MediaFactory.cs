using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vizyo.Display.Manager.Models;

namespace Vizyo.Display.Manager.Rendering
{
    public static class MediaFactory
    {
        public static BaseMedia CreateMedia(MediaModel media)
        {
            BaseMedia m = media.Type.ToLower() switch
            {
                "image" => new ImageMedia { Source = media.Source },
                "video" => new VideoMedia { Source = media.Source },
                "text" => new TextMedia { Source = media.Source },
                "ticker" => new TickerMedia { Source = media.Source },
                "webview" => new WebViewMedia { Source = media.Source },
                _ => new TextMedia { Source = $"Unknown type: {media.Type}" }
            };
            m.Render();
            return m;
        }
    }
}
