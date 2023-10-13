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

export const oppositeDirection = (direction) => {
    if (direction === "left") {
        return "right";
    }
    if (direction === "right") {
        return "left";
    }
    if (direction === "up") {
        return "down";
    }
    return "up";
};

export const emitEvent = (name, detail) => {
    const event = new CustomEvent(name, {
        detail
    });
    document.dispatchEvent(event);
};

export const wait = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};