let R, // canvas context
    G, // Game instance
    V, // Camera instance
    U, // Universe instance
    w = window,
    isTouch,
    mobile = navigator.userAgent.match(nomangle(/andro|ipho|ipa|ipo|windows ph/i)),
    CANVAS_HEIGHT = mobile ? 1400 : 1000;

let monoFont;
