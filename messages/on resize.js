const targetElement = document.getElementById("schedule-wrapper");

let prevHeight = targetElement?.scrollHeight;

// Notify parent about size changes
function notifySizeChange() {
    if (parent.postMessage) {
        const {scrollHeight} = targetElement;

        if (prevHeight !== scrollHeight) {
            prevHeight = scrollHeight;
            window.parent.postMessage({
                type: 'iframe:resize',
                source: "instabook-embed",
                data: {height: scrollHeight}
            }, '*');
        }
    }
}

// Use MutationObserver to detect changes in the target element
const observer = new MutationObserver(() => {
    notifySizeChange();
});

// Observe changes in attributes and content
observer.observe(targetElement, { attributes: true, childList: true });

// Initial notification
notifySizeChange();
