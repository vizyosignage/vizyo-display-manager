using System.Collections.Generic;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using Vizyo.Display.Manager.Models;

namespace Vizyo.Display.Manager;

public partial class LayoutView : UserControl
{
    public LayoutView()
    {
        InitializeComponent();
    }

    public void AddRegion(RegionModel model)
    {
        var regionView = new RegionView(model);

        Canvas.SetLeft(regionView, model.X);
        Canvas.SetTop(regionView, model.Y);

        MainCanvas.Children.Add(regionView);
    }

    public void LoadRegions(List<RegionModel> regions)
    {
        MainCanvas.Children.Clear();
        foreach (var region in regions)
            AddRegion(region);
    }
}