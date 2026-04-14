using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Vizyo.Display.Manager.Data;
using Volo.Abp.DependencyInjection;

namespace Vizyo.Display.Manager.EntityFrameworkCore;

public class EntityFrameworkCoreManagerDbSchemaMigrator
    : IManagerDbSchemaMigrator, ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;

    public EntityFrameworkCoreManagerDbSchemaMigrator(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task MigrateAsync()
    {
        /* We intentionally resolving the ManagerDbContext
         * from IServiceProvider (instead of directly injecting it)
         * to properly get the connection string of the current tenant in the
         * current scope.
         */

        await _serviceProvider
            .GetRequiredService<ManagerDbContext>()
            .Database
            .MigrateAsync();
    }
}
