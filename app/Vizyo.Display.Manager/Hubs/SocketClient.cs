using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Client;

namespace Vizyo.Display.Manager.Hubs
{
    public class SocketClient : IAsyncDisposable
    {
        private HubConnection? connection;
        private string url = "socket-hub";

        // triggered when connection is established
        public delegate void ConnectionDelegate();
        public event ConnectionDelegate? ConnectionEvent;

        // triggered when a message arrives
        public delegate void MessageReceiveDelegate(string from, string to, SocketCommand command, string message = "");
        public event MessageReceiveDelegate? MessageReceiveEvent;

        // triggered on error
        public delegate void ErrorDelegate(string error);
        public event ErrorDelegate? ErrorEvent;

        public SocketClient(string baseUrl)
        {
            url = baseUrl;
        }

        public async Task Connect()
        {
            await Disconnect();

            connection = new HubConnectionBuilder()
             .WithUrl(url)
             .WithAutomaticReconnect(new[] { TimeSpan.Zero, TimeSpan.Zero, TimeSpan.FromSeconds(10) })
             .Build();

            connection.On<string, string, SocketCommand, string>("getMessage", (from, to, command, message) =>
            {
                OnMessageFromServer(from, to, command, message);
            });

            connection.Reconnected += (id) => {
                Debug.WriteLine("socket reconnected: " + id);
                return Task.CompletedTask;
            };

            connection.Closed += (error) => {
                Debug.WriteLine("socket disconnect: " + error?.Message);
                ErrorEvent?.Invoke(string.Format("{0} : {1}", "SocketClient Error", error?.Message));
                return Task.CompletedTask;
            };

            try
            {
                await connection.StartAsync();

                if (connection != null)
                {
                    Debug.WriteLine("socket connection started");
                    ConnectionEvent?.Invoke();
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(string.Format("{0} : {1}", "SocketClient", ex.ToString()));
                ErrorEvent?.Invoke(string.Format("{0} : {1}", "SocketClient Error", ex.ToString()));
            }
        }

        private void OnMessageFromServer(string from, string to, SocketCommand command, string message)
        {
            MessageReceiveEvent?.Invoke(from, to, command, message);
        }

        public async Task SendMessage(string from, string to, SocketCommand command, string message = "")
        {
            try
            {
                if (connection != null)
                {
                    if (connection.State == HubConnectionState.Connected)
                    {
                        await connection.InvokeAsync("SendMessage", from, to, command, message);
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(string.Format("{0} : {1}", "SocketClient", ex.ToString()));
                ErrorEvent?.Invoke(string.Format("{0} : {1}", "SocketClient Error", ex.ToString()));
            }
        }

        public async Task Disconnect()
        {
            if (connection != null)
            {
                await connection.StopAsync();
                await connection.DisposeAsync();
                connection = null;
            }
        }

        public async ValueTask DisposeAsync()
        {
            await Disconnect();
        }
    }

    public enum SocketCommand
    {
        None = 0,
        Test,
        Message,
        Update,
        Refresh,
        Open,
        Close,
        GetDeviceFromServer,
        Dispose,
        Error
    }
}
