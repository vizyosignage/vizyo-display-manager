using System;
using System.IO;
using System.Security.Cryptography.X509Certificates;
using Blazorise.Bootstrap5;
using Blazorise.Icons.FontAwesome;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Extensions.DependencyInjection;
using OpenIddict.Validation.AspNetCore;
using OpenIddict.Server.AspNetCore;
using Microsoft.Extensions.Options;
using Vizyo.Display.Manager.Blazor.Components;
using Vizyo.Display.Manager.Blazor.Menus;
using Vizyo.Display.Manager.EntityFrameworkCore;
using Vizyo.Display.Manager.Localization;
using Vizyo.Display.Manager.MultiTenancy;
using Microsoft.OpenApi.Models;
using Volo.Abp;
using Volo.Abp.Account.Web;
using Volo.Abp.AspNetCore.Components.Web;
using Volo.Abp.AspNetCore.Components.Web.Theming.Routing;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.Localization;
using Volo.Abp.AspNetCore.Mvc.UI.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared;
using Volo.Abp.AspNetCore.Serilog;
using Volo.Abp.AspNetCore.Components.Server;
using Volo.Abp.AspNetCore.Components.Server.BasicTheme;
using Volo.Abp.AspNetCore.Components.Server.BasicTheme.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Basic;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Basic.Bundling;
using Volo.Abp.Identity;
using Volo.Abp.Autofac;
using Volo.Abp.AutoMapper;
using Vizyo.Display.Manager.Blazor.HealthChecks;
using Volo.Abp.Identity.Blazor.Server;
using Volo.Abp.TenantManagement.Blazor.Server;
using Volo.Abp.SettingManagement.Blazor.Server;
using Volo.Abp.FeatureManagement.Blazor.Server;
using Volo.Abp.Security.Claims;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.OpenIddict;
using Volo.Abp.Swashbuckle;
using Volo.Abp.UI.Navigation;
using Volo.Abp.UI.Navigation.Urls;
using Volo.Abp.VirtualFileSystem;
using Volo.Abp.Studio.Client.AspNetCore;

namespace Vizyo.Display.Manager.Blazor;

[DependsOn(
    typeof(ManagerApplicationModule),
    typeof(AbpStudioClientAspNetCoreModule),
    typeof(ManagerEntityFrameworkCoreModule),
    typeof(ManagerHttpApiModule),
    typeof(AbpAutofacModule),
    typeof(AbpSwashbuckleModule),
    typeof(AbpIdentityBlazorServerModule),
    typeof(AbpTenantManagementBlazorServerModule),
    typeof(AbpAccountWebOpenIddictModule),
    typeof(AbpAspNetCoreComponentsServerBasicThemeModule),
    typeof(AbpAspNetCoreMvcUiBasicThemeModule),
    typeof(AbpAspNetCoreSerilogModule),
    typeof(AbpFeatureManagementBlazorServerModule),
    typeof(AbpSettingManagementBlazorServerModule)
   )]
