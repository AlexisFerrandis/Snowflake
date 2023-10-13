import React from 'react';

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

        const resultingEvents = submission.move.success;
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

        this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
        this.turn();

    }

    async init() {

        await this.onNewEvent({
            type: "textMessage",
            text: `La rencontre commence !`
        })

        // start first turn
        this.turn();
    }
}