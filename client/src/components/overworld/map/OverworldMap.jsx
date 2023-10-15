import React from 'react';

import { withGrid, asGridCoords, nextPosition } from '../../../Utils';

// import { Demo } from "./maps/demo/Demo"

import demoLowerImg from "../../../assets/graphic/maps/demo/down.png";
import demoUpperImg from "../../../assets/graphic/maps/demo/up.png";
import voidImg from "../../../assets/graphic/maps/demo/void.png";

import npc01 from "../../../assets/graphic/characters/npc_01.png";
import npc02 from "../../../assets/graphic/characters/npc_02.png";
import Person from '../../objects/Person';
import OverworldEvent from '../event/OverworldEvent';
import { CAM_POS_X, CAM_POS_Y } from '../../constants';

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
            withGrid(CAM_POS_X) - cameraPerson.x,
            withGrid(CAM_POS_Y) - cameraPerson.y,
        );
    }
    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.upperImage,
            withGrid(CAM_POS_X) - cameraPerson.x,
            withGrid(CAM_POS_Y) - cameraPerson.y,
        );
    }

    isSpaceTaken(currentX, currentY, direction) {
        const { x, y } = nextPosition(currentX, currentY, direction);
        return this.walls[`${x}, ${y}`] || false;
    }

    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {
            let obj = this.gameObjects[key];
            obj.id = key;

            obj.mount(this);
        })
    }

    async startCutScene(events) {
        this.isCutscenePlaying = true;

        for (let i = 0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this,
            })
            await eventHandler.init()
        }

        this.isCutscenePlaying = false;

        // reset npcs to their behavior
        Object.values(this.gameObjects).forEach(obj => obj.doBehaviorEvent(this));
    }

    checkForActionCutscene() {
        const player = this.gameObjects["player"];
        const nextCoords = nextPosition(player.x, player.y, player.direction);
        const match = Object.values(this.gameObjects).find((object) => {
            return `${object.x}, ${object.y}` === `${nextCoords.x}, ${nextCoords.y}`;
        });
        if (!this.isCutscenePlaying && match && match.talking.length) {
            const relevantScenario = match.talking.find((scenario) => {
                return (scenario.required || []).every((sf) => {
                    return window.playerState.storyFlags[sf];
                })
            })

            relevantScenario && this.startCutScene(relevantScenario.events);
        }
    }

    async checkForFootstepCutscene() {
        const player = this.gameObjects["player"];
        const match = this.cutsceneSpaces[`${player.x}, ${player.y}`];

        // normal event
        if (!this.isCutscenePlaying && match) {
            this.startCutScene(match[0].events);
            return
        }
    }

    addWall(x, y) {
        this.walls[`${x}, ${y}`] = true;
    }
    removeWall(x, y) {
        delete this.walls[`${x}, ${y}`];
    }
    moveWall(wasX, wasY, direction) {
        this.removeWall(wasX, wasY);
        const { x, y } = nextPosition(wasX, wasY, direction);
        this.addWall(x, y);
    }
}



window.OverworldMaps = {
    Demo: {
        id: "Demo",
        lowerSrc: demoLowerImg,
        upperSrc: demoUpperImg,
        gameObjects: {
            player: new Person({
                isPlayerControlled: true,
                x: withGrid(15),
                y: withGrid(18),
            }),
            npc01: new Person({
                x: withGrid(18),
                y: withGrid(15),
                src: npc01,
                behaviorLoop: [
                    { type: "stand", direction: "down", time: 3200 },
                    { type: "stand", direction: "left", time: 2100 },
                    { type: "stand", direction: "right", time: 2300 },
                ],
                talking: [{
                    events: [
                        { type: "textMessage", who: "Syndra", text: "J'aime beaucoup ce village.", facePlayer: "npc01" },
                        { type: "battle", enemyId: "npc_01" },
                    ]
                }]
            }),
            npc02: new Person({
                x: withGrid(12),
                y: withGrid(16),
                src: npc02,
                behaviorLoop: [
                    { type: "stand", direction: "left", time: 1200 },
                    { type: "stand", direction: "right", time: 3000 },
                    { type: "walk", direction: "right" },
                    { type: "stand", direction: "right", time: 2100 },
                    { type: "walk", direction: "down" },
                    { type: "stand", direction: "down", time: 2300 },
                    { type: "walk", direction: "left" },
                    { type: "stand", direction: "left", time: 3000 },
                    { type: "walk", direction: "up", time: 2700 },
                ],
                talking: [{
                    events: [
                        { type: "textMessage", who: "Syndra", text: "J'aime beaucoup ce village.", facePlayer: "npc02" },
                        { type: "textMessage", who: "Syndra", text: "C'est si paisible.", facePlayer: "npc02" },
                    ]
                }]
            }),
        },
        walls: {
            [asGridCoords(2, 1)]: true,
            [asGridCoords(3, 3)]: true,
            [asGridCoords(4, 4)]: true,
            [asGridCoords(5, 5)]: true,
        },
        cutsceneSpaces: {
            [asGridCoords(17, 17)]: [
                {
                    events: [
                        { who: "player", type: "walk", direction: "down" },
                        { type: "textMessage", who: "Event", text: "Event triggerd!", facePlayer: "npc02" },
                    ]
                },
            ],
            [asGridCoords(5, 18)]: [
                {
                    events: [
                        { type: "changeMap", map: "Void" },
                    ]
                },
            ]
        }
    },

    Void: {
        id: "Void",
        lowerSrc: voidImg,
        upperSrc: voidImg,
        gameObjects: {
            player: new Person({
                isPlayerControlled: true,
                x: withGrid(15),
                y: withGrid(18),
            }),
        }
    }
} 