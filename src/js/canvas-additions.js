const p = CanvasRenderingContext2D.prototype;

// A couple extra canvas functions
p.wrap = function(f) {
    this.save();
    f();
    this.restore();
};
p.fr = p.fillRect;