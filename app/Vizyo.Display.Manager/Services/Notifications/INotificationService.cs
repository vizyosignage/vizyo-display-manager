using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Avalonia.Controls.Notifications;

namespace Vizyo.Display.Manager.Services.Notifications
{
    public interface INotificationService
    {
        void ShowSuccess(string message, string title = "Success", bool showIcon = false, bool showClose = false, string style = "Dark");
        void ShowError(string message, string title = "Error", bool showIcon = false, bool showClose = false, string style = "Dark");
        void ShowWarning(string message, string title = "Warning", bool showIcon = false, bool showClose = false, string style = "Dark");
        void ShowInfo(string message, string title = "Information", bool showIcon = false, bool showClose = false, string style = "Dark");
        void ShowCustom(string message, string title, NotificationType type, bool showIcon = false, bool showClose = false, string style = "Dark");
    }
}
