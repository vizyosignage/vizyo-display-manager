(function ($, pluginsNamespace, util) {
  'use strict';

  var optimalSizeOfDropdown = 375;

  /**
   * Creates color input for changing color; colorChangeHandler is called on color change.
   *
   * @param {DrawerJs.Drawer} drawer
   *
   * @param {Object} [options]
   * Configuration object.
   *
   * @param {String[]} [options.colors]
   * Array of colors to be used.
   *
   * @param {number} [options.colorsInRow]
   * Number of colors for one row.
   *
   * @constructor
   * @memberof DrawerJs.plugins
   */
  var JsColorpickerControl = function JsColorpickerControlConstructor(drawer, options) {
      this.drawer = drawer;

      // init options
      options = options || {};
      this.options = $.extend(true, {}, this._defaultOptions || {}, options || {});

      this.hideOnEditMode = true;
      // more stuff
      this.assetsUrl = util.getDrawerFolderUrl() + 'assets/';
      this.shouldDisplayTransparent = false;

      this.colors = this.options.colors;
      this.colorsInRow = this.options.colorsInRow;

      // jsColor
      this.pickerInput = null; //document.getElementById('jscolorInput');
      this.colorpicker = null;
    };


  JsColorpickerControl.prototype._defaultOptions = {
      colors: [
        // kırmızı
        '#ff1a1a', '#ff0000','#fa0000', '#e60000', '#cc0000',
        '#b30000', '#990000', '#800000', '#660000', '#4d0000',
        // yeşil
        '#5cd65c', '#47d147', '#33cc33', '#2eb82e', '#29a329',
        '#248f24', '#1f7a1f', '#196619', '#145214', '#0f3d0f',
        // mavi
        '#4db8ff', '#33adff', '#1aa3ff', '#0099ff', '#008ae6',
        '#007acc', '#006bb3', '#005c99', '#004d80', '#003d66',
        // sarı - turuncu
        '#fff080', '#ffed66', '#ffea4d', '#ffe833', '#ffe41a',
        '#ffc566', '#ffbb4d', '#ffb133', '#ffa71a', '#ffa71a',
        // beyaz - siyah
        '#ffffff', '#e6e6e6', '#cccccc', '#b3b3b3', '#999999',
        '#808080', '#666666', '#4d4d4d', '#333333', '#000000',
        ],
        colorsInRow: 11,
        minSwatchSize : 10,
        buttonOrder: 6
  };

  JsColorpickerControl.prototype.TRANSPARENT = 'rgba(0, 0, 0, 0)';
  JsColorpickerControl.prototype.defaultPosition = 'bottom';
  JsColorpickerControl.prototype.positions = ['bottom', 'top', 'left', 'right'];

  /**
   * Removes tool
   */
  JsColorpickerControl.prototype.remove = function () {
    if (this.$colorButton) {
      this.$colorButton.remove();
    }
  };


  /**
   * Hides controls
   */
  JsColorpickerControl.prototype.hideControls = function () {
    if (this.$colorButton) {
      this.$colorButton.addClass('hidden');
    }
  };

  /**
   * Shows controls.
   * Before showing - updates controls size and position.
   */
  JsColorpickerControl.prototype.showControls = function () {
    if (this.$colorButton) {
      this.$colorButton.removeClass('hidden');
    }
  };


  /**
   * Returns current selected color
   * @return {String} currently selected css color
   */
  JsColorpickerControl.prototype.getColor = function() {
      return this.currentColor;
  };


  /**
   * Sets current color.
   * @param {String|fabric.Color} color valid css color or 'transparent'
   */
  JsColorpickerControl.prototype.setColor = function (color) {
      //console.log(color);
      if (color instanceof fabric.Color) {
        this.currentColor = color;
      } else {
        this.currentColor = new fabric.Color(color);
      }

      var background = color,
          isTransparent = color === '' || color == this.TRANSPARENT || color == 'transparent';
      if (isTransparent) {
        background = 'url(' + this.assetsUrl + 'transparent.png)';
        this.currentColor = this.TRANSPARENT;
      }

      // jscolor geçerli renk kodunu set ediyoruz
      this.colorpicker.fromString(color);
      //console.log(this.colorpicker);
    };


  /**
   * Removes transparent color from list
   */
  JsColorpickerControl.prototype.disableTransparent = function () {
    this.shouldDisplayTransparent = false;

    if (this.$colorButton) {
      this.$colorButton.find('.transparent').hide();
    }
  };

  /**
   * Adds transparent color to the list
   */
  JsColorpickerControl.prototype.enableTransparent = function () {
    this.shouldDisplayTransparent = true;

    if (this.$colorButton) {
      this.$colorButton.find('.transparent').show();
    }
  };

  /**
   * This function is called every time user clicks on color from color-dropdown
   * menu.
   *
   * @param {String} selectedColor Hash value of user selected color.
   */
  JsColorpickerControl.prototype.onColorSelected = function (selectedColor) {
    this.setColor(selectedColor);

    if (this.colorChangeHandler) {
      this.colorChangeHandler(selectedColor);
    }
  };


  /**
   * Create and attach global click handlers
   * @private
   */
  JsColorpickerControl.prototype._setGlobalClickHandler = function() {
    var self = this;
    $('html').click(function (e) {
        if (self.colorDropdownVisible && (e.target != self.$colorButton.$colorIndicator.get(0))) {
          self.hideColorDropdown();
        }
        return true;
    });
  };


  /**
   * Creates color button which shows colors Controls on click.
   *
   * @param {DrawerToolbar} toolbar to append this button to.
   * @param {Function} colorChangeHandler - Function that will be called when color is selected.
   */
  JsColorpickerControl.prototype.createControl = function (toolbar, colorChangeHandler) {
    this.$colorButton = $(this._getControlHtml());

    this.colorChangeHandler = colorChangeHandler;

   this._setGlobalClickHandler();

    toolbar.addControl(this.$colorButton, this.options.buttonOrder);

    return this.$colorButton;
  };

  /**
   * jsColor init
   */
   JsColorpickerControl.prototype._initJscolor = function () {
    jscolor.presets.default = {
      position: 'right',
      palette: [
        // kırmızı
        '#ff1a1a', '#ff0000','#fa0000', '#e60000', '#cc0000',
        '#b30000', '#990000', '#800000', '#660000', '#4d0000',
        // yeşil
        '#5cd65c', '#47d147', '#33cc33', '#2eb82e', '#29a329',
        '#248f24', '#1f7a1f', '#196619', '#145214', '#0f3d0f',
        // mavi
        '#4db8ff', '#33adff', '#1aa3ff', '#0099ff', '#008ae6',
        '#007acc', '#006bb3', '#005c99', '#004d80', '#003d66',
        // sarı - turuncu
        '#fff080', '#ffed66', '#ffea4d', '#ffe833', '#ffe41a',
        '#ffc566', '#ffbb4d', '#ffb133', '#ffa71a', '#ffa71a',
        // beyaz - siyah
        '#ffffff', '#e6e6e6', '#cccccc', '#b3b3b3', '#999999',
        '#808080', '#666666', '#4d4d4d', '#333333', '#000000',
      ],
      //paletteCols: 12,
      //hideOnPaletteClick: true,
    };

    jscolor.install(); 
    jscolor.trigger('input');

    this.colorpicker = document.querySelector('#jscolorInput').jscolor;
    this.colorpicker.fromString('#000000');

    // jscolor click eventlarını bu şekilde alacağız
    var that = this;

    // colorpicker üzerinden renk seçilip tıklandığında tetiklenir
    document.querySelector("#jscolorInput").addEventListener("click", function (event) {
      that.colorpicker = event.target.jscolor;
      document.querySelector(".jscolor-picker").addEventListener("click", function () {
          that.onColorSelected(that.colorpicker.toHEXString());
      });
    });

  // text input üzerinde hex renk kodunu girip entera basınca tetiklenir
  document.querySelector("#jscolorInput").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) 
    {
      that.colorpicker = event.target.jscolor;
      that.onColorSelected(that.colorpicker.toHEXString());
    }
  });

  // text input üzerinde hex renk kodunu girerken tetiklenir (gerek yok)
  // document.querySelector("#jscolorInput").addEventListener("onchange", function (event) {
  //   if (event.keyCode === 13) 
  //   {
  //     that.colorpicker = event.target.jscolor;
  //     that.onColorSelected(that.colorpicker.toHEXString());
  //   }
  // });

  };

  JsColorpickerControl.prototype._collectDataFromToolbar = function (toolbar) {
    if (toolbar) {
      var toolbarPosition = toolbar.options.position;
      this.isVertical = toolbarPosition === 'left' || toolbarPosition === 'right';
      this.$toolbar = toolbar.$toolbar;
      this.toolbar = toolbar;
    }
  };

  /**
   * Calcs swatch size and updated Controls width if needed.
   * @private
   */
  JsColorpickerControl.prototype._updateControlsSize = function () {
      // calc swatch size
      var swatchSize = this._calcSwatchSize();
      // swatch size in css is 1em, so set $container fontSize
      this.$colorButton.$colorDropdown.css('fontSize', swatchSize + 'px');
      // set control width
      var controlWidth = swatchSize * this.colorsInRow;
      this.$colorButton.$colorDropdown.css('width', controlWidth + 'px');
  };

  /**
   * Collect sizes of needed elements
   * @param {jQuery} $trigger - trigger element
   * @returns {Object}
   * @private
   */
  JsColorpickerControl.prototype._getAvailableSpace = function ($trigger) {
    var result;
    if ($trigger && $trigger.length) {
      var $canvas = this.drawer.$canvasEditContainer,
          $contentWrapper = this.$colorButton.$colorDropdown.closest('.popup-content-wrapper'),
          $toolbarWrapper = this.$colorButton.$colorDropdown.closest('.toolbar-content-wrapper'),
          canvasSizes = $canvas.get(0).getBoundingClientRect(),
          triggerSizes = $trigger.get(0).getBoundingClientRect(),
          toolbarSizes = $toolbarWrapper.get(0).getBoundingClientRect(),
          popupSizes = $contentWrapper.get(0).getBoundingClientRect(),
          paletteSizes = this.$colorButton.$colorDropdown.get(0).getBoundingClientRect(),

          // arrowSize = 10,
          arrowSize = 0,
          triggerOffsetX = triggerSizes.left - canvasSizes.left,
          triggerOffsetY = triggerSizes.top - canvasSizes.top;
      result = {};

      result.top = triggerOffsetY;
      result.left = triggerOffsetX;
      result.right = canvasSizes.width - triggerOffsetX - triggerSizes.width;
      result.bottom = canvasSizes.height - triggerOffsetY - triggerSizes.height;

      result.centerX = triggerOffsetX + triggerSizes.width/2;
      result.centerY = triggerOffsetY + triggerSizes.height/2;

      result.palette = {
        arrowSize: arrowSize,
        top: paletteSizes.height,
        bottom: paletteSizes.height,
        left: paletteSizes.width,
        right: paletteSizes.width
      };

      result.popupSizes = popupSizes;
      result.toolbarSizes = toolbarSizes;
      result.paletteSizes = paletteSizes;
      result.canvasSizes = canvasSizes;
      result.triggerSizes = triggerSizes;
    }
    this.sizes = result;
    return result;
  };

  /**
   * Adjusts color dropdown position to be inside drawer
   * @private
   */
  JsColorpickerControl.prototype._adjustControlsPosition = function () {
    var notEnoughWidth = this.drawer.width < optimalSizeOfDropdown,
        notEnoughHeight = this.drawer.height < optimalSizeOfDropdown,
        smallerThanNormalSize = this.isVertical ? notEnoughHeight : notEnoughWidth,
        canvasContainerSizes = this.drawer.$canvasEditContainer.get(0).getBoundingClientRect(),
        colorButtonSizes = this.$colorButton.get(0).getBoundingClientRect(),
        minimumSizeDelta = 10,
        currDropdownSizes;


    this.$colorButton.$colorDropdown.removeAttr('style');
    currDropdownSizes = this.$colorButton.$colorDropdown.get(0).getBoundingClientRect();

    if (this.isVertical) {
      if (smallerThanNormalSize) {
        this.$colorButton.$colorDropdown.css('top', 0);
      } else {
        var topOffsetOfButton = colorButtonSizes.top - canvasContainerSizes.top,
            newTopValue = topOffsetOfButton + colorButtonSizes.height / 2 - currDropdownSizes.height / 2;
        this.$colorButton.$colorDropdown.css('top', newTopValue);
      }
    } else {
      if (smallerThanNormalSize) {
        this.$colorButton.$colorDropdown.css('left', 0);
      } else {
        var leftOffsetOfButton = colorButtonSizes.left - canvasContainerSizes.left,
            newLeftValue = leftOffsetOfButton + colorButtonSizes.width / 2 - currDropdownSizes.width / 2;
        this.$colorButton.$colorDropdown.css('left', newLeftValue);
      }
    }

    if (!smallerThanNormalSize) {
      currDropdownSizes = this.$colorButton.$colorDropdown.get(0).getBoundingClientRect();
      if (this.isVertical) {
        smallerThanNormalSize = (optimalSizeOfDropdown - currDropdownSizes.height) > minimumSizeDelta;

        var topOffsetIsValid = currDropdownSizes.top > canvasContainerSizes.top,
            bottomOffsetIsValid = (currDropdownSizes.top + currDropdownSizes.height) < (canvasContainerSizes.top + canvasContainerSizes.height),
            topIsCorrect = topOffsetIsValid,
            bottomIsCorrect = bottomOffsetIsValid && !smallerThanNormalSize;

        if (!topIsCorrect) {
          this.$colorButton.$colorDropdown.removeAttr('style');
          this.$colorButton.$colorDropdown.css('top', 0);
        }
        if (!bottomIsCorrect) {
          this.$colorButton.$colorDropdown.removeAttr('style');
          this.$colorButton.$colorDropdown.css({
            'bottom' : 0,
            'top': 'auto'
          });
        }
      } else {
        smallerThanNormalSize = (optimalSizeOfDropdown - currDropdownSizes.width) > minimumSizeDelta;

        var leftOffsetIsValid = currDropdownSizes.left > canvasContainerSizes.left,
            rightOffsetIsValid = (currDropdownSizes.left + currDropdownSizes.width) < (canvasContainerSizes.left + canvasContainerSizes.width),
            leftIsCorrect = leftOffsetIsValid,
            rightIsCorrect = rightOffsetIsValid && !smallerThanNormalSize;

        if (!leftIsCorrect) {
          this.$colorButton.$colorDropdown.removeAttr('style');
          this.$colorButton.$colorDropdown.css('left', 0);
        }
        if (!rightIsCorrect) {
          this.$colorButton.$colorDropdown.removeAttr('style');
          this.$colorButton.$colorDropdown.css({
            'right' : 0,
            'left': 'auto'
          });
        }
      }
    }
  };

  /**
   * Get html of color control
   * @returns {String}
   * @private
   */
  JsColorpickerControl.prototype._getControlHtml = function () {
    var colorLabelText = this.options.colorText || "";
    //var jscolorData = "{onInput:'_onUpdate(this)'}";
    //var jscolorData = "{onInput:" + this._onUpdate(jscolor) + "}";
    var jscolorData = "{}";
    //var jscolorHtml = '<input id="jscolorInput" value="#000000" data-jscolor="'+ jscolorData +'" style="width: 140px">';
    //var jscolorHtml = '<input id="jscolorInput" value="#000000" data-jscolor="{}" style="width: 140px">';

    return "";
    
    /* var jscolorHtml = '<Buttons Margin="Margin.Is2.OnX">' +
    '<Tooltip Text="@Localize["Editor:ColorInputDescription"]" Placement="TooltipPlacement.Bottom">' +
    '<Button Color="Color.Secondary">' +
    '<Icon class="text-white" Name="IconName.PaintRoller" /> </Button> </Tooltip>' +
    '<input id="jscolorInput" value="#000000" data-jscolor="{}" style="width: 140px">' +
    '</Buttons>';
    

    return '<li class="colorpicker-control" ' +
              'data-editable-canvas-sizeable="toolbar-button" ' +
              '>' +
            '<span class="toolbar-label" ' +
                  'data-editable-canvas-sizeable="toolbar-button" ' +
                  'data-editable-canvas-cssrules="line-height">' +
            '</span>' +
            jscolorHtml +
          '</li>'; */
    };


  pluginsNamespace.JsColorpickerControl = JsColorpickerControl;

}(jQuery, DrawerJs.plugins, DrawerJs.util));
