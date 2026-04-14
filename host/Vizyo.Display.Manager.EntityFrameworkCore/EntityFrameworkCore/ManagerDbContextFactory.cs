using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Vizyo.Display.Manager.EntityFrameworkCore;

/* This class is needed for EF Core console commands
 * (like Add-Migration and Update-Database commands) */
public class ManagerDbContextFactory : IDesignTimeDbContextFactory<ManagerDbContext>
{
    public ManagerDbContext CreateDbContext(string[] args)
    {
        var configuration = BuildConfiguration();
        
        ManagerEfCoreEntityExtensionMappings.Configure();

        var builder = new DbContextOptionsBuilder<ManagerDbContext>()
            .UseSqlite(configuration.GetConnectionString("Default"));
        
        return new ManagerDbContext(builder.Options);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../Vizyo.Display.Manager.DbMigrator/"))
            .AddJsonFile("appsettings.json", optional: false);

        return builder.Build();
    }
}
