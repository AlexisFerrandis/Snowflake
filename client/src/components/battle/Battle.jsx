import React from 'react';
// import PlayerState from '../state/PlayerState';

import "./battle.scss"

import Combatant from './combatant/Combatant';
import TurnCycle from './TurnCycle';
import BattleEvent from './events/BattleEvent';
import Team from './team/Team';

import { companions } from "../content/Companions"

import battleBackground from "../../assets/graphic/backgrounds/snow_bg.gif"
import playerImg from "../../assets/graphic/battle/characters/player.png"
import { emitEvent } from '../../Utils';

export default class Battle extends React.Component {
    // eslint-disable-next-line react/prop-types
    constructor({ enemy, onComplete }) {
        super(enemy)

        this.enemy = enemy;
        this.onComplete = onComplete;

        this.combatants = {

        };

        this.activeCombatants = {
            player: null,
            enemy: null,
        };

        // dynamically add team
        window.playerState.lineup.forEach(id => {
            this.addCombatant(id, "player", window.playerState.companions[id])
        })
        Object.keys(this.enemy.companions).forEach((key) => {
            this.addCombatant("e_" + key, "enemy", this.enemy.companions[key]);
        });

        // add player items
        this.items = [];
        window.playerState.items.forEach((item) => {
            this.items.push({
                ...item,
                team: "player",
            });
        });
        this.usedInstanceIds = {};
    }

    addCombatant(id, team, config) {
        this.combatants[id] = new Combatant({
            ...companions[config.companionId],
            ...config,
            team,
            isPlayerControlled: team === "player",
        }, this);
        // populate 1st combatant
        this.activeCombatants[team] = this.activeCombatants[id] || id;
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
        `;
        /*
            ${this.enemy.name !== "Wild" ?
                (`
                    <div class="battle-enemy">
                        <img src=${this.enemy.src} alt=${this.enemy.name} />
                    </div>
                `) : (``)
            }
            <div class="text-container"></div>
        */
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);

        this.playerTeam = new Team("player", "Player")
        this.enemyTeam = new Team("enemy", "Enemy")
        Object.keys(this.combatants).forEach(key => {
            let combatant = this.combatants[key];
            combatant.id = key;
            combatant.init(this.element)

            // add to correct team
            if (combatant.team === "player") {
                this.playerTeam.combatants.push(combatant);
            } else if (combatant.team === "enemy") {
                this.enemyTeam.combatants.push(combatant);
            }
        });
        this.playerTeam.init(this.element);
        this.enemyTeam.init(this.element);


        this.turnCycle = new TurnCycle({
            battle: this,
            onNewEvent: e => {
                return new Promise(resolve => {
                    const battleEvent = new BattleEvent(e, this);
                    battleEvent.init(resolve);
                })
            },
            onWinner: winner => {
                if (winner === "player") {
                    const playerState = window.playerState;
                    Object.keys(playerState.companions).forEach(id => {
                        const playerStateCompanions = playerState.companions[id];
                        const combatant = this.combatants[id];
                        if (combatant) {
                            playerStateCompanions.hp = combatant.hp;
                            playerStateCompanions.xp = combatant.xp;
                            playerStateCompanions.maxXp = combatant.maxXp;
                            playerStateCompanions.maxHp = combatant.maxHp;
                            playerStateCompanions.level = combatant.level;
                        }
                    });
                    // get rid of player used items
                    playerState.items = playerState.items.filter((item) => {
                        return !this.usedInstanceIds[item.instanceId];
                    });
                    // send signal to update
                    emitEvent("PlayerStateUpdated");
                }
                else if (winner === "runAway") {
                    winner = "player"
                }


                // animate ending battle here
                this.element.remove();
                this.onComplete(winner === "player");
            }
        })
        this.turnCycle.init();
    }
}