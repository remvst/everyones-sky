function particle(size, color, interpolations) {
    let p;

    // Add to the list of particles
    U.particles.push(p = {
        size: size,
        color: color,
        alpha: 1,
        render: () => {
            if (!V.contains(this.x, this.y, this.size)) {
                return;
            }

            G.renderedParticles++;

            wrap(() => {
                R.globalAlpha = p.alpha;
                R.fillStyle = p.color;
                beginPath();
                arc(p.x, p.y, p.size / 2, 0, PI * 2);
                fill();
                // fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            });
        }
    });

    // Interpolations
    interpolations.forEach((a, id) => {
        const args = [p].concat(a);

        // Add the remove callback to the first interpolation
        if (!id) {
            args[7] = () => U.remove(U.particles, p);
        }

        // Apply the interpolation
        interp.apply(0, args);
    });
}
