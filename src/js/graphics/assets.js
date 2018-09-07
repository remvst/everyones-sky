renderResourcesIcon = () => {
    beginPath(); arc(0, -12, 15, 0, TWO_PI); fill();
    beginPath(); arc(12, 12, 15, 0, TWO_PI); fill();
    beginPath(); arc(-12, 12, 15, 0, TWO_PI); fill();
};

haloAround = (asset, haloRadius, colorStart, colorEnd) => {
    return createCanvas(asset.width + haloRadius * 2, asset.height + haloRadius * 2, (r, can) => {
        const gradient = r.createRadialGradient(can.width / 2, can.height / 2, asset.width / 2, can.width / 2, can.height / 2, asset.width / 2 + haloRadius);
        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(1, colorEnd);

        r.fs(gradient);
        r.fr(0, 0, can.width, can.height);

        try { r.drawImage(asset, haloRadius, haloRadius); } catch(e) {}
    });
};
