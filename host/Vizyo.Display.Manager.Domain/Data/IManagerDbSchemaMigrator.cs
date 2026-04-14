using System.Threading.Tasks;

namespace Vizyo.Display.Manager.Data;

public interface IManagerDbSchemaMigrator
{
    Task MigrateAsync();
}
