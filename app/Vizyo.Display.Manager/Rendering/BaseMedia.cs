using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Avalonia.Controls;

namespace Vizyo.Display.Manager.Rendering
{
    public abstract class BaseMedia : UserControl
    {
        public string Source { get; set; }
        public abstract void Render();
    }
}
