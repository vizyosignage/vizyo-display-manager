using Volo.Abp.Modularity;

namespace Vizyo.Display.Manager;

[DependsOn(
    typeof(ManagerDomainModule),
    typeof(ManagerTestBaseModule)
)]
public class ManagerDomainTestModule : AbpModule
{

}
