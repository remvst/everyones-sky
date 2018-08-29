onload = () => {
    onresize(); // trigger initial sizing pass

    const can = document.querySelector('canvas');
    can.width = CANVAS_WIDTH;
    can.height = CANVAS_HEIGHT;

    R = can.getContext('2d');
    
    R.font = nomangle('99pt f'); // Setting a font that obviously doesn't exist
    const reference = R.measureText(w.title);

    for (let fontName of [nomangle('Mono'), nomangle('Courier')]) {
        R.font = '99pt ' + fontName;
        const measurement = R.measureText(w.title);
        if (measurement.width != reference.width || measurement.height != reference.height) {
            monoFont = fontName;
            break;
        }
    }

    // Shortcut for all canvas methods to the main canvas
    Object.getOwnPropertyNames(p).forEach(n => {
        if (R[n] && R[n].call) {
            window[n] = p[n].bind(R);
        }
    });

    new Game();

    // Start cycle()
    let lf = Date.now();
    let frame = () => {
        let n = Date.now(),
            e = (n - lf) / 1000;

        if(DEBUG){
            G.fps = ~~(1 / e);
        }

        lf = n;

        G.cycle(e);

        requestAnimationFrame(frame);
    };
    frame();
};