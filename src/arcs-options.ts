/**
 * @module jqArcs
 *//** */
export interface ArcsOptions{
    viewBox?: number;
    limit?: number;
    stroke?:number;
    separation?:number;
    selectors?:{
        item?:string
    },
    classes?:{
        root?:string;
        item?:string;
        group?:string;
        arc?:string;
        back?:string;
        mid?:string;
        fill?:string;
        disabled?:string;
        activating?:string;
        activated?:string;
        current?:string;
    };
    back?: {//config for back arc
        color?: string;
        border?:number;
    };
    mid?: {//config for middle arc
        color?: string;
        border?:number;
    };
    fill?: {//config for fill arc
        color?: string;
    };
    animation?:{//animation config
        duration?:number;
        ease?:string;
        delay?:number;
    };
    lineal?:boolean;
    disabled?:boolean;
}