w.down = {};
onkeydown = e => {
    w.down[e.keyCode] = true;
};
onkeyup = e => {
    w.down[e.keyCode] = false;
    G.selectPromptOption(String.fromCharCode(e.keyCode));
};
