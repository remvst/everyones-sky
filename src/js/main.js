onload = () => {
    onresize(); // trigger initial sizing pass

    C = document.querySelector('canvas');
    C.width = CANVAS_WIDTH;
    C.height = CANVAS_HEIGHT;

    R = C.getContext('2d');

    G = new Game();
};