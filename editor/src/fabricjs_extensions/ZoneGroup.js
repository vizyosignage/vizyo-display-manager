(function (global) {

  'use strict';
  

  var fabric = global.fabric || (global.fabric = {}),
    extend = fabric.util.object.extend;

  fabric.ZoneGroup = fabric.util.createClass(fabric.Rect, {
    type: 'ZoneGroup',
    id: 'ZoneGroup',
    initialize: function (options) {
      var _this = this;
      options = options || {};
      
      this.width = options.width || 10;
      this.height = options.height || 10;

      var circle1 = new fabric.Circle({
        radius: 50,
        fill: 'red',
        left: 0
      });

      /* this.grp = new fabric.Group([circle1], {
        selectable: false,
        padding: 0
      }); */

      /* this.add(
        new fabric.Group([
            new fabric.Text('A', {top: 200, left: 200}),
            new fabric.Text('B', {top: 200, left: 200})
      ])); */

      /* this.grp.add(
        new fabric.Text('AAAAAAA', {top: 10, left: 10, fill: '#000000', fontSize: 30})
      ); */
      
      
      this.id = canvasObjectUid();
      this.transparentCorners = false;
      
      //this.callSuper('initialize', options);
      var objects = [new fabric.Text('A', {top: 10, left: 10}), new fabric.Text('B', {top: 20, left: 10})];
      this.callSuper('initialize', objects, options);
    },
    
    _render: function (ctx) {
      this.callSuper('_render', ctx);
    },
  
    toObject: function (propertiesToInclude) {
      return extend(this.callSuper('toObject', propertiesToInclude), {
        width: this.width,
        height: this.height,
        id: this.get('id')
        //id : this.id //(new Date()).getTime().toString(16)+Math.floor(1E7*Math.random()).toString(16)
      });
    }
 });


  fabric.ZoneGroup.fromObject = function (object, callback) {
    return fabric.Object._fromObject('ZoneGroup', object, callback);
    //return new fabric.Zone(object, true);
  };

  fabric.ZoneGroup.async = false;
  

})(typeof exports !== 'undefined' ? exports : this);

