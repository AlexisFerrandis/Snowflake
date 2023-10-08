import React from 'react';

import downImg from "../../assets/graphic/maps/down.png"
import playerImg from "../../assets/graphic/characters/player.png"
import shadowImg from "../../assets/graphic/characters/shadow.png"

export default class Overworld extends React.Component {
    constructor(config) {
        super(config);

        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

    startGameLoop() {

    }

    async init() {
        console.log("Overworld initialisation...");

        const img = new Image();
        img.src = downImg;
        img.onload = () => {
            this.ctx.drawImage(img, 0, 0)
        }

        const x = 5;
        const y = 7;

        const shadow = new Image();
        shadow.src = shadowImg;
        shadow.onload = () => {
            this.ctx.drawImage(
                shadow,
                0, // left cut
                0, // top cut
                32, // width of cut
                64, // height of cut
                x * 32,
                y * 32 - 16,
                32,
                64,)
        }

        const player = new Image();
        player.src = playerImg;
        player.onload = () => {
            this.ctx.drawImage(
                player, // src
                0, // left cut
                0, // top cut
                64, // width of cut
                64, // height of cut
                x * 32 - 16,
                y * 32 - 32,
                64,
                64,
            )
        }
    }
}