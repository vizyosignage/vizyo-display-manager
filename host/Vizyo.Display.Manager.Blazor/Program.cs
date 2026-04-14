using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;
using Vizyo.Display.Manager.Hubs;

namespace Vizyo.Display.Manager.Blazor;

public class Program
{
    public async static Task<int> Main(string[] args)
    {
        Log.Logger = new LoggerConfiguration()
            .WriteTo.Async(c => c.File("Logs/logs.txt"))
            .WriteTo.Async(c => c.Console())
            .CreateBootstrapLogger();

        try
        {
            Log.Information("Starting web host.");
            var builder = WebApplication.CreateBuilder(args);
            builder.Host
                .AddAppSettingsSecretsJson()
                .UseAutofac()
                .UseSerilog((context, services, loggerConfiguration) =>
                {
                    loggerConfiguration
#if DEBUG
                        .MinimumLevel.Debug()
#else
                        .MinimumLevel.Information()
#endif
                        .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                        .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
                        .Enrich.FromLogContext()
                        .WriteTo.Async(c => c.File("Logs/logs.txt"))
                        .WriteTo.Async(c => c.Console())
                        .WriteTo.Async(c => c.AbpStudio(services));
                });

            //builder.WebHost.ConfigureKestrel(options =>
            //{
            //    options.ListenAnyIP(5000, listenOptions =>
            //    {
            //        listenOptions.Protocols = HttpProtocols.Http1AndHttp2;
            //    });
            //});

            builder.Host.ConfigureServices((context, services) =>
            {
                IHostEnvironment environment = context.HostingEnvironment;

                services.AddServerSideBlazor().AddHubOptions(options =>
                {
                    options.MaximumReceiveMessageSize = null;
                });

                services.AddSignalR(options =>
                {
                    options.EnableDetailedErrors = true;
                    options.MaximumReceiveMessageSize = null;
                });

                services.AddResponseCompression(options =>
                {
                    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(
                        new[] { "application/octet-stream" });
                });

                //services.AddApplication<ManagerBlazorModule>(options =>
                //{
                //    options.PlugInSources.AddFolder(Path.Combine(environment.ContentRootPath, "wwwroot", "plugins"), SearchOption.AllDirectories);
                //});

                services.AddApplication<ManagerBlazorModule>();

            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", policy =>
                policy.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            });

            //await builder.AddApplicationAsync<ManagerBlazorModule>();
            var app = builder.Build();
            await app.InitializeApplicationAsync();

            app.MapHub<SocketHub>("/socket-hub", options =>
            {
                options.Transports =
                    HttpTransportType.WebSockets |
                    HttpTransportType.LongPolling;
            });

            await app.RunAsync();
            return 0;
        }
        catch (Exception ex)
        {
            if (ex is HostAbortedException)
            {
                throw;
            }

            Log.Fatal(ex, "Host terminated unexpectedly!");
            return 1;
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }
    public async static Task<int> Main_Old(string[] args)
    {
        Log.Logger = new LoggerConfiguration()
            .WriteTo.Async(c => c.File("Logs/logs.txt"))
            .WriteTo.Async(c => c.Console())
            .CreateBootstrapLogger();

        try
        {
            Log.Information("Starting web host.");
            var builder = WebApplication.CreateBuilder(args);
            builder.Host
                .AddAppSettingsSecretsJson()
                .UseAutofac()
                .UseSerilog((context, services, loggerConfiguration) =>
                {
                    loggerConfiguration
                    #if DEBUG
                        .MinimumLevel.Debug()
                    #else
                        .MinimumLevel.Information()
                    #endif
                        .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                        .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
                        .Enrich.FromLogContext()
                        .WriteTo.Async(c => c.File("Logs/logs.txt"))
                        .WriteTo.Async(c => c.Console())
                        .WriteTo.Async(c => c.AbpStudio(services));
                });

            builder.WebHost.ConfigureKestrel(options =>
            {
                options.ListenAnyIP(5000, listenOptions =>
                {
                    listenOptions.Protocols = HttpProtocols.Http1AndHttp2;
                });
            });

            await builder.AddApplicationAsync<ManagerBlazorModule>();
            var app = builder.Build();
            await app.InitializeApplicationAsync();
            await app.RunAsync();
            return 0;
        }
        catch (Exception ex)
        {
            if (ex is HostAbortedException)
            {
                throw;
            }

            Log.Fatal(ex, "Host terminated unexpectedly!");
            return 1;
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }
}
