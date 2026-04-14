using Vizyo.Display.Manager.Localization;
using Volo.Abp.AspNetCore.Components;

namespace Vizyo.Display.Manager.Blazor;

public abstract class ManagerComponentBase : AbpComponentBase
{
    protected ManagerComponentBase()
    {
        LocalizationResource = typeof(ManagerResource);
    }
}
