/*jshint esnext: true */

/**
 * uuid for canvas objects
 */
function canvasObjectUid() {
    return (new Date()).getTime().toString(16) + Math.floor(1E7 * Math.random()).toString(16);
}

var _snapToGrid = false; // nesne hareket ederken piksel atlaması yapsınmı
var _gridW = 10; // nesne hareket ederken kaç piksel atlasın
var _gridH = 10;

function snapToGrid(isActive, gridW, gridH) {
    //console.log(gridW, gridH);
    _snapToGrid = isActive;
    if (gridW) {
        _gridW = gridW;
    }
    if (gridH) {
        _gridH = gridH;
    }

    //console.log(_snapToGrid, _gridW, _gridH);
}

function snapToGridX() {
    if (_snapToGrid === true) {
        _snapToGrid = false;
    } else {
        _snapToGrid = true;
    }
}


/**
 * Objects moving-scaling infos,snap into canvas
 * 
 */
function initObjectsInfos(canvas) {

    function snapCanvasX(target) {
        // bazı sorunlar var şimdilik iptal
        //console.log(target);
        //console.log("snap canvas");
        
        if (!target) return;

        // snap değeri tam sıfır olmasın
        var snap = 2;

        var canvasWidth = target.canvas.width; //canvas.fCanvas.width;
        var canvasHeight = target.canvas.height; //canvas.fCanvas.height;
        //var zoom = target.canvas.getZoom();

        // nesne en sol sınırda
        if (target.getLeft() < snap) {
            target.setLeft(snap);
        }

        // nesne en üst sınırda
        if (target.getTop() < snap) {
            target.setTop(snap);
        }

        // nesne en sağ sınırda
        if ((target.getWidth() + target.getLeft()) > (canvasWidth - snap)) {
            target.setLeft(canvasWidth - target.getWidth());
        }

        // nesne en alt sınırda
        if ((target.getHeight() + target.getTop()) > (canvasHeight - snap)) {
            target.setTop(canvasHeight - target.getHeight());
        }

        // nesnenin eni canvas enine eşitse
        if (target.getWidth() > (canvasWidth - snap)) {
            target.setWidth(canvasWidth - snap);
            target.setLeft(snap);
        }
        
        // if (target.getWidth() > canvasWidth & target.getHeight() > canvasHeight) {
        //    target.setWidth(canvasWidth - snap);
        //    target.setHeight(canvasHeight - snap);
        //    target.setLeft(snap);
        //    target.setTop(snap);
        // }

        // if (target.getHeight() > canvasHeight) {
        //     target.setHeight(canvasHeight - snap);
        //     target.setTop(2);
        // }

        logCanvas(target);
    }

    function snapCanvas(target) {
        //console.log(target);
        if (!target) return;

        // snap değeri tam sıfır olmasın
        var snap = 2;

        var canvasWidth = target.canvas.width; //canvas.fCanvas.width;
        var canvasHeight = target.canvas.height; //canvas.fCanvas.height;
        var zoom = target.canvas.getZoom();

        var left = target.getLeft();
        var top = target.getTop();
        var width = target.getWidth();
        var height = target.getHeight();

        // nesne en sol sınırda
        if (left < snap) {
            target.setLeft(snap);
        }

        // nesne en üst sınırda
        if (top < snap) {
            target.setTop(snap);
        }

        // nesne en sağ sınırda
        if (width + left > canvasWidth - snap) {
            target.setLeft(canvasWidth - width - snap);
        }

        // nesne en alt sınırda
        if (height + top > canvasHeight - snap) {
            target.setTop(canvasHeight - height - snap);
        }

        // // nesnenin eni canvas enine eşitse
        // if (width > canvasWidth) {
        //     target.setLeft(snap);
        //     target.setWidth(canvasWidth - snap);
        // }
        
        // if (target.getWidth() > canvasWidth & target.getHeight() > canvasHeight) {
        //    target.setWidth(canvasWidth - snap);
        //    target.setHeight(canvasHeight - snap);
        //    target.setLeft(snap);
        //    target.setTop(snap);
        // }

        // if (target.getHeight() > canvasHeight) {
        //     target.setHeight(canvasHeight - snap);
        //     target.setTop(2);
        // }

        logCanvas(target);
    }

    function logCanvas(target) {
        var zoom = canvas.zoomFactor;
        
        if (target) {
            var type = target.type;
            var fontSize = 0;
            //console.log(type); 
            
            //if(type != "Zone" && type != "ImageZone")
            if(type == "TextZone")
            {
                fontSize = Math.round(target.fontSize * target.scaleX);
                
            }

            //console.log(zoom);
            var w = Math.round((target.width * target.scaleX) / zoom);
            var h = Math.round((target.height * target.scaleY) / zoom);
            var x = Math.round(target.left / zoom);
            var y = Math.round(target.top / zoom);

            $('#txtFontSize').val(fontSize);
            $('#txtW').val(w);
            $('#txtH').val(h);
            $('#txtX').val(x);
            $('#txtY').val(y);
        } else {
            $('#txtFontSize').val(0);
            $('#txtW').val(canvas.width / zoom);
            $('#txtH').val(canvas.height / zoom);
            $('#txtX').val(0);
            $('#txtY').val(0);
        }
    }

    function checkObjectSize(target) {
        if (target) {
            if (target.getWidth() < 30) {
                target.setWidth(30);
                canvas.renderAll();
                console.log(target);
            }
            if (target.getHeight() < 30) {
                target.setHeight(30);
                canvas.renderAll();
            }
        }
    }

    canvas.on('object:moving', function(event) {
        //console.log("object moving");
        snapCanvas(event.target);
    });

    /* canvas.on('object:scaling', function(event) {
        var target = event.target;
        checkObjectSize(target);
        logCanvas(target);
    }); */

    canvas.on('object:scaling', function(e) {
        //console.log("object scaling");
        var obj = e.target;
        logCanvas(obj);

        // var canvas = obj.canvas;
        // var zoom = canvas.getZoom();

        // var pan_x = canvas.viewportTransform[4];
        // var pan_y = canvas.viewportTransform[5];

        // var canvas_height = canvas.height / zoom;
        // var canvas_width = canvas.width / zoom;

        // var totalWidth = obj.width * obj.scaleX;
        // var totalHeight = obj.height * obj.scaleY;

        // var top_margin = 0; //marginYTop;
        // var bottom_margin = 0; //marginYBottom;
        // var left_margin = 0; //marginXLeft;
        // var right_margin = 0; //marginXRight;

        // var top_bound = top_margin - pan_y;
        // var bottom_bound = canvas_height - bottom_margin - pan_y;
        // var left_bound = left_margin - pan_x;
        // var right_bound = canvas_width - right_margin - pan_x;

        // if (obj.top < top_bound || (obj.top + totalHeight) > bottom_bound) {
        //     obj.scaleY = obj.canvas.lastScaleY;
        //     obj.set("top", top_bound);
        // }
        // if (obj.left < left_bound || (obj.left + totalWidth) > right_bound) {
        //     obj.scaleX = obj.canvas.lastScaleX;
        //     obj.set("left", left_bound);
        // }

        // obj.canvas.lastScaleY = obj.scaleY;
        // obj.canvas.lastScaleX = obj.scaleX;
    });

    canvas.on('mouse:down', function(event) {
        var target = event.target;
        //checkObjectSize(target);
        logCanvas(target);
    });

    canvas.on('mouse:up', function(event) {
        var target = event.target;
        //checkObjectSize(target);
        logCanvas(target);
    });

    /* canvas.on('text:changed', function(event) {
        var target = event.target;
        if (!target) return;
        if (target.type !== "i-text") return;

        if (target.width > target.fixedWidth) {
          target.fontSize *= target.fixedWidth / (target.width + 1);
          target.width = target.fixedWidth;
        }
      }); */

    $(document).on('click', '#btnFontUp', function() {
        //console.log("fontUp click");
        var target = canvas.getActiveObject();
        if (!target) return;

        var size = parseInt($("#txtFontSize").val());
        size++;
        $("#txtFontSize").val(size);

        var scale =  target.getObjectScaling();
        target.set("fontSize", size / scale.scaleX);

        canvas.renderAll();
    });

    $(document).on('click', '#btnFontDown', function() {
        //console.log("fontDown click");
        var target = canvas.getActiveObject();
        if (!target) return;

        var size = parseInt($("#txtFontSize").val());
        size--;
        $("#txtFontSize").val(size);

        var scale =  target.getObjectScaling();
        target.set("fontSize", size / scale.scaleX);

        canvas.renderAll();
    });

    $(document).on('click', '#btnFontApply', function() {
        //console.log("fontApply click");
        var target = canvas.getActiveObject();
        if (!target) return;

        var size = parseInt($("#txtFontSize").val());
        var scale =  target.getObjectScaling();
        target.set("fontSize", size / scale.scaleX);

        canvas.renderAll();
    });

    $(document).on('keyup', 'input[name=txtWH]', function() {
        var _this = $(this);
        var min = parseInt(_this.attr('min')) || 1;
        var max = parseInt(_this.attr('max')) || 800;
        var val = parseInt(_this.val()) || (min - 1);
        //if (_this.val() === '')
        //_this.val(0);
        if (val < min)
            _this.val(min);
        if (val > max)
            _this.val(max);
    });

    $(document).on('keyup', 'input[name=txtXY]', function() {
        var _this = $(this);
        var min = parseInt(_this.attr('min')) || 0;
        var max = parseInt(_this.attr('max')) || 800;
        var val = parseInt(_this.val()) || (min - 1);
        //if (_this.val() === '')
        //_this.val(0);
        if (val < 0)
            _this.val(min);
        if (val > max)
            _this.val(max);
    });

    $(document).on('click', '#btnWH', function() {
        var target = canvas.getActiveObject(); //.get('type') === "text")
        if (!target) return;

        var sX = target.scaleX;
        var sY = target.scaleY;
        target.setWidth(target.getWidth() * sX);
        target.setHeight(target.getHeight() * sY);
        //target.scaleX = 1;
        //target.scaleY = 1;
        //target.dirty = true;

        // var w = parseInt($("#txtW").val());
        // var h = parseInt($("#txtH").val());
        
        // var scale = target.getObjectScaling();
        // console.log(scale);
        
        // target.setWidth(w / scale.scaleX);
        // target.setHeight(target.getHeight() * scale.scaleY);

        // target.setLeft(3);
        // target.setTop(3);

        // target.scaleX = 1;
        // target.scaleY = 1;
        // target.dirty = true;
        
        //snapCanvas(target);
        //target.setCoords();
        canvas.renderAll(); //requestRenderAll();
    });

    function onclickWH() {
        var target = canvas.getActiveObject(); //.get('type') === "text")
        if (!target) return;
        var w = parseInt($("#txtW").val());
        var h = parseInt($("#txtH").val());
        //w = w * target.scaleX;
        //h = h * target.scaleY;
        target.scaleX = 1;
        target.scaleY = 1;
        target.setWidth(w);
        target.setHeight(h);
        snapCanvas(target);
        target.setCoords();
        canvas.renderAll();
    }

    $(document).on('click', '#btnXY', function() {
        var target = canvas.getActiveObject();
        if (!target) return;
        var x = parseInt($("#txtX").val());
        var y = parseInt($("#txtY").val());
        target.setLeft(x);
        target.setTop(y);
        snapCanvas(target);
        target.setCoords();
        canvas.renderAll();
    });

    function onclickXY() {
        var target = canvas.getActiveObject();
        if (!target) return;
        var x = parseInt($("#txtX").val());
        var y = parseInt($("#txtY").val());
        target.setLeft(x);
        target.setTop(y);
        snapCanvas(target);
        target.setCoords();
        canvas.renderAll();
    }

    function onclickTest() {
        console.log("test test");
    }

    $('#_btnWH').click(function() {
        //console.log('#btnWH', canvas);
        var target = canvas.getActiveObject(); //.get('type') === "text")
        if (!target) return;
        var w = parseInt($("#txtW").val());
        var h = parseInt($("#txtH").val());
        //w = w * target.scaleX;
        //h = h * target.scaleY;
        target.scaleX = 1;
        target.scaleY = 1;
        target.setWidth(w);
        target.setHeight(h);
        target.setCoords();
        canvas.renderAll();
        //console.log(target);
    });

    $('#_btnXY').click(function() {
        //console.log('#btnXY', canvas);
        var target = canvas.getActiveObject();
        if (!target) return;
        var x = parseInt($("#txtX").val());
        var y = parseInt($("#txtY").val());
        target.setLeft(x);
        target.setTop(y);
        target.setCoords();
        canvas.renderAll();
        //console.log(target);
    });
}


