using Microsoft.Extensions.Localization;
using Vizyo.Display.Manager.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace Vizyo.Display.Manager.Blazor;

[Dependency(ReplaceServices = true)]
public class ManagerBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<ManagerResource> _localizer;

    public ManagerBrandingProvider(IStringLocalizer<ManagerResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
