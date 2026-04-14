(function(global) {

    'use strict';


    var fabric = global.fabric || (global.fabric = {}),
        extend = fabric.util.object.extend;

    fabric.Zone = fabric.util.createClass(fabric.Rect, {
        type: 'Zone',
        id: 'Zone',
        mediaFileId: null, //content id
        mediaPlaylistId: null, //playlist id
        
        initialize: function(options) {
            var _this = this;
            options = options || {};

            this.id = canvasObjectUid();
            this.mediaFileId = options.mediaFileId;
            this.mediaPlaylistId = options.mediaPlaylistId;
            this.width = options.width || 10;
            this.height = options.height || 10;
            this.transparentCorners = false;
            this.hasRotatingPoint = false;
            this.cornerStyle = 'circle'; //rect, circle
            //this.cornerSize = 5;

            this.callSuper('initialize', options);
        },

        _render: function(ctx) {
            this.callSuper('_render', ctx);
        },

        toObject: function(propertiesToInclude) {
            return extend(this.callSuper('toObject', propertiesToInclude), {
                width: this.width,
                height: this.height,
                id: this.get('id'),
                mediaFileId: this.get('mediaFileId'),
                mediaPlaylistId: this.get('mediaPlaylistId')
            });
        }
    });


    fabric.Zone.fromObject = function(object, callback) {
        return fabric.Object._fromObject('Zone', object, callback);
        //return new fabric.Zone(object, true);
    };

    fabric.Zone.async = false;


})(typeof exports !== 'undefined' ? exports : this);