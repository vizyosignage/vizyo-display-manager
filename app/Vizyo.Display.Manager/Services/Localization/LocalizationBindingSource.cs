using System;
using System.ComponentModel;
using Vizyo.Display.Manager.Services.Localization;

namespace Vizyo.Display.Manager.Services.Localization
{
    public class LocalizationBindingSourceLazy : INotifyPropertyChanged
    {
        public static LocalizationBindingSourceLazy Instance { get; } = new();

        private LocalizationService? _localization;
        private bool _isSubscribed;
        private readonly object _sync = new();

        private LocalizationBindingSourceLazy() { }

        public event PropertyChangedEventHandler? PropertyChanged;

        /// <summary>
        /// XAML'deki [key] binding erişiminde çalışır.
        /// </summary>
        public string this[string key]
        {
            get
            {
                EnsureLocalizationResolved();

                if (_localization is not null)
                {
                    try
                    {
                        return _localization.Translate(key) ?? key;
                    }
                    catch
                    {
                        return key;
                    }
                }

                // Henüz LocalizationService yoksa fallback
                return key;
            }
        }

        /// <summary>
        /// LocalizationService henüz çözülmediyse App.Services üzerinden çözmeyi dener.
        /// </summary>
        private void EnsureLocalizationResolved()
        {
            if (_localization != null)
                return;

            lock (_sync)
            {
                if (_localization != null)
                    return;

                try
                {
                    var svc = App.Services?.GetService(typeof(LocalizationService)) as LocalizationService;
                    if (svc != null)
                    {
                        _localization = svc;

                        if (!_isSubscribed)
                        {
                            _localization.PropertyChanged += (_, e) =>
                            {
                                // Kültür değiştiğinde tüm bindingler yenilensin
                                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(string.Empty));
                            };
                            _isSubscribed = true;
                        }

                        // Servis bulunduğunda UI güncellensin
                        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(string.Empty));
                    }
                }
                catch
                {
                    // App.Services henüz hazır değilse sessiz geç
                }
            }
        }
    }
}
