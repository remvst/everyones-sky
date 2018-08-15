const createPattern = (w, h, instructions) => {
    const canvas = createCanvas(w, h, instructions);
    return canvas.getContext('2d').createPattern(canvas, 'repeat');
};
