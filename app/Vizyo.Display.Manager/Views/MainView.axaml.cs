using System.Diagnostics;
using Avalonia;
using Avalonia.Controls;
using Ursa.Controls;
using Vizyo.Display.Manager.ViewModels;

namespace Vizyo.Display.Manager.Views
{
    public partial class MainView : UserControl
    {
        private MainViewModel? _viewModel;
        public MainView()
        {
            InitializeComponent();
        }

        //protected override void OnAttachedToVisualTree(VisualTreeAttachmentEventArgs e)
        //{
        //    base.OnAttachedToVisualTree(e);
        //    if (DataContext is not MainViewModel vm) return;

        //    var topLevel = TopLevel.GetTopLevel(this);
        //    _viewModel = vm;
        //    _viewModel.ToastManager = new WindowToastManager(topLevel) { MaxItems = 4 };
        //    _viewModel.NotificationManager = WindowNotificationManager.TryGetNotificationManager(topLevel, out var manager)
        //    ? manager
        //    : new WindowNotificationManager(topLevel);
        //}

        //protected override void OnDetachedFromVisualTree(VisualTreeAttachmentEventArgs e)
        //{
        //    base.OnDetachedFromVisualTree(e);
        //    _viewModel?.ToastManager?.Uninstall();
        //}

        //protected override void OnSizeChanged(SizeChangedEventArgs e)
        //{
        //    base.OnSizeChanged(e);
        //    mainGrid.Width = this.Width;
        //    mainGrid.Height = this.Height;
        //    mainCanvas.Width = this.Width;
        //    mainCanvas.Height = this.Height;
        //    Debug.WriteLine($"w: {e.NewSize.Width} h: {e.NewSize.Height}");
        //}

        //private void MainView_SizeChanged(object? sender, SizeChangedEventArgs e)
        //{
        //    var newWidth = e.NewSize.Width;
        //    var newHeight = e.NewSize.Height;

        //    //var actualWidth = this.Bounds.Width;
        //    //var actualHeight = this.Bounds.Height;

        //    mainGrid.Width = newWidth;
        //    mainGrid.Height = newHeight;
        //    mainCanvas.Width = newWidth;
        //    mainCanvas.Height = newHeight;

        //    Debug.WriteLine($"Width: {newHeight:F0}, Height: {newHeight:F0}");
        //}
    }
}