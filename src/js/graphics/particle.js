function particle(size, color, interpolations, render) {
    let p;

    // Add to the list of particles
    U.particles.push(p = {
        size: size,
        color: color,
        alpha: 1,
        render: () => wrap(() => {
            if (render) {
                if (DEBUG) {
                    G.renderedParticles++;
                }
                return render(p);
            }

            if (!V.isVisible(p.x, p.y, p.size)) {
                return;
            }

            if (DEBUG) {
                G.renderedParticles++;
            }

            R.globalAlpha = p.alpha;
            fs(p.color);
            beginPath();
            arc(p.x, p.y, p.size / 2, 0, PI * 2);
            fill();
            // fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        })
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
