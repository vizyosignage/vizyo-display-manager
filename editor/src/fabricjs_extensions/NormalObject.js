(function (global) {

    'use strict';

    var fabric = global.fabric || (global.fabric = {}),
        extend = fabric.util.object.extend;

    fabric.NormalObject = fabric.util.createClass(fabric.Object, {
        /**
         * Type of an object
         * @type String
         * @default
         */
        type: 'normalObject',

        /**
         * Constructor
         * @param {Object} objData object
         * @return {fabric.NormalObject}
         */
        initialize: function (objData) {
            objData = objData || {};

            // call super[fabric.Object].initialize()
            this.callSuper('initialize', objData);
        }
    });


    /**
     * Creates fabric object from data.
     *
     * @param objData
     * @param {function} callback
     * @return {fabric.NormalObject} Instance of fabric.NormalObject
     */
    fabric.NormalObject.fromObject = function (objData) {
        return new fabric.NormalObject(objData);
    };

    // make our object erasable via ErasableMixin.
    //fabric.makeObjectErasable(fabric.NormalObject);

})(typeof exports !== 'undefined' ? exports : this);