import React from 'react';

export default class DirectionInputs extends React.Component {
    constructor(config) {
        super(config);

        this.heldDirections = [];

        this.map = {
            "ArrowUp": "up",
            "KeyZ": "up",
            "ArrowDown": "down",
            "KeyS": "down",
            "ArrowLeft": "left",
            "KeyQ": "left",
            "ArrowRight": "right",
            "KeyD": "right",
        }
    }

    get direction() {
        return this.heldDirections[0];
    }

    init() {
        document.addEventListener("keydown", (e) => {
            const dir = this.map[e.code];
            if (dir && this.heldDirections.indexOf(dir) === -1) {
                this.heldDirections.unshift(dir)
            }
        });
        document.addEventListener("keyup", (e) => {
            const dir = this.map[e.code];
            const index = this.heldDirections.indexOf(dir);
            if (index > -1) {
                this.heldDirections.splice(index, 1);
            }
        });
    }
}