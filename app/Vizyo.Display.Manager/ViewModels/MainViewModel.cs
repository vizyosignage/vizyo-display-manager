using System;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Avalonia.Controls;
using Avalonia.Controls.Notifications;
using Avalonia.Threading;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Extensions.Localization;
using Ursa.Controls;
using Vizyo.Display.Manager.Hubs;
using Vizyo.Display.Manager.Localization;
using Vizyo.Display.Manager.Services.Localization;
using Vizyo.Display.Manager.Services.Notifications;
using static System.Net.Mime.MediaTypeNames;
using Notification = Ursa.Controls.Notification;
using WindowNotificationManager = Ursa.Controls.WindowNotificationManager;

namespace Vizyo.Display.Manager.ViewModels
{
    public partial class MainViewModel : ViewModelBase
    {
        private SocketClient? socketClient;

        [ObservableProperty]
        private string _greeting = "Welcome to VizyoSignage!";

        private void SetMessage(string text) => ShowToast(text);

        private readonly IToastService _toastService;
        private readonly INotificationService _notificationService;
        private readonly LocalizationService _localizationService;

        public string WelcomeText => _localizationService.Translate("Welcome");

        public string PluginsPath => GetCrossPlatformPluginsPath();
        public string CurrentLanguage => _localizationService.CurrentCulture;

        public MainViewModel(IToastService toastService, INotificationService notificationService, LocalizationService localizationService)
        {
            _toastService = toastService;
            _notificationService = notificationService;
            _localizationService = localizationService;

            //WebSocketConnect();
            TestMessage();
            CreatePluginsDirectory(GetCrossPlatformPluginsPath());

            _localizationService.PropertyChanged += (_, e) =>
            {
                if (e.PropertyName == nameof(LocalizationService.CurrentCulture) ||
                    e.PropertyName == nameof(LocalizationService.Translate))
                {
                    OnPropertyChanged(string.Empty);
                    //OnPropertyChanged(nameof(WelcomeText));
                    //OnPropertyChanged(nameof(CurrentLanguage));
                }
            };
        }

        private async void WebSocketConnect()
        {
            await WebSocketDisconnect();

            string url = "http://localhost:5000/socket-hub";
            socketClient = new SocketClient(url);

            if (socketClient != null)
            {
                socketClient.MessageReceiveEvent += SocketClient_MessageReceivedEvent;
                socketClient.ConnectionEvent += SocketClient_ConnectionEvent;
                socketClient.ErrorEvent += SocketClient_ErrorEvent;
                await socketClient.Connect();

                Debug.WriteLine("SocketClient Connect");
                ShowToast("Websocket Connect");
            }
        }

        private async Task WebSocketDisconnect()
        {
            if (socketClient != null)
            {
                await socketClient.Disconnect();
                socketClient.MessageReceiveEvent -= SocketClient_MessageReceivedEvent;
                socketClient.ConnectionEvent -= SocketClient_ConnectionEvent;
                socketClient.ErrorEvent -= SocketClient_ErrorEvent;
                socketClient = null;

                Debug.WriteLine("SocketClient Disconnect");
                ShowToast("Websocket Disconnect");
            }
        }

        private async void SendSocketMessage(SocketCommand command, string message = "")
        {
            if (socketClient != null)
            {
                await socketClient.SendMessage("VizyoClient", "VizyoHost", command, message);
            }
        }

        private void SocketClient_MessageReceivedEvent(string from, string to, SocketCommand command, string message)
        {
            Debug.WriteLine($"SocketClient_MessageReceivedEvent: {from} {to} {message}");

            //if (to != "VizyoClient") return;

            switch (command)
            {
                case SocketCommand.Message:
                    //ShowMessage(from, message, NotificationType.Success);
                    Dispatcher.UIThread.Invoke(() => ShowMessage(from, message, NotificationType.Success));
                    //Dispatcher.UIThread.Post(() => SetMessage(message));
                    break;
            }
        }

        private void SocketClient_ConnectionEvent()
        {
            Debug.WriteLine("SocketClient_ConnectionEvent");
            TestMessage();
            Dispatcher.UIThread.Invoke(() => ShowToast("Websocket Connect", NotificationType.Success));
        }

        private void SocketClient_ErrorEvent(string error)
        {
            Debug.WriteLine("SocketClient_ErrorEvent");
            Dispatcher.UIThread.Invoke(() => ShowToast(error, NotificationType.Error));
        }

        //[RelayCommand]
        public void ShowMessage(string title, string message, NotificationType type = NotificationType.Information, string style = "Dark")
        {
            _notificationService.ShowSuccess(message, title, true);
        }

        //[RelayCommand]
        public void ShowToast(string message, NotificationType type = NotificationType.Information, string style = "Dark")
        {
            _toastService.ShowSuccess(message);
        }

        public void ShowSuccessToast(string message)
        {
            _toastService.ShowSuccess(message);
        }

        private async void TestMessage()
        {
            var timer = new PeriodicTimer(TimeSpan.FromSeconds(10));
            while (await timer.WaitForNextTickAsync())
            {
                Debug.WriteLine("TestMessage");
                _localizationService.SetCulture("tr");
                ShowToast("Localization Test", NotificationType.Warning, "Light");
                //SendSocketMessage(SocketCommand.Message, "Test 123456");

                //ShowMessage("test", "test 123");
                //ShowMessage("test", "test 123", NotificationType.Success);
                //ShowMessage("test", "test 123", NotificationType.Warning);
                //ShowMessage("test", "test 123", NotificationType.Error);

                //ShowToast("test 123456", NotificationType.Information, "Light");
                //ShowToast("test 123456", NotificationType.Success, "Light");
                //ShowToast("test 123456", NotificationType.Warning, "Light");
                //ShowToast("test 123456", NotificationType.Error, "Light");
            }
        }

        private string GetCrossPlatformPluginsPath()
        {
            var appDataPath = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);

            if (string.IsNullOrEmpty(appDataPath))
            {
                appDataPath = Environment.GetFolderPath(Environment.SpecialFolder.Personal);
            }

            return Path.Combine(appDataPath, "VizyoSignage", "Plugins");
        }

        private void CreatePluginsDirectory(string pluginsDirectory)
        {
            if (!Directory.Exists(pluginsDirectory))
            {
                Directory.CreateDirectory(pluginsDirectory);
            }
            Debug.WriteLine($"Plugins directory created: {pluginsDirectory}");
        }
    }    
}
