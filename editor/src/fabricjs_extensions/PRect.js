(function (global) {

  'use strict';
  

  var fabric = global.fabric || (global.fabric = {}),
    extend = fabric.util.object.extend,
    min = fabric.util.array.min,
    max = fabric.util.array.max,
    toFixed = fabric.util.toFixed;

  fabric.PRect = fabric.util.createClass(fabric.SegmentablePolygon, {
    type: 'PRect',
    id: 'PRect',
    initialize: function (options) {
      var _this = this;
      options = options || {};
      
      this.id = canvasObjectUid();
      this.width = options.width || 10;
      this.height = options.height || 10;
      this.transparentCorners = false;
      var points = this.makeRect(this.width, this.height);

      this.callSuper('initialize', points, options);
    },
    makeRect: function (width, height) {
      var halfWidth = width / 2;
      var halfHeight = height / 2;

      var points = [
        {x: halfWidth * -1, y: halfHeight * -1},
        {x: halfWidth, y: halfHeight * -1},
        {x: halfWidth, y: halfHeight},
        {x: halfWidth * -1, y: halfHeight}
      ];

      return [points];
    },
    _render: function (ctx) {
      this.callSuper('_render', ctx);
    },
    _set: function (key, value) {
      var dimensionsChanged = false;
      if (key === 'width') {
        this.width = value;
        dimensionsChanged = true;
      }
      if (key === 'height') {
        this.height = value;
        dimensionsChanged = true;
      }
      if (dimensionsChanged) {
        this.points = this.makeRect(this.width, this.height);
        this.callSuper('_set', 'points', this.points);
      }

      this.callSuper('_set', key, value);
    },
    toObject: function (propertiesToInclude) {
      return extend(this.callSuper('toObject', propertiesToInclude), {
        width: this.width,
        height: this.height,
        id : this.id //(new Date()).getTime().toString(16)+Math.floor(1E7*Math.random()).toString(16)
      });
    }
 });


  fabric.PRect.fromObject = function (object) {
    return new fabric.PRect(object, true);
  };

  fabric.PRect.async = false;
  

})(typeof exports !== 'undefined' ? exports : this);

