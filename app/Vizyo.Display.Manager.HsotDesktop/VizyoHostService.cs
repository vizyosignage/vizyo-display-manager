using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;
using Vizyo.Display.Manager.Blazor;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Reflection;
using System.IO;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.ResponseCompression;
using Vizyo.Display.Manager.Hubs;
using Volo.Abp.Modularity.PlugIns;

namespace Vizyo.Display.Manager.HostDesktop
{
    public static class VizyoHostService
    {
        private static IHost? _host;

        public static async Task<int> StartAsync(string[]? args = null)
        {
            if (_host != null)
                return 0;

            Log.Logger = new LoggerConfiguration()
                .WriteTo.Async(c => c.File("Logs/logs.txt"))
                .CreateBootstrapLogger();

            try
            {
                Log.Information("Starting VizyoSignage host.");
                args ??= Array.Empty<string>();

                var blazorAssembly = typeof(ManagerBlazorModule).Assembly;
                var blazorAssemblyName = blazorAssembly.GetName().Name; // "Vizyo.Display.Manager.Blazor"
                //var blazorAssemblyPath = AppContext.BaseDirectory; // Path.GetDirectoryName(blazorAssembly.Location)!;
                //var blazorProjectRoot = Path.GetFullPath(Path.Combine(Path.GetDirectoryName(blazorAssembly.Location)!, "..", "..", "..", "..", "..")); // up 5 step for development

                var options = new WebApplicationOptions
                {
                    Args = args,
                    ContentRootPath = AppContext.BaseDirectory,
                    ApplicationName = blazorAssemblyName,
                    WebRootPath = "wwwroot",
                    EnvironmentName = "Production"
                };

                var builder = WebApplication.CreateBuilder(options);

                //var builder = WebApplication.CreateBuilder(args);
                //Debug.WriteLine(builder.Environment.EnvironmentName + " isProduction: " + builder.Environment.IsProduction().ToString());
                //builder.WebHost.UseUrls("http://localhost:5000");

                builder.Host
                    .AddAppSettingsSecretsJson()
                    .UseAutofac()
                    .UseSerilog((context, services, loggerConfiguration) =>
                    {
#if DEBUG
                        loggerConfiguration.MinimumLevel.Debug();
#else
                loggerConfiguration.MinimumLevel.Information();
#endif
                        loggerConfiguration
                            .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                            .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
                            .Enrich.FromLogContext()
                            .WriteTo.Async(c => c.File("Logs/logs.txt"))
                            .WriteTo.Async(c => c.Console());
                    });

                builder.WebHost.ConfigureKestrel(options =>
                {
                    options.ListenAnyIP(5000, listenOptions =>
                    {
                        listenOptions.Protocols = HttpProtocols.Http1AndHttp2;
                    });
                });

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
                        options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] { "application/octet-stream" });
                    });

                    services.AddCors(options =>
                    {
                        options.AddPolicy("CorsPolicy", policy =>
                        policy.AllowAnyOrigin()
                            .AllowAnyMethod()
                            .AllowAnyHeader());
                    });

                    // if host plugins are active
                    //services.AddApplication<ManagerBlazorModule>(options =>
                    //{
                    //    options.PlugInSources.AddFolder(Path.Combine(environment.ContentRootPath, "wwwroot", "plugins"), SearchOption.AllDirectories);
                    //});

                    services.AddApplication<ManagerBlazorModule>();

                });

                var app = builder.Build();
                await app.InitializeApplicationAsync();

                app.MapHub<SocketHub>("/socket-hub", options =>
                {
                    options.Transports =
                        HttpTransportType.WebSockets |
                        HttpTransportType.LongPolling;
                });

                await app.RunAsync();

                _host = app;
                return 0;
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Host terminated unexpectedly!");
                return 1;
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static async Task StopAsync()
        {
            if (_host != null)
            {
                await _host.StopAsync();
                _host.Dispose();
                _host = null;
            }
        }

        public static string GetLocalIpAddress()
        {
            using var socket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, 0);
            socket.Connect("8.8.8.8", 65530);
            var endPoint = socket.LocalEndPoint as IPEndPoint;
            return endPoint?.Address.ToString() ?? "127.0.0.1";
        }


        #region Experimental

        private static Process? _hostProcess;
        public static bool IsRunning => _hostProcess != null && !_hostProcess.HasExited;

        public static async Task StartHostAsync()
        {
            if (IsRunning)
                return;

            string workingDir = Environment.CurrentDirectory;
            string appDir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)!;
            string baseDir = AppContext.BaseDirectory;
            string dllName = "Vizyo.Display.Manager.Blazor.dll";
            string projectPath = baseDir + dllName;
            Debug.WriteLine(projectPath);

            KillExistingHost(dllName);

            var psi = new ProcessStartInfo
            {
                FileName = "dotnet",
                Arguments = projectPath,
                WorkingDirectory = baseDir,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
            };

            _hostProcess = new Process { StartInfo = psi, EnableRaisingEvents = true };

            _hostProcess.OutputDataReceived += (s, e) => {
                if (!string.IsNullOrWhiteSpace(e.Data))
                    Debug.WriteLine($"[HOST] {e.Data}");
            };

            _hostProcess.ErrorDataReceived += (s, e) => {
                if (!string.IsNullOrWhiteSpace(e.Data))
                    Debug.WriteLine($"[HOST-ERR] {e.Data}");
            };

            _hostProcess.Exited += (s, e) => {
                Debug.WriteLine("Blazor host stopped.");
            };

            _hostProcess.Start();
            _hostProcess.BeginOutputReadLine();
            _hostProcess.BeginErrorReadLine();

            await Task.Delay(1000);
            Debug.WriteLine("Blazor host started.");
        }

        public static void StopHost()
        {
            if (!IsRunning)
                return;

            try
            {
                if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
                {
                    _hostProcess?.CloseMainWindow();
                    _hostProcess?.WaitForExit(2000);
                }

                if (IsRunning)
                    _hostProcess?.Kill(true);

                _hostProcess?.Dispose();
                _hostProcess = null;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error stopping host: {ex.Message}");
            }
        }

        private static void KillExistingHost(string dllName)
        {
            try
            {
                var dotnetProcesses = Process.GetProcessesByName("dotnet");

                foreach (var proc in dotnetProcesses)
                {
                    try
                    {
                        string cmdLine = GetCommandLine(proc);

                        if (!string.IsNullOrWhiteSpace(cmdLine) && cmdLine.Contains(dllName, StringComparison.OrdinalIgnoreCase))
                        {
                            Debug.WriteLine($"(PID={proc.Id}), stopped...");
                            proc.Kill(entireProcessTree: true);
                            proc.WaitForExit(2000);
                        }
                    }
                    catch { /* do nothing */ }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error existing host: {ex.Message}");
            }
        }

        private static string GetCommandLine(Process process)
        {
            try
            {
                if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
                {
                    // for windows (ok)
                    using var searcher = new System.Management.ManagementObjectSearcher(
                        $"SELECT CommandLine FROM Win32_Process WHERE ProcessId = {process.Id}");
                    using var objects = searcher.Get();
                    var cmd = objects.Cast<System.Management.ManagementBaseObject>()
                                     .SingleOrDefault()?["CommandLine"]?.ToString();
                    return cmd ?? string.Empty;
                }
                else
                {
                    // procfs for Linux/macOS (to be tested)
                    string cmdPath = $"/proc/{process.Id}/cmdline";
                    if (File.Exists(cmdPath))
                    {
                        return File.ReadAllText(cmdPath).Replace('\0', ' ');
                    }
                }
            }
            catch { /* do nothing */ }

            return string.Empty;
        }

        #endregion

    }
}
