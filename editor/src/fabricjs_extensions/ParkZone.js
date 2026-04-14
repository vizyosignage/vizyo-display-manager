(function(global) {

    'use strict';

    var fabric = global.fabric || (global.fabric = {}),
        extend = fabric.util.object.extend;

    /**
     * @class
     * @extends fabric.Text
     */
    fabric.ParkZone = fabric.util.createClass(fabric.Textbox, { //fabric.util.createClass(fabric.PText, {
        type: 'ParkZone', // otopark bilgileri
        id: 'Park',
        mediaFileId: null, //content id
        mediaPlaylistId: null, //playlist id
        //isErasable : true,

        /**
         */
        initialize: function(text, options) {
            var _this = this;
            options = options || {};

            this.id = canvasObjectUid();
            this.mediaFileId = options.mediaFileId;
            this.mediaPlaylistId = options.mediaPlaylistId;
            this.left = options.left || 0;
            this.top = options.top || 0;
            this.width = options.width || 100;
            this.height = options.height || 100;
            this.textAlign = options.textAlign || 'center';
            this.editable = options.editable || false;

            this.fixedWidth = this.width;

            this.backgroundColor = options.backgroundColor || null;
            this.hasControls = options.hasControls || false;

            this.setControlsVisibility({
                mt: false, // middle top disable
                mb: false, // midle bottom
                ml: false, // middle left
                mr: false, // middle right
            });

            //console.log('ParkZone.initialize', options);
            this.callSuper('initialize', text, options);
        },


        /**
         * Overriding IText mouseup handler.
         * This version do not trigger editing mode on second click.
         * This functionality is inside _iconClickHandler
         */
        initMouseupHandler: function() {
            this.on('mouseup', function(evt) {
                this.onMouseUpSuperHandler(evt);
            });
        },


        /**
         *
         * @see fabric.js Text.onMouseUpSuperHandler
         * @param  {fabric.Event} evt
         */
        onMouseUpSuperHandler: function(evt) {
            this.__isMousedown = false;
            if (!this.editable || (this._isObjectMoved && this._isObjectMoved(evt.e))) {
                return;
            }

            if (this.__lastSelected && !this.__corner) {
                this.enterEditing(evt.e);
                if (this.selectionStart === this.selectionEnd) {
                    this.initDelayedCursor(true);
                } else {
                    this.renderCursorOrSelection();
                }
            }

            this.selected = true;
        },



        /* render: function (ctx) {
            this.callSuper('_render', ctx);
        }, */

        /* _set: function (key, value) {
            this.callSuper('_set', key, value);
        }, */

        toObject: function(propertiesToInclude) {
            return extend(this.callSuper('toObject', propertiesToInclude), {
                left: this.left,
                top: this.top,
                width: this.width,
                height: this.height,
                lockScalingFlip: true,
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

    fabric.ParkZone.fromObject = function(object, callback, forceAsync) {
        return fabric.Object._fromObject('ParkZone', object, callback, forceAsync, object.text);
    };

    fabric.ParkZone.async = true;

    // make our object erasable via ErasableMixin.
    //fabric.makeObjectErasable(fabric.ParkZone);

})(typeof exports !== 'undefined' ? exports : this);