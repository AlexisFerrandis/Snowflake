import React from 'react';

import Sprite from "./Sprite";
import OverworldEvent from '../overworld/event/OverworldEvent';

import playerImg from "../../assets/graphic/characters/playerSprite.png";

export default class GameObject extends React.Component {
    constructor(config) {
        super(config);

        this.id = null;

        this.isMaounted = false;

        this.x = config.x || 0;
        this.y = config.y || 0;

        this.direction = config.direction || "down";

        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || playerImg,
        });

        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;

        this.talking = config.talking || [];
        this.retryTimeout = null;

        this.isNotHere = config.isNotHere;
        this.isNowHere = config.isNowHere;

        this.initialX = config.initialX || 0;
        this.initialY = config.initialY || 0;
    }

    mount(map) {
        this.isMaounted = true;
        map.addWall(this.x, this.y);

        // start behavior after n sec
        setTimeout(() => {
            this.doBehaviorEvent(map);
        }, 10);
    }

    async doBehaviorEvent(map) {
        // stop if cutscene
        if (map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding) {
            return;
        }

        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
        eventConfig.who = this.id;

        // create event instance
        const eventHandler = new OverworldEvent({ map, event: eventConfig });
        await eventHandler.init();

        // setting next event
        this.behaviorLoopIndex += 1;
        if (this.behaviorLoopIndex === this.behaviorLoop.length) {
            this.behaviorLoopIndex = 0;
        }

        this.doBehaviorEvent(map);
    }
}