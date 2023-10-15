import React from 'react';

import PlayerState from '../state/PlayerState';
window.playerState = new PlayerState();

import OverworldMap from './map/OverworldMap';
import DirectionInputs from '../player_inputs/DirectionInputs';
import KeyPressListener from '../player_inputs/KeyPressListener';

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
        Object.values(this.map.gameObjects).sort((a, b) => {
            return a.y - b.y;
        }).forEach(obj => {
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

            requestAnimationFrame(stepFct);
        }
        requestAnimationFrame(stepFct);
    }

    bindActionInput() {
        new KeyPressListener("Enter", () => { this.map.checkForActionCutscene() });
        new KeyPressListener("Space", () => { this.map.checkForActionCutscene() });
    }

    bindPlayerPositionCheck() {
        document.addEventListener("PersonWalkingComplete", e => {
            if (e.detail.whoId === "player") {
                this.map.checkForFootstepCutscene();
            }
        })
    }

    startMap(mapConfig) {
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;
        this.map.mountObjects();
    }

    async init() {
        console.log("Overworld initialisation...");

        this.startMap(window.OverworldMaps.Demo);

        // create controls
        this.bindActionInput();
        this.bindPlayerPositionCheck();

        this.directionInput = new DirectionInputs();
        this.directionInput.init();

        this.startGameLoop();

        // this.map.startCutScene([
        //     { type: "battle", enemyId: "npc_01" }
        // { type: "changeMap", map: "Demo" },
        // ])
    }
}