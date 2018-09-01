once = f => {
    let res
    return () => {
        res = res || f();
        return res;
    };
};
