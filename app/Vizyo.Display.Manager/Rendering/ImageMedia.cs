using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vizyo.Display.Manager.Rendering
{
    public class ImageMedia : BaseMedia
    {
        public override void Render()
        {
            var img = new Avalonia.Controls.Image
            {
                Source = new Avalonia.Media.Imaging.Bitmap(Source),
                Stretch = Avalonia.Media.Stretch.UniformToFill
            };
            this.Content = img;
        }
    }
}
