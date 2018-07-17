/**
 * @module jqArcs
 *//** */

import {ArcsOptions} from "./arcs-options";
import * as svgProxy from "svgjs";
//solve rollup error
const SVG = (<any>svgProxy).default || svgProxy;
import {ArcsItem} from "./arcs-item";
import {
    ArcsItemSvg,
    ArcsItemSvgOptions
} from "./arcs-item-svg";
import {SvgElementExtended} from "./svg-element-extended";
import {ArcsEvents} from "./arcs-events";
export class Arcs{
    /**
     * Root element of the plugin
     */
    protected element: JQuery;
    /**
     * Current options
     */
    protected options: ArcsOptions;
    protected disabled:boolean;
    protected _svg:any;
    protected _position:number;
    protected _radius:number;
    protected _$items:JQuery;
    protected _items:ArcsItem[];
    protected _activated:number = 0;
    protected _current:number = -1;
    protected _draws:SvgElementExtended[];
    /**
     * @constructor
     * @private
     */
    protected _create() {
        this.element.addClass(this.options.classes.root);
        this._svg = SVG(this.element.get(0));
        //center of the circumference
        this._position = this.options.viewBox / 2;
        this._radius = (this.options.viewBox / 2) - this.options.stroke;
        this._svg.viewbox(0, 0, this.options.viewBox, this.options.viewBox);
        this.draw(true);
    }
    /**
     * Render the component
     * @param [force=false]   Parse the items again and reset the states. By default false
     * If is false the arcs will be rendered again with the same state
     * If the [[ArcsOptions.lineal]] is true the sequence will reseted
     */
    draw(force=false){
        if(force) {
            this._findElements();
            this._extractData();
            this._activated = 0;
            this._current = -1;
        }
        this._draw();
        if (this.options.lineal) {
            if(force) {
                this.next();
            }else{
                this._updateCurrentItem();
            }
        }
    }
    /**
     * Enables the next arc
     * Only works if the [[ArcsOptions.lineal]] is true
     */
    next(){
        if(this.options.lineal){
            this._current++;
            this.setItemDisable(this._current,false);
            this._updateCurrentItem();
        }
    }
    /**
     * Change the disable state of an item
     * @param index     Index of the item to change
     * @param disabled  New state
     */
    setItemDisable(index,disabled){
        let item = this._items[index];
        if(item){
            item.disabled = disabled;
            if(disabled){
                item.group.$node.addClass(this.options.classes.disabled);
                item.$item.addClass(this.options.classes.disabled);
            }else{
                item.group.$node.removeClass(this.options.classes.disabled);
                item.$item.removeClass(this.options.classes.disabled);
            }
        }
    }
    /**
     * Enable an item
     * @param index Index of the item to enable
     */
    enableItem(index:number){
        this.setItemDisable(index,false);
    }
    /**
     * Disable an item
     * @param index Index of the item to disable
     */
    disableItem(index:number){
        this.setItemDisable(index,true);
    }
    enable(){
        //Call to jquery widget super
        //@ts-ignore
        if(this._super){
            //@ts-ignore
            this._super();
        }
        this.element.removeClass(this.options.classes.disabled);
    }
    disable(){
        //Call to jquery widget super
        //@ts-ignore
        if(this._super){
            //@ts-ignore
            this._super();
        }
        this.element.addClass(this.options.classes.disabled);
    }
    /**
     * Set an item as active if the component is enabled and the item is also enabled
     * @param index Index of the item to activate
     * @returns {JQueryPromise<T>}
     */
    activate(index:number){
        if(this.options.disabled != true) {
            let item = this._items[index];
            if (item && item.disabled != true) {
                item.group.$node.addClass(this.options.classes.activating);
                item.$item.addClass(this.options.classes.activating);
                item.group.off("click",this._onGroupClick);
                return this._animate(item);
            }
        }
    }
    protected _findElements() {
        this._$items = this.element.find(this.options.selectors.item);
        this._$items.addClass(this.options.classes.item);
    }
    /**
     * Analize the items and generate the structure for the arcs
     * @private
     */
    protected _extractData() {
        //parse the html elements to create the svg paths
        let $items = this._$items,
            items: ArcsItem[] = [],
            limit = this.options.limit,//degree limit
            stroke = this.options.stroke,//stroke with
            separation = this.options.separation,//separation between arcs
            backBorder = this.options.back.border,//border of the back arc
            midBorder = this.options.mid.border,//border of the mid arc
            current = 0,//count degree
            degreesPerItem = limit / $items.length;//the degrees of each arc
        for (let itemIndex = 0, $itemsLength = $items.length; itemIndex < $itemsLength; itemIndex++) {
            let $current = $($items[itemIndex]);
            let {back, mid, fill} = this._calculateItemArcs(current, degreesPerItem, stroke,separation,backBorder,midBorder);
            back = $.extend(true,{},this.options.back,back);
            mid = $.extend(true,{},this.options.mid,mid);
            fill = $.extend(true,{},this.options.fill,fill);
            //each arc is formed by a back arc, a middle arc and a fill arc
            let item: ArcsItem = new ArcsItem({
                $item: $current,
                back:back,
                mid:mid,
                fill:fill,
                disabled:this.options.lineal,
                activated:false
            });
            items.push(item);
            current+=degreesPerItem;
        }
        this._items = items;
    }
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
    protected _calculateItemArcs(start, degrees, stroke, separation, border, borderMid):{back:ArcsItemSvgOptions,mid:ArcsItemSvgOptions,fill:ArcsItemSvgOptions} {
        let sideSeparation = separation/2,
            midPosition  = sideSeparation+border,//the mid arc position is the parent position with an offset of border
            fillPosition = midPosition+borderMid,//the fill arc position is the mid arc position with an offset of borderMid
            midStroke = stroke-(border*2),//stroke has to be in consideration the border
            fillStroke = midStroke - (borderMid*2);
        let back:ArcsItemSvgOptions = {
            start: start + sideSeparation,//start degree
            end: start + degrees - sideSeparation,//end degree, start degree + amount of degrees - the separation
            stroke: stroke
        };
        let mid:ArcsItemSvgOptions = {
            start: start + midPosition,//start degree
            end: start + degrees - midPosition,
            stroke: midStroke
        };
        let fill:ArcsItemSvgOptions = {
            start: start + fillPosition,
            end: start + degrees - fillPosition,
            stroke: fillStroke
        };
        return {
            back: back,
            mid: mid,
            fill: fill
        };
    }
    /**
     * Only works when the [[ArcsOptions.lineal]] is true
     * Update the css classes for the current item an the item before the current one
     */
    protected _updateCurrentItem(){
        if(this.options.lineal) {
            let old = this._items[this._current - 1];
            if (old) {
                old.group.$node.removeClass(this.options.classes.current);
                old.$item.removeClass(this.options.classes.current);
            }
            let current = this._items[this._current];
            if (current) {
                current.group.$node.addClass(this.options.classes.current);
                current.$item.addClass(this.options.classes.current);
            }
        }
    }

