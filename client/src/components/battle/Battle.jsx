import React from 'react';

import "./battle.scss"

import Combatant from './combatant/Combatant';

import { companions } from "../content/Companions"
import TurnCycle from './TurnCycle';
import BattleEvent from './events/BattleEvent';

import battleBackground from "../../assets/graphic/backgrounds/snow_bg.gif"
import playerImg from "../../assets/graphic/battle/characters/player.png"

export default class Battle extends React.Component {
    // eslint-disable-next-line react/prop-types
    constructor({ enemy, onComplete }) {
        super(enemy)

        this.enemy = enemy;
        this.onComplete = onComplete;

        this.combatants = {
            "player1": new Combatant({
                ...companions.chevrette,
                team: "player",
                hp: 34,
                maxHp: 50,
                xp: 30,
                maxXp: 100,
                level: 5,
                status: null,
            }, this),
            "enemy1": new Combatant({
                ...companions.rat,
                team: "enemy",
                hp: 40,
                maxHp: 50,
                xp: 0,
                maxXp: 100,
                level: 5,
                status: null,
            }, this),
            "enemy2": new Combatant({
                ...companions.rat,
                team: "enemy",
                hp: 50,
                maxHp: 50,
                xp: 0,
                maxXp: 100,
                level: 5,
                status: null,
            }, this),
        };

        this.activeCombatants = {
            player: "player1",
            enemy: "enemy1",
        };
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("battle");

        this.element.innerHTML = `
            <div class="battle-background">
                <img src="${battleBackground}" alt="battle background" />
            </div>

            <div class="player-animation"></div>

            <div class="battle-player">
                <img src=${playerImg} class="player-img" alt="player" />
            </div>

            <div class="enemy-animation"></div>

            <div class="text-container">
            </div>
        `;
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);

        Object.keys(this.combatants).forEach(key => {
            let combatant = this.combatants[key];
            combatant.id = key;
            combatant.init(this.element)

            // add to correct team
            // if (combatant.team === "player") {
            //     this.playerTeam.combatants.push(combatant);
            // } else if (combatant.team === "enemy") {
            //     this.enemyTeam.combatants.push(combatant);
            // }
        });

        this.turnCycle = new TurnCycle({
            battle: this,
            onNewEvent: e => {
                return new Promise(resolve => {
                    const battleEvent = new BattleEvent(e, this);
                    battleEvent.init(resolve);
                })
            }
        })
        this.turnCycle.init();
    }
}