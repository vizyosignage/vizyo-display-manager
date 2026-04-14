(function() {
    /**
     *
     * @param {DrawerJs.Drawer} drawer - instance of drawer
     * @memberOf DrawerJs
     * @constructor
     */
    var DrawerApi = function(drawer) {
        if (!drawer) {
            throw new Error('DrawerApi(): no drawer is provided!');
        }
        this.drawer = drawer;
    };

    DrawerApi.prototype.drawer = null;

    // Drawer core API
    ////////////////////////////////////////////////////////////////////////

    /**
     * Starts editing mode.
     * If already in this mode - do nothing.
     */
    DrawerApi.prototype.checkIsActive = function() {
        if (this.drawer.mode != this.drawer.MODE_ACTIVE) {
            throw new Error("Drawer is not active!");
        }
    };


    /**
     * Starts editing mode.
     * If already in this mode - do nothing.
     */
    DrawerApi.prototype.startEditing = function() {
        this.drawer._startEditing();
    };

    /**
     * Stops editing.
     * If already stopped, ie. in INACTIVE_MODE - do nothing.
     */
    DrawerApi.prototype.stopEditing = function() {
        this.drawer._stopEditing();
    };



    /**
     * Get serialized in JSON string canvas data.
     * @returns [String]
     */
    DrawerApi.prototype.getCanvasAsJSON = function() {
        this.drawer.api.checkIsActive();
        return this.drawer.getSerializedCanvas();
    };

    /**
     * Get serialized in clear JSON string canvas data.
     * @returns [String]
     */
    DrawerApi.prototype.getCanvasJson = function() {
        return this.drawer.getCanvasJson();
    };

    /** todo
     * test
     * @returns [String]
     */
    DrawerApi.prototype.getCanvasClearJson = function() {
        return this.drawer.getCanvasClearJson();
    };

    /**
     * clear all canvas objects
     * @returns [String]
     */
    DrawerApi.prototype.clearCanvas = function() {
        return this.drawer.clearCanvas();
    };


    /**
     * Save canvas.
     * Syncs drawer canvas data with storages, defined in options
     */
    DrawerApi.prototype.saveCanvas = function() {
        this.drawer.api.checkIsActive();
        this.drawer.syncCanvasData();
    };


    /**
     * Load canvas.
     * Loads canvas
     */
    DrawerApi.prototype.loadCanvasFromData = function(data) {
        //console.log('DrawerApi.prototype.loadCanvasFromData', data);
        this.drawer.loadCanvas(data);
    };



    /**
     * Returns data-url with image encoded to base64.
     *
     * @see Drawer.Storage.js getImageData() for details
     * @returns {String} image data encoded in base64/png.
     */
    DrawerApi.prototype.getCanvasAsImage = function() {
        return this.drawer.getImageData();
    };

     DrawerApi.prototype.getCanvasAsScaledImage = function(scaleFactor) {
        return this.drawer.getImageData(scaleFactor);
    };


    /**
     * Save canvas as image in storages, as defined in config
     */
    DrawerApi.prototype.saveCanvasImage = function() {
        this.drawer.api.checkIsActive();
        this.drawer.syncImageData();
    };

    /**
     * set background image from url
     */
    /*  DrawerApi.prototype.backgroundImage = function (url) {
         this.drawer.backgroundImage(url);
     }; */

    /**
     * List of all available options for each mode of each toolbar
     * @typedef {Object} sizesOfDrawer
     * @memberOf DrawerJs.DrawerApi
     * @property {Number} width - width of Drawer
     * @property {Number} height - height of drawer
     * @property {Number} scrollTop - "Top" position including scrollTop value of parent elements
     * @property {Number} scrollLeft - "Left" position including scrollLeft value of parent elements
     * @property {Number} top - Absolute value of "top" position
     * @property {Number} left - Absolute value of "left" position
     */

    /**
     * Set zoom factor of drawer
     * @returns {DrawerJs.DrawerApi.setZoomFactor}
     */
     DrawerApi.prototype.setZoomFactor = function(zoomFactor) {
        this.drawer.zoomFactor = zoomFactor;
    };

    /**
     * Get zoom factor of drawer
     * @returns {DrawerJs.DrawerApi.getZoomFactor}
     */
     DrawerApi.prototype.getZoomFactor = function() {
        var zoom = this.drawer.getZoomFactor();
        return zoom;
    };


    /**
     * Get sizes of drawer
     * @returns {DrawerJs.DrawerApi.sizesOfDrawer}
     */
    DrawerApi.prototype.getSize = function() {
        var sizes = this.drawer.getSize();
        return sizes;
    };

    /**
     * Sets drawer size.
     */
    DrawerApi.prototype.setSize = function(width, height, zoomFactor) {
        this.drawer.setSize(width, height, zoomFactor);
    };

    /**
     * Set active color
     * @param {String} color - New color value (HEX)
     */
    DrawerApi.prototype.setActiveColor = function(color) {
        this.drawer.setActiveColor(color);
    };

    /**
     * Set background color
     * @param {String} color - New color value (HEX)
     */
    DrawerApi.prototype.setBackgroundColor = function(color) {
        this.drawer.fCanvas.backgroundColor = color;
        this.drawer.fCanvas.renderAll();
    };

    /**@
     * Create text object
     * @param {Number} [positionX=0] - left offset of new text object
     * @param {Number} [positionY=0] - top offset of new text object
     * @param {String} [text="Text"] - text of new object
     * @param {Object} [styles] - styles for new text object
     */
    DrawerApi.prototype.createText = function(positionX, positionY, text, styles) {
        this.drawer._pluginsInstances.Text.addTextShape(positionX, positionY, text, styles);
    };

    DrawerApi.prototype.createRectangle = function() {
        var canvasW = this.drawer.fCanvas.width;
        var canvasH = this.drawer.fCanvas.height;
        var z = this.drawer.fCanvas.zoomFactor;

        var w = 80;
        var h = 80;

        if (canvasH < h)
        {
            w = canvasH;
            h = canvasH;
        }

        var rect = new fabric.Rect({
            left: 0,
            top: 0,
            width: w,
            height: h,
            fill: '#5CD65C'
          });

        this.drawer.fCanvas.add(rect);
        this.drawer.fCanvas.renderAll();
    };

    DrawerApi.prototype.createRoute = function(text, options) {
        //this.drawer._pluginsInstances.Route.addTextShape(positionX, positionY, text, styles);
        var route = new fabric.RouteZone(text, options);
        this.drawer.fCanvas.add(route);
        this.drawer.fCanvas.setActiveObject(route);
    };

    DrawerApi.prototype.createPark = function(text, options) {
        //this.drawer._pluginsInstances.Park.addTextShape(positionX, positionY, text, styles);
        var park = new fabric.ParkZone(text, options);
        this.drawer.fCanvas.add(park);
        this.drawer.fCanvas.setActiveObject(park);
    };

    DrawerApi.prototype.createSign = function(text, options) {
        var sign = new fabric.SignZone(text, options);
        this.drawer.fCanvas.add(sign);
        this.drawer.fCanvas.setActiveObject(sign);
    };

    DrawerApi.prototype.createTicker = function(positionX, positionY, text, styles) {
        this.drawer._pluginsInstances.Text.addTickerShape(positionX, positionY, text, styles);
    };

    DrawerApi.prototype.createLabel = function(options) {
        var label = new fabric.LabelZone(options);
        /* var label = new fabric.LabelZone({
            width: 300,
            height: 300,
            left: 100,
            top: 100,
            backgroundColor: '#d99694',
            label: 'www.google.com',
            fill: '#ccc',
            id: '5454545454545455454'
        }); */
        this.drawer.fCanvas.add(label);
        this.drawer.fCanvas.setActiveObject(label);
    };


    /**
     * Update current options.
     * If optionsToUpdate has plugins key, plugins will be reloaded
     *
     * @param  {Object} optionsToUpdate options object
     */
    DrawerApi.prototype.updateOptions = function(optionsToUpdate) {
        this.drawer.updateOptions(optionsToUpdate);
    };


    /**
     * Update current options.
     * All plugins will be reloaded
     *
     * @param  {Object} optionsToUpdate options object
     */
    DrawerApi.prototype.setOptions = function(newOptions) {
        this.drawer.setOptions(newOptions);
    };


    /**
     * Load plugin by name.
     * Name must exists in DrawerJs namespace.
     * If plugin is already loaded, error will be thrown
     *
     * @param  {String} pluginName plugin name
     */
    DrawerApi.prototype.loadPlugin = function(pluginName) {
        this.drawer.loadPlugin(pluginName);
    };


    /**
     * Unload plugin by name.
     * If plugin is not loaded, nothing happens.
     *
     * @param  {String} pluginName plugin name
     */
    DrawerApi.prototype.unloadPlugin = function(pluginName) {
        this.drawer.unloadPlugin(pluginName);
    };



    DrawerJs.DrawerApi = DrawerApi;
})(DrawerJs);