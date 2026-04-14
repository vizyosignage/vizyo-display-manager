using System.Threading.Tasks;
using System;
using Avalonia.Controls;
using Ursa.Controls;
using Vizyo.Display.Manager.ViewModels;

namespace Vizyo.Display.Manager.Views
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            //this.Width = 1920;
            //this.Height = 1080;
            this.WindowStartupLocation = WindowStartupLocation.CenterScreen;
            this.WindowState = WindowState.Normal;
            //this.WindowState = WindowState.FullScreen;

            // Web host (Microsoft.AspNetCore) only works on Windows, Linux, and macOS desktop. It does not work on Android or iOS mobile.
            // Moved under Vizyo.Display.Manager.HostDesktop.Program.cs
            //this.Closed += (_, _) =>
            //{
            //    Task.Run(async () =>
            //    {
            //        try
            //        {
            //            await BlazorHostService.StopAsync();
            //            Debug.WriteLine("Blazor host stopped.");
            //        }
            //        catch (Exception ex)
            //        {
            //            Debug.WriteLine($"Error stopping Blazor host: {ex}");
            //        }
            //    });
            //};
        }
    }
}