using Vizyo.Display.Manager.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace Vizyo.Display.Manager.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class ManagerController : AbpControllerBase
{
    protected ManagerController()
    {
        LocalizationResource = typeof(ManagerResource);
    }
}
