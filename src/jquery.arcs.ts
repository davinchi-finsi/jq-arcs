/**
 * @module jqArcs
 *//** */
import {Arcs} from "./arcs";
//$.widget extends the prototype that receives, to extend the prototype all the properties must be enumerable
//the properties of a es6 class prototype aren't enumerable so it's necessary to get the propertyNames and get the descriptor of each one
if(Object.hasOwnProperty("getOwnPropertyDescriptors")){
    //@ts-ignore
    let proto = {},
        names = Object.getOwnPropertyNames(Arcs.prototype);
    for (let nameIndex = 0, namesLength = names.length; nameIndex < namesLength; nameIndex++) {
        let currentName = names[nameIndex];
        proto[currentName]=Object.getOwnPropertyDescriptor(Arcs.prototype,currentName).value
    }
    $.widget("ui.arcs", proto);
}else {
    $.widget("ui.arcs", Arcs.prototype);
}