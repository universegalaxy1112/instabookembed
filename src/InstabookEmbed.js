import { EventType } from "./types/common";
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
                z-index: 1;
            }
            .ib-iframe-container {
                transition: height 0.5s ease;
                position: relative;
                min-height: 100%;
            }
        `;
document.head.appendChild(loaderStyle);
export default class InstabookEmbed extends EventTarget {
    constructor(options) {
        super();
        this.isReady = false;
        this.eventCallbacks = {};
        this.customStyles = null;
        this.handleMessage = this.handleMessage.bind(this);
        this.init = this.init.bind(this);
        this.reload = this.reload.bind(this);
        this.addEventListener = this.addEventListener.bind(this);
        this.removeEventListener = this.removeEventListener.bind(this);
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
        options.version = options.version || 'live';
        this.options = options;
    }
    init() {
        // Create the iframe
        this.createIframe(this.options.embedParams);
    }
    // Register callback for a specific event type
    on(eventType, callback) {
        this.eventCallbacks[eventType] = [callback];
    }
    // Remove an event listener for a specific event type
    removeEventListener(eventType, callback) {
        const callbacks = this.eventCallbacks[eventType];
        if (callbacks) {
            this.eventCallbacks[eventType] = callbacks.filter(cb => cb !== callback);
        }
    }
    addEventListener(eventType, callback) {
        if (!this.eventCallbacks[eventType]) {
            this.eventCallbacks[eventType] = [];
        }
        this.eventCallbacks[eventType]?.push(callback);
    }
    triggerEvent(eventType, eventData) {
        if (this.isReady) {
            const callbacks = this.eventCallbacks[eventType] || [];
            callbacks.forEach(callback => callback(eventData));
        }
    }
    // Stop the video
    reload() {
        this.sendMessage("reload", null);
    }
    // Get video duration
    getSomething() {
        return 1;
    }
    // Send a message to the iframe
    sendMessage(message, data) {
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
        }
        else {
            throw Error('Iframe did not load the content');
        }
    }
    // Event handler for messages
    handleMessage(event) {
        if (!this.isReady) {
            return;
        }
        try {
            const eventData = event.data;
            if (event.source === this.iframe?.contentWindow &&
                eventData.source === InstabookSource &&
                event.origin === 'https://instabook.io') {
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
        }
        catch (error) {
            // Handle message parsing error
        }
    }
    buildQueryString(params) {
        let queryString = "";
        if (params) {
            for (const key in params) {
                queryString += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
            }
        }
        return queryString;
    }
    onResize(data) {
        this.triggerEvent(EventType.IFRAME_RESIZE, data);
        if (this.options.fitContent) {
            debounce(300, (data) => {
                if (this.isReady && this.iframeContainer && this.options.fitContent) {
                    this.iframeContainer.style.height = `${data.height + 80}px`;
                }
            })(data);
        }
    }
    onReady() {
        this.triggerEvent(EventType.EMBED_IFRAME_READY);
        if (this.loaderElement) {
            this.loaderElement.style.display = 'none';
        }
    }
    onLoad() {
        this.triggerEvent(EventType.IFRAME_LOAD);
        if (this.loaderElement) {
            this.loaderElement.style.display = 'none';
        }
    }
    onError(e) {
        this.triggerEvent(EventType.IFRAME_ERROR, e);
        if (this.loaderElement) {
            this.loaderElement.style.display = 'none';
        }
    }
    // Create the iframe
    createIframe(embedParams) {
        if (!this.iframeContainer) {
            throw Error('Container does not exist');
        }
        let origin = "".concat(location.protocol, "//").concat(location.hostname);
        if (location.port) {
            origin += ":".concat(location.port);
        }
        const baseUrl = this.options.version === 'live' ? 'https://instabook.io/e1/' : `https://instabook.io/version-${this.options.version}/e1/`;
        const embedUrl = baseUrl +
            this.options.businessID +
            "?remoteEmbed=true&remoteHost=" +
            encodeURIComponent(origin) +
            this.buildQueryString(embedParams);
        // Create the iframe element
        this.iframe = document.createElement("iframe");
        this.iframe.src = embedUrl;
        this.iframe.allow = "fullscreen";
        this.iframe.scrolling = this.options.fitContent ? 'no' : 'yes';
        this.iframe.setAttribute("style", "width: 100%; height: 100%; border: 0px; position: absolute;");
        this.iframeContainer.classList.add('ib-iframe-container');
        this.iframeContainer.appendChild(this.iframe);
        this.loaderElement = this.iframeContainer.querySelector('.ib-iframe-loader');
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
//# sourceMappingURL=InstabookEmbed.js.map