using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Vizyo.Display.Manager.Models;

namespace Vizyo.Display.Manager.Rendering
{
    public static class LayoutLoaderService
    {
        public static LayoutModel LoadLayout(string path)
        {
            var json = File.ReadAllText(path);
            var root = JsonSerializer.Deserialize<RootLayout>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            return root?.Layout ?? new LayoutModel();
        }
    }
}
