using System;
using System.Collections.Generic;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using Avalonia.Threading;
using Vizyo.Display.Manager.Models;
using Vizyo.Display.Manager.Rendering;

namespace Vizyo.Display.Manager;

public partial class RegionView : UserControl
{
    private List<MediaModel> _medias;
    private int _currentIndex = 0;
    private DispatcherTimer _timer;

    public RegionView(RegionModel region)
    {
        InitializeComponent();

        _medias = region.Medias;
        Width = region.Width;
        Height = region.Height;

        LoadMedia(_currentIndex);
    }

    private void LoadMedia(int index)
    {
        if (index >= _medias.Count)
            index = 0;

        var mediaModel = _medias[index];
        this.Content = MediaFactory.CreateMedia(mediaModel);

        _timer?.Stop();
        _timer = new DispatcherTimer { Interval = TimeSpan.FromMilliseconds(mediaModel.Duration) };
        _timer.Tick += (s, e) =>
        {
            _timer.Stop();
            _currentIndex++;
            LoadMedia(_currentIndex);
        };
        _timer.Start();
    }
}