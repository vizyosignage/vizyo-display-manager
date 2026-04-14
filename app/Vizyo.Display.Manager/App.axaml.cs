using System;
using System.Globalization;
using System.Linq;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Data.Core;
using Avalonia.Data.Core.Plugins;
using Avalonia.Markup.Xaml;
using Microsoft.Extensions.DependencyInjection;
using Vizyo.Display.Manager.Services.Localization;
using Vizyo.Display.Manager.ViewModels;
using Vizyo.Display.Manager.Views;

namespace Vizyo.Display.Manager
{
    public partial class App : Application
    {
        public static IServiceProvider? Services { get; private set; }

        public override void Initialize()
        {
            AvaloniaXamlLoader.Load(this);
        }

        //public override void OnFrameworkInitializationCompleted()
        //{
        //    if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
        //    {
        //        //desktop.Exit += async (_, _) =>
        //        //{
        //        //    await BlazorHostService.StopAsync();
        //        //};

        //        // Avoid duplicate validations from both Avalonia and the CommunityToolkit. 
        //        // More info: https://docs.avaloniaui.net/docs/guides/development-guides/data-validation#manage-validationplugins
        //        DisableAvaloniaDataAnnotationValidation();
        //        desktop.MainWindow = new MainWindow
        //        {
        //            DataContext = new MainViewModel()
        //        };
        //    }
        //    else if (ApplicationLifetime is ISingleViewApplicationLifetime singleViewPlatform)
        //    {
        //        singleViewPlatform.MainView = new MainView
        //        {
        //            DataContext = new MainViewModel()
        //        };
        //    }

        //    base.OnFrameworkInitializationCompleted();
        //}

        //public override void OnFrameworkInitializationCompleted()
        //{
        //    if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
        //    {
        //        var services = new ServiceCollection();

        //        DisableAvaloniaDataAnnotationValidation();
        //        desktop.MainWindow = new MainWindow();

        //        var topLevel = TopLevel.GetTopLevel(desktop.MainWindow);
        //        services.AddNotificationServices(topLevel);
        //        services.AddApplication<ManagerDomainSharedModule>();
        //        services.AddSingleton<LocalizationService>();

        //        services.AddTransient<MainViewModel>();

        //        //var serviceProvider = services.BuildServiceProvider();
        //        serviceProvider = services.BuildServiceProvider();

        //        //var localizationService = serviceProvider.GetRequiredService<LocalizationService>();
        //        //var culture = localizationService.GetSavedCultureOrSystem();
        //        //localizationService.SetCulture("en");

        //        var vm = serviceProvider.GetService<MainViewModel>();
        //        desktop.MainWindow.DataContext = vm; //serviceProvider.GetRequiredService<MainViewModel>();
        //        vm?.ShowSuccessToast("desktop");
        //    }
        //    else if (ApplicationLifetime is ISingleViewApplicationLifetime singleViewPlatform)
        //    {
        //        var services = new ServiceCollection();

        //        singleViewPlatform.MainView = new MainView();

        //        var topLevel = TopLevel.GetTopLevel(singleViewPlatform.MainView);
        //        services.AddNotificationServices(topLevel);
        //        services.AddApplication<ManagerDomainSharedModule>();
        //        services.AddLocalizationService();

        //        services.AddTransient<MainViewModel>();

        //        serviceProvider = services.BuildServiceProvider();

        //        var localizationService = serviceProvider.GetRequiredService<LocalizationService>();
        //        var culture = localizationService.GetSavedCultureOrSystem();
        //        localizationService.SetCulture(culture);

        //        var vm = serviceProvider.GetService<MainViewModel>();
        //        singleViewPlatform.MainView.DataContext = vm; //serviceProvider.GetRequiredService<MainViewModel>();
        //        vm?.ShowSuccessToast("mobile");
        //    }

        //    base.OnFrameworkInitializationCompleted();
        //}

        //public override void OnFrameworkInitializationCompleted()
        //{
        //    IServiceCollection services = new ServiceCollection();

        //    // Ortak servis kayýtlarý
        //    DisableAvaloniaDataAnnotationValidation();

        //    services.AddApplication<ManagerDomainSharedModule>();
        //    services.AddSingleton<LocalizationService>();
        //    services.AddTransient<MainViewModel>();

        //    IServiceProvider provider;

        //    if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
        //    {
        //        var mainWindow = new MainWindow();
        //        var topLevel = TopLevel.GetTopLevel(mainWindow);
        //        services.AddNotificationServices(topLevel);

        //        provider = services.BuildServiceProvider();
        //        App.Services = provider; 

        //        // Localization baþlat
        //        var localizationService = provider.GetRequiredService<LocalizationService>();
        //        var culture = localizationService.GetSavedCultureOrSystem();
        //        localizationService.SetCulture(culture);

        //        // ViewModel baðla
        //        var vm = provider.GetRequiredService<MainViewModel>();
        //        mainWindow.DataContext = vm;

        //        desktop.MainWindow = mainWindow;
        //        vm.ShowSuccessToast("desktop");
        //    }
        //    else if (ApplicationLifetime is ISingleViewApplicationLifetime singleViewPlatform)
        //    {
        //        var mainView = new MainView();
        //        var topLevel = TopLevel.GetTopLevel(mainView);
        //        services.AddNotificationServices(topLevel);

