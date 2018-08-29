const createCanvas = (w, h, instructions) => {
    const can = document.createElement('canvas');
    can.width = w;
    can.height = h;

    const ctx = can.getContext('2d');

    instructions(ctx, can);

    return can;
};
