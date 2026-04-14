using Xunit;

namespace Vizyo.Display.Manager.EntityFrameworkCore;

[CollectionDefinition(ManagerTestConsts.CollectionDefinitionName)]
public class ManagerEntityFrameworkCoreCollection : ICollectionFixture<ManagerEntityFrameworkCoreFixture>
{

}