/**
 * Should objects be aligned by a bounding box?
 * [Bug] Scaled objects sometimes can not be aligned by edges
 *
 */
function initAligningGuidelines(canvas) {

    var ctx = canvas.getSelectionContext(),
        aligningLineOffset = 5,
        aligningLineMargin = 4,
        aligningLineWidth = 1,
        aligningLineColor = 'rgb(0,255,0)',
        viewportTransform,
        zoom = 1;

    function drawVerticalLine(coords) {
        drawLine(
            coords.x + 0.5,
            coords.y1 > coords.y2 ? coords.y2 : coords.y1,
            coords.x + 0.5,
            coords.y2 > coords.y1 ? coords.y2 : coords.y1);
    }

    function drawHorizontalLine(coords) {
        drawLine(
            coords.x1 > coords.x2 ? coords.x2 : coords.x1,
            coords.y + 0.5,
            coords.x2 > coords.x1 ? coords.x2 : coords.x1,
            coords.y + 0.5);
    }

    function drawLine(x1, y1, x2, y2) {
        ctx.save();
        ctx.lineWidth = aligningLineWidth;
        ctx.strokeStyle = aligningLineColor;
        ctx.beginPath();
        ctx.moveTo(((x1 + viewportTransform[4]) * zoom), ((y1 + viewportTransform[5]) * zoom));
        ctx.lineTo(((x2 + viewportTransform[4]) * zoom), ((y2 + viewportTransform[5]) * zoom));
        ctx.stroke();
        ctx.restore();
    }

    function isInRange(value1, value2) {
        value1 = Math.round(value1);
        value2 = Math.round(value2);
        for (var i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
            if (i === value2) {
                return true;
            }
        }
        return false;
    }

    var verticalLines = [],
        horizontalLines = [];

    canvas.on('mouse:down', function(opt) {
        viewportTransform = canvas.viewportTransform;
        zoom = canvas.getZoom();
    });

    canvas.on('object:moving', function(e) {

        var activeObject = e.target,
            canvasObjects = canvas.getObjects(),
            activeObjectCenter = activeObject.getCenterPoint(),
            activeObjectLeft = activeObjectCenter.x,
            activeObjectTop = activeObjectCenter.y,
            activeObjectBoundingRect = activeObject.getBoundingRect(),
            activeObjectHeight = activeObjectBoundingRect.height / viewportTransform[3],
            activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0],
            horizontalInTheRange = false,
            verticalInTheRange = false,
            transform = canvas._currentTransform;

        if (!transform) return;

        // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
        // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move

        for (var i = canvasObjects.length; i--;) {

            if (canvasObjects[i] === activeObject) continue;

            var objectCenter = canvasObjects[i].getCenterPoint(),
                objectLeft = objectCenter.x,
                objectTop = objectCenter.y,
                objectBoundingRect = canvasObjects[i].getBoundingRect(),
                objectHeight = objectBoundingRect.height / viewportTransform[3],
                objectWidth = objectBoundingRect.width / viewportTransform[0];

            // snap by the horizontal center line
            if (isInRange(objectLeft, activeObjectLeft)) {
                verticalInTheRange = true;
                verticalLines.push({
                    x: objectLeft,
                    y1: (objectTop < activeObjectTop) ? (objectTop - objectHeight / 2 - aligningLineOffset) :
                        (objectTop + objectHeight / 2 + aligningLineOffset),
                    y2: (activeObjectTop > objectTop) ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset) :
                        (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                });
                activeObject.setPositionByOrigin(new fabric.Point(objectLeft, activeObjectTop), 'center', 'center');
            }

            // snap by the left edge
            if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
                verticalInTheRange = true;
                verticalLines.push({
                    x: objectLeft - objectWidth / 2,
                    y1: (objectTop < activeObjectTop) ? (objectTop - objectHeight / 2 - aligningLineOffset) :
                        (objectTop + objectHeight / 2 + aligningLineOffset),
                    y2: (activeObjectTop > objectTop) ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset) :
                        (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                });
                activeObject.setPositionByOrigin(new fabric.Point(objectLeft - objectWidth / 2 + activeObjectWidth / 2, activeObjectTop), 'center', 'center');
            }

            // snap by the right edge
            if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
                verticalInTheRange = true;
                verticalLines.push({
                    x: objectLeft + objectWidth / 2,
                    y1: (objectTop < activeObjectTop) ? (objectTop - objectHeight / 2 - aligningLineOffset) :
                        (objectTop + objectHeight / 2 + aligningLineOffset),
                    y2: (activeObjectTop > objectTop) ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset) :
                        (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                });
                activeObject.setPositionByOrigin(new fabric.Point(objectLeft + objectWidth / 2 - activeObjectWidth / 2, activeObjectTop), 'center', 'center');
            }

            // snap by the vertical center line
            if (isInRange(objectTop, activeObjectTop)) {
                horizontalInTheRange = true;
                horizontalLines.push({
                    y: objectTop,
                    x1: (objectLeft < activeObjectLeft) ? (objectLeft - objectWidth / 2 - aligningLineOffset) :
                        (objectLeft + objectWidth / 2 + aligningLineOffset),
                    x2: (activeObjectLeft > objectLeft) ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset) :
                        (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                });
                activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop), 'center', 'center');
            }

            // snap by the top edge
            if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
                horizontalInTheRange = true;
                horizontalLines.push({
                    y: objectTop - objectHeight / 2,
                    x1: (objectLeft < activeObjectLeft) ? (objectLeft - objectWidth / 2 - aligningLineOffset) :
                        (objectLeft + objectWidth / 2 + aligningLineOffset),
                    x2: (activeObjectLeft > objectLeft) ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset) :
                        (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                });
                activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop - objectHeight / 2 + activeObjectHeight / 2), 'center', 'center');
            }

            // snap by the bottom edge
            if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
                horizontalInTheRange = true;
                horizontalLines.push({
                    y: objectTop + objectHeight / 2,
                    x1: (objectLeft < activeObjectLeft) ? (objectLeft - objectWidth / 2 - aligningLineOffset) :
                        (objectLeft + objectWidth / 2 + aligningLineOffset),
                    x2: (activeObjectLeft > objectLeft) ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset) :
                        (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                });
                activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop + objectHeight / 2 - activeObjectHeight / 2), 'center', 'center');
            }
        }

        if (!horizontalInTheRange) {
            horizontalLines.length = 0;
        }

        if (!verticalInTheRange) {
            verticalLines.length = 0;
        }

        // nesne grid içinde kalsın
        if (_snapToGrid) {
            e.target.set({
                left: Math.round(e.target.left / _gridW) * _gridW,
                top: Math.round(e.target.top / _gridH) * _gridH
            });
        }
        /* if (_snapToGrid) {
            var grid = 10;
            e.target.set({
                left: Math.round(e.target.left / grid) * grid,
                top: Math.round(e.target.top / grid) * grid
            });
        }
 */
    });

    canvas.on('before:render', function() {
        canvas.clearContext(canvas.contextTop);
    });

    canvas.on('after:render', function() {
        for (var i = verticalLines.length; i--;) {
            drawVerticalLine(verticalLines[i]);
        }
        for (var j = horizontalLines.length; j--;) {
            drawHorizontalLine(horizontalLines[j]);
        }

        verticalLines.length = horizontalLines.length = 0;
    });

    canvas.on('mouse:up', function() {
        verticalLines.length = horizontalLines.length = 0;
        canvas.renderAll();
    });

}


