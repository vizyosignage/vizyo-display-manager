using Volo.Abp.Modularity;

namespace Vizyo.Display.Manager;

[DependsOn(
    typeof(ManagerApplicationModule),
    typeof(ManagerDomainTestModule)
)]
public class ManagerApplicationTestModule : AbpModule
{

}
