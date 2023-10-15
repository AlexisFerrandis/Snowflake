import React from 'react';

import { PLAYER_NAME } from '../constants';

export default class TurnCycle extends React.Component {
    // eslint-disable-next-line react/prop-types
    constructor({ battle, onNewEvent, onWinner }) {
        super(battle)

        this.battle = battle;
        this.onNewEvent = onNewEvent;
        this.onWinner = onWinner;
        this.currentTeam = "player";
    }

    async turn() {
        // caster
        const casterId = this.battle.activeCombatants[this.currentTeam];
        const caster = this.battle.combatants[casterId];

        const enemyId = this.battle.activeCombatants[caster.team === "player" ? "enemy" : "player"];
        const enemy = this.battle.combatants[enemyId];

        const submission = await this.onNewEvent({
            type: "submissionMenu",
            caster,
            enemy,
        })

        // stop here if remplacing companion
        if (submission.replacement) {
            await this.onNewEvent({
                type: "replace",
                replacement: submission.replacement,
            })
            await this.onNewEvent({
                type: "textMessage",
                text: `${submission.replacement.name}, c'est à toi !`,
            })
            this.nextTurn();
            return;
        }

        // item remove & persistance
        if (submission.instanceId) {
            this.battle.usedInstanceIds[submission.instanceId] = true;
            this.battle.items = this.battle.items.filter(i => i.instanceId !== submission.instanceId);

        }

        const resultingEvents = caster.getReplacedEvents(submission.move.success);
        for (let i = 0; i < resultingEvents.length; i++) {
            const event = {
                ...resultingEvents[i],
                submission,
                move: submission.move,
                caster,
                target: submission.target
            }
            await this.onNewEvent(event);
        }

        // did a target die ?
        const targetDead = submission.target.hp <= 0;
        if (targetDead) {
            await this.onNewEvent({
                type: "textMessage", text: `${submission.target.name} est KO!`
            })
            // xp handler
            if (submission.target.team === "enemy") {
                const playerActiveCombatants = this.battle.activeCombatants.player;
                const xp = Math.floor((submission.target.givesXp / 18) + (submission.target.level * 2) + 8);

                const initialLevel = this.battle.combatants[playerActiveCombatants].level;
                await this.onNewEvent({
                    type: "textMessage",
                    text: `${caster.name} a gagné ${xp} XP!`,
                });
                await this.onNewEvent({
                    type: "giveXp",
                    xp,
                    combatant: this.battle.combatants[playerActiveCombatants],
                });
                const actualisedLevel = this.battle.combatants[playerActiveCombatants].level;
                if (initialLevel !== actualisedLevel) {
                    await this.onNewEvent({
                        type: "textMessage",
                        text: `${caster.name} monte au niveau ${actualisedLevel}!`,
                    });
                    await this.onNewEvent({
                        type: "textMessage",
                        text: `Toutes ses statistiques ont évoluées !`,
                    });
                }
            }
        }

        // winning team ?
        const winner = this.getWinningTeam();
        if (winner) {
            if (winner === "player") {
                // if (this.battle.enemy.name === "Wild") {
                await this.onNewEvent({
                    type: "textMessage",
                    text: `Vous avez vaincu ${enemy.name}.`
                })
                // }

                // if (this.battle.enemy.name !== "Wild") {
                //     window.playerState.money += this.battle.enemy.giveMoney;

                //     await this.onNewEvent({
                //         type: "textMessage",
                //         text: `Vous avez vaincu ${this.battle.enemy.name}!`
                //     })
                //     await this.onNewEvent({
                //         type: "textMessage",
                //         text: `${this.battle.enemy.name} vous donne ${this.battle.enemy.giveMoney}¥.`
                //     })
                //     await this.onNewEvent({
                //         type: "textMessage",
                //         text: `${this.battle.enemy.name}: ${this.battle.enemy.lastLineOfDialog}`
                //     })
                // }

                this.onWinner(winner)
                return;
            }

            else {
                await this.onNewEvent({
                    type: "textMessage",
                    text: `Tous vos combattants sont KO.`
                })
                await this.onNewEvent({
                    type: "textMessage",
                    text: `${PLAYER_NAME} perd 100¥ en s'échappant.`
                })
                await this.onNewEvent({
                    type: "textMessage",
                    text: `Vous vous hâtez vers le centre de soin le plus proche.`
                })
                this.onWinner(winner);
                return;
            }
        }

        // dead companion but no winner -> replacement
        if (targetDead) {
            const replacement = await this.onNewEvent({
                type: "replacementMenu",
                team: submission.target.team
            })
            await this.onNewEvent({
                type: "replace",
                replacement: replacement
            })
            await this.onNewEvent({
                type: "textMessage",
                text: `${replacement.name}, j'ai besoin de ton aide !`
            })
        }

        // check for post events
        const postEvents = caster.getPostsEvents();
        for (let i = 0; i < postEvents.length; i++) {
            const event = {
                ...postEvents[i],
                submission,
                move: submission.move,
                caster,
                target: submission.target
            }
            await this.onNewEvent(event)
        }

        // check for status expire
        const expiredEvent = caster.decrementStatus();
        if (expiredEvent) {
            await this.onNewEvent(expiredEvent);
        }
        this.nextTurn();
    }

    nextTurn() {
        this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
        this.turn();
    }

    getWinningTeam() {
        let aliveTeams = {};
        Object.values(this.battle.combatants).forEach((c) => {
            if (c.hp > 0) {
                aliveTeams[c.team] = true;
            }
        });
        if (!aliveTeams["player"]) { return "enemy"; }
        if (!aliveTeams["enemy"]) { return "player"; }
        return null;
    }

    async init() {

        // start the battle
        if (this.battle.enemy.name === "Wild") {
            await this.onNewEvent({
                type: "textMessage",
                text: `Un ${this.battle.combatants.e_wild.name} sauvage apparait !`
            })
        } else {
            await this.onNewEvent({
                type: "textMessage",
                text: `${this.battle.enemy.name} veut se battre !`
            })
            await this.onNewEvent({
                type: "textMessage",
                text: `${this.battle.enemy.name}: ${this.battle.enemy.firstLineOfDialog}`
            })
        }

        this.turn();
    }
}