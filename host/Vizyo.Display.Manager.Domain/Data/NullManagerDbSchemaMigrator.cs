using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Vizyo.Display.Manager.Data;

/* This is used if database provider does't define
 * IManagerDbSchemaMigrator implementation.
 */
public class NullManagerDbSchemaMigrator : IManagerDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
