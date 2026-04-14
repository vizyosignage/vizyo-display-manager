using System;
using System.Diagnostics;
using System.Runtime.Versioning;
using System.Threading.Tasks;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Media;
using Avalonia.Threading;
using Microsoft.Extensions.DependencyInjection;
using Vizyo.Display.Manager.ViewModels;
using Vizyo.Display.Manager.Views;

namespace Vizyo.Display.Manager.HostDesktop
{
    [SupportedOSPlatform("windows")]
    [SupportedOSPlatform("linux")]
    [SupportedOSPlatform("macos")]
    internal sealed class Program
    {
        // Initialization code. Don't use any Avalonia, third-party APIs or any
        // SynchronizationContext-reliant code before AppMain is called: things aren't initialized
        // yet and stuff might break.
        //[STAThread]
        //public static void Main(string[] args) => BuildAvaloniaApp()
        //    .StartWithClassicDesktopLifetime(args);

        [STAThread]
        public static void Main(string[] args)
        {
            Task.Factory.StartNew(async() => await VizyoHostService.StartAsync());
            Debug.WriteLine("Vizyo host started");

            var appBuilder = BuildAvaloniaApp()
                .With(new FontManagerOptions
                {
                    FontFallbacks = new[]
                    {
                new FontFallback { FontFamily = new FontFamily("Microsoft YaHei") }
                    }
                });

            var lifetime = new ClassicDesktopStyleApplicationLifetime();
            appBuilder.SetupWithLifetime(lifetime);

            var services = new ServiceCollection();

            lifetime.MainWindow = new MainWindow();

            var topLevel = TopLevel.GetTopLevel(lifetime.MainWindow);
            services.AddNotificationServices(topLevel);
            services.AddTransient<MainViewModel>();

            var serviceProvider = services.BuildServiceProvider();

            var vm = serviceProvider.GetService<MainViewModel>();
            lifetime.MainWindow.DataContext = vm; //serviceProvider.GetRequiredService<MainViewModel>();

            lifetime.MainWindow.Opened += (_, _) =>
            {
                try
                {
                    Dispatcher.UIThread.Post(() =>
                    {
                        vm?.ShowSuccessToast("host");
                    });
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"Error starting Vizyo host: {ex.Message}");
                }
            };

            lifetime.MainWindow.Closed += async (_, _) =>
            {
                try
                {
                    await VizyoHostService.StopAsync();
                    Debug.WriteLine("Vizyo host stopped");
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"Error stopping Vizyo host: {ex.Message}");
                }
            };

            lifetime.Start(args);
        }

        // Avalonia configuration, don't remove; also used by visual designer.
        public static AppBuilder BuildAvaloniaApp()
            => AppBuilder.Configure<App>()
                .UsePlatformDetect()
                .WithInterFont()
                .LogToTrace();
    }
}