        //        provider = services.BuildServiceProvider();
        //        App.Services = provider; 

        //        var localizationService = provider.GetRequiredService<LocalizationService>();
        //        var culture = localizationService.GetSavedCultureOrSystem();
        //        localizationService.SetCulture(culture);

        //        var vm = provider.GetRequiredService<MainViewModel>();
        //        mainView.DataContext = vm;

        //        singleViewPlatform.MainView = mainView;
        //        vm.ShowSuccessToast("mobile");
        //    }

        //    base.OnFrameworkInitializationCompleted();
        //}

        //public override void OnFrameworkInitializationCompleted()
        //{
        //    // 1) Servisleri kaydet
        //    IServiceCollection services = new ServiceCollection();

        //    DisableAvaloniaDataAnnotationValidation();

        //    services.AddApplication<ManagerDomainSharedModule>();
        //    services.AddSingleton<LocalizationService>();
        //    services.AddTransient<MainViewModel>();

        //    // notification servisleri için TopLevel gerekli olduðu için bunlarý view oluþturduktan sonra ekliyoruz,
        //    // ama App.Services'i buraya koyalým önce.
        //    var provider = services.BuildServiceProvider();
        //    App.Services = provider; // global eriþim saðla

        //    // 2) Artýk LocalizationService hazýr — baþlatabiliriz
        //    var localizationService = provider.GetRequiredService<LocalizationService>();
        //    var culture = localizationService.GetSavedCultureOrSystem();
        //    localizationService.SetCulture(culture);

        //    // 3) Desktop veya SingleView için view'ý oluþtur ve notification/top-level eklemelerini yap
        //    if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
        //    {
        //        var mainWindow = new MainWindow();

        //        // notification servisleri TopLevel gerektiriyorsa buraya ekle
        //        var topLevel = TopLevel.GetTopLevel(mainWindow);
        //        if (topLevel != null)
        //        {
        //            services.AddNotificationServices(topLevel);
        //        }

        //        // DataContext ata
        //        var vm = provider.GetRequiredService<MainViewModel>();
        //        mainWindow.DataContext = vm;

        //        desktop.MainWindow = mainWindow;
        //        vm.ShowSuccessToast("desktop");
        //    }
        //    else if (ApplicationLifetime is ISingleViewApplicationLifetime singleViewPlatform)
        //    {
        //        var mainView = new MainView();

        //        var topLevel = TopLevel.GetTopLevel(mainView);
        //        if (topLevel != null)
        //        {
        //            services.AddNotificationServices(topLevel);
        //        }

        //        var vm = provider.GetRequiredService<MainViewModel>();
        //        mainView.DataContext = vm;

        //        singleViewPlatform.MainView = mainView;
        //        vm.ShowSuccessToast("mobile");
        //    }

        //    base.OnFrameworkInitializationCompleted();
        //}

        public override void OnFrameworkInitializationCompleted()
        {
            var services = new ServiceCollection();

            DisableAvaloniaDataAnnotationValidation();
            services.AddApplication<ManagerDomainSharedModule>();

            if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
            {
                var mainWindow = new MainWindow();
                var topLevel = TopLevel.GetTopLevel(mainWindow);

                services.AddNotificationServices(topLevel);

                services.AddSingleton<LocalizationService>();
                services.AddTransient<MainViewModel>();

                var provider = services.BuildServiceProvider();
                App.Services = provider;

                var localizationService = provider.GetRequiredService<LocalizationService>();
                var culture = localizationService.GetSavedCultureOrSystem();
                localizationService.SetCulture("en");

                var vm = provider.GetRequiredService<MainViewModel>();
                mainWindow.DataContext = vm;

                desktop.MainWindow = mainWindow;
                vm.ShowSuccessToast("desktop");
            }
            else if (ApplicationLifetime is ISingleViewApplicationLifetime singleViewPlatform)
            {
                var mainView = new MainView();
                singleViewPlatform.MainView = mainView;

                var topLevel = TopLevel.GetTopLevel(mainView);
                services.AddNotificationServices(topLevel);

                services.AddSingleton<LocalizationService>();
                services.AddTransient<MainViewModel>();

                var provider = services.BuildServiceProvider();
                App.Services = provider;

                var localizationService = provider.GetRequiredService<LocalizationService>();
                var culture = localizationService.GetSavedCultureOrSystem();
                localizationService.SetCulture("en");

                var vm = provider.GetRequiredService<MainViewModel>();
                singleViewPlatform.MainView.DataContext = vm;
                vm.ShowSuccessToast("mobile");
            }

            base.OnFrameworkInitializationCompleted();
        }



        private void DisableAvaloniaDataAnnotationValidation()
        {
            // Get an array of plugins to remove
            var dataValidationPluginsToRemove =
                BindingPlugins.DataValidators.OfType<DataAnnotationsValidationPlugin>().ToArray();

            // remove each entry found
            foreach (var plugin in dataValidationPluginsToRemove)
            {
                BindingPlugins.DataValidators.Remove(plugin);
            }
        }
    }
}