/**
 * Augments canvas by assigning to `onObjectMove` and `onAfterRender`.
 * This kind of sucks because other code using those methods will stop functioning.
 * Need to fix it by replacing callbacks with pub/sub kind of subscription model.
 * (or maybe use existing fabric.util.fire/observe (if it won't be too slow))
 */
function initCenteringGuidelines(canvas) {

    var canvasWidth = canvas.getWidth(),
        canvasHeight = canvas.getHeight(),
        canvasWidthCenter = canvasWidth / 2,
        canvasHeightCenter = canvasHeight / 2,
        canvasWidthCenterMap = {},
        canvasHeightCenterMap = {},
        centerLineMargin = 4,
        centerLineColor = 'rgba(255,0,241,0.5)',
        centerLineWidth = 1,
        ctx = canvas.getSelectionContext(),
        viewportTransform;

    for (var i = canvasWidthCenter - centerLineMargin, wlen = canvasWidthCenter + centerLineMargin; i <= wlen; i++) {
        canvasWidthCenterMap[Math.round(i)] = true;
    }
    for (var j = canvasHeightCenter - centerLineMargin, hlen = canvasHeightCenter + centerLineMargin; j <= hlen; j++) {
        canvasHeightCenterMap[Math.round(j)] = true;
    }

    function showVerticalCenterLine() {
        showCenterLine(canvasWidthCenter + 0.5, 0, canvasWidthCenter + 0.5, canvasHeight);
    }

    function showHorizontalCenterLine() {
        showCenterLine(0, canvasHeightCenter + 0.5, canvasWidth, canvasHeightCenter + 0.5);
    }

    function showCenterLine(x1, y1, x2, y2) {
        ctx.save();
        ctx.strokeStyle = centerLineColor;
        ctx.lineWidth = centerLineWidth;
        ctx.beginPath();
        ctx.moveTo(x1 * viewportTransform[0], y1 * viewportTransform[3]);
        ctx.lineTo(x2 * viewportTransform[0], y2 * viewportTransform[3]);
        ctx.stroke();
        ctx.restore();
    }

    var afterRenderActions = [],
        isInVerticalCenter,
        isInHorizontalCenter;

    canvas.on('mouse:down', function() {
        viewportTransform = canvas.viewportTransform;
    });

    canvas.on('object:moving', function(e) {
        var object = e.target,
            objectCenter = object.getCenterPoint(),
            transform = canvas._currentTransform;

        if (!transform) return;

        isInVerticalCenter = Math.round(objectCenter.x) in canvasWidthCenterMap;
        isInHorizontalCenter = Math.round(objectCenter.y) in canvasHeightCenterMap;

        if (isInHorizontalCenter || isInVerticalCenter) {
            object.setPositionByOrigin(new fabric.Point((isInVerticalCenter ? canvasWidthCenter : objectCenter.x), (isInHorizontalCenter ? canvasHeightCenter : objectCenter.y)), 'center', 'center');
        }
    });

    canvas.on('before:render', function() {
        canvas.clearContext(canvas.contextTop);
    });

    canvas.on('after:render', function() {
        if (isInVerticalCenter) {
            showVerticalCenterLine();
        }
        if (isInHorizontalCenter) {
            showHorizontalCenterLine();
        }
    });

    canvas.on('mouse:up', function() {
        // clear these values, to stop drawing guidelines once mouse is up
        isInVerticalCenter = isInHorizontalCenter = null;
        canvas.renderAll();
    });
}