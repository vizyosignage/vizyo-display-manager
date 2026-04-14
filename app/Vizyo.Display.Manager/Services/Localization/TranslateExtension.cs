using Avalonia;
using Avalonia.Controls;
using Avalonia.Data;
using Avalonia.Markup.Xaml;
using Avalonia.Markup.Xaml.MarkupExtensions;
using System;
using System.ComponentModel;

namespace Vizyo.Display.Manager.Services.Localization
{
    //public class TranslateExtension : MarkupExtension
    //{
    //    public string Key { get; set; } = string.Empty;

    //    public TranslateExtension() { }

    //    public TranslateExtension(string key)
    //    {
    //        Key = key;
    //    }

    //    public override object ProvideValue(IServiceProvider serviceProvider)
    //    {
    //        if (Design.IsDesignMode)
    //            return Key; // Tasarım modunda anahtarı göster

    //        return new Binding
    //        {
    //            Mode = BindingMode.OneWay,
    //            Path = $"[{Key}]",
    //            Source = LocalizationBindingSourceLazy.Instance
    //        };
    //    }
    //}

    //public class LocalizationBindingSource : INotifyPropertyChanged
    //{
    //    public static LocalizationBindingSource Instance { get; } = new();

    //    private readonly LocalizationService _localization;

    //    private LocalizationBindingSource()
    //    {
    //        _localization = App.Services?.GetService(typeof(LocalizationService)) as LocalizationService
    //                        ?? throw new InvalidOperationException("LocalizationService not found. Register it as singleton and set App.Services.");

    //        _localization.PropertyChanged += Localization_PropertyChanged;
    //    }

    //    private void Localization_PropertyChanged(object? sender, PropertyChangedEventArgs e)
    //    {
    //        /PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(string.Empty));
    //    }

    //    public event PropertyChangedEventHandler? PropertyChanged;

    //    // Indexer: XAML = Path = "[Key]" 
    //    public string this[string key] => _localization.Translate(key) ?? string.Empty;
    //}
}
