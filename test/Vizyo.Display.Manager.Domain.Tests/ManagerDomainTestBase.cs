using Volo.Abp.Modularity;

namespace Vizyo.Display.Manager;

/* Inherit from this class for your domain layer tests. */
public abstract class ManagerDomainTestBase<TStartupModule> : ManagerTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
