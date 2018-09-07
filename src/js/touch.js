ontouchstart = e => ontouchmove(e, true);

ontouchmove = ontouchend = (e, mobileStart) => {
    e.preventDefault();

    const canvasRect = document.querySelector('canvas').getBoundingClientRect();

    w.down[32] = false;
    w.down[37] = false;
    w.down[38] = false;
    w.down[39] = false;

    for (let i = 0 ; i < e.touches.length ; i++) {
        const x = (e.touches[i].clientX - canvasRect.left) / canvasRect.width;
        const y = (e.touches[i].clientY - canvasRect.top) / canvasRect.height;
        if (y > 1 - 200 / CANVAS_HEIGHT) {
            if (x < 0.25) {
                w.down[37] = true;
            } else if (x < 0.5) {
                w.down[39] = true;
            } else if (x < 0.75) {
                w.down[32] = true;
            } else {
                w.down[38] = true;
            }
        } else if (mobileStart && y > 1 - 400 / CANVAS_HEIGHT) {
            G.selectPromptOption(~~(x / (1 / (G.promptOptions || []).length)));
        }
    }

    mobile = true;

    G.start();
};
