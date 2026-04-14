using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Avalonia.Controls;

namespace Vizyo.Display.Manager.Rendering
{
    public class WebViewMedia : BaseMedia
    {
        public override void Render()
        {
            var border = new Border
            {
                Background = Avalonia.Media.Brushes.Gray,
                Child = new TextBlock { Text = $"Web: {Source}", HorizontalAlignment = Avalonia.Layout.HorizontalAlignment.Center, VerticalAlignment = Avalonia.Layout.VerticalAlignment.Center }
            };
            this.Content = border;
        }
    }
}
