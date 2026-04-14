using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.EventBus.Local;
using Volo.Abp.Modularity;

namespace Vizyo.Display.Manager.Hubs
{
    public class EventBusHub : AbpModule
    {
        private readonly ILocalEventBus _localEventBus;

        public EventBusHub(ILocalEventBus localEventBus)
        {
            _localEventBus = localEventBus;
        }

        public async Task SendLocalMessageAsync(string from, string message, LocalMessageType type)
        {
            await _localEventBus.PublishAsync(new LocalMessageEvent(from, message, type));
        }
    }

    public class LocalMessageEvent
    {
        public string From { get; set; }
        public string Message { get; set; }
        public LocalMessageType Type { get; set; }

        public LocalMessageEvent(string from, string message, LocalMessageType type)
        {
            From = from;
            Message = message;
            Type = type;
        }
    }

    public enum LocalMessageType
    {
        None = 0,
        Message,
        Info,
        Warning,
        Error
    }
}
