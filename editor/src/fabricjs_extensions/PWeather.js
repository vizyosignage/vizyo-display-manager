    (function (global) {

    'use strict';

    var fabric = global.fabric || (global.fabric = {}),
        extend = fabric.util.object.extend;

    /**
     * @class
     * @extends fabric.Group
     */
   
/*     fabric.PWeather = fabric.util.createClass(fabric.Group, {
      type: "PWeather",
      animateable: !0,
      setFill: function (fill) {
          this.todayWeather.setFill(fill);
          this.day1.setFill(fill);
          this.day2.setFill(fill);
          this.day3.setFill(fill); 
          this.day4.setFill(fill); 
          this.fill = fill;
      },
      initialize: function (options, attrs) {
          attrs = clone(attrs);
          var defaultAttrs = {
              units: "M",
              lat: 55.6760968,
              lng: 12.5683371,
              fontFamily: "Open Sans",
              iconSet: "flat-black",
              language: "en",
              cityName: "istanbul"
          };
          if (attrs = angular.extend(defaultAttrs, attrs), !options.length) {
              var item = new fabric.TodayPWeather([], {
                  top: 0,
                  left: 0,
                  propName: "todayWeather"
              });
              options.push(item);
              var column = new fabric.FuturePWeather([], {
                  top: 205,
                  left: 0,
                  propName: "day1",
                  dayIndex: 1
              });
              options.push(column);
              var label = new fabric.FuturePWeather([], {
                  top: 205,
                  left: 90,
                  propName: "day2",
                  dayIndex: 2
              });
              options.push(label);
              var page = new fabric.FuturePWeather([], {
                  top: 205,
                  left: 180,
                  propName: "day3",
                  dayIndex: 3
              });
              options.push(page);
              var version = new fabric.FuturePWeather([], {
                  top: 205,
                  left: 270,
                  propName: "day4",
                  dayIndex: 4
              });
              options.push(version);
          }
          for (var idx = 0; idx < options.length; idx++) {
              this.set(options[idx].propName, options[idx]);
              options[idx].set("parent", this);
          }
          this.setControlsVisibility({
              mt: !1,
              mb: !1,
              ml: !1,
              mr: !1
          }), 
          this.callSuper("initialize", options, attrs),
          this.renderCount = 0;
      },
      toObject: function () {
          var attributes = fabric.util.object.extend(this.callSuper("toObject"), this.animationValues());
          return fabric.util.object.extend(attributes, {
              city: this.get("city"),
              lat: this.get("lat"),
              lng: this.get("lng"),
              units: this.get("units"),
              language: this.get("language"),
              fontFamily: this.get("fontFamily"),
              iconSet: this.get("iconSet")
          });
      },
      render: function (ctx) {
          this.dirty = !0;
          var settings = create(this);
          this.todayWeather.setOptions(settings);
          this.day1.setOptions(settings); 
          this.day2.setOptions(settings);
          this.day3.setOptions(settings);
          this.day4.setOptions(settings); 
          this.callSuper("render", ctx);
      }
  }), fabric.PWeather.fromObject = function (object, callback) {
      fabric.util.enlivenObjects(object.objects, function (enlivenedObjects) {
          delete object.objects;
          callback && callback(new fabric.PWeather(enlivenedObjects, object));
      });
  }, fabric.WeatherIcon = fabric.util.createClass(fabric.Image, {
      type: "weatherIcon",
      animateable: !0,
      objectCaching: !1,
      initialize: function (text, options) {
          options = clone(options), this.currentIconSet = options.iconSet,
              this.setControlsVisibility({
                  mt: !1,
                  mb: !1,
                  ml: !1,
                  mr: !1
              }), this.callSuper("initialize", text, options);
      },
      setIcon: function (row, col) {
          if (this.iconCode !== col || this.currentIconSet !== row) {
              this.iconSet = row, this.iconCode = col;
              var self = this, src = $rootScope.baseUrl("/assets/weather/" + row + "/" + col + ".svg");
              this.setSrc(src, function () {
                  self.currentIconSet = row, duration();
              });
          }
      },
      toObject: function () {
          var attributes = fabric.util.object.extend(this.callSuper("toObject"), this.animationValues());
          return fabric.util.object.extend(attributes, {
              propName: this.get("propName"),
              iconCode: this.get("iconCode"),
              iconSet: this.get("iconSet"),
              lat: this.get("lat"),
              lng: this.get("lng"),
              units: this.get("units"),
              language: this.get("language"),
              dayIndex: this.get("dayIndex"),
              cityName: this.get("cityName")
          });
      },
      render: function (name) {
          var record = s.getWeather(this.lat, this.lng, this.language, this.units);
          if (record) {
              var item = record.data[this.dayIndex], icon = item.weather.icon;
              if (0 === this.dayIndex) {
                  var id = update(record);
                  icon = id.weather.icon;
              }
              this.setIcon(this.iconSet, icon);
          } else s.requestWeather(this.lat, this.lng, this.language, this.units).then(duration);
          this.callSuper("render", name);
      }
  }), fabric.WeatherIcon.fromObject = function (object, callback) {
      fabric.util.loadImage(object.src, function (img, image) {
          return image ? void (callback && callback(null, image)) : void fabric.WeatherIcon.prototype._initFilters.call(object, object.filters, function (filters) {
              object.filters = filters || [], fabric.WeatherIcon.prototype._initFilters.call(object, [object.resizeFilter], function (token) {
                  object.resizeFilter = token[0];
                  var instance = new fabric.WeatherIcon(img, object);
                  callback(instance);
              });
          });
      }, null, object.crossOrigin);
  }, fabric.DayNightIcon = fabric.util.createClass(fabric.Image, {
      type: "dayNightIcon",
      toObject: function () {
          return fabric.util.object.extend(this.callSuper("toObject"), {
              propName: this.get("propName"),
              iconSet: this.get("iconSet"),
              iconCode: this.get("iconCode")
          });
      }
  }), fabric.DayNightIcon.fromObject = function (object, callback) {
      fabric.util.loadImage(object.src, function (img, image) {
          return image ? void (callback && callback(null, image)) : void fabric.DayNightIcon.prototype._initFilters.call(object, object.filters, function (filters) {
              object.filters = filters || [], fabric.DayNightIcon.prototype._initFilters.call(object, [object.resizeFilter], function (token) {
                  object.resizeFilter = token[0];
                  var instance = new fabric.DayNightIcon(img, object);
                  callback(instance);
              });
          });
      }, null, object.crossOrigin);
  }, fabric.DayNightPWeather = fabric.util.createClass(fabric.Group, {
      type: "dayNightPWeather",
      animateable: !0,
      setIcon: function (position) {
          if (this.dayIcon.iconSet !== position) {
              var src = $rootScope.baseUrl("/assets/weather/" + position + "/day.svg");
              this.dayIcon.setSrc(src, function () {
                  canvas.renderAll();
              }), this.dayIcon.iconCode = "day", this.dayIcon.iconSet = position;
              var elem = $rootScope.baseUrl("/assets/weather/" + position + "/night.svg");
              this.nightIcon.setSrc(elem, function () {
                  canvas.renderAll();
              }), this.nightIcon.iconCode = "night", this.nightIcon.iconSet = position;
          }
      },
      setFill: function (fill) {
          this.day.fill !== fill && (this.day.setFill(fill), this.night.setFill(fill));
      },
      initialize: function (options, record) {
          if (record = clone(record), !options.length) {
              var label = new fabric.WeatherText("         ", {
                  fontSize: 25,
                  propName: "day",
                  left: 30,
                  textAlign: "right"
              });
              options.push(label);
              var image = new Image(), item = new fabric.DayNightIcon(image, {
                  propName: "dayIcon",
                  scaleY: .25,
                  scaleX: .25
              });
              options.push(item);
              var page = new fabric.WeatherText("", {
                  fontSize: 25,
                  propName: "night",
                  top: 25,
                  left: 30,
                  textAlign: "right"
              });
              options.push(page);
              var self = new Image(), result = new fabric.DayNightIcon(self, {
                  propName: "nightIcon",
                  scaleY: .25,
                  scaleX: .25,
                  top: 25
              });
              options.push(result);
          }
          for (var idx = 0; idx < options.length; idx++) this.set(options[idx].propName, options[idx]);
          this.set("propName", record.propName), this.setControlsVisibility({
              mt: !1,
              mb: !1,
              ml: !1,
              mr: !1
          }), this.callSuper("initialize", options, record);
      },
      toObject: function () {
          var attributes = fabric.util.object.extend(this.callSuper("toObject"), this.animationValues());
          return fabric.util.object.extend(attributes, {
              propName: this.get("propName"),
              lat: this.get("lat"),
              lng: this.get("lng"),
              units: this.get("units"),
              language: this.get("language"),
              fontFamily: this.get("fontFamily"),
              iconSet: this.get("iconSet"),
              cityName: this.get("cityName")
          });
      },
      render: function (ctx) {
          var link = create(this);
          this.setOptions(link), this.day.setOptions(link), this.night.setOptions(link);
          var settings = s.getWeather(this.lat, this.lng, this.language, this.units);
          if (settings) {
              this.day.textAlign = "right", this.night.textAlign = "right", this.day.setText(Math.round(settings.data[0].max_temp) + settings.units),
                  this.day.fontFamily = this.fontFamily, this.night.setText(Math.round(settings.data[0].min_temp) + settings.units),
                  this.night.fontFamily = this.fontFamily, this.setIcon(this.iconSet, this.iconCode);
              var width = Math.max(this.night.measureLine(0).width, this.day.measureLine(0).width);
              this.night.set("width", width), this.day.set("width", width);
          } else s.requestWeather(this.lat, this.lng, this.language, this.units).then(duration);
          this.callSuper("render", ctx);
      }
  }), fabric.DayNightPWeather.fromObject = function (object, callback) {
      fabric.util.enlivenObjects(object.objects, function (enlivenedObjects) {
          delete object.objects, callback && callback(new fabric.DayNightPWeather(enlivenedObjects, object));
      });
  }, fabric.WeatherText = fabric.util.createClass(fabric.Text, {
      type: "weatherText",
      animateable: !0,
      initialize: function (text, options) {
          options = clone(options), this.callSuper("initialize", text, options);
      },
      toObject: function () {
          var attributes = fabric.util.object.extend(this.callSuper("toObject"), this.animationValues());
          return fabric.util.object.extend(attributes, {
              propName: this.get("propName"),
              idAsset: this.get("idAsset"),
              url: this.get("url")
          });
      }
  }), fabric.WeatherText.fromObject = function (object, callback) {
      callback(new fabric.WeatherText(object.text, object));
  }, fabric.WeatherDescription = fabric.util.createClass(fabric.Text, {
      type: "weatherDescription",
      animateable: !0,
      initialize: function (text, options) {
          options = clone(options), this.callSuper("initialize", text, options);
      },
      toObject: function () {
          var attributes = fabric.util.object.extend(this.callSuper("toObject"), this.animationValues());
          return fabric.util.object.extend(attributes, {
              propName: this.get("propName"),
              lat: this.get("lat"),
              lng: this.get("lng"),
              units: this.get("units"),
              language: this.get("language"),
              maxWidth: this.get("maxWidth"),
              idAsset: this.get("idAsset"),
              url: this.get("url"),
              cityName: this.get("cityName")
          });
      },
      render: function (ctx) {
          var length = s.getWeather(this.lat, this.lng, this.language, this.units);
          if (length) {
              var results = update(length);
              for (this.setText(results.weather.description), this.fontSize = 30; this.measureLine(0).width > this.maxWidth;) this.fontSize--;
          } else s.requestWeather(this.lat, this.lng, this.language, this.units).then(duration);
          this.callSuper("render", ctx);
      }
  }), fabric.WeatherDescription.fromObject = function (object, callback) {
      callback(new fabric.WeatherDescription(object.text, object));
  }, fabric.WeatherTemperature = fabric.util.createClass(fabric.Text, {
      type: "weatherTemperature",
      animateable: !0,
      initialize: function (text, options) {
          options = clone(options), this.callSuper("initialize", text, options);
      },
      toObject: function () {
          var attributes = fabric.util.object.extend(this.callSuper("toObject"), this.animationValues());
          return fabric.util.object.extend(attributes, {
              propName: this.get("propName"),
              lat: this.get("lat"),
              lng: this.get("lng"),
              units: this.get("units"),
              language: this.get("language"),
              idAsset: this.get("idAsset"),
              url: this.get("url"),
              cityName: this.get("cityName")
          });
      },
      render: function (options) {
          var settings = s.getWeather(this.lat, this.lng, this.language, this.units);
          if (settings) {
              var self = (settings.data[0], Date.now() / 1e3, update(settings));
              this.setText(Math.round(self.temp) + " " + settings.units);
          } else s.requestWeather(this.lat, this.lng, this.language, this.units).then(duration);
          this.set("width", 125), this.setCoords(), this.callSuper("render", options);
      }
  }), fabric.WeatherTemperature.fromObject = function (object, callback) {
      callback(new fabric.WeatherTemperature(object.text, object));
  }, fabric.TodayPWeather = fabric.util.createClass(fabric.Group, {
      type: "todayPWeather",
      animateable: !0,
      setFill: function (fill) {
          this.fill !== fill && (this.fill = fill, this.city.setFill(fill),
              this.today.setFill(fill), this.temperature.setFill(fill), this.dayNightWeather.setFill(fill),
              this.description.setFill(fill));
      },
      initialize: function (options, params) {
          if (params = clone(params), !options.length) {
              var item = new fabric.WeatherIcon(new Image(), {
                  propName: "icon",
                  top: 45,
                  left: 120,
                  scaleX: .35,
                  scaleY: .35,
                  dayIndex: 0
              });
              options.push(item);
              var column = new fabric.WeatherText("istanbul", {
                  fontSize: 30,
                  propName: "city"
              });
              options.push(column);
              var label = new fabric.WeatherText("Today", {
                  fontSize: 30,
                  propName: "today",
                  top: 40
              });
              options.push(label);
              var page = new fabric.WeatherDescription("Loading data...", {
                  fontSize: 30,
                  propName: "description",
                  top: 180,
                  left: 170,
                  originX: "center",
                  originY: "center"
              });
              options.push(page);
              var version = new fabric.WeatherTemperature("           ", {
                  fontSize: 45,
                  fontWeight: "bold",
                  propName: "temperature",
                  top: 0,
                  left: 230,
                  textAlign: "right"
              });
              options.push(version);
              var settings = new fabric.DayNightPWeather([], {
                  top: 50,
                  left: 265,
                  propName: "dayNightWeather"
              });
              options.push(settings);
          }
          this.set("propName", "todayWeather");
          for (var idx = 0; idx < options.length; idx++) this.set(options[idx].propName, options[idx]),
              options[idx].set("parent", this);
          this.setControlsVisibility({
              mt: !1,
              mb: !1,
              ml: !1,
              mr: !1
          }), this.callSuper("initialize", options, params);
      },
      toObject: function () {
          var attributes = fabric.util.object.extend(this.callSuper("toObject"), this.animationValues());
          return fabric.util.object.extend(attributes, {
              propName: this.get("propName"),
              lat: this.get("lat"),
              lng: this.get("lng"),
              units: this.get("units"),
              language: this.get("language"),
              iconSet: this.get("iconSet"),
              dayIndex: this.get("dayIndex"),
              fontFamily: this.get("fontFamily"),
              cityName: this.get("cityName")
          });
      },
      render: function (ctx) {
          var link = create(this);
          this.setOptions(link), this.dayNightWeather.setOptions(link), this.icon.setOptions(link),
              this.description.setOptions(link), this.today.setOptions(link), this.city.setOptions(link),
              this.temperature.setOptions(link), this.description.maxWidth = this.width,
              this.dirty = !0, this.callSuper("render", ctx);
          var title = t.instant("TODAY", null, null, this.language);
          this.today.setText(title);
      }
  }), fabric.TodayPWeather.fromObject = function (object, callback) {
      fabric.util.enlivenObjects(object.objects, function (enlivenedObjects) {
          delete object.objects, callback && callback(new fabric.TodayPWeather(enlivenedObjects, object));
      });
  }, fabric.FuturePWeather = fabric.util.createClass(fabric.Group, {
      type: "futurePWeather",
      animateable: !0,
      objectCaching: !1,
      setFill: function (fill) {
          this.fill !== fill && (this.fill = fill, this.day.setFill(fill),
              this.temperature.setFill(fill));
      },
      initialize: function (options, record) {
          if (record = clone(record), !options.length) {
              var label = new fabric.WeatherText("          ", {
                  fontSize: 30,
                  propName: "day",
                  originX: "center",
                  originY: "center"
              });
              options.push(label);
              var image = new Image(), item = new fabric.WeatherIcon(image, {
                  propName: "icon",
                  scaleY: .22,
                  scaleX: .22,
                  originX: "center",
                  originY: "center",
                  top: 50,
                  dayIndex: record.dayIndex
              });
              options.push(item);
              var page = new fabric.WeatherText("", {
                  fontSize: 23,
                  propName: "temperature",
                  originX: "center",
                  originY: "center",
                  top: 100
              });
              options.push(page);
          }
          for (var idx = 0; idx < options.length; idx++) this.set(options[idx].propName, options[idx]),
              options[idx].set("parent", this);
          this.set("propName", record.propName), this.setControlsVisibility({
              mt: !1,
              mb: !1,
              ml: !1,
              mr: !1
          }), this.callSuper("initialize", options, record);
      },
      toObject: function () {
          var attributes = fabric.util.object.extend(this.callSuper("toObject"), this.animationValues());
          return fabric.util.object.extend(attributes, {
              propName: this.get("propName"),
              lat: this.get("lat"),
              lng: this.get("lng"),
              units: this.get("units"),
              language: this.get("language"),
              iconSet: this.get("iconSet"),
              dayIndex: this.get("dayIndex"),
              fontFamily: this.get("fontFamily"),
              cityName: this.get("cityName")
          });
      },
      render: function (ctx) {
          var link = create(this);
          this.icon.setOptions(link), this.day.setOptions(link), this.temperature.setOptions(link),
              this.setOptions(link);
          var settings = s.getWeather(this.lat, this.lng, this.language, this.units);
          if (settings) {
              var result = settings.data[this.dayIndex];
              this.temperature.text = Math.round(result.max_temp) + "° " + Math.round(result.min_temp) + "°",
                  this.temperature.fontFamily = this.fontFamily, this.day.text = callback("moment")(new Date(1e3 * result.ts), "ddd", this.language),
                  this.day.fontFamily = this.fontFamily;
          } else s.requestWeather(this.lat, this.lng, this.language, this.units).then(duration);
          this.callSuper("render", ctx);
      }
  }), fabric.FuturePWeather.fromObject = function (object, callback) {
      fabric.util.enlivenObjects(object.objects, function (enlivenedObjects) {
          delete object.objects, callback && callback(new fabric.FuturePWeather(enlivenedObjects, object));
      });
  }; */

})(typeof exports !== 'undefined' ? exports : this);
