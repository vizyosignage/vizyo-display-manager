using Vizyo.Display.Manager.Localization;
using Volo.Abp.Application.Services;

namespace Vizyo.Display.Manager;

/* Inherit your application services from this class.
 */
public abstract class ManagerAppService : ApplicationService
{
    protected ManagerAppService()
    {
        LocalizationResource = typeof(ManagerResource);
    }
}
