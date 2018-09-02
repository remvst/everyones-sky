ontouchstart = ontouchmove = ontouchend = e => {
    e.preventDefault();

    const canvasRect = document.querySelector('canvas').getBoundingClientRect();

    w.down[32] = false;
    w.down[37] = false;
    w.down[38] = false;
    w.down[39] = false;

    for (let i = 0 ; i < e.touches.length ; i++) {
        const x = (e.touches[i].clientX - canvasRect.left) / canvasRect.width;

        if (x < 0.25) {
            w.down[37] = true;
        } else if (x < 0.5) {
            w.down[39] = true;
        } else if (x < 0.75) {
            w.down[32] = true;
        } else {
            w.down[38] = true;
        }
    }

    isTouch = true;

    G.start();
};
