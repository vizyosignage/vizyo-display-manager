using Volo.Abp.Modularity;

namespace Vizyo.Display.Manager;

public abstract class ManagerApplicationTestBase<TStartupModule> : ManagerTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
