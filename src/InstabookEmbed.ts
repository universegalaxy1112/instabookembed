import { EmbedOption, EmbedParams, EventCallbacks, EventType, EventDataMap, IframeResizeType } from "./types/common";
import { debounce } from "./utils/common";

const InstabookSource = "instabook-embed";

const loaderStyle = document.createElement("style");
loaderStyle.textContent = `
            .ib-iframe-loader {
                position: absolute;
                display: none;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
            }
            .ib-iframe-container {
                transition: height 0.5s ease;
            }
        `;
document.head.appendChild(loaderStyle);

export default class InstabookEmbed extends EventTarget {

    iframe: HTMLIFrameElement | undefined;
    iframeContainer: HTMLElement | null;
    loaderElement?: HTMLElement | null;
    iframeId: string;
    options: EmbedOption;
    private isReady = false;
    eventCallbacks: EventCallbacks = {};
    customStyles: HTMLStyleElement | null = null;

    constructor(options: EmbedOption) {
        super();
        this.handleMessage = this.handleMessage.bind(this);
        if (!options) {
            throw Error('Options required');
        }
        const { id } = options;
        if (!id) {
            throw Error('container id is required');
        }
        if (!options.businessID) {
            throw Error('business id is required');
        }
        this.iframeContainer = document.getElementById(id);
        if (!this.iframeContainer) {
            throw Error('Container does not exist');
        }
        this.iframeId = id;
        options.mode = options.mode || 'live';

        this.options = options;
        // Create the iframe
        this.createIframe(options.embedParams);
    }


    // Register callback for a specific event type
    on<T extends EventType>(eventType: T, callback: (eventData?: EventDataMap[T]) => void) {
        this.eventCallbacks[eventType] = [callback];
    }

    // Remove an event listener for a specific event type
    removeEventListener<T extends EventType>(eventType: T, callback: (data: EventDataMap[T]) => void) {
        const callbacks = this.eventCallbacks[eventType];
        if (callbacks) {
            this.eventCallbacks[eventType] = callbacks.filter(cb => cb !== callback);
        }
    }

    addEventListener<T extends EventType>(eventType: T, callback: (data: EventDataMap[T]) => void) {
        if (!this.eventCallbacks[eventType]) {
            this.eventCallbacks[eventType] = [];
        }
        this.eventCallbacks[eventType]?.push(callback);
    }

    private triggerEvent<T extends EventType>(eventType: T, eventData?: EventDataMap[T]) {
        if (this.isReady) {
            const callbacks = this.eventCallbacks[eventType] || [];
            callbacks.forEach(callback => callback(eventData));
        }
    }

    // Stop the video
    reload () {
        this.sendMessage("reload", null);
    }

    // Get video duration
    getSomething () {
        return 1;
    }

    // Send a message to the iframe
    sendMessage (message: string, data: any) {
        if (!this.isReady) {
            return;
        }
        const jsonData = data === null ? "" : data;
        const messageObject = {
            msg: message,
            source: InstabookSource,
            id: this.iframeId,
            data: jsonData
        };
        if (this.iframe && this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage(messageObject, "https://instabook.io");
        } else {
            throw Error('Iframe did not load the content');
        }
    }

// Event handler for messages
    private handleMessage (event: MessageEvent) {
        if (!this.isReady) {
            return;
        }
        try {
            const eventData = event.data;

            if (
                event.source === this.iframe?.contentWindow &&
                eventData.source === InstabookSource &&
                event.origin === 'https://instabook.io'
            ) {
                const eventType = eventData.type;
                switch (eventType) {
                    case "iframe:ready":
                        this.onReady();
                        break;
                    case "iframe:error":
                        this.onError(eventData.data);
                        break;
                    case "iframe:resize":
                        this.onResize(eventData.data);
                        break;
                }
            }
        } catch (error) {
            // Handle message parsing error
        }
    }
    buildQueryString (params?: EmbedParams) {
        let queryString = "";
        if (params) {
            for (const key in params) {
                queryString += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
            }
        }
        return queryString;
    }

    private onResize (data: IframeResizeType) {
        this.triggerEvent(EventType.IFRAME_RESIZE, data);
        if (this.options.fitContent) {
            debounce(300, (data: IframeResizeType) => {
                if (this.isReady && this.iframeContainer && this.options.fitContent) {
                    this.iframeContainer.style.height = `${data.height + 150}px`
                }
            })(data);
        }
    }

    private onReady () {
        this.triggerEvent(EventType.EMBED_IFRAME_READY);
        if (this.loaderElement) {
            this.loaderElement.style.display = 'none';
        }
    }

    private onLoad () {
        this.triggerEvent(EventType.IFRAME_LOAD);
        if (this.loaderElement) {
            this.loaderElement.style.display = 'none';
        }
    }

    private onError (e: any) {
        this.triggerEvent(EventType.IFRAME_ERROR, e);
        if (this.loaderElement) {
            this.loaderElement.style.display = 'none';
        }
    }

    // Create the iframe
    private createIframe (embedParams?: EmbedParams) {

        if (!this.iframeContainer) {
            throw Error('Container does not exist');
        }
        let origin = "".concat(location.protocol, "//").concat(location.hostname);
        if (location.port) {
            origin += ":".concat(location.port);
        }

        const baseUrl = this.options.mode === 'test' ? 'https://instabook.io/version-test/e1/' : 'https://instabook.io/e1/';

        const embedUrl =
            baseUrl +
            this.options.businessID +
            "?remoteEmbed=true&remoteHost=" +
            encodeURIComponent(origin) +
            this.buildQueryString(embedParams);

        // Create the iframe element
        this.iframe = document.createElement("iframe");
        this.iframe.src = embedUrl;
        this.iframe.allow = "fullscreen";
        this.iframe.scrolling = this.options.fitContent ? 'no' : 'yes';
        this.iframe.setAttribute("style", "width: 100%; height: 100%; border: 0px;")

        this.iframeContainer.classList.add('ib-iframe-container');
        this.iframeContainer.appendChild(this.iframe);
        this.loaderElement = this.iframeContainer.querySelector('.ib-iframe-loader') as HTMLElement;

        if (this.options.showLoader && this.loaderElement) {
            this.loaderElement.style.display = 'block';
        }
        this.iframe.onload = this.onLoad.bind(this);
        this.iframe.onerror = this.onError.bind(this);
        this.isReady = true;
        // Add message event listener
        window.removeEventListener("message", this.handleMessage, false);
        window.addEventListener("message", this.handleMessage, false);
    }

    reset() {
        if (!this.isReady) {
            return;
        }
        if (this.iframeContainer && this.iframe) {
            // Remove iframe from the container
            this.iframeContainer.removeChild(this.iframe);
            this.iframeContainer.classList.remove('ib-iframe-container');
            this.iframe = undefined;
        }

        if (this.customStyles) {
            // Remove the custom styles when destroying
            this.customStyles.remove();
            this.customStyles = null;
        }

        if (this.loaderElement) {
            this.loaderElement.style.display = 'none';
        }

        // Remove message event listener
        window.removeEventListener("message", this.handleMessage, false);

        // Reset event callbacks
        this.eventCallbacks = {};
        this.isReady = false;

    }
}
