using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Globalization;
using System.IO;
using System.Text.Json;
using Microsoft.Extensions.Localization;
using System.ComponentModel;
using Vizyo.Display.Manager.Localization;

namespace Vizyo.Display.Manager.Services.Localization;

public class LocalizationService : INotifyPropertyChanged
{
    private readonly IStringLocalizer<ManagerResource> _localizer;
    private string _currentCulture;
    private const string SettingsFileName = "settings.json";
    private readonly string _settingsPath;

    public event PropertyChangedEventHandler? PropertyChanged;

    public LocalizationService(IStringLocalizer<ManagerResource> localizer)
    {
        _localizer = localizer;

        _settingsPath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "VizyoSignage", "Settings",
            SettingsFileName);

        Directory.CreateDirectory(Path.GetDirectoryName(_settingsPath)!);

        _currentCulture = GetSavedCultureOrSystem();
        SetCulture(_currentCulture);
    }

    public string CurrentCulture
    {
        get => _currentCulture;
        private set
        {
            if (_currentCulture != value)
            {
                _currentCulture = value;
                OnPropertyChanged(nameof(CurrentCulture));
            }
        }
    }

    public string Translate(string key)
    {
        return _localizer[key];
    }

    public void SetCulture(string culture)
    {
        CultureInfo.CurrentUICulture = new CultureInfo(culture);
        CultureInfo.CurrentCulture = new CultureInfo(culture);

        CurrentCulture = culture;
        SaveCulture(culture);

        OnPropertyChanged(nameof(Translate));
        //OnPropertyChanged(string.Empty);
    }

    public string GetSavedCultureOrSystem()
    {
        if (File.Exists(_settingsPath))
        {
            try
            {
                var json = File.ReadAllText(_settingsPath);
                var data = JsonSerializer.Deserialize<UserSettings>(json);
                if (!string.IsNullOrWhiteSpace(data?.Culture))
                    return data.Culture;
            }
            catch { /* ignore */ }
        }

        var systemCulture = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName;
        return systemCulture == "tr" ? "tr" : "en";
    }

    private void SaveCulture(string culture)
    {
        var data = new UserSettings { Culture = culture };
        var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(_settingsPath, json);
    }

    private class UserSettings
    {
        public string Culture { get; set; } = "en";
        public string HostAddress { get; set; } = "http://localhost:5000";
        public string DisplayId { get; set; } = "x";
        public string Layout { get; set; } = "x.json";
        public string UserName { get; set; } = "display";
        public string Password { get; set; } = "123654789";
    }

    private void OnPropertyChanged(string name)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
    }
}
