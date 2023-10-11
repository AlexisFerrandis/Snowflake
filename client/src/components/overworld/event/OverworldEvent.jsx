import React from 'react';
import TextMessage from '../../text/TextMessage';
import { oppositeDirection } from '../../../Utils';
import SceneTransition from './SceneTransition';

export default class OverworldEvent extends React.Component {
    // eslint-disable-next-line react/prop-types
    constructor({ map, event }) {
        super(event);

        this.map = map;
        this.event = event;
    }

    stand(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
            map: this.map
        }, {
            type: "stand",
            direction: this.event.direction,
            time: this.event.time
        })

        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonStandComplete", completeHandler);
                resolve();
            }
        }
        document.addEventListener("PersonStandComplete", completeHandler)
    }

    walk(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
            map: this.map
        }, {
            type: "walk",
            direction: this.event.direction,
            retry: true
        })

        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                resolve();
            }
        }
        document.addEventListener("PersonWalkingComplete", completeHandler)
    }

    textMessage(resolve) {
        if (this.event.facePlayer) {
            const obj = this.map.gameObjects[this.event.facePlayer];
            obj.direction = oppositeDirection(this.map.gameObjects["player"].direction);
        }

        const message = new TextMessage({
            text: this.event.text,
            who: this.event.who,
            onComplete: () => resolve(),
        });
        message.init(document.querySelector(".game-container"));
    }

    changeMap(resolve) {
        const sceneTransition = new SceneTransition();
        sceneTransition.init(document.querySelector(".game-container"), () => {
            this.map.overworld.startMap(window.OverworldMaps[this.event.map], {
                x: this.event.x,
                y: this.event.y,
                direction: this.event.direction,
            });
            resolve();

            sceneTransition.fadeOut();
        });

        // this.map.overworld.startMap(window.OverworldMaps[this.event.map]);
        // resolve();
    }


    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve)
        })
    }
}