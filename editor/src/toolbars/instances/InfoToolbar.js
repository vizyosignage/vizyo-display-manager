/**
 * Toolbar with canvas Infos
 *
 * @param {DrawerJs.Drawer} drawerInstance
 * @param {Object} [options]
 * @extends DrawerToolbar
 * @constructor
 */
var InfoToolbar = function(drawerInstance, options) {
    // css class for toolbar
    options.toolbarClass = 'tool-info-toolbar';
    // call DrawerToolbar c-tor
    DrawerToolbar.call(this, drawerInstance, options);
    // cry loud of birth
    drawerInstance.trigger(drawerInstance.EVENT_INFO_TOOLBAR_CREATED, [this]);
    //console.log(options);
};

InfoToolbar.prototype = Object.create(DrawerToolbar.prototype);
InfoToolbar.prototype.constructor = DrawerToolbar;

InfoToolbar.prototype.customScrollMode = true;