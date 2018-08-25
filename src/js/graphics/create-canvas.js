const createCanvas = (w, h, instructions) => {
    const can = document.createElement('canvas');
    can.width = w;
    can.height = h;

    const context = can.getContext('2d');

    instructions(context, can);

    return can;
};