public class ManagerBlazorModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        var hostingEnvironment = context.Services.GetHostingEnvironment();
        var configuration = context.Services.GetConfiguration();

        context.Services.PreConfigure<AbpMvcDataAnnotationsLocalizationOptions>(options =>
        {
            options.AddAssemblyResource(
                typeof(ManagerResource),
                typeof(ManagerDomainModule).Assembly,
                typeof(ManagerDomainSharedModule).Assembly,
                typeof(ManagerApplicationModule).Assembly,
                typeof(ManagerApplicationContractsModule).Assembly,
                typeof(ManagerBlazorModule).Assembly
            );
        });

        PreConfigure<OpenIddictBuilder>(builder =>
        {
            builder.AddValidation(options =>
            {
                options.AddAudiences("Manager");
                options.UseLocalServer();
                options.UseAspNetCore();
            });
        });

        if (!hostingEnvironment.IsDevelopment())
        {
            PreConfigure<AbpOpenIddictAspNetCoreOptions>(options =>
            {
                options.AddDevelopmentEncryptionAndSigningCertificate = false;
            });

            PreConfigure<OpenIddictServerBuilder>(serverBuilder =>
            {
                serverBuilder.AddProductionEncryptionAndSigningCertificate("openiddict.pfx", configuration["AuthServer:CertificatePassPhrase"]!);
                serverBuilder.SetIssuer(new Uri(configuration["AuthServer:Authority"]!));
            });
        }

        PreConfigure<AbpAspNetCoreComponentsWebOptions>(options =>
        {
            options.IsBlazorWebApp = true;
        });
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var hostingEnvironment = context.Services.GetHostingEnvironment();
        var configuration = context.Services.GetConfiguration();

        // Add services to the container.
        context.Services.AddRazorComponents()
            .AddInteractiveServerComponents();

        if (!configuration.GetValue<bool>("App:DisablePII"))
        {
            Microsoft.IdentityModel.Logging.IdentityModelEventSource.ShowPII = true;
            Microsoft.IdentityModel.Logging.IdentityModelEventSource.LogCompleteSecurityArtifact = true;
        }

        if (!configuration.GetValue<bool>("AuthServer:RequireHttpsMetadata"))
        {
            Configure<OpenIddictServerAspNetCoreOptions>(options =>
            {
                options.DisableTransportSecurityRequirement = true;
            });
            
            Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.XForwardedProto;
            });
        }

        ConfigureAuthentication(context);
        ConfigureUrls(configuration);
        ConfigureBundles();
        ConfigureHealthChecks(context);
        ConfigureAutoMapper();
        ConfigureVirtualFileSystem(hostingEnvironment);
        ConfigureSwaggerServices(context.Services);
        ConfigureAutoApiControllers();
        ConfigureBlazorise(context);
        ConfigureRouter(context);
        ConfigureMenu(context);
    }
    
    private void ConfigureAuthentication(ServiceConfigurationContext context)
    {
        context.Services.ForwardIdentityAuthenticationForBearer(OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme);
        context.Services.Configure<AbpClaimsPrincipalFactoryOptions>(options =>
        {
            options.IsDynamicClaimsEnabled = true;
        });
    }

    private void ConfigureUrls(IConfiguration configuration)
    {
        Configure<AppUrlOptions>(options =>
        {
            options.Applications["MVC"].RootUrl = configuration["App:SelfUrl"];
            options.RedirectAllowedUrls.AddRange(configuration["App:RedirectAllowedUrls"]?.Split(',') ?? Array.Empty<string>());
        });
    }

    private void ConfigureBundles()
    {
        Configure<AbpBundlingOptions>(options =>
        {
            // MVC UI
            options.StyleBundles.Configure(
                BasicThemeBundles.Styles.Global,
                bundle =>
                {
                    bundle.AddFiles("/global-styles.css");
                }
            );

            options.ScriptBundles.Configure(
                BasicThemeBundles.Scripts.Global,
                bundle =>
                {
                    bundle.AddFiles("/global-scripts.js");
                }
            );

            // Blazor UI
            options.StyleBundles.Configure(
                BlazorBasicThemeBundles.Styles.Global,
                bundle =>
                {
                    bundle.AddFiles("/global-styles.css");
                }
            );
        });
    }

    private void ConfigureHealthChecks(ServiceConfigurationContext context)
    {
        context.Services.AddManagerHealthChecks();
    }

    private void ConfigureVirtualFileSystem(IWebHostEnvironment hostingEnvironment)
    {
        if (hostingEnvironment.IsDevelopment())
        {
            Configure<AbpVirtualFileSystemOptions>(options =>
            {
                // for start host in desktop app
                //var rootPath = Path.GetFullPath(Path.Combine(hostingEnvironment.ContentRootPath, "..", "..", "..", "..", ".."));

                //options.FileSets.ReplaceEmbeddedByPhysical<ManagerDomainSharedModule>(
                //    Path.Combine(rootPath, "host", "Vizyo.Display.Manager.Domain.Shared", "Domain.Shared"));
                //options.FileSets.ReplaceEmbeddedByPhysical<ManagerDomainModule>(
                //    Path.Combine(rootPath, "host", "Vizyo.Display.Manager.Domain", "Domain"));
                //options.FileSets.ReplaceEmbeddedByPhysical<ManagerApplicationContractsModule>(
                //    Path.Combine(rootPath, "host", "Vizyo.Display.Manager.Application.Contracts", "Application.Contracts"));
                //options.FileSets.ReplaceEmbeddedByPhysical<ManagerApplicationModule>(
                //    Path.Combine(rootPath, "host", "Vizyo.Display.Manager.Application", "Application"));
                //options.FileSets.ReplaceEmbeddedByPhysical<ManagerBlazorModule>(
                //    Path.Combine(rootPath, "host", "Vizyo.Display.Manager.Blazor"));

                options.FileSets.ReplaceEmbeddedByPhysical<ManagerDomainSharedModule>(Path.Combine(hostingEnvironment.ContentRootPath, $"..{Path.DirectorySeparatorChar}Vizyo.Display.Manager.Domain.Shared"));
                options.FileSets.ReplaceEmbeddedByPhysical<ManagerDomainModule>(Path.Combine(hostingEnvironment.ContentRootPath, $"..{Path.DirectorySeparatorChar}Vizyo.Display.Manager.Domain"));
                options.FileSets.ReplaceEmbeddedByPhysical<ManagerApplicationContractsModule>(Path.Combine(hostingEnvironment.ContentRootPath, $"..{Path.DirectorySeparatorChar}Vizyo.Display.Manager.Application.Contracts"));
                options.FileSets.ReplaceEmbeddedByPhysical<ManagerApplicationModule>(Path.Combine(hostingEnvironment.ContentRootPath, $"..{Path.DirectorySeparatorChar}Vizyo.Display.Manager.Application"));
                options.FileSets.ReplaceEmbeddedByPhysical<ManagerBlazorModule>(hostingEnvironment.ContentRootPath);
            });
        }
    }

    private void ConfigureSwaggerServices(IServiceCollection services)
    {
        services.AddAbpSwaggerGen(
            options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "Vizyo.Display.Manager API", Version = "v1" });
                options.DocInclusionPredicate((docName, description) => true);
                options.CustomSchemaIds(type => type.FullName);
            }
        );
    }


    private void ConfigureBlazorise(ServiceConfigurationContext context)
    {
        context.Services
            .AddBootstrap5Providers()
            .AddFontAwesomeIcons();
    }

    private void ConfigureMenu(ServiceConfigurationContext context)
    {
        Configure<AbpNavigationOptions>(options =>
        {
            options.MenuContributors.Add(new ManagerMenuContributor());
        });
    }
    

    private void ConfigureRouter(ServiceConfigurationContext context)
    {
        Configure<AbpRouterOptions>(options =>
        {
            options.AppAssembly = typeof(ManagerBlazorModule).Assembly;
        });
    }

    private void ConfigureAutoApiControllers()
    {
        Configure<AbpAspNetCoreMvcOptions>(options =>
        {
            options.ConventionalControllers.Create(typeof(ManagerApplicationModule).Assembly);
        });
    }

    private void ConfigureAutoMapper()
    {
        Configure<AbpAutoMapperOptions>(options =>
        {
            options.AddMaps<ManagerBlazorModule>();
        });
    }

    public override void OnApplicationInitialization(ApplicationInitializationContext context)
    {
        var env = context.GetEnvironment();
        var app = context.GetApplicationBuilder();

        app.UseForwardedHeaders();

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseAbpRequestLocalization();

        if (!env.IsDevelopment())
        {
            app.UseErrorPage();
            app.UseHsts();
        }

        app.UseCorrelationId();
        app.UseRouting();
        app.MapAbpStaticAssets();
        app.UseAbpStudioLink();
        app.UseAbpSecurityHeaders();
        app.UseAntiforgery();
        app.UseAuthentication();
        app.UseAbpOpenIddictValidation();

        if (MultiTenancyConsts.IsEnabled)
        {
            app.UseMultiTenancy();
        }

        app.UseUnitOfWork();
        app.UseDynamicClaims();
        app.UseAuthorization();
        app.UseSwagger();
        app.UseAbpSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "Manager API");
        });
        app.UseAuditing();
        app.UseAbpSerilogEnrichers();
        app.UseConfiguredEndpoints(builder =>
        {
            builder.MapRazorComponents<App>()
                .AddInteractiveServerRenderMode()
                .AddAdditionalAssemblies(builder.ServiceProvider.GetRequiredService<IOptions<AbpRouterOptions>>().Value.AdditionalAssemblies.ToArray());
        });
    }
}
