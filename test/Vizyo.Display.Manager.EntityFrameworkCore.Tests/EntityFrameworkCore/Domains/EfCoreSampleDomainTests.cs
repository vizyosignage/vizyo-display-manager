using Vizyo.Display.Manager.Samples;
using Xunit;

namespace Vizyo.Display.Manager.EntityFrameworkCore.Domains;

[Collection(ManagerTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<ManagerEntityFrameworkCoreTestModule>
{

}
