(function($, pluginsNamespace, BaseInfoTool, util) {
    'use strict';

    /**
     * Provides canvas InfoControls.
     * Text içerikli kontrollerin Font,En,Boy,X,Y ayarlarınının yapıldığı toolbar
     *
     * @param {DrawerJs.Drawer} drawer
     * Instance of {@link DrawerJs.Drawer}.
     *
     * @param {Object} options - Configuration object
     * @param {Number} options.defaultValue - Default InfoControls value
     *
     *
     * @constructor
     * @memberof DrawerJs.options
     * @extends {DrawerJs.plugins.BaseInfoTool}
     */
    var InfoControls = function InfoControlsConstructor(drawer, options) {
        // call super c-tor
        BaseInfoTool.call(this, drawer);
        this._setupOptions(options);
    };

    InfoControls.prototype = Object.create(BaseInfoTool.prototype);
    InfoControls.prototype.constructor = BaseInfoTool;

    InfoControls.prototype.optionName = 'infoControl';


    InfoControls.prototype.createControls = function(toolbar) {
        this.createControl(toolbar);
    };

    /**
     * Create controls
     * @param {DrawerToolbar} toolbar
     * @returns {jQuery}
     */
    InfoControls.prototype.createControl = function(toolbar) {
        this.toolbar = toolbar;
        //console.log('InfoControls this: ', this);
        var w = this.drawer.width; //800;
        var h = this.drawer.height; //450;
        var ctrl = //"<div class='noselect toolbar-placeholder toolbar-placeholder-top' style='float:right; position:relative; height:28px;'>" +
            "<div style='height:32px;margin-top:10px'>" +
            "<span style='margin:5px'>Font:</span>" +
            "<a id='btnFontUp' class='toolbar-button-icon' tabindex='-1' style='font-size:16px;margin-left:5px;margin-right:5px'><i class='fa fa-plus fa-border'></i></a>" +
            "<a id='btnFontDown' class='toolbar-button-icon' tabindex='-1' style='font-size:16px;margin-right:5px'><i class='fa fa-minus fa-border'></i></a>" +
            "<input type='number' id='txtFontSize' name='txtFontSize' min='1' max='300' value='32' style='border:0px; background-color:#eee; color:#000'>" +
            "<a id='btnFontApply' class='toolbar-button-icon' tabindex='-1' style='font-size:16px;margin-left:5px;margin-right:10px'><i class='fa fa-check fa-border'></i></a>" +
            
            "<span style='margin:5px'>W:</span>" +
            "<input disabled type='number' id='txtW' name='txtWH' min='1' max='" + w + "' value='100' style='border:0px; background-color:#eee; color:#000'>" +
            "<span style='margin:5px'>H:</span>" +
            "<input disabled type='number' id='txtH' name='txtWH' min='1' max='" + h + "' value='100' style='border:0px; background-color:#eee; color:#000'>" +
            // "<a id='btnWH' (click)='onclickWH()' class='toolbar-button-icon' tabindex='-1' style='font-size:16px;margin-left:5px;margin-right:10px'><i class='fa fa-check'></i></a>" +
            
            "<span style='margin:5px'>X:</span>" +
            "<input type='number' id='txtX' name='txtXY' min='0' max='" + w + "' value='0' style='border:0px; background-color:#eee; color:#000'>" +
            "<span style='margin:5px'>Y:</span>" +
            "<input type='number' id='txtY' name='txtXY' min='0' max='" + h + "' value='0' style='border:0px; background-color:#eee; color:#000'>" +
            "<a id='btnXY' (click)='onclickXY()' class='toolbar-button-icon' tabindex='-1' style='font-size:16px;margin-left:5px;margin-right:10px'><i class='fa fa-check fa-border'></i></a>" +
            "</div>";

        this.$InfoControl = $(ctrl);

        toolbar.addControl(this.$InfoControl, this.options.buttonOrder);
        return this.$InfoControl;
    };

    InfoControls.prototype.showControls = function() {
        this.$InfoControl.removeClass('hidden');
    };

    InfoControls.prototype.hideControls = function(force) {
        var alwaysVisible = this.drawer.options.toolbars.popupButtonAlwaysVisible || this.options.alwaysVisible;
        if (force || !alwaysVisible) {
            this.$InfoControl.addClass('hidden');
        }
    };

    function addElements(w, h) {
        var ctrl = "<span style='margin:5px'>En:</span>" +
            "<input type='number' id='txtW' name='txtWH' min='1' max='" + w + "' value='100' style='border:0px; background-color:#eee; color:#000'>" +
            "<span style='margin:5px'>Boy:</span>" +
            "<input type='number' id='txtH' name='txtWH' min='1' max='" + h + "' value='100' style='border:0px; background-color:#eee; color:#000'>" +
            "<span style='margin:5px'>X:</span>" +
            "<input type='number' id='txtX' name='txtXY' min='0' max='" + w + "' value='0' style='border:0px; background-color:#eee; color:#000'>" +
            "<span style='margin:5px'>Y:</span>" +
            "<input type='number' id='txtY' name='txtXY' min='0' max='" + h + "' value='0' style='border:0px; background-color:#eee; color:#000'>" +
            "<a id='btnWH' href='javascript:void(0)' class='toolbar-button-icon' tabindex='-1' style='font-size:16px;margin-left:5px;margin-right:10px'><i class='fa fa-check'></i></a>" +
            "<a id='btnXY' href='javascript:void(0)' class='toolbar-button-icon' tabindex='-1' style='font-size:16px;margin-left:5px;margin-right:10px'><i class='fa fa-check'></i></a>" +
            "<div class='noselect toolbar-placeholder toolbar-placeholder-top' style='float:right; position:relative; height:28px;'>" +
            "</div>";

        return ctrl;
    }

    pluginsNamespace.InfoControls = InfoControls;

}(jQuery, DrawerJs.plugins, DrawerJs.plugins.BaseInfoTool, DrawerJs.util));