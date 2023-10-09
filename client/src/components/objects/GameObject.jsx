import React from 'react';

import Sprite from "./Sprite";
import playerImg from "../../assets/graphic/characters/player.png";

export default class GameObject extends React.Component {
    constructor(config) {
        super(config);

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
}