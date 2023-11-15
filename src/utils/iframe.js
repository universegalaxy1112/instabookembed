const setClassName = (el, className) => el.className = className;

const addClass = (el, className) => el.classList.add(className);

const appendChild = (parent, child) => parent.appendChild(child);

const setAttribute = (el, attrKey, attrValue) => {
    el.setAttribute(attrKey, attrValue);
};

const setIframeAttributes = (iframe, attrs) => {
    for(const key in attrs)
        setAttribute(iframe, key, attrs[key]);
};

const removeIframe = (_iframe) => {
    _iframe.remove();
};
