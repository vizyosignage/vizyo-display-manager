using System;
using System.Threading.Tasks;
using System.Diagnostics;
using Android.App;
using Android.Content.PM;
using Android.OS;
using Avalonia;
using Avalonia.Android;
using Android.Views;

namespace Vizyo.Display.Manager.Android
{
    [Activity(
        Label = "Vizyo.Display.Manager.Android",
        Theme = "@style/MyTheme.NoActionBar",
        Icon = "@drawable/icon",
        MainLauncher = true,
        ConfigurationChanges = ConfigChanges.Orientation | 
                               ConfigChanges.ScreenSize | 
                               ConfigChanges.UiMode |
                               ConfigChanges.ScreenLayout |
                               ConfigChanges.SmallestScreenSize)]
    public class MainActivity : AvaloniaMainActivity<App>
    {
        protected override AppBuilder CustomizeAppBuilder(AppBuilder builder)
        {
            return base.CustomizeAppBuilder(builder)
                .WithInterFont();
        }

        protected override void OnCreate(Bundle? savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            MakeFullScreen();
        }

        public override void OnWindowFocusChanged(bool hasFocus)
        {
            base.OnWindowFocusChanged(hasFocus);
            if (hasFocus)
                MakeFullScreen();
        }

        private void MakeFullScreen()
        {
            if (Build.VERSION.SdkInt >= BuildVersionCodes.R)
            {
                // Android 11+ (API 30+)
                var controller = Window.InsetsController;
                if (controller != null)
                {
                    controller.Hide(WindowInsets.Type.StatusBars() | WindowInsets.Type.NavigationBars());
                    controller.SystemBarsBehavior = (int)WindowInsetsControllerBehavior.ShowTransientBarsBySwipe;
                }
            }
            else
            {
                // (API < 30)
                var decorView = Window?.DecorView;
                if (decorView != null)
                {
                    decorView.SystemUiVisibility =
                        (StatusBarVisibility)(
                            SystemUiFlags.ImmersiveSticky |
                            SystemUiFlags.HideNavigation |
                            SystemUiFlags.Fullscreen |
                            SystemUiFlags.LayoutHideNavigation |
                            SystemUiFlags.LayoutFullscreen);
                }
            }

            // fullscreen flags
            Window?.AddFlags(WindowManagerFlags.Fullscreen | WindowManagerFlags.KeepScreenOn);
            Window?.ClearFlags(WindowManagerFlags.ForceNotFullscreen);
        }


        //protected override async void OnCreate(Bundle? savedInstanceState)
        //{
        //    base.OnCreate(savedInstanceState);

        //    try
        //    {
        //        await Task.Factory.StartNew(() => VizyoHostService.StartAsync());
        //    }
        //    catch (Exception ex)
        //    {
        //        System.Diagnostics.Debug.WriteLine($"Failed to start Vizyo host: {ex}");
        //    }
        //}

        //protected override async void OnDestroy()
        //{
        //    base.OnDestroy();

        //    try
        //    {
        //        await VizyoHostService.StopAsync();
        //    }
        //    catch (Exception ex)
        //    {
        //        System.Diagnostics.Debug.WriteLine($"Error stopping Vizyo host: {ex}");
        //    }
        //}
    }
}
