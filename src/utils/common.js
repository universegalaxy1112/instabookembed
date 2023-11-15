export function debounce(wait, callback, immediate = false) {
    // This is a number in the browser and an object in Node.js,
    // so we'll use the ReturnType utility to cover both cases.
    let timeout;
    return function (...args) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const context = this;
        const later = () => {
            timeout = null;
            if (!immediate) {
                callback.apply(context, args);
            }
        };
        const callNow = immediate && !timeout;
        if (typeof timeout === "number") {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
        if (callNow) {
            callback.apply(context, args);
        }
    };
}
//# sourceMappingURL=common.js.map