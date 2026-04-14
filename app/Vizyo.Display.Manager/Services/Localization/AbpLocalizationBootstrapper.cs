using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Localization;
using Volo.Abp.Localization;
using Volo.Abp.VirtualFileSystem;
using System;
using Vizyo.Display.Manager.Localization;

namespace Vizyo.Display.Manager.Services.Localization;

public static class AbpLocalizationBootstrapper
{
    public static IServiceProvider Initialize()
    {
        var services = new ServiceCollection();

        services.AddApplication<ManagerDomainSharedModule>();

        //// Virtual file system
        //services.Configure<AbpVirtualFileSystemOptions>(options =>
        //{
        //    options.FileSets.AddEmbedded<ManagerResource>();
        //});

        //// ABP Localization config
        //services.Configure<AbpLocalizationOptions>(options =>
        //{
        //    options.Resources
        //        .Add<ManagerResource>("en")
        //        .AddVirtualJson("/Localization/DisplayManager");
        //});

        //services.AddSingleton<IStringLocalizerFactory, AbpStringLocalizerFactory>();
        //services.AddSingleton(typeof(IStringLocalizer<>), typeof(StringLocalizer<>));

        // Localization service
        services.AddLocalizationService();

        return services.BuildServiceProvider();
    }
}
