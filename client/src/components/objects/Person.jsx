import GameObject from './GameObject';
import { MOVING_PROCESS } from '../constants';
import { emitEvent } from '../../Utils';

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
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {

            // case : keyboard ready & arrow pressed
            if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
                this.startBehavior(state, {
                    type: "walk",
                    direction: state.arrow
                })
            }
            this.updateSprite();
        }
    }

    startBehavior(state, behavior) {
        // set character direction 
        this.direction = behavior.direction;
        if (behavior.type === "walk") {
            // stop
            if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
                behavior.retry && setTimeout(() => {
                    this.startBehavior(state, behavior)
                }, 10)
                return;
            }
            // go
            state.map.moveWall(this.x, this.y, this.direction);
            this.movingProgressRemaining = MOVING_PROCESS;
            this.updateSprite(state)
        }
        // stand
        if (behavior.type === "stand") {
            this.isStanding = true;
            setTimeout(() => {
                emitEvent("PersonStandComplete", {
                    whoId: this.id
                })
                this.isStanding = false;
            }, behavior.time)
        }
    }

    updatePosition() {
        const [property, change] = this.directionUpdate[this.direction];
        this[property] += change;
        this.movingProgressRemaining -= 1;

        if (this.movingProgressRemaining === 0) {
            this.intentPosition = null;
            emitEvent("PersonWalkingComplete", {
                whoId: this.id
            });
        }
    }

    updateSprite() {
        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation("walk-" + this.direction);
            return;
        }
        this.sprite.setAnimation("idle-" + this.direction);
    }
}