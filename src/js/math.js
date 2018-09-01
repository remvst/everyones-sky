limit = (a, b, c) => {
    if (b < a) return a;
    if (b > c) return c;
    return b;
};

between = (a, b, c) => {
    return b >= a && b <= c;
};

rnd = (min, max) => {
    return random() * (max - min) + min;
};

pick = a => {
    return a[~~(random() * a.length)];
};

distP = (x1, y1, x2, y2) => {
    return sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
};

dist = (a, b) => {
    return distP(a.x, a.y, b.x, b.y);
};

sign = x => {
    return x < 0 ? -1 : (x > 0 ? 1 : 0);
};

// Modulo centered around zero: the result will be between -y and +y
moduloWithNegative = (x, y) => {
    x = x % (y * 2);
    if (x > y) {
        x -= y * 2;
    }
    if (x < -y) {
        x += y * 2;
    }
    return x;
};

normalize = x => {
    // Possibly faster version but definitely smaller
    moduloWithNegative(x, PI);
    // while (x < -PI) x += PI * 2;
    // while (x > PI) x -= PI * 2;
    // return x;
};

angleBetween = (a, b) => {
    return atan2(b.y - a.y, b.x - a.x);
};

// Make Math global
const m = Math;
Object.getOwnPropertyNames(m).forEach(n => w[n] = w[n] || m[n]);
