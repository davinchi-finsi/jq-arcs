/**
 * @module jqArcs
 *//** */
import * as SVG from "svgjs";
import {ArcsItemSvg,ArcsItemSvgOptions} from "./arcs-item-svg";
import {SvgElementExtended} from "./svg-element-extended";
/**
 * Options for the constructor of [[ArcsItem]]
 */
export interface ArcsItemOptions{
    /**
     * JQuery element for the item
     */
    $item?: JQuery;
    /**
     * Back svg item
     */
    back?: ArcsItemSvg | ArcsItemSvgOptions;
    /**
     * Mid svg item
     */
    mid?: ArcsItemSvg | ArcsItemSvgOptions;
    /**
     * Fill svg item
     */
    fill?: ArcsItemSvg | ArcsItemSvgOptions;
    /**
     * Group item
     */
    group?:SvgElementExtended;
    /**
     * The item is disabled
     */
    disabled?:boolean;
    /**
     * The item is activated
     */
    activated?:boolean;
}
/**
 * Represents an item
 */
export class ArcsItem {
    /**
     * JQuery element for the item
     */
    $item: JQuery;
    /**
     * Back svg item
     */
    back: ArcsItemSvg;
    /**
     * Mid svg item
     */
    mid: ArcsItemSvg;
    /**
     * Fill svg item
     */
    fill: ArcsItemSvg;
    /**
     * Group item
     */
    group:SvgElementExtended;
    /**
     * The item is disabled
     */
    disabled:boolean;
    /**
     * The item is activated
     */
    activated:boolean;
    constructor(params:ArcsItemOptions={}){
        if(params.$item != undefined){
            this.$item = params.$item;
        }
        if(params.back != undefined){
            if(params.back instanceof ArcsItemSvg){
                this.back = params.back;
            }else{
                this.back = new ArcsItemSvg(params.back);
            }
        }
        if(params.mid != undefined){
            if(params.mid instanceof ArcsItemSvg){
                this.mid = params.mid;
            }else{
                this.mid = new ArcsItemSvg(params.mid);
            }
        }
        if(params.fill != undefined){
            if(params.fill instanceof ArcsItemSvg){
                this.fill = params.fill;
            }else{
                this.fill = new ArcsItemSvg(params.fill);
            }
        }
        if(params.group != undefined){
            this.group = params.group;
        }
        if(params.disabled != undefined){
            this.disabled = params.disabled;
        }
        if(params.activated != undefined){
            this.activated = params.activated;
        }
    }
}