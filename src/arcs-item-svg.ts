/**
 * @module jqArcs
 *//* */
import * as SVG from "svgjs";
import {SvgElementExtended} from "./svg-element-extended";

/**
 * Options for the constructor of [[ArcsItemSvg]]
 */
export interface ArcsItemSvgOptions{
    /**
     * Color for the item. Must be a hex
     */
    color?: string;
    /**
     * Degree where to start
     */
    start?: number;
    /**
     * Degree where to end
     */
    end?: number;
    /**
     * Stroke width
     */
    stroke?: number;
    d?:string;
    /**
     * Svg element
     */
    arc?:SvgElementExtended;
    /**
     * Total length
     */
    totalLength?;
}
/**
 * Represents the svg of an item
 */
export class ArcsItemSvg {
    /**
     * Color for the item. Must be a hex
     */
    color: string;
    /**
     * Degree where to start
     */
    start: number;
    /**
     * Degree where to end
     */
    end: number;
    /**
     * Stroke width
     */
    stroke: number;
    d?:string;
    /**
     * Svg element
     */
    arc:SvgElementExtended;
    /**
     * Total length
     */
    totalLength;
    constructor(params:ArcsItemSvgOptions={}){
        if(params.color != undefined){
            this.color = params.color;
        }
        if(params.start != undefined){
            this.start = params.start;
        }
        if(params.end != undefined){
            this.end = params.end;
        }
        if(params.stroke != undefined){
            this.stroke = params.stroke;
        }
        if(params.d != undefined){
            this.d = params.d;
        }
        if(params.arc != undefined){
            this.arc = params.arc;
        }
        if(params.totalLength != undefined){
            this.totalLength = params.totalLength;
        }
    }
}