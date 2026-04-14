using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Avalonia.Controls;

namespace Vizyo.Display.Manager.Rendering
{
    public class VideoMedia : BaseMedia
    {
        public override void Render()
        {
            var border = new Border
            {
                Background = Avalonia.Media.Brushes.Black,
                Child = new TextBlock { Text = $"Video: {Source}", HorizontalAlignment = Avalonia.Layout.HorizontalAlignment.Center, VerticalAlignment = Avalonia.Layout.VerticalAlignment.Center }
            };
            this.Content = border;
        }
    }
}
