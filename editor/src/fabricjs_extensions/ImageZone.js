(function(global) {

    'use strict';

    var fabric = global.fabric || (global.fabric = {}),
        extend = fabric.util.object.extend;

    /**
     * @class
     * @extends fabric.Image
     */
    fabric.ImageZone = fabric.util.createClass(fabric.Image, {
        type: 'ImageZone',
        id: 'Image',
        mediaFileId: null, //content id
        mediaPlaylistId: null, //playlist id
        async: true,

        /**
         * List of options to show when object is selected
         * @type {String[]}
         */
        objectOptionsList: ['opacity', 'border'],

        /**
         * Initializes ImageZone with fabric.Image
         *
         * @param {fabric.Image} fabricImage
         * @param options
         */
        initialize: function(fabricImage, options) {
            var _this = this;
            options = options || {};

            // set width and height
            this.id = canvasObjectUid();
            this.mediaFileId = options.mediaFileId;
            this.mediaPlaylistId = options.mediaPlaylistId;
            this.crossOrigin = 'anonymous';
            this.width = options.width || 10;
            this.height = options.height || 10;
            this.hasControls = options.hasControls || true;

            this.callSuper('initialize', fabricImage, options);
        },

        _render: function(ctx) {
            this.callSuper('_render', ctx);
        },

        _set: function(key, value) {
            this.callSuper('_set', key, value);
        },

        toObject: function(propertiesToInclude) {
            return extend(this.callSuper('toObject', propertiesToInclude), {
                crossOrigin: 'anonymous',
                width: this.width,
                height: this.height,
                id: this.get('id'),
                mediaFileId: this.get('mediaFileId'),
                mediaPlaylistId: this.get('mediaPlaylistId')
            });
        }

    });


    /**
     * Creates fabric object from data.
     * Is async, so always use callback param.
     *
     * @param objData
     * @param {function} callback
     */
    /* fabric.ImageZone.fromObject = function (objData, callback) {
        fabric.util.loadImage(objData.src, function(createdImage) {
            var ImageZone = new fabric.ImageZone(createdImage, objData);
            // call callback with instance of our ImageZone
            if (callback)
                callback(ImageZone);
        });
    }; */

    fabric.ImageZone.fromObject = function(objData, callback) {
        fabric.util.loadImage(objData.src, function(createdImage) {

            var image = new Image();
            image.crossOrigin = "anonymous";
            image.src = objData.src;

            image.onload = function() {
                var ImageZone = new fabric.ImageZone(image, objData);

                if (callback)
                    callback(ImageZone);
            };

            image.onerror = function() {
                console.log('ImageZone-FromObject: Image failed to create!');
            };

        });
    };


    // important! set 'ImageZone.async'
    // It is already set for the prototype, but if do not set here - it WILL CRASH on image load from object;
    // idiotic stuff...
    fabric.ImageZone.async = true;

    // make our object erasable via ErasableMixin.
    //fabric.makeObjectErasable(fabric.ImageZone);

})(typeof exports !== 'undefined' ? exports : this);