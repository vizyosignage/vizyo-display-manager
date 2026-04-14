using Vizyo.Display.Manager.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace Vizyo.Display.Manager.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(ManagerEntityFrameworkCoreModule),
    typeof(ManagerApplicationContractsModule)
)]
public class ManagerDbMigratorModule : AbpModule
{
}
