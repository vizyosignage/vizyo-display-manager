(function($, pluginsNamespace) {
    'use strict';

    /**
     * Base class for tool infos plugins.
     *
     * @param drawer
     * @constructor
     * @memberof DrawerJs.plugins
     */
    var BaseInfoTool = function(drawer, options) {
        if (!drawer) {
            throw new Error("BaseInfoTool CTOR : drawer is not set!");
        }
        this.drawer = drawer;
        this._setupOptions(options);

        // handle toolbar created/destroyed
        this._bindedOnToolbarCreated = this._onToolbarCreated.bind(this);
        drawer.on(drawer.EVENT_INFO_TOOLBAR_CREATED, this._bindedOnToolbarCreated);
        drawer.on(drawer.EVENT_TOOLBAR_DESTROYED, this._onToolbarDestroyed.bind(this));

        // handle tool activation/deactivation
        drawer.on(drawer.EVENT_DO_DEACTIVATE_ALL_TOOLS, this._onDeactivateTool.bind(this));

        drawer.on(drawer.EVENT_DO_DEACTIVATE_TOOL, this._onDeactivateTool.bind(this));
        drawer.on(drawer.EVENT_DO_ACTIVATE_TOOL, this._onActivateTool.bind(this));

        drawer.on(drawer.EVENT_TOOL_DEACTIVATED, this._onDeactivateTool.bind(this));
        drawer.on(drawer.EVENT_TOOL_ACTIVATED, this._onActivateTool.bind(this));

        // handle object selection/deselection
        drawer.on(drawer.EVENT_OBJECT_SELECTED, this._onObjectSelected.bind(this));
        drawer.on(drawer.EVENT_SELECTION_CLEARED, this._onSelectionCleared.bind(this));

        // react on edit mode entering
        drawer.on(drawer.EVENT_TEXT_EDITING_ENTERED, this._onTextEditingEntered.bind(this));
        // react on edit mode exiting
        drawer.on(drawer.EVENT_TEXT_EDITING_EXITED, this._onTextEditingExited.bind(this));
    };

    /**
     * is active at the moment
     * @type {boolean}
     */
    BaseInfoTool.prototype.active = false;

    /** Instance of Drawer
     * @type {Drawer} */
    BaseInfoTool.prototype.drawer = null;

    /** Instance of toolbar
     * @type {DrawerToolbar} */
    BaseInfoTool.prototype.toolbar = null;

    /**
     * Tool name
     * @const
     * @type {string}
     */
    BaseInfoTool.prototype.name = '';

    /**
     * Tool type
     */
    BaseInfoTool.prototype.type = null;

    /**
     * Tool name. On selecting tool/object, if this.optionName is in array of
     * object allowed options - tool will show controls
     * @const
     * @type {String}
     */
    BaseInfoTool.prototype.optionName = '';

    /**
     * Css class of tool button
     * @default
     * @const
     * @type {String}
     */
    BaseInfoTool.prototype.btnClass = 'btn';

    /**
     * Tool icon font-awesome class
     * @const
     * @type {String}
     */
    BaseInfoTool.prototype.faClass = '';

    /**
     * Show tool only in edit mode
     * @default
     * @const
     * @type {boolean}
     */
    BaseInfoTool.prototype.showOnEditMode = false;

    /**
     * Hide tool in edit mode
     * @default
     * @const
     * @type {boolean}
     */
    BaseInfoTool.prototype.hideOnEditMode = true;

    /**
     * Current option data
     * @type {Object}
     */
    BaseInfoTool.prototype.data = {};

    /**
     * Setup data
     * @param {Object} [options] - options to save
     * @param {String} [pluginName] - name of plugin
     * @param {Boolean} [doNotSave] - set true to not save result as this.options
     * @returns {Object} config of plugin
     */
    BaseInfoTool.prototype._setupOptions = function(options, pluginName, doNotSave) {
        options = options || {};
        var optionsFromDrawer = this._collectDefaultOptions(pluginName),
            result = $.extend(true, {},
                this._defaultOptions || {},
                optionsFromDrawer || {},
                options
            );

        var updatedResult = this._onOptionsSetup(this._defaultOptions, options, optionsFromDrawer, result);
        result = updatedResult || result;
        if (!doNotSave) {
            this.options = result;
        }
        return result;
    };

    /**
     * Process options
     * @param {Object} [defaultOptions]
     * @param {Object} [options]
     * @param {Object} [optionsFromDrawer]
     * @param {Object} [result]
     * @returns {Object}
     * @private
     */
    BaseInfoTool.prototype._onOptionsSetup = function(defaultOptions, options, optionsFromDrawer, result) {
        return result;
    };

    /**
     * Setup data
     * @param {String} [pluginName] - name of plugin
     * @returns {Object}
     * @private
     */
    BaseInfoTool.prototype._collectDefaultOptions = function(pluginName) {
        pluginName = pluginName || this.name || this.optionName;
        var drawer = this.drawerInstance || this.drawer,
            result = drawer && drawer.getPluginConfig(pluginName);
        return result;
    };


    /**
     * On toolbar created - create tool button.
     * @param {fabric.Event} ev
     * @param {DrawerToolbar} toolbar
     * @private
     */
    BaseInfoTool.prototype._onToolbarCreated = function(ev, toolbar) {
        this.toolbar = toolbar;
        //console.log('BaseInfoTool _onToolbarCreated toolbar: ', toolbar);
        if (this.createControls) {
            this.createControls(toolbar);
        }

        if (this.useCombobox && this.$toolControl) {
            var comboBoxOptions = {
                    drawer: this.drawer,
                    editable: !this.onlyPredefined,
                    buttonMode: this.buttonMode
                },
                $targetSelect = this.$toolControl.find('select');
            $targetSelect.ToolbarComboBox(comboBoxOptions);
            this.comboBox = $targetSelect.getComboBox();
        }
    };


    /**
     * On toolbar destroyed - destroy button, if it was our toolbar.
     * @param {fabric.Event} ev
     * @param {DrawerToolbar} toolbar
     * @private
     */
    BaseInfoTool.prototype._onToolbarDestroyed = function(ev, toolbar) {
        if (this.toolbar == toolbar) {
            this.removeTool();
        }
    };


    /**
     * Deletes tool button.
     * If  doDeleteToolbarCreationListeners is true - removes listeners of toolbar creation event.
     * So, tool will not appear on toolbar next time, when toolbar is created.
     *
     * @param {boolean} doDeleteToolbarCreationListeners
     */
    BaseInfoTool.prototype.removeTool = function(doDeleteToolbarCreationListeners) {
        if (this.deleteControls) {
            this.deleteControls();
        }

        // stop listening toolbar creation
        if (doDeleteToolbarCreationListeners) {
            this.drawer.off(this.drawer.EVENT_OPTIONS_TOOLBAR_CREATED, this._bindedOnToolbarCreated);
        }
    };

    /**
     * React on edit mode entering
     * @param  {fabric.Event} [fEvent]
     * @param  {fabric.Object} tool
     * @private
     */
    BaseInfoTool.prototype._onTextEditingEntered = function(fEvent, tool) {
        tool = tool && tool.target;

        var isEditMode = tool && tool.isEditing,
            showControls = !this.hideOnEditMode && (this.showOnEditMode || isEditMode);
        if (showControls) {
            this.showControls(true, tool);
        } else {
            this.hideControls();
        }
    };

    /**
     * React on edit mode exiting
     * @param  {fabric.Event} [fEvent]
     * @param  {fabric.Object} [tool]
     * @private
     */
    BaseInfoTool.prototype._onTextEditingExited = function(fEvent, tool) {
        var isEditMode = tool && tool.target && tool.target.isEditing,
            showControls = this.hideOnEditMode && !isEditMode;
        if (showControls) {
            this.showControls();
        } else {
            this.hideControls();
        }
    };

    /**
     * Handler for EVENT_DO_DEACTIVATE_TOOL.
     * Hides controls.
     * Calls this.onDeactivateTool() if it is defined
     *
     * @param e event obj
     * @param tool tool object
     * @private
     */
    BaseInfoTool.prototype._onDeactivateTool = function(e, tool) {
        // set active to false
        this.active = false;
        // hide controls
        var needToShow = this.options && this.options.alwaysVisible;
        if (!needToShow) {
            this.hideControls();
        } else {
            this.showControls();
        }
    };


    /**
     * Default handler for EVENT_DO_ACTIVATE_TOOL.
     * Calls this.updateOnTool()
     *
     * @param {fabric.Event} e event obj
     * @param {BaseTool} tool tool object
     * @private
     */
    BaseInfoTool.prototype._onActivateTool = function(e, tool) {
        this.updateOnTool(tool);
    };


    /**
     * Shows/hides controls depending on tool.toolOptionsList
     *
     * @param {BaseTool} tool tool object
     */
    BaseInfoTool.prototype.updateOnTool = function(tool) {
        // look if activated tool toolOptionsList has this option name
        var toolHasOption = tool.toolOptionsList && (tool.toolOptionsList.indexOf(this.optionName) !== -1),
            editModeIsCorrect = (!this.showOnEditMode || tool.isEditing),
            needToShowControls = toolHasOption && editModeIsCorrect;
        if (needToShowControls) {
            this.active = true;
            // show controls
            this.showControls();
            // and activate tool
            if (this.onActivateTool) {
                this.onActivateTool(tool);
            }
        } else {
            this.active = false;
            // show controls
            this.hideControls(tool.forceOptionsHide);
        }
    };


    /**
     * Shows/hides controls, depending on selected object optionName
     * @param  {Event} event
     * @param  {fabric.Event} fabricEvent [description]
     * @private
     */
    BaseInfoTool.prototype._onObjectSelected = function(event, fabricEvent) {
        var target = fabricEvent.target,
            toolHasOption = target.objectOptionsList && (target.objectOptionsList.indexOf(this.optionName) !== -1),
            editModeIsCorrect = (!this.showOnEditMode || target.isEditing),
            needToShowControls = toolHasOption && editModeIsCorrect;
        if (needToShowControls) {
            // show controls
            this.showControls();
            // update controls
            this.updateControlsFromObject(target);
        } else {
            this.hideControls();
        }
    };

    /**
     * React on object deselect
     * @private
     */
    BaseInfoTool.prototype.onSelectionCleared = function() {

    };


    /**
     * On selection cleared - hide option controls if not tool is active.
     * Else shows option controls for active tool.
     * Calls this.onSelectionCleared if defined.
     * @private
     */
    BaseInfoTool.prototype._onSelectionCleared = function() {
        // if tool is active now - show controls for it. If no - hide  controls
        if (this.drawer.activeDrawingTool) {
            this.updateOnTool(this.drawer.activeDrawingTool);
        } else {
            this.hideControls();
        }
        this.onSelectionCleared();
    };

    /**
     * Collect necessary data from object
     * @param  {fabric.Object} target - fabric object
     * @returns {object} result
     */
    BaseInfoTool.prototype.collectDataFromObject = function(target) {
        var result = {};
        return result;
    };

    /**
     * Update controls with actual data
     * @param {object} data
     */
    BaseInfoTool.prototype.updateControls = function(data) {};

    /**
     * Collect and update controls with data from target object
     * @param  {fabric.Object} target - fabric object
     */
    BaseInfoTool.prototype.updateControlsFromObject = function(target) {
        this.collectDataFromObject(target);
        this.updateControls(this.data);
    };

    /**
     * This have to be redefined in child class
     * @param {Boolean} [withUpdate] - need to update controls
     * @param  {fabric.Object} [tool] - for styles collecting
     */
    BaseInfoTool.prototype.showControls = function(withUpdate, tool) {};

    /**
     * This have to be redefined in child class
     * @param {Boolean} [force] - force hide ignoring any options
     */
    BaseInfoTool.prototype.hideControls = function(force) {};


    pluginsNamespace.BaseInfoTool = BaseInfoTool;
}(jQuery, DrawerJs.plugins));