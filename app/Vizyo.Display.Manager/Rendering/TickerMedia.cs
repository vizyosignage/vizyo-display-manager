using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Avalonia.Controls;

namespace Vizyo.Display.Manager.Rendering
{
    public class TickerMedia : BaseMedia
    {
        public override void Render()
        {
            var textBlock = new TextBlock
            {
                Text = Source
            };
            var border = new Border
            {
                ClipToBounds = true,
                Child = textBlock
            };
            this.Content = border;
        }
    }
}
