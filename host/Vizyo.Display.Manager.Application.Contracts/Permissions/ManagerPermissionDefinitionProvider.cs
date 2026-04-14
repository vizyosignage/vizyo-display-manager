using Vizyo.Display.Manager.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;

namespace Vizyo.Display.Manager.Permissions;

public class ManagerPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(ManagerPermissions.GroupName);

        //Define your own permissions here. Example:
        //myGroup.AddPermission(ManagerPermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<ManagerResource>(name);
    }
}
