//require('Canvas.Utils');

(function(namespace, util) {

    'use strict';

    var getPointer = fabric.util.getPointer,
        degreesToRadians = fabric.util.degreesToRadians,
        radiansToDegrees = fabric.util.radiansToDegrees,
        atan2 = Math.atan2,
        abs = Math.abs;

    var gridGroup;

    /**
     * Fabricjs canvas class with customizations to allow
     * eraser paths, fixed rotations etc.
     *
     * @constructor
     * @memberof DrawerJs
     */
    namespace.Canvas = fabric.util.createClass(fabric.Canvas, /** @lends fabric.Canvas.prototype */ {

        /**
         * Constructor
         * @param {HTMLElement | String} el &lt;canvas> element to initialize instance on
         * @param {Object} [options] Options object
         * @return {Object} thisArg
         */
        initialize: function(el, options) {
            options = options ? options : {};
            this.preserveObjectStacking = true;
            this.selection = false;
            this.backgroundColor = '#ffffff'; //default back color

            this.callSuper('initialize', el, options);

            //Canvas.Utils
            initObjectsInfos(this);
            initAligningGuidelines(this);
            initCenteringGuidelines(this);
        },

        createGridX: function() {
            var gridLen;
            var options = {
                distance: 10,
                width: this.width,
                height: this.height,
                param: {
                    stroke: '#ebebeb',
                    strokeWidth: 1,
                    selectable: false
                }
            };

            gridLen = options.width / options.distance;

            for (var i = 0; i < gridLen; i++) {
                var distance = i * options.distance,
                    horizontal = new fabric.Line([distance, 0, distance, options.width], options.param),
                    vertical = new fabric.Line([0, distance, options.width, distance], options.param);
                this.add(horizontal);
                this.add(vertical);
                if (i % 5 === 0) {
                    horizontal.set({ stroke: '#cccccc' });
                    vertical.set({ stroke: '#cccccc' });
                }
            }
        },

        createGrid: function(gW, gH, isSnap, isOnlyRow) {
            if (!gW) {
                gW = 10;
            }
            if (!gH) {
                gH = 10;
            }

            if (isOnlyRow) {
                this.createRow(gW, gH, isSnap);
                return;
            }

            if (gridGroup) {
                this.remove(gridGroup);
                gridGroup = null;
                snapToGrid(false, gW, gH);
                return;
            }

            var gridLen;
            var options = {
                distance: gW,
                vdistance: gH,
                width: this.width,
                height: this.height,
                param: {
                    stroke: '#ebebeb',
                    strokeWidth: 1,
                    selectable: false
                }
            };

            //console.log(this.width + ' - ' + this.height);
            gridLen = options.width / options.distance;
            var separateLines = [];

            if (this.width > this.height) { // yatay ekran

                for (var x = 0; x < gridLen; x++) {
                    var distance = x * options.distance,
                        xhorizontal = new fabric.Line([distance, 0, distance, options.width], options.param),
                        xvertical = new fabric.Line([0, distance, options.width, distance], options.param);
                    separateLines.push(xhorizontal);
                    separateLines.push(xvertical);
                    if (x % 5 === 0) {
                        xhorizontal.set({ stroke: '#cccccc' });
                        xvertical.set({ stroke: '#cccccc' });
                    }
                }

            } else { //dikey ekran

                for (var i = 0; i < options.width / options.distance; i++) {
                    var hdistance = i * options.distance,
                        horizontal = new fabric.Line([hdistance, 0, hdistance, options.height], options.param);
                    separateLines.push(horizontal);
                    if (i % 5 === 0) {
                        horizontal.set({ stroke: '#cccccc' });
                    }
                }

                for (var j = 0; j < options.height / options.vdistance; j++) {
                    var vdistance = j * options.vdistance,
                        vertical = new fabric.Line([0, vdistance, options.height, vdistance], options.param);
                    separateLines.push(vertical);
                    if (j % 5 === 0) {
                        vertical.set({ stroke: '#cccccc' });
                    }
                }

                /* for (var i = 0; i < options.width / options.distance; i++) {
                    var hdistance = i * options.distance,
                        horizontal = new fabric.Line([hdistance, 0, hdistance, options.height], options.param);
                    separateLines.push(horizontal);
                    if (i % 5 === 0) {
                        horizontal.set({ stroke: '#cccccc' });
                    }
                }

                for (var j = 0; j < options.height / options.distance; j++) {
                    var vdistance = j * options.distance,
                        vertical = new fabric.Line([0, vdistance, options.height, vdistance], options.param);
                    separateLines.push(vertical);
                    if (j % 5 === 0) {
                        vertical.set({ stroke: '#cccccc' });
                    }
                } */

            }

            gridGroup = new fabric.Group(separateLines, {
                selectable: false,
                evented: false
            });

            gridGroup.addWithUpdate();
            this.add(gridGroup);
            gridGroup.sendBackwards();
            gridGroup.sendToBack();
            this.renderAll();

            //console.log(gW, gH);
            snapToGrid(isSnap, gW, gH);
        },

        createRow: function(gW, gH, isSnap) {
            // en
            if (!gW) {
                gW = 48;
            }
            // boy
            if (!gH) {
                gH = 32;
            }
            
            if (gridGroup) {
                this.remove(gridGroup);
                gridGroup = null;
                snapToGrid(false, gW, gH);
                return;
            }


            var separateLines = [];

            for (var i = 0; i < (this.height / gH); i++) {
                // columns
                //separateLines.push(new fabric.Line([ i * gH, 0, i * gH, gW], { stroke: '#ccc', selectable: false }));
                // rows
                separateLines.push(new fabric.Line([0, i * gH, gW, i * gH], { stroke: '#ccc', selectable: false }));
            }

            gridGroup = new fabric.Group(separateLines, {
                selectable: false,
                evented: false
            });

            gridGroup.addWithUpdate();
            this.add(gridGroup);
            gridGroup.sendBackwards();
            gridGroup.sendToBack();
            this.renderAll();

            //console.log(gW, gH);
            snapToGrid(isSnap, gW, gH);
        },

        removeGridX: function() {
            var objects = this.getObjects('line');
            for (var i in objects) {
                this.remove(objects[i]);
            }
        },

        removeGrid: function() {
            this.remove(gridGroup);
            gridGroup = null;
            snapToGrid(false);
            //this.off('object:moving');
        },

        clearCanvas: function() {
            this.remove(gridGroup);
            gridGroup = null;
            snapToGrid(false);
            this.clear();
            this.backgroundColor = '#ffffff';
        },

        saveCanvas: function() {
            this.remove(gridGroup);
            gridGroup = null;
            snapToGrid(false);

            // JSON without default values
            this.includeDefaultValues = false;
            //this.propertiesToInclude = true;
            //console.log(JSON.stringify(this));
            //console.log(JSON.stringify(this.toDatalessJSON()));
            //var json = JSON.stringify( canvas.toDataLessJSON(['id']) );
            console.log(JSON.stringify(this.toObject()));
        },

        getCanvasClearJson: function() {
            this.remove(gridGroup);
            gridGroup = null;
            snapToGrid(false);

            this.includeDefaultValues = false;
            var json = JSON.stringify(this.toObject());
            return json;
        },

        getCanvasJson: function() {
            this.remove(gridGroup);
            gridGroup = null;
            snapToGrid(false);

            this.includeDefaultValues = false;
            var serializedCanvas = this.toJSON(['id']);
            var serializedCanvasStr = JSON.stringify(serializedCanvas, null, 2);
            return serializedCanvasStr;
        },

        /* backgroundImage: function(url) {
          var fabricImage = new fabric.Image(url);
          this.setBackgroundImage(fabricImage, function() {
            this.renderAll();
          }, 
          {
            backgroundImageOpacity: 0.5,
            backgroundImageStretch: false
          });
          //this.renderAll();
        },  */

        disableSelection: function() {
            var obj = null;
            var objects = this.getObjects();
            this.deactivateAll();

            for (var i = 0; i < objects.length; i++) {
                obj = objects[i];
                if (obj.__evented === undefined) {
                    obj.__evented = obj.get('evented');
                    obj.set('evented', false);
                }

                if (obj.__selectable === undefined) {
                    obj.__selectable = obj.get('selectable');
                    obj.set('selectable', false);
                }
            }
        },

        restoreSelection: function() {
            var obj = null;
            var objects = this.getObjects();

            for (var i = 0; i < objects.length; i++) {
                obj = objects[i];

                if (obj.__evented !== undefined) {
                    obj.set('evented', obj.__evented);
                    delete obj.__evented;
                }

                if (obj.__selectable !== undefined) {
                    obj.set('selectable', obj.__selectable);
                    delete obj.__selectable;
                }
            }
        },

        /**
         * @private
         * @param {CanvasRenderingContext2D} ctx Context to render on
         * @param {Array} objectsToRender
         */
        _renderObjects: function(ctx, objectsToRender) {
            var i, length, obj;

            var tempCanvas = util.getTemporaryCanvas(this);
            var tempContext = tempCanvas.getContext('2d');
            tempContext.clearRect(0, 0, this.width, this.height);

            this.eraserPaths = [];

            for (i = 0, length = objectsToRender.length; i < length; ++i) {
                obj = objectsToRender[i];

                // we do not render eraser paths
                if (obj instanceof fabric.EraserPath)
                    continue;

                // obj.render(tempContext);
                obj.render(ctx);
            }

            // ctx.drawImage(tempCanvas, 0, 0);
            // tempContext.clearRect(0, 0, this.width, this.height);

        },


        _applyEraserPath: function(pathObject, ctx) {
            pathObject.visible = true;
            pathObject.globalCompositeOperation = 'destination-out';
            pathObject.render(ctx);
            pathObject.visible = false;
        },

        /**
         * @private
         */
        _findNewLowerIndex: function(object, idx, intersecting) {
            var newIdx;

            if (intersecting) {
                newIdx = idx;

                // traverse down the stack looking for the nearest intersecting object
                for (var i = idx - 1; i >= 0; --i) {

                    if (this._objects[i] instanceof fabric.EraserPath) {
                        continue;
                    }

                    var isIntersecting = object.intersectsWithObject(this._objects[i]) ||
                        object.isContainedWithinObject(this._objects[i]) ||
                        this._objects[i].isContainedWithinObject(object);

                    if (isIntersecting) {
                        newIdx = i;
                        break;
                    }
                }
            } else {
                newIdx = idx - 1;
            }

            return newIdx;
        },
        /**
         * @private
         */
        _findNewUpperIndex: function(object, idx, intersecting) {
            var newIdx;

            if (intersecting) {
                newIdx = idx;

                // traverse up the stack looking for the nearest intersecting object
                for (var i = idx + 1; i < this._objects.length; ++i) {

                    if (this._objects[i] instanceof fabric.EraserPath) {
                        continue;
                    }

                    var isIntersecting = object.intersectsWithObject(this._objects[i]) ||
                        object.isContainedWithinObject(this._objects[i]) ||
                        this._objects[i].isContainedWithinObject(object);

                    if (isIntersecting) {
                        newIdx = i;
                        break;
                    }
                }
            } else {
                newIdx = idx + 1;
            }

            return newIdx;
        },

        /**
         * This override is needed to properly call object.set() method
         * instead of simple assigment.
         *
         * @private
         * @param {Number} x pointer's x coordinate
         * @param {Number} y pointer's y coordinate
         *
         * @return {boolean} always returns true, except case when _currentTransform.get('lockRotation') returns true
         */
        _rotateObject: function(x, y) {
            var t = this._currentTransform;

            if (t.target.get('lockRotation')) {
                return;
            }

            var lastAngle = atan2(t.ey - t.top, t.ex - t.left),
                curAngle = atan2(y - t.top, x - t.left),
                angle = radiansToDegrees(curAngle - lastAngle + t.theta);

            // normalize angle to positive value
            if (angle < 0) {
                angle = 360 + angle;
            }

            t.target.set('angle', angle % 360);
            return true;
        }

    });
})(DrawerJs, DrawerJs.util);