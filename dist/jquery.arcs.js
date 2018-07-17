/**
 * @license jq-arcs v1.0.0
 * (c) 2018 Finsi, Inc.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('svgjs')) :
    typeof define === 'function' && define.amd ? define(['exports', 'svgjs'], factory) :
    (factory((global.jqArcs = {}),null));
}(this, (function (exports,svgProxy) { 'use strict';

    var svgProxy__default = 'default' in svgProxy ? svgProxy['default'] : svgProxy;

    (function (ArcsEvents) {
        /**
         * Triggered when an item will be activated
         * The instance of Arcs Widget is passed with the [[ArcsItem]] to activate
         * @example
         * ```typescript
         * $("someSelector").on(ArcsEvents.beforeActivateItem,(e,arcsWidgetInstance,item)=>{
         *      console.log(arcsWidgetInstance,item)
         * });
         * ```
         */
        ArcsEvents["beforeActivateItem"] = "arcs:beforeActivateItem";
        /**
         * Triggered when an item is activated
         * The instance of Arcs Widget is passed with the [[ArcsItem]] activated
         * @example
         * ```typescript
         * $("someSelector").on(ArcsEvents.activateItem,(e,arcsWidgetInstance,item)=>{
         *      console.log(arcsWidgetInstance,item)
         * });
         * ```
         */
        ArcsEvents["activateItem"] = "arcs:activateItem";
        /**
         * Triggered when all the items has been activated
         * The instance of Arcs Widget is passed
         * @example
         * ```typescript
         * $("someSelector").on(ArcsEvents.completed,(e,arcsWidgetInstance)=>{
         *      console.log(arcsWidgetInstance)
         * });
         * ```
         */
        ArcsEvents["complete"] = "arcs:complete";
    })(exports.ArcsEvents || (exports.ArcsEvents = {}));

    /**
     * Represents the svg of an item
     */
    var ArcsItemSvg = /** @class */ (function () {
        function ArcsItemSvg(params) {
            if (params === void 0) { params = {}; }
            if (params.color != undefined) {
                this.color = params.color;
            }
            if (params.start != undefined) {
                this.start = params.start;
            }
            if (params.end != undefined) {
                this.end = params.end;
            }
            if (params.stroke != undefined) {
                this.stroke = params.stroke;
            }
            if (params.d != undefined) {
                this.d = params.d;
            }
            if (params.arc != undefined) {
                this.arc = params.arc;
            }
            if (params.totalLength != undefined) {
                this.totalLength = params.totalLength;
            }
        }
        return ArcsItemSvg;
    }());

    /**
     * Represents an item
     */
    var ArcsItem = /** @class */ (function () {
        function ArcsItem(params) {
            if (params === void 0) { params = {}; }
            if (params.$item != undefined) {
                this.$item = params.$item;
            }
            if (params.back != undefined) {
                if (params.back instanceof ArcsItemSvg) {
                    this.back = params.back;
                }
                else {
                    this.back = new ArcsItemSvg(params.back);
                }
            }
            if (params.mid != undefined) {
                if (params.mid instanceof ArcsItemSvg) {
                    this.mid = params.mid;
                }
                else {
                    this.mid = new ArcsItemSvg(params.mid);
                }
            }
            if (params.fill != undefined) {
                if (params.fill instanceof ArcsItemSvg) {
                    this.fill = params.fill;
                }
                else {
                    this.fill = new ArcsItemSvg(params.fill);
                }
            }
            if (params.group != undefined) {
                this.group = params.group;
            }
            if (params.disabled != undefined) {
                this.disabled = params.disabled;
            }
            if (params.activated != undefined) {
                this.activated = params.activated;
            }
        }
        return ArcsItem;
    }());

    /**
     * @module jqArcs
     */ /** */
    //solve rollup error
    var SVG = svgProxy__default || svgProxy;
    var Arcs = /** @class */ (function () {
        function Arcs() {
            this._activated = 0;
            this._current = -1;
        }
        /**
         * @constructor
         * @private
         */
        Arcs.prototype._create = function () {
            this.element.addClass(this.options.classes.root);
            this._svg = SVG(this.element.get(0));
            //center of the circumference
            this._position = this.options.viewBox / 2;
            this._radius = (this.options.viewBox / 2) - this.options.stroke;
            this._svg.viewbox(0, 0, this.options.viewBox, this.options.viewBox);
            this.draw(true);
        };
        /**
         * Render the component
         * @param [force=false]   Parse the items again and reset the states. By default false
         * If is false the arcs will be rendered again with the same state
         * If the [[ArcsOptions.lineal]] is true the sequence will reseted
         */
        Arcs.prototype.draw = function (force) {
            if (force === void 0) { force = false; }
            if (force) {
                this._findElements();
                this._extractData();
                this._activated = 0;
                this._current = -1;
            }
            this._draw();
            if (this.options.lineal) {
                if (force) {
                    this.next();
                }
                else {
                    this._updateCurrentItem();
                }
            }
        };
        /**
         * Enables the next arc
         * Only works if the [[ArcsOptions.lineal]] is true
         */
        Arcs.prototype.next = function () {
            if (this.options.lineal) {
                this._current++;
                this.setItemDisable(this._current, false);
                this._updateCurrentItem();
            }
        };
        /**
         * Change the disable state of an item
         * @param index     Index of the item to change
         * @param disabled  New state
         */
        Arcs.prototype.setItemDisable = function (index, disabled) {
            var item = this._items[index];
            if (item) {
                item.disabled = disabled;
                if (disabled) {
                    item.group.$node.addClass(this.options.classes.disabled);
                    item.$item.addClass(this.options.classes.disabled);
                }
                else {
                    item.group.$node.removeClass(this.options.classes.disabled);
                    item.$item.removeClass(this.options.classes.disabled);
                }
            }
        };
        /**
         * Enable an item
         * @param index Index of the item to enable
         */
        Arcs.prototype.enableItem = function (index) {
            this.setItemDisable(index, false);
        };
        /**
         * Disable an item
         * @param index Index of the item to disable
         */
        Arcs.prototype.disableItem = function (index) {
            this.setItemDisable(index, true);
        };
        Arcs.prototype.enable = function () {
            //Call to jquery widget super
            //@ts-ignore
            if (this._super) {
                //@ts-ignore
                this._super();
            }
            this.element.removeClass(this.options.classes.disabled);
        };
        Arcs.prototype.disable = function () {
            //Call to jquery widget super
            //@ts-ignore
            if (this._super) {
                //@ts-ignore
                this._super();
            }
            this.element.addClass(this.options.classes.disabled);
        };
        /**
         * Set an item as active if the component is enabled and the item is also enabled
         * @param index Index of the item to activate
         * @returns {JQueryPromise<T>}
         */
        Arcs.prototype.activate = function (index) {
            if (this.options.disabled != true) {
                var item = this._items[index];
                if (item && item.disabled != true) {
                    item.group.$node.addClass(this.options.classes.activating);
                    item.$item.addClass(this.options.classes.activating);
                    item.group.off("click", this._onGroupClick);
                    return this._animate(item);
                }
            }
        };
        Arcs.prototype._findElements = function () {
            this._$items = this.element.find(this.options.selectors.item);
            this._$items.addClass(this.options.classes.item);
        };
        /**
         * Analize the items and generate the structure for the arcs
         * @private
         */
        Arcs.prototype._extractData = function () {
            //parse the html elements to create the svg paths
            var $items = this._$items, items = [], limit = this.options.limit, //degree limit
            stroke = this.options.stroke, //stroke with
            separation = this.options.separation, //separation between arcs
            backBorder = this.options.back.border, //border of the back arc
            midBorder = this.options.mid.border, //border of the mid arc
            current = 0, //count degree
            degreesPerItem = limit / $items.length; //the degrees of each arc
            for (var itemIndex = 0, $itemsLength = $items.length; itemIndex < $itemsLength; itemIndex++) {
                var $current = $($items[itemIndex]);
                var _a = this._calculateItemArcs(current, degreesPerItem, stroke, separation, backBorder, midBorder), back = _a.back, mid = _a.mid, fill = _a.fill;
                back = $.extend(true, {}, this.options.back, back);
                mid = $.extend(true, {}, this.options.mid, mid);
                fill = $.extend(true, {}, this.options.fill, fill);
                //each arc is formed by a back arc, a middle arc and a fill arc
                var item = new ArcsItem({
                    $item: $current,
                    back: back,
                    mid: mid,
                    fill: fill,
                    disabled: this.options.lineal,
                    activated: false
                });
                items.push(item);
                current += degreesPerItem;
            }
            this._items = items;
        };
        /**
         * Calculate the position of an arc
         * @param start         Starting degree
         * @param degrees       Degrees of the arc
         * @param stroke        Width of the arc
         * @param separation    Separation between arcs. Half for each side
         * @param border        Stroke for the main border
         * @param borderMid     Stroke for the secondary border
         * @private
         */
        Arcs.prototype._calculateItemArcs = function (start, degrees, stroke, separation, border, borderMid) {
            var sideSeparation = separation / 2, midPosition = sideSeparation + border, //the mid arc position is the parent position with an offset of border
            fillPosition = midPosition + borderMid, //the fill arc position is the mid arc position with an offset of borderMid
            midStroke = stroke - (border * 2), //stroke has to be in consideration the border
            fillStroke = midStroke - (borderMid * 2);
            var back = {
                start: start + sideSeparation,
                end: start + degrees - sideSeparation,
                stroke: stroke
            };
            var mid = {
                start: start + midPosition,
                end: start + degrees - midPosition,
                stroke: midStroke
            };
            var fill = {
                start: start + fillPosition,
                end: start + degrees - fillPosition,
                stroke: fillStroke
            };
            return {
                back: back,
                mid: mid,
                fill: fill
            };
        };
        /**
         * Only works when the [[ArcsOptions.lineal]] is true
         * Update the css classes for the current item an the item before the current one
         */
        Arcs.prototype._updateCurrentItem = function () {
            if (this.options.lineal) {
                var old = this._items[this._current - 1];
                if (old) {
                    old.group.$node.removeClass(this.options.classes.current);
                    old.$item.removeClass(this.options.classes.current);
                }
                var current = this._items[this._current];
                if (current) {
                    current.group.$node.addClass(this.options.classes.current);
                    current.$item.addClass(this.options.classes.current);
                }
            }
        };
        Arcs.prototype._getCreateOptions = function () {
            var options = {
                viewBox: 200,
                limit: 360,
                stroke: 30,
                separation: 10,
                selectors: {
                    item: "[data-arcs-item]"
                },
                classes: {
                    root: "jq-arcs",
                    item: "jq-arcs__item",
                    group: "jq-arcs__group",
                    arc: "jq-arcs__arc",
                    back: "jq-arcs__arc-back",
                    mid: "jq-arcs__arc-mid",
                    fill: "jq-arcs__arc-fill",
                    disabled: "jq-arcs--disabled",
                    activating: "jq-arcs--activating",
                    activated: "jq-arcs--activated",
                    current: "jq-arcs--current"
                },
                back: {
                    color: "#000",
                    border: 2
                },
                mid: {
                    color: "#fff",
                    border: 0
                },
                fill: {
                    color: "#2196F3"
                },
                animation: {
                    duration: 800,
                    ease: "<>",
                    delay: 0
                },
                lineal: true
            };
            return options;
        };
        Arcs.prototype._draw = function () {
            //if items exists, remove it
            if (this._draws) {
                var draws = this._draws;
                for (var drawIndex = 0, drawsLength = draws.length; drawIndex < drawsLength; drawIndex++) {
                    var current = draws[drawIndex];
                    current.remove();
                }
            }
            this._draws = [];
            var items = this._items;
            //for each item
            for (var itemIndex = 0, itemsLength = items.length; itemIndex < itemsLength; itemIndex++) {
                var current = items[itemIndex], back = current.back, mid = current.mid, fill = current.fill, group = this._svg.group(); //create a svg group
                current.group = group; //store it in the item
                group.attr(//add css class
                {
                    "class": this.options.classes.group
                });
                //generate the paths
                back.d = this._describeArc(this._position, this._position, this._radius, back.start, back.end);
                mid.d = this._describeArc(this._position, this._position, this._radius, mid.start, mid.end);
                fill.d = this._describeArc(this._position, this._position, this._radius, fill.start, fill.end);
                //draw in group
                back.arc = group.path(back.d).fill("none").stroke({
                    width: back.stroke,
                    color: this.options.back.color
                }).attr({
                    "class": this.options.classes.arc + " " + this.options.classes.back
                });
                //create jquery object of the node for a easy manipulation
                back.arc.$node = $(back.arc.node);
                //mid
                mid.arc = group.path(mid.d).fill("none").stroke({
                    width: mid.stroke,
                    color: this.options.mid.color
                }).attr({
                    "class": this.options.classes.arc + " " + this.options.classes.mid
                });
                //create jquery object of the node for a easy manipulation
                mid.arc.$node = $(mid.arc.node);
                //fill
                fill.arc = group.path(fill.d).fill("none").stroke({
                    width: fill.stroke,
                    color: this.options.fill.color
                }).attr({
                    "class": this.options.classes.arc + " " + this.options.classes.fill
                });
                //create jquery object of the node for a easy manipulation
                fill.arc.$node = $(fill.arc.node);
                //@ts-ignore
                var length_1 = fill.arc.node.getTotalLength();
                //store the length of the path for animation
                fill.totalLength = length_1;
                fill.arc.attr({
                    "stroke-dasharray": length_1 + " " + length_1,
                    "stroke-dashoffset": current.activated != true ? -length_1 : 0 //if is activated set offset to 0
                });
                //assign event for activate
                group.on("click", this._onGroupClick.bind(this, itemIndex));
                group.$node = $(group.node);
                //update the disabled state
                this.setItemDisable(itemIndex, current.disabled);
                this._draws.push(group);
            }
        };
        /**
         * Invoked when a group is clicked. Set the arc as active
         * @param index Index of the arc to activate
         * @private
         */
        Arcs.prototype._onGroupClick = function (index) {
            this.activate(index);
        };
        /**
         * Convert the polar degrees to cartesian degrees
         * @param centerX
         * @param centerY
         * @param radius
         * @param angleInDegrees
         * @returns {{x: any, y: any}}
         * @private
         * @see http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
         */
        Arcs.prototype._polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {
            var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
            return {
                x: centerX + (radius * Math.cos(angleInRadians)),
                y: centerY + (radius * Math.sin(angleInRadians))
            };
        };
        /**
         * Generate the config for the arc
         * @param x
         * @param y
         * @param radius
         * @param startAngle
         * @param endAngle
         * @returns {string}
         * @private
         * @see http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
         */
        Arcs.prototype._describeArc = function (x, y, radius, startAngle, endAngle) {
            var start = this._polarToCartesian(x, y, radius, endAngle);
            var end = this._polarToCartesian(x, y, radius, startAngle);
            var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
            var d = [
                "M", start.x, start.y,
                "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
            ].join(" ");
            return d;
        };
        /**
         * Invoked when the activating animation ends
         * Updates the state and trigger the events
         * @param item
         * @param defer
         * @private
         */
        Arcs.prototype._onAnimationEnd = function (item, defer) {
            defer.resolve(item);
            item.activated = true;
            item.group.$node.removeClass(this.options.classes.activating);
            item.$item.removeClass(this.options.classes.activating);
            item.group.$node.addClass(this.options.classes.activated);
            item.$item.addClass(this.options.classes.activated);
            this._activated++;
            if (this.options.lineal) {
                this.next();
            }
            this.element.trigger(exports.ArcsEvents.activateItem, [this, item]);
            if (this._activated == this._items.length) {
                this.element.trigger(exports.ArcsEvents.complete, [this]);
            }
        };
        /**
         * Execute the activating animation for an item
         * @param item  Item to animate
         * @returns {JQueryPromise<T>}
         * @private
         */
        Arcs.prototype._animate = function (item) {
            var defer = $.Deferred();
            if (this.options.disabled != true && item && item.disabled != true) {
                this.element.trigger(exports.ArcsEvents.beforeActivateItem, [this, item]);
                item.fill.arc.animate(this.options.animation.duration, this.options.animation.ease, this.options.animation.delay)
                    .attr({
                    "stroke-dashoffset": 0
                })
                    //@ts-ignore
                    .afterAll(this._onAnimationEnd.bind(this, item, defer));
            }
            else {
                defer.rejectWith(this, [item]);
            }
            return defer.promise();
        };
        return Arcs;
    }());

    /**
     * @module jqArcs
     */ /** */
    //$.widget extends the prototype that receives, to extend the prototype all the properties must be enumerable
    //the properties of a es6 class prototype aren't enumerable so it's necessary to get the propertyNames and get the descriptor of each one
    if (Object.hasOwnProperty("getOwnPropertyDescriptors")) {
        //@ts-ignore
        var proto = {}, names = Object.getOwnPropertyNames(Arcs.prototype);
        for (var nameIndex = 0, namesLength = names.length; nameIndex < namesLength; nameIndex++) {
            var currentName = names[nameIndex];
            proto[currentName] = Object.getOwnPropertyDescriptor(Arcs.prototype, currentName).value;
        }
        $.widget("ui.arcs", proto);
    }
    else {
        $.widget("ui.arcs", Arcs.prototype);
    }

    exports.ArcsItemSvg = ArcsItemSvg;
    exports.ArcsItem = ArcsItem;
    exports.Arcs = Arcs;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
