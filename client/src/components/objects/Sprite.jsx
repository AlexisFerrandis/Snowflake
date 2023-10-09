import React from 'react';

import shadowImg from "../../assets/graphic/characters/shadow.png";

import { withGrid } from '../../Utils';
import { ANIMATION_FRAME_LIMIT } from '../constants';

export default class Sprite extends React.Component {
    constructor(config) {
        super(config);

        // set up the img
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        // shadow
        this.shadow = new Image();
        this.useShadow = true;
        if (this.useShadow) {
            this.shadow.src = shadowImg;
        }
        this.shadow.onload = () => {
            this.isShadowLoaded = true;
        }

        // configure animation
        this.animation = config.animation || {
            "idle-down": [[0, 0]],
            "idle-up": [[0, 3]],
            "idle-left": [[0, 1]],
            "idle-right": [[0, 2]],

            "walk-down": [[1, 0], [0, 0], [3, 0], [0, 0]],
            "walk-up": [[1, 3], [0, 3], [3, 3], [0, 3]],
            "walk-left": [[1, 1], [1, 1], [3, 1], [0, 1]],
            "walk-right": [[1, 2], [0, 2], [3, 2], [3, 2]],
        };
        this.currentAnimation = config.currentAnimation || "idle-down";
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || ANIMATION_FRAME_LIMIT;
        this.animationFrameProgress = this.animationFrameLimit;

        // ref game object
        this.gameObject = config.gameObject;
    }

    get frame() {
        return this.animation[this.currentAnimation][this.currentAnimationFrame];
    }

    setAnimation(key) {
        if (this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgress() {
        // downtick time 
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }

        // reset counter
        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame += 1;

        if (this.frame === undefined) {
            this.currentAnimationFrame = 0;
        }
    }

    draw(ctx, cameraPerson) {
        const x = this.gameObject.x - 16 + withGrid(16) - cameraPerson.x;
        const y = this.gameObject.y - 32 + withGrid(9) - cameraPerson.y;

        this.isShadowLoaded && ctx.drawImage(this.shadow, (x + 15), (y + 16));

        const [frameX, frameY] = this.frame;

        this.isLoaded && ctx.drawImage(
            this.image,
            frameX * 64, // left cut
            frameY * 64, // right cut
            64, // width of cut
            64, // height of cut
            x,
            y,
            64, // width of sprite
            64 // height of sprite
        )
        this.updateAnimationProgress();
    }
}