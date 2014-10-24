(function( factory ) {
  if ( typeof define === "function" && define.amd ) {

    // AMD. Register as an anonymous module.
    define([
      "jquery",
      "./core",
      "./widget"
      ], factory );
  } else {

    // Browser globals
    factory( jQuery );
  }
} (function($) {
  return $.widget("dmulog.level", {
    options : {
      value : 120,
      label : 'Level',
      granularity : 7,
      animTime: 200
    },

    /**
     * Creates the HTML structure necessary for the widget to work. Also
     * animates upto the specified start value.
     */
    _create: function () {
      this._container = $('<div/>').addClass('level-container');

      var leftDiv = $('<div/>').addClass('level-leftDiv')
        , rightDiv = $('<div/>').addClass('level-rightDiv')
        , labelDiv = $('<div/>').addClass('level-label').text(this.options.label);

      this._valueDiv = $('<div/>').addClass('level-value').html(this._displayValue());
      leftDiv.append(this._valueDiv);
      leftDiv.append(labelDiv);

      this._levelBar = $('<div/>').addClass('level-bar');
      rightDiv.append(this._levelBar);

      this._container.append(leftDiv);
      this._container.append(rightDiv);

      this.element.append(this._container);

      this._initLevelBar();
      this._animatePercentage(0);
      this._animateTower();
    },

    /**
     * Start with @param value, and animate to current value. Equally divide
     * into this.options.granularity segments for animation.
     */
    _animateTower: function(value) {
      var oldValue = value
        , newValue = this.options.value
        , animTime = this.options.animTime
        , that = this
        , passNum = 0
        
        , animateColor = function (div, from, to) {
          div.css('background-color', to);
        }

        // Given an old value and an index, will give you the color for the tower
        // block at that index
        , colorFor = function (value, idx) {
          var value = Math.min(value - idx * 20, 20) / 20.0;
          var fraction = (value < 0) ? 0 : value;

          var h = Math.floor(120 * fraction),
              s = 1,
              b = 0;

          return "hsb(" + h + ", " + s + ", " + b + ")";
        };

      $.each(that.tower, function (idx, div) {
        var oldColor = colorFor(oldValue, idx)
          , newColor = colorFor(newValue, idx);

        animateColor(div, oldColor, newColor);
      });
    },

    /**
     * Start with @param value, and animate to current value. Equally divide
     * into this.options.granularity segments for animation.
     */
    _animatePercentage: function(value) {
      var oldValue = value
        , newValue = this.options.value
        , granularity = this.options.granularity
        , animTime = this.options.animTime
        , increment = (newValue - oldValue) / granularity
        , that = this
        , passNum = 0;

      repeatFn = function() {
        passNum++;

        oldValue = (passNum === granularity) ? newValue : parseInt(oldValue + increment);
        that._valueDiv.html(that._displayValue(parseInt(oldValue)));

        if (passNum < granularity) {
          setTimeout(repeatFn, parseInt(animTime / granularity));
        }
      }
      
      setTimeout(repeatFn, parseInt(animTime / granularity));
    },

    _initLevelBar: function () {
      var container = this._levelBar;

      this.tower = [];
      for (var i=0; i<5; i++) {
        this.tower.push($('<div class="level-tower-block"/>'));
        container.prepend(this.tower[i]);
      }

      this.towerValue = [];
      for (var i=0; i<5; i++) {
        this.towerValue.push(0);
      }
    },

    _displayValue: function (value) {
      var num = (value === undefined) ? this.value() : value;
      return num + '<span class="level-percentage">%</span>';
    },

    value: function (value) {
      if (value === undefined) {
        // Not defined, act as getter 
        return this.options.value;
      } else {
        // Defined, act as setter
        value = parseInt(value); // Ensure integer percentages
        var oldValue = this.options.value;
        this.options.value = value;

        this._animatePercentage(oldValue);
        this._animateTower(oldValue);
      }
    }
  });
}));
