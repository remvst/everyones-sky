let R, // canvas context
    G, // Game instance
    V, // Camera instance
    U, // Universe instance
    w = window,
    isTouch,
    mobile = navigator.userAgent.match(nomangle(/andro|ipho|ipa|ipo|windows ph/i)),
    CANVAS_WIDTH = mobile ? 700 : 1000;

let monoFont;
