import React from 'react';

import OverworldMap from './map/OverworldMap';
import DirectionInputs from '../player_inputs/DirectionInputs';

import { FPS_RATIO } from '../constants';

export default class Overworld extends React.Component {
    constructor(config) {
        super(config);

        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

    gameLoopStepWork(delta) {
        // clear
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // establish camera person (or anything)
        const cameraPerson = this.map.gameObjects.player;

        // update all objects
        Object.values(this.map.gameObjects).forEach(obj => {
            obj.update({
                delta,
                arrow: this.directionInput.direction,
                map: this.map,
            })
        })

        // draw layer and objects
        this.map.drawLowerImage(this.ctx, cameraPerson);
        Object.values(this.map.gameObjects).forEach(obj => {
            obj.sprite.draw(this.ctx, cameraPerson);
        });
        this.map.drawUpperImage(this.ctx, cameraPerson);
    }

    startGameLoop() {
        let previousMs;
        const step = FPS_RATIO;

        const stepFct = (timestampMs) => {
            if (this.map.isPaused) {
                return;
            }
            if (previousMs === undefined) {
                previousMs = timestampMs;
            }
            let delta = (timestampMs - previousMs) / 1000;
            while (delta >= step) {
                this.gameLoopStepWork(delta);
                delta -= step;
            }
            previousMs = timestampMs - delta * 1000;

            requestAnimationFrame(stepFct)
        }
        requestAnimationFrame(stepFct)
    }

    async init() {
        console.log("Overworld initialisation...");

        this.map = new OverworldMap(window.OverworldMaps.Demo);
        this.map.mountObjects();

        this.directionInput = new DirectionInputs();
        this.directionInput.init();

        this.startGameLoop();
    }
}