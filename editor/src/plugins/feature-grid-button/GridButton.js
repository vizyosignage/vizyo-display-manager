(function($, pluginsNamespace) {
    "use strict";

    /**
     * Provides a button to create grid in to canvas.
     *
     * @param {DrawerJs.Drawer} drawer
     * Instance of {@link DrawerJs.Drawer}.
     *
     * @constructor
     * @memberof DrawerJs.plugins
     */
    var GridButton = function GridButtonConstructor(drawer, options) {
        /**
         * @type {Drawer}
         */
        this.drawer = drawer;
        this.name = 'GridButton';
        this._setupOptions(options);

        this._bindedOnToolbarCreated = this._onToolbarCreated.bind(this);
        drawer.on(drawer.EVENT_CONFIG_TOOLBAR_CREATED, this._bindedOnToolbarCreated);
        drawer.on(drawer.EVENT_MINIMIZED_TOOLBAR_CREATED, this._bindedOnToolbarCreated);
    };

    GridButton.prototype._defaultOptions = {
        buttonOrder: 1
    };

    /**
     * Setup data
     * @param {Object} [options] - options to save
     * @param {String} [pluginName] - name of plugin
     * @param {Boolean} [doNotSave] - set true to not save result as this.options
     * @returns {Object} config of plugin
     */
    GridButton.prototype._setupOptions = function(options, pluginName, doNotSave) {
        pluginName = pluginName || this.name;
        var drawer = this.drawerInstance || this.drawer,
            optionsFromDrawer = drawer && drawer.getPluginConfig(pluginName),
            result = $.extend(true, {},
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
    GridButton.prototype._onToolbarCreated = function(ev, toolbar) {
        this.toolbar = toolbar;
        if (this.createControls) {
            this.createControls(toolbar);
        }
    };


    GridButton.prototype.createControls = function(toolbar) {
        this._createAndAddButton(toolbar);
    };

    /**
     * Deletes tool button.
     * If  doDeleteToolbarCreationListeners is true - removes listeners of toolbar creation event.
     * So, tool will not appear on toolbar next time, when toolbar is created.
     *
     * @param {boolean} doDeleteToolbarCreationListeners
     */
    GridButton.prototype.removeTool = function(doDeleteToolbarCreationListeners) {
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
    GridButton.prototype._createAndAddButton = function(toolbar) {
        var buttonConfig = {
            buttonOrder: this.options.buttonOrder,
            additionalClass: 'btn-grid-canvas',
            iconClass: 'fa-th',
            tooltipText: this.drawer.t('Grid into canvas'),
            clickHandler: this._onGridButtonClick.bind(this)
        };
        toolbar.addButton(buttonConfig);
    };


    /**
     * grid into canvas or remove grid
     */
    GridButton.prototype._onGridButtonClick = function() {
        var self = this;
        //console.log(self.drawer.defaultOptions.gridW, self.drawer.defaultOptions.gridH, self.drawer.defaultOptions.isOnlyRow);
        self.drawer.createGrid(self.drawer.defaultOptions.gridW, self.drawer.defaultOptions.gridH, true, self.drawer.defaultOptions.isOnlyRow);
    };


    pluginsNamespace.GridButton = GridButton;

})(jQuery, DrawerJs.plugins, DrawerJs.util);