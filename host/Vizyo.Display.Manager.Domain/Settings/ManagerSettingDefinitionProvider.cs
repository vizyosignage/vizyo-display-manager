using Volo.Abp.Settings;

namespace Vizyo.Display.Manager.Settings;

public class ManagerSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        //Define your own settings here. Example:
        //context.Add(new SettingDefinition(ManagerSettings.MySetting1));
    }
}
