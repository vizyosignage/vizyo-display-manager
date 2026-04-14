(function (global) {

    'use strict';

    var fabric = global.fabric || (global.fabric = {}),
        extend = fabric.util.object.extend;

    /**
     * @class
     * @extends fabric.Rect+Textbox
     */
     fabric.LabelZone = fabric.util.createClass(fabric.Rect, {
        type: 'LabelZone',
        id: 'Label',
        mediaFileId: null, //content id
        mediaPlaylistId: null, //playlist id
        //isErasable : true,

        initialize: function (options) {
            var _this = this;
            options = options || {};

            this.id = canvasObjectUid();
            this.mediaFileId = options.mediaFileId || null;
            this.mediaPlaylistId = options.mediaPlaylistId || null;
            this.left = options.left || 0;
            this.top = options.top || 0;
            this.width = options.width || 100;
            this.height = options.height || 100;
            
            this.fill = options.fill || '#000';
            this.backgroundColor = options.backgroundColor || '#000';
            this.hasControls = options.hasControls || true;

            this.set('label', options.label || '');

            //console.log('LabelZone.initialize', options);
            this.callSuper('initialize', options);
        },


            toObject: function (propertiesToInclude) {
            return extend(this.callSuper('toObject', propertiesToInclude), {
                left: this.left,
                top: this.top,
                width: this.width,
                height: this.height,
                lockScalingFlip: true,
                id: this.get('id'),
                mediaFileId: this.get('mediaFileId'),
                mediaPlaylistId: this.get('mediaPlaylistId'),
                label: this.get('label'),
            });
        },

        _render: function (ctx) {
            this.callSuper('_render', ctx);

            ctx.font = '20px Arial';
            ctx.textAlign="center"; 
            ctx.textBaseline = "middle";
            
            /* var textWidth = ctx.measureText(this.label).width;
            var x = 0; //(this.width / 2) - textWidth;
            var y = 0;
            console.log(this.width + " " + this.height);
            console.log(textWidth);
            console.log(x + " " + y); */
            //context.fillText(text,x,y,maxWidth);

            ctx.fillStyle = '#fff';
            //ctx.fillText(this.label, -this.width / 2, this.height / 2 + 20, this.width);
            ctx.fillText(this.label, 0, 0, this.width);

            /* function refresh(){
                //context.clearRect(x,y,width,height);
                ctx.clearRect(0, 0, this.width, this.height);
                ctx.fillText(this.label, 0, 0, this.width);
            } */
        },   
    });


    /**
     * @param object
     * @param {function} callback
     */

    fabric.LabelZone.fromObject = function (object, callback, forceAsync) {
        return fabric.Object._fromObject('LabelZone', object, callback, forceAsync);
    };
    
    /* fabric.LabelZone.fromObject = function (object, callback) {
        fabric.util.enlivenObjects(object.objects, function (enlivenedObjects) {
            delete object.objects;
            callback(new fabric.LabelZone(enlivenedObjects, object));
        });
    }; */

    fabric.LabelZone.async = true;

    // make our object erasable via ErasableMixin.
    //fabric.makeObjectErasable(fabric.LabelZone);

})(typeof exports !== 'undefined' ? exports : this);