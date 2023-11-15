const targetElement = document.getElementById("schedule-wrapper");

if (parent.postMessage && targetElement) {
    window.parent.postMessage({
        type: 'iframe:ready',
        source: "instabook-embed",
    }, '*');
}
