(function ($, pluginsNamespace) {
  "use strict";

  /**
   * Provides a button to json from canvas.
   *
   * @param {DrawerJs.Drawer} drawer
   * Instance of {@link DrawerJs.Drawer}.
   *
   * @constructor
   * @memberof DrawerJs.plugins
   */
  var SaveButton = function SaveButtonConstructor(drawer, options) {
    /**
     * @type {Drawer}
     */
    this.drawer = drawer;
    this.name = 'SaveButton';
    this._setupOptions(options);

    this._bindedOnToolbarCreated = this._onToolbarCreated.bind(this);
    drawer.on(drawer.EVENT_CONFIG_TOOLBAR_CREATED, this._bindedOnToolbarCreated);
    drawer.on(drawer.EVENT_MINIMIZED_TOOLBAR_CREATED, this._bindedOnToolbarCreated);
  };

  SaveButton.prototype._defaultOptions = {
    buttonOrder: 1
  };

  /**
   * Setup data
   * @param {Object} [options] - options to save
   * @param {String} [pluginName] - name of plugin
   * @param {Boolean} [doNotSave] - set true to not save result as this.options
   * @returns {Object} config of plugin
   */
  SaveButton.prototype._setupOptions = function (options, pluginName, doNotSave) {
    pluginName = pluginName || this.name;
    var drawer = this.drawerInstance || this.drawer,
        optionsFromDrawer = drawer && drawer.getPluginConfig(pluginName),
        result = $.extend(true,
            {},
            this._defaultOptions || {},
            optionsFromDrawer || {},
            options || {}
        );

    if (!doNotSave) {
      this.options = result;
    }
    return result;
  };


  /**
   * On toolbar created - create tool button.
   */
  SaveButton.prototype._onToolbarCreated = function (ev, toolbar) {
      this.toolbar = toolbar;
      if (this.createControls) {
          this.createControls(toolbar);
      }
  };


 SaveButton.prototype.createControls = function (toolbar) {
    this._createAndAddButton(toolbar);
 };

  /**
   * Deletes tool button.
   * If  doDeleteToolbarCreationListeners is true - removes listeners of toolbar creation event.
   * So, tool will not appear on toolbar next time, when toolbar is created.
   *
   * @param {boolean} doDeleteToolbarCreationListeners
   */
  SaveButton.prototype.removeTool = function(doDeleteToolbarCreationListeners) {
      if (this.deleteControls) {
          this.deleteControls();
      }

      // stop listening toolbar creation
      if (doDeleteToolbarCreationListeners) {
          this.drawer.off(this.drawer.EVENT_CONFIG_TOOLBAR_CREATED, this._bindedOnToolbarCreated);
      }
  };





  /**
   * Creates and adds button to toolbar.
   * @param  {DrawerToolbar} toolbar
   */
  SaveButton.prototype._createAndAddButton = function(toolbar) {
    var buttonConfig = {
      buttonOrder: this.options.buttonOrder,
      additionalClass: 'btn-save-canvas',
      iconClass: 'fa-save',
      tooltipText: this.drawer.t('Save to canvas'),
      clickHandler: this._onSaveButtonClick.bind(this)
    };
    toolbar.addButton(buttonConfig);
  };


/**
 * save to canvas (toJson)
 */
SaveButton.prototype._onSaveButtonClick = function() {
  var self = this;
  self.drawer.saveCanvas();
};


  pluginsNamespace.SaveButton = SaveButton;

})(jQuery, DrawerJs.plugins, DrawerJs.util);
