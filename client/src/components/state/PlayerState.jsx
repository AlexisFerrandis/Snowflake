import React from 'react';
import { emitEvent } from "../../Utils"

export default class PlayerState extends React.Component {
    constructor() {
        super()

        this.companions = {
            "p1": {
                companionId: "chevrette",
                hp: 34,
                maxHp: 50,
                xp: 90,
                maxXp: 100,
                level: 5,
                status: null,
            },
            "p2": {
                companionId: "chevrette",
                hp: 34,
                maxHp: 50,
                xp: 80,
                maxXp: 100,
                level: 5,
                status: null,
            },
        };

        this.lineup = ["p1", "p2"];
        this.items = [
            { itemId: "POTION", instanceId: "item1", },
            { itemId: "POTION", instanceId: "item2", },
        ];
        this.storyFlags = {};
        this.position = "";
        this.currentBackgroundMusic = "";

        this.essentialItem = {};

        this.healing = "Demo";
        this.money = 100;
        this.backgroundFilter = null;
    }

    addCompanion(companionId, stats) {
        const newId = `p${Date.now()}` + Math.floor(Math.random() * 99999);
        this.companions[newId] = {
            companionId,
            team: "player",
            hp: stats.hp,
            maxHp: stats.maxHp,
            xp: stats.xp,
            maxXp: stats.maxXp,
            level: stats.level,
            status: stats.status,
        }
        if (this.lineup.length < 6) {
            this.lineup.unshift(newId)
        }
        emitEvent("LineupChanged")
    }
}