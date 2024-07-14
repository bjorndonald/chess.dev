export function hasClass(el: Element, className: string) {
    if (el.classList)
        return el.classList.contains(className);
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

export function addClass(el: Element, className: string) {
    
    if (el.classList)
        el.classList.add(className)
    else if (!hasClass(el, className))
        el.className += " " + className;
    
}

export function removeClass(el: Element, className: string) {
    if (el.classList)
        el.classList.remove(className)
    else if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className = el.className.replace(reg, ' ');
    }
}

export function getChildElementIndex(node: Element) {
    return Array.prototype.indexOf.call(node.parentNode.children, node);
}

export const fade = (element: HTMLElement) => {
    return new Promise((resolve: Function) => {
        var op = 1;
        var timer = setInterval(function () {
            if (op <= 0.2) {
                clearInterval(timer);
                element.style.display = 'none';
                resolve()
            }
            element.style.opacity = op + "";
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.2;
        }, 50);
    })
}

export const unfade = (element: HTMLElement) => {
    return new Promise((resolve: Function) => {
        var op = 0.1;
        element.style.display = 'block';
        var timer = setInterval(function () {
            if (op >= 1) {
                clearInterval(timer);
                resolve()
            }
            element.style.opacity = op + "";
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op += op * 0.1;
        }, 10);
    })
}