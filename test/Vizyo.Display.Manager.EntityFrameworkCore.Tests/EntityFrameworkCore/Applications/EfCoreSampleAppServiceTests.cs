using Vizyo.Display.Manager.Samples;
using Xunit;

namespace Vizyo.Display.Manager.EntityFrameworkCore.Applications;

[Collection(ManagerTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<ManagerEntityFrameworkCoreTestModule>
{

}
