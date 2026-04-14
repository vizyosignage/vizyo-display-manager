using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Avalonia.Controls.Notifications;
using Ursa.Controls;
using Notification = Ursa.Controls.Notification;
using WindowNotificationManager = Ursa.Controls.WindowNotificationManager;

namespace Vizyo.Display.Manager.Services.Notifications
{
    public class NotificationService : INotificationService
    {
        private readonly WindowNotificationManager _notificationManager;

        public NotificationService(WindowNotificationManager notificationManager)
        {
            _notificationManager = notificationManager;
        }
        public void ShowCustom(string message, string title, NotificationType type, bool showIcon = false, bool showClose = false, string style = "Dark")
        {
            _notificationManager?.Show(
                    new Notification(title, message),
                    showIcon: showIcon,
                    showClose: showClose,
                    type: type,
                    classes: [style]); //Light
        }

        public void ShowError(string message, string title = "Error", bool showIcon = false, bool showClose = false, string style = "Dark")
        {
            ShowCustom(message, title, NotificationType.Error, showIcon, showClose, style);
        }

        public void ShowInfo(string message, string title = "Information", bool showIcon = false, bool showClose = false, string style = "Dark")
        {
            ShowCustom(message, title, NotificationType.Information, showIcon, showClose, style);
        }

        public void ShowSuccess(string message, string title = "Success", bool showIcon = false, bool showClose = false, string style = "Dark")
        {
            ShowCustom(message, title, NotificationType.Success, showIcon, showClose, style);
        }

        public void ShowWarning(string message, string title = "Warning", bool showIcon = false, bool showClose = false, string style = "Dark")
        {
            ShowCustom(message, title, NotificationType.Warning, showIcon, showClose, style);
        }
    }
}
