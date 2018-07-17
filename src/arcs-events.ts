/**
 * @module jqArcs
 *//** */
export interface ArcsActivateItemEvent{

}
export enum ArcsEvents{
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
    beforeActivateItem="arcs:beforeActivateItem",
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
    activateItem="arcs:activateItem",
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
    complete="arcs:complete"
}