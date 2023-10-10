export const withGrid = (n) => {
    return n * 32;
};

export const asGridCoords = (x, y) => {
    return `${x * 32}, ${y * 32}`
};

export const setGridCoords = (x, y) => {
    return `${x * 32}, ${y * 32}`
};

export const nextPosition = (initialX, initialY, direction) => {
    let x = initialX;
    let y = initialY;
    const size = 32;
    if (direction === 'left') {
        x -= size;
    } else if (direction === 'right') {
        x += size;
    } else if (direction === 'up') {
        y -= size;
    } else if (direction === "down") {
        y += size;
    }
    return { x, y };
};