    protected _getCreateOptions(){
        let options:ArcsOptions={
            viewBox: 200,
            limit: 360,
            stroke: 30,
            separation:10,
            selectors:{
                item:"[data-arcs-item]"
            },
            classes:{
                root:"jq-arcs",
                item:"jq-arcs__item",
                group:"jq-arcs__group",
                arc:"jq-arcs__arc",
                back:"jq-arcs__arc-back",
                mid:"jq-arcs__arc-mid",
                fill:"jq-arcs__arc-fill",
                disabled:"jq-arcs--disabled",
                activating:"jq-arcs--activating",
                activated:"jq-arcs--activated",
                current:"jq-arcs--current"
            },
            back: {//config for back arc
                color: "#000",
                border:2
            },
            mid: {//config for middle arc
                color: "#fff",
                border:0
            },
            fill: {//config for fill arc
                color: "#2196F3"
            },
            animation:{//animation config
                duration:800,
                ease:"<>",//easeInOut
                delay:0
            },
            lineal:true
        };
        return options;
    }
    protected _draw(){
        //if items exists, remove it
        if (this._draws) {
            let draws:SvgElementExtended[] = this._draws;
            for (let drawIndex = 0, drawsLength = draws.length; drawIndex < drawsLength; drawIndex++) {
                let current = draws[drawIndex];
                current.remove()
            }
        }
        this._draws = [];
        let items = this._items;
        //for each item
        for (let itemIndex = 0, itemsLength = items.length; itemIndex < itemsLength; itemIndex++) {
            let current: ArcsItem = items[itemIndex],
                {back,mid,fill} = current,
                group = this._svg.group();//create a svg group
            current.group = group;//store it in the item
            group.attr(//add css class
                {
                    class:this.options.classes.group
                }
            );
            //generate the paths
            back.d = this._describeArc(this._position, this._position, this._radius,back.start,back.end);
            mid.d = this._describeArc(this._position, this._position, this._radius,mid.start,mid.end);
            fill.d = this._describeArc(this._position, this._position, this._radius,fill.start,fill.end);
            //draw in group
            back.arc = group.path(back.d).fill("none").stroke(
                {
                    width:back.stroke,
                    color:this.options.back.color
                }
            ).attr(
                {
                    class:this.options.classes.arc+" "+this.options.classes.back
                }
            );
            //create jquery object of the node for a easy manipulation
            back.arc.$node = $(back.arc.node);
            //mid
            mid.arc = group.path(mid.d).fill("none").stroke(
                {
                    width:mid.stroke,
                    color:this.options.mid.color
                }
            ).attr(
                {
                    class:this.options.classes.arc+" "+this.options.classes.mid
                }
            );
            //create jquery object of the node for a easy manipulation
            mid.arc.$node = $(mid.arc.node);
            //fill
            fill.arc = group.path(fill.d).fill("none").stroke(
                {
                    width:fill.stroke,
                    color:this.options.fill.color
                }
            ).attr(
                {
                    class:this.options.classes.arc+" "+this.options.classes.fill
                }
            );
            //create jquery object of the node for a easy manipulation
            fill.arc.$node = $(fill.arc.node);
            //@ts-ignore
            let length = fill.arc.node.getTotalLength();
            //store the length of the path for animation
            fill.totalLength = length;
            fill.arc.attr(
                {
                    "stroke-dasharray": length+" "+length,
                    "stroke-dashoffset": current.activated != true ? -length: 0//if is activated set offset to 0
                }
            );
            //assign event for activate
            group.on("click",this._onGroupClick.bind(this,itemIndex));
            group.$node = $(group.node);
            //update the disabled state
            this.setItemDisable(itemIndex,current.disabled);
            this._draws.push(group);
        }
    }
    /**
     * Invoked when a group is clicked. Set the arc as active
     * @param index Index of the arc to activate
     * @private
     */
    protected _onGroupClick(index:number){
        this.activate(index);
    }
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
    protected _polarToCartesian (centerX, centerY, radius, angleInDegrees) {
        let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }
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
    protected _describeArc(x, y, radius, startAngle, endAngle){
        let start = this._polarToCartesian(x, y, radius, endAngle);
        let end = this._polarToCartesian(x, y, radius, startAngle);

        let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        let d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
        return d;
    }
    /**
     * Invoked when the activating animation ends
     * Updates the state and trigger the events
     * @param item
     * @param defer
     * @private
     */
    protected _onAnimationEnd(item:ArcsItem,defer:JQuery.Deferred<ArcsItem>){
        defer.resolve(item);
        item.activated = true;
        item.group.$node.removeClass(this.options.classes.activating);
        item.$item.removeClass(this.options.classes.activating);
        item.group.$node.addClass(this.options.classes.activated);
        item.$item.addClass(this.options.classes.activated);
        this._activated++;
        if(this.options.lineal){
            this.next();
        }
        this.element.trigger(ArcsEvents.activateItem,[this,item]);
        if(this._activated == this._items.length){
            this.element.trigger(ArcsEvents.complete,[this]);
        }
    }
    /**
     * Execute the activating animation for an item
     * @param item  Item to animate
     * @returns {JQueryPromise<T>}
     * @private
     */
    protected _animate(item:ArcsItem) {
        let defer = $.Deferred();
        if (this.options.disabled != true && item && item.disabled != true) {
            this.element.trigger(ArcsEvents.beforeActivateItem,[this,item]);
            item.fill.arc.animate(
                this.options.animation.duration,
                this.options.animation.ease,
                this.options.animation.delay
            )
                .attr(
                    {
                        "stroke-dashoffset": 0
                    }
                )
                //@ts-ignore
                .afterAll(this._onAnimationEnd.bind(this, item, defer));
        }else{
            defer.rejectWith(this,[item]);
        }
        return defer.promise();
    }
}