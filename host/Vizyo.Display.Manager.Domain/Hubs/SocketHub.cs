using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Volo.Abp.Identity;
using Volo.Abp.AspNetCore.SignalR;
using Volo.Abp.Users;
using Vizyo.Display.Manager.Settings;
using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;
using Microsoft.Extensions.Logging;

namespace Vizyo.Display.Manager.Hubs
{
    public class SocketHub : AbpHub
    {
        private readonly IIdentityUserRepository _identityUserRepository;
        private readonly ILookupNormalizer _lookupNormalizer;
        private readonly ILogger<SocketHub> _logger;

        public SocketHub(IIdentityUserRepository identityUserRepository, ILookupNormalizer lookupNormalizer, ILogger<SocketHub> logger)
        {
            _identityUserRepository = identityUserRepository;
            _lookupNormalizer = lookupNormalizer;
            _logger = logger;

            //TestMessage();
        }

        public async Task SendMessage(string from, string to, SocketCommand command, string message)
        {
            await Clients.All.SendAsync("getMessage", from, to, command, message);
        }

        public async Task SendUserMessage(string targetUserName, string message)
        {
            var targetUser = await _identityUserRepository.FindByNormalizedUserNameAsync(_lookupNormalizer.NormalizeName(targetUserName));
            //var txt = L["MyText"]; //Localization

            message = $"{CurrentUser.UserName}: {message}";

            await Clients
                .User(targetUser.Id.ToString())
                .SendAsync("getUserMessage", message);
        }

        public async Task SendImage(string base64String)
        {
            await Clients.All.SendAsync("getImage", base64String);
        }

        public async void TestMessage()
        {
            var timer = new PeriodicTimer(TimeSpan.FromSeconds(10));
            while (await timer.WaitForNextTickAsync())
            {
                _logger.LogDebug("SocketHub TestMessage");
                await SendMessage("VizyoHost", "VizyoClient", SocketCommand.Message, "Test");
            }
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
