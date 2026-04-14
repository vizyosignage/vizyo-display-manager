using Avalonia;
using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using Vizyo.Display.Manager.Models;

namespace Vizyo.Display.Manager;

public partial class PageView : UserControl
{
    private readonly PageModel _page;
    
    public PageView(PageModel page)
    {
        InitializeComponent();
        _page = page;

        LoadRegions();
    }
    private void LoadRegions()
    {
        MainCanvas.Children.Clear();
        foreach (var region in _page.Regions)
        {
            var regionView = new RegionView(region);
            Canvas.SetLeft(regionView, region.X);
            Canvas.SetTop(regionView, region.Y);
            MainCanvas.Children.Add(regionView);
        }
    }

}
