const limit = (a, b, c) => {
    if (b < a) return a;
    if (b > c) return c;
    return b;
};

const rnd = (min, max) => {
    return Math.random() * (max - min) + min;
};

const distP = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

const dist = (a, b) => {
    return distP(a.x, a.y, b.x, b.y);
};