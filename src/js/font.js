function stickString(string, charSpacing) {
    const absoluteSegments = [];

    let characterX = 0;
    let width;
    string.split('').forEach(character => {
        const charSegments = characterSettings[character] || [];

        let nextX = characterX;
        charSegments.forEach(segment => {
            absoluteSegments.push([
                characterX + segment[0], 
                segment[1], 
                characterX + segment[2], 
                segment[3]
            ]);
            nextX = max(nextX, characterX + segment[0] + charSpacing, characterX + segment[2] + charSpacing);
        });

        if (!charSegments.length) {
            nextX += 1;
        }

        characterX = nextX;
        width = characterX - charSpacing;
    });

    const appearanceOffsets = [];
    let offset = 0;
    for (let i = 0 ; i < absoluteSegments.length ; i++) {
        appearanceOffsets.splice(~~(random() * appearanceOffsets.length), 0, offset);
        offset += 1;
    }

    return {
        'segments': absoluteSegments,
        'appearanceOffsets': appearanceOffsets,
        'width': width,
        'height': 1
    };
}

function renderStickString(stickStringSettings, charWidth, charHeight, progress, segmentInterval, appearanceTime) {
    stickStringSettings.segments.forEach((segment, index) => {
        wrap(() => {
            const appearanceOffset = stickStringSettings.appearanceOffsets[index];
            const delay = appearanceOffset * segmentInterval;
            const factor = limit(0, (progress - delay) / appearanceTime, 1);
            
            const direction = sign(((index + appearanceOffset) % 2) - 0.5);
            if (((index % 2) - 0.5) > 0) {
                translate(direction * (1 - factor) * 50, 0);
            } else {
                translate(0, direction * (1 - factor) * 50);
            }
        
            R.globalAlpha *= factor;

            beginPath();
            moveTo(segment[0] * charWidth, segment[1] * charHeight);
            lineTo(segment[2] * charWidth, segment[3] * charHeight);
            stroke();
        });
    });
}

const characterSettings = {
    'a': [
        [0, 1, 1 / 2, 0],
        [1, 1, 1 / 2, 0]
    ],
    'b': [
        [0, 0, 0, 1],
        [0, 0, 1, 1 / 4],
        [1, 1 / 4, 0, 1 / 2],
        [0, 1 / 2, 1, 3 / 4],
        [1, 3 / 4, 0, 1]
    ],
    'c': [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 1, 1, 1]
    ],
    'd': [
        [0, 0, 0, 1],
        [0, 0, 1, 1 / 2],
        [1, 1 / 2, 0, 1]
    ],
    'e': [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 1 / 2, 1 * 2 / 3, 1 / 2],
        [0, 1, 1, 1]
    ],
    'f': [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 1 / 2, 1 * 2 / 3, 1 / 2]
    ],
    'g': [
        [0, 0, 1, 0],
        [0, 0, 0, 1],
        [0, 1, 1, 1],
        [1, 1, 1, 1 / 2]
    ],
    'h': [
        [0, 0, 0, 1],
        [1, 0, 1, 1],
        [0, 1 / 2, 1, 1 / 2]
    ],
    'i': [
        [0, 0, 0, 1]
    ],
    'k': [
        [0, 0, 0, 1],
        [1, 0, 0, 1 / 2],
        [1, 1, 0, 1 / 2],
    ],
    'l': [
        [0, 0, 0, 1],
        [0, 1, 1, 1]
    ],
    'm': [
        [0, 0, 0, 1],
        [0, 0, 1 / 2, 1 / 2],
        [1, 0, 1 / 2, 1 / 2],
        [1, 0, 1, 1]
    ],
    'n': [
        [0, 0, 0, 1],
        [0, 0, 1, 1],
        [1, 0, 1, 1]
    ],
    'o': [
        [0, 0, 1, 0],
        [0, 1, 1, 1],
        [0, 0, 0, 1],
        [1, 0, 1, 1],
    ],
    'p': [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [1, 0, 1, 1 / 2],
        [0, 1 / 2, 1, 1 / 2],
    ],
    'r': [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [1, 0, 1, 1 / 2],
        [0, 1 / 2, 1, 1 / 2],
        [0, 1 / 2, 1, 1]
    ],
    's': [
        [0, 0, 1, 0],
        [0, 0, 0, 1 / 2],
        [0, 1 / 2, 1, 1 / 2],
        [1, 1 / 2, 1, 1],
        [0, 1, 1, 1],
    ],
    't': [
        [0, 0, 1, 0],
        [1 / 2, 0, 1 / 2, 1]
    ],
    'u': [
        [0, 0, 0, 1],
        [0, 1, 1, 1],
        [1, 0, 1, 1]
    ],
    'v': [
        [0, 0, 1 / 2, 1],
        [1, 0, 1 / 2, 1]
    ],
    'w': [
        [0, 0, 1 / 4, 1],
        [1 / 4, 1, 1 / 2, 1 / 2],
        [3 / 4, 1, 1 / 2, 1 / 2],
        [1, 0, 3 / 4, 1],
    ],
    'y': [
        [0, 0, 1 / 2, 1 / 2],
        [1 / 2, 1 / 2, 1, 0],
        [1 / 2, 1 / 2, 1 / 2, 1]
    ],
    '\'': [
        [0, 1 / 4, 1 / 4, 0]
    ]
};