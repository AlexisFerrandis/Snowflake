import React from 'react';

import { withGrid } from '../../../Utils';

// import { Demo } from "./maps/demo/Demo"
// import GameObject from '../../objects/GameObject';

import lowerImg from "../../../assets/graphic/maps/demo/down.png";
import upperImg from "../../../assets/graphic/maps/demo/up.png";

import npcImg from "../../../assets/graphic/characters/npc_01.png";
import Person from '../../objects/Person';

export default class OverworldMap extends React.Component {
    constructor(config) {
        super(config);

        this.overworld = null;

        this.gameObjects = config.gameObjects; // live objects
        this.configObjects = config.configObjects; // config content

        // this.music = config.music;
        this.cutsceneSpaces = config.cutsceneSpaces || {};
        this.walls = config.walls || {};
        this.grass = config.grass || {};
        this.bump = config.bump || {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;

        this.isCutscenePlaying = false;
        this.isPaused = false;
    }

    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.lowerImage,
            withGrid(16) - cameraPerson.x,
            withGrid(9) - cameraPerson.y,
        );
    }
    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.upperImage,
            withGrid(16) - cameraPerson.x,
            withGrid(9) - cameraPerson.y,
        );
    }
}



window.OverworldMaps = {
    Demo: {
        id: "Demo",
        lowerSrc: lowerImg,
        upperSrc: upperImg,
        gameObjects: {
            player: new Person({
                x: withGrid(1),
                y: withGrid(1),
                isPlayerControlled: true
            }),
            npc01: new Person({
                x: withGrid(5),
                y: withGrid(7),
                src: npcImg,
            }),
        },
    }
} 