const createCanvas = (w, h, instructions) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;

    const context = canvas.getContext('2d');

    instructions(context, canvas);

    return canvas;
};
