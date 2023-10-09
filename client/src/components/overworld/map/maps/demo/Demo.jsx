import { withGrid } from '../../../../../Utils';
import GameObject from '../../../../objects/GameObject';

import lowerImg from "../../../../../assets/graphic/maps/demo/down.png";
import upperImg from "../../../../../assets/graphic/maps/demo/up.png";

import npcImg from "../../../../../assets/graphic/characters/npc_01.png";

export const Demo = {
    id: "Demo",
    lowerSrc: lowerImg,
    upperSrc: upperImg,
    gameObjects: {
        player: new GameObject({
            x: withGrid(1),
            y: withGrid(1),
        }),
        npc01: new GameObject({
            x: withGrid(3),
            y: withGrid(3),
            src: npcImg,
        }),
    },
    // configObjects: {
    //     player: ({
    //         type: "Person",
    //         isPlayerControlled: true,
    //         x: withGrid(13),
    //         y: withGrid(18),
    //         direction: "up"
    //     }),
    //     npc: ({
    //         type: "Person",
    //         x: withGrid(13),
    //         y: withGrid(13),
    //         src: npcImg,
    //         behaviorLoop: [
    //             { type: "stand", direction: "up", time: 100 },
    //         ],
    //     }),
    // },
}