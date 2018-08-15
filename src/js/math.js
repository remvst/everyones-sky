const limit = (a, b, c) => {
    if (b < a) return a;
    if (b > c) return c;
    return b;
};

const rnd = (min, max) => {
    return Math.random() * (max - min) + min;
};

const dist = (a, b) => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};