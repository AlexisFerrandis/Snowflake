import GameObject from './GameObject';
import { MOVING_PROCESS } from '../constants';

export default class Person extends GameObject {
    constructor(config) {
        super(config);

        this.movingProgressRemaining = 0;
        this.isStanding = false;
        this.intentPosition = null;

        this.isPlayerControlled = config.isPlayerControlled || false;

        this.directionUpdate = {
            "up": ["y", -1],
            "down": ["y", 1],
            "left": ["x", -1],
            "right": ["x", 1],
        };
    }

    update(state) {
        this.updatePosition();
        this.updateSprite();

        if (this.isPlayerControlled && this.movingProgressRemaining === 0 && state.arrow) {
            this.direction = state.arrow;
            this.movingProgressRemaining = MOVING_PROCESS;
        }
    }

    updatePosition() {
        if (this.movingProgressRemaining > 0) {
            const [property, change] = this.directionUpdate[this.direction];
            this[property] += change;
            this.movingProgressRemaining -= 1;
        }
    }

    // update(state) {
    //     if (this.movingProgressRemaining > 0) {
    //         this.updatePosition();
    //     } else {

    //         // case : keyboard ready & arrow pressed
    //         if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
    //             this.startBehavior(state, {
    //                 type: "walk",
    //                 direction: state.arrow
    //             });
    //         }
    //         this.updateSprite(state);
    //     }
    // }

    updateSprite() {
        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation("walk-" + this.direction);
            return;
        }
        this.sprite.setAnimation("idle-" + this.direction);
    }
}