using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Avalonia.Controls;

namespace Vizyo.Display.Manager.Rendering
{
    public class TextMedia : BaseMedia
    {
        public override void Render()
        {
            this.Content = new TextBlock
            {
                Text = Source,
                TextWrapping = Avalonia.Media.TextWrapping.Wrap
            };
        }
    }
}
