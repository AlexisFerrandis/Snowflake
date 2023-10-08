import React from 'react';

export default class GameObject extends React.Component {
    constructor(config) {
        super(config);

        this.x = config.x || 0;
        this.y = config.y || 0;

        this.sprite = null;

        this.direction = config.direction || "down";

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