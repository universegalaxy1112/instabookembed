export interface EmbedParams {
    [key: string]: any
}

export interface EmbedOption {
    id: string;
    businessID: string;
    fitContent?: boolean;
    showLoader?: boolean;
    locale?: string;
    appearance?: string;
    customCSS?: string | string[];
    embedParams?: EmbedParams;
}

// Define event types
export enum EventType {
    IFRAME_LOAD = "iframe:load",
    EMBED_IFRAME_READY = "iframe:ready",
    IFRAME_ERROR = "iframe:error",
    IFRAME_RESIZE = "iframe:resize",
}

export interface IframeResizeType {
    height: number;
}

export interface EventDataMap {
    [EventType.EMBED_IFRAME_READY]?: any;
    [EventType.IFRAME_ERROR]?: any;
    [EventType.IFRAME_LOAD]?: any;
    [EventType.IFRAME_RESIZE]?: IframeResizeType;
}
// Define callback interface
// Define callback interface based on event data
export type EventCallbacks = {
    [K in keyof EventDataMap]?: ((data: EventDataMap[K]) => void)[];
};
