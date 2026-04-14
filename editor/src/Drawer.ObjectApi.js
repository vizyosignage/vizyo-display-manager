/*jshint esnext: true */

(function(DrawerApi) {
    /**
     * Checks if obj is set and is fabric.Object
     *
     * @param  {} obj [description]
     * @throw {Error}  if obj is falsie or object is not fabric.Object
     */
    DrawerApi.prototype._checkObject = function(obj) {
        if (!obj) {
            throw new Error('[Drawer API]  no object provided!');
        }
        if (!(obj instanceof fabric.Object)) {
            throw new Error("[Drawer API]  object type is not 'fabric.Object!'");
        }
    };


    /**
     * Returns currently active object.
     * @return {fabric.Object}   currently active object
     */
    DrawerApi.prototype.getSelectedObject = function() {
        return this.drawer.fCanvas.getActiveObject();
    };


    /**
     * Bring object closer to front in objects stack.
     *
     * @param  {fabric.Object} fabricItem   object to reposition
     * @return {fabric.Object} returns   same object
     */
    DrawerApi.prototype.bringObjectForward = function(fabricItem) {
        this._checkObject(fabricItem);

        this.drawer.fCanvas.bringForward(fabricItem, true);
        this.drawer.syncCanvasData();
        return fabricItem;
    };

     DrawerApi.prototype.bringForward = function() {
       var activeObject = this.drawer.fCanvas.getActiveObject();
        if (!activeObject) return;

        this.drawer.fCanvas.bringForward(activeObject, true);
        this.drawer.syncCanvasData();
    };


    /**
     * Bring object closer to bottom in objects stack.
     *
     * @param  {fabric.Object} fabricItem   object to reposition
     * @return {fabric.Object} returns   same object
     */
    DrawerApi.prototype.sendObjectBackwards = function(fabricItem) {
        this._checkObject(fabricItem);
        this.drawer.fCanvas.sendBackwards(fabricItem, true);
        this.drawer.syncCanvasData();
        return fabricItem;
    };

    DrawerApi.prototype.sendBackwards = function() {
        var activeObject = this.drawer.fCanvas.getActiveObject();
        if (!activeObject) return;
        
        this.drawer.fCanvas.sendBackwards(activeObject, true);
        this.drawer.syncCanvasData();
    };


    /**
     * Move object the top object in stack.
     *
     * @param  {fabric.Object} fabricItem   object to reposition
     * @return {fabric.Object}   returns same object
     */
    DrawerApi.prototype.bringObjectToFront = function(fabricItem) {
        this._checkObject(fabricItem);

        this.drawer.fCanvas.bringToFront(fabricItem, true);
        this.drawer.syncCanvasData();
        return fabricItem;
    };

    DrawerApi.prototype.bringToFront = function() {
        var activeObject = this.drawer.fCanvas.getActiveObject();
        if (!activeObject) return;

        this.drawer.fCanvas.bringToFront(activeObject, true);
        this.drawer.syncCanvasData();
     };


    /**
     * Move object the bottom object in stack.
     *
     * @param  {fabric.Object} fabricItem   object to reposition
     * @return {fabric.Object}   returns same object
     */
    DrawerApi.prototype.sendObjectToBack = function(fabricItem) {
        this._checkObject(fabricItem);

        this.drawer.fCanvas.sendToBack(fabricItem);
        this.drawer.syncCanvasData();
        return fabricItem;
    };

    DrawerApi.prototype.sendToBack = function() {
        var activeObject = this.drawer.fCanvas.getActiveObject();
        if (!activeObject) return;

        this.drawer.fCanvas.sendToBack(activeObject);
        this.drawer.syncCanvasData();
    };

    /**
     * Remove object from canvas.
     *
     * @param  {fabric.Object} fabricItem  object to reposition
     */
    DrawerApi.prototype.removeObject = function(fabricItem) {
        this._checkObject(fabricItem);

        fabricItem.remove();
        this.drawer.fCanvas.renderAll();
    };

    DrawerApi.prototype.remove = function() {
        var activeObject = this.drawer.fCanvas.getActiveObject();
        if (!activeObject) return;

        activeObject.remove();
        this.drawer.fCanvas.renderAll();
    };

    /**
     * Settings object (media, content, playlist)
     *
     * @param  {fabric.Object} fabricItem  object
     */
    DrawerApi.prototype.settingsObject = function(fabricItem) {
        //window.angularComponentReference.zone.run(() => { window.angularComponentReference.loadAngularFunction(); });
        window.angularComponent.getActiveCanvasObject();
    };


    /**
     * Duplicate given object.
     * If object is not 'async' - it will be returned.
     * If 'callback' is provided - it will be called after cloning,
     *  with cloned object as argument
     *
     * @param  {fabric.Object}  fabricItem  object to be cloned
     * @param  {Function}       callback    will be called after cloning with cloned object as argument
     * @return {fabric.Object}              cloned object, if objject is not 'async'
     */
    DrawerApi.prototype.duplicateObject = function(fabricItem, callback) {
        this._checkObject(fabricItem);

        var _this = this;
        var onCloned = function(clonedObj) {
            if (!clonedObj) {
                throw new Error("[Drawer API] duplicateObject() : Clone failed! Clone source: " + fabricItem.toString());
            }

            clonedObj.set('left', fabricItem.get('left') + 20);
            clonedObj.set('top', fabricItem.get('top') + 20);

            var uid = canvasObjectUid();
            clonedObj.set('id', uid); //set different uid from original object

            _this.drawer.fCanvas.add(clonedObj);
            _this.drawer.fCanvas.renderAll();

            // call callback with new object
            if (callback) {
                callback(clonedObj);
            }
            return clonedObj;
        };

        // sync and async objects cloning is different
        if (fabricItem.async) {
            // call clone with callback
            fabricItem.clone(onCloned);
        } else {
            // direct call function
            return onCloned(fabricItem.clone());
        }
    };

    DrawerApi.prototype.duplicate = function(callback) {
        var activeObject = this.drawer.fCanvas.getActiveObject();
        if (!activeObject) return;

        var _this = this;
        var onCloned = function(clonedObj) {
            if (!clonedObj) {
                throw new Error("[Drawer API] duplicateObject() : Clone failed! Clone source: " + activeObject.toString());
            }

            clonedObj.set('left', activeObject.get('left') + 20);
            clonedObj.set('top', activeObject.get('top') + 20);

            var uid = canvasObjectUid();
            clonedObj.set('id', uid); //set different uid from original object

            _this.drawer.fCanvas.add(clonedObj);
            _this.drawer.fCanvas.renderAll();

            // call callback with new object
            if (callback) {
                callback(clonedObj);
            }
        };

        // sync and async objects cloning is different
        if (activeObject.async) {
            // call clone with callback
            activeObject.clone(onCloned);
        } else {
            // direct call function
            return onCloned(activeObject.clone());
        }
    };


    /**
     * Create grid in to canvas.
     *
     */
    DrawerApi.prototype.createGrid = function(gridW, gridH, isSnap, isOnlyRow) {
        if (!gridW) { gridW = this.drawer.defaultOptions.gridW; }
        if (!gridH) { gridH = this.drawer.defaultOptions.gridH; }
        //if (!isOnlyRow) { isOnlyRow = this.drawer.defaultOptions.isOnlyRow; }
        this.drawer.fCanvas.createGrid(gridW, gridH, isSnap, isOnlyRow);
        this.drawer.fCanvas.renderAll();
    };

    /**
     * Create rows in to canvas.
     *
     */
    DrawerApi.prototype.createRow = function(gridW, gridH, isSnap) {
        if (!gridW) { gridW = this.drawer.defaultOptions.gridW; }
        if (!gridH) { gridH = this.drawer.defaultOptions.gridH; }
        this.drawer.fCanvas.createRow(gridW, gridH, isSnap);
        this.drawer.fCanvas.renderAll();
    };

    /**
     * Remove grid from canvas.
     *
     */
    DrawerApi.prototype.removeGrid = function() {
        this.drawer.fCanvas.removeGrid();
        this.drawer.fCanvas.renderAll();
    };

    /**
     * set size and pos to canvas object
     *
     */
    //DrawerApi.prototype.setObjectSize = function(w = 0, h = 0) {
    DrawerApi.prototype.setObjectSize = function() {
        var target = this.drawer.fCanvas.getActiveObject();
        if (!target) return;

        //if (w <= 0 & h <= 0) {
        var w = parseInt($("#txtW").val());
        var h = parseInt($("#txtH").val());
        //}

        target.scaleX = 1;
        target.scaleY = 1;
        target.setWidth(w);
        target.setHeight(h);
        //snapCanvas(target);
        target.setCoords();
        this.drawer.fCanvas.renderAll();
    };

    //DrawerApi.prototype.setObjectPos = function(x = -1, y = -1) {
    DrawerApi.prototype.setObjectPos = function() {
        var target = this.drawer.fCanvas.getActiveObject();
        if (!target) return;

        //if (x < 0 & y < 0) {
        var x = parseInt($("#txtX").val());
        var y = parseInt($("#txtY").val());
        //}

        target.setLeft(x);
        target.setTop(y);
        //snapCanvas(target);
        target.setCoords();
        this.drawer.fCanvas.renderAll();
    };

})(DrawerJs.DrawerApi);