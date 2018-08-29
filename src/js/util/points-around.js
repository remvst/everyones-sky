function pointsAround(center, radiuses) {
    const pts = [];

    const circles = [];
    radiuses.forEach(radius => {
        const circle = [];
        circles.push(circle);

        for (let i = 0 ; i < 6 ; i++) {
            const angle = PI * 2 * (i / 6);
            const pt = {
                'x': cos(angle) * radius + center.x,
                'y': sin(angle) * radius + center.y,
                'neighbors': []
            };
            pts.push(pt);

            circle.push(pt);
        }
    });

    circles.forEach((circle, circleIndex) => {
        circle.forEach((pt, ptIndex) => {
            // Link within the same circle
            const circleNeighbor = circle[(ptIndex + 1) % circle.length];
            pt.neighbors.push(circleNeighbor);
            circleNeighbor.neighbors.push(pt);

            // Link between circles
            const radiusNeighbor = circles[(circleIndex + 1) % circles.length][ptIndex];
            pt.neighbors.push(radiusNeighbor);
            radiusNeighbor.neighbors.push(pt);
        });
    });

    return pts;
}
