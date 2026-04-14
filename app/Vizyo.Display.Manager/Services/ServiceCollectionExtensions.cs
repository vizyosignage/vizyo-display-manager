using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Avalonia.Controls.Notifications;
using Avalonia.Controls;
using Microsoft.Extensions.DependencyInjection;
using Vizyo.Display.Manager.Services.Notifications;
using Ursa.Controls;
using Notification = Ursa.Controls.Notification;
using WindowNotificationManager = Ursa.Controls.WindowNotificationManager;
using Volo.Abp.Localization;
using Vizyo.Display.Manager.Services.Localization;
using Vizyo.Display.Manager.Localization;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddNotificationServices(this IServiceCollection services, TopLevel topLevel)
    {
        // Toast Manager
        services.AddSingleton(provider =>
        {
            var toastManager = new WindowToastManager(topLevel) { MaxItems = 4 };
            return toastManager;
        });

        // Notification Manager
        services.AddSingleton<WindowNotificationManager>(provider =>
        {
            if (WindowNotificationManager.TryGetNotificationManager(topLevel, out var manager))
            {
                return manager;
            }
            return new WindowNotificationManager(topLevel);
        });

        // Services
        services.AddSingleton<IToastService, ToastService>();
        services.AddSingleton<INotificationService, NotificationService>();

        return services;
    }

    public static IServiceCollection AddLocalizationService(this IServiceCollection services)
    {
        // Localization Service
        services.AddSingleton<LocalizationService>();

        //services.Configure<AbpLocalizationOptions>(options =>
        //{
        //    options.Resources
        //        .Add<ManagerResource>("en")
        //        .AddVirtualJson("/Localization/DisplayManager");
        //});

        return services;
    }
}
