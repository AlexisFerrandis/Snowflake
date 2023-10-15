import React from 'react';

import "./team.scss"

export default class Team extends React.Component {
    constructor(team, name) {
        super(team)

        this.team = team;
        this.name = name;
        this.combatants = [];
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("team");
        this.element.setAttribute("data-team", this.team);
        this.combatants.forEach((c) => {
            let icon = document.createElement("div");
            icon.setAttribute("data-combatant", c.id);

            icon.innerHTML = `
                <div class="combatant-icon">o</div>
                <div class="active-combatant-indicator">▲</div>
            `;
            this.element.appendChild(icon);
        });
    }

    update() {
        this.combatants.forEach((c) => {
            const icon = this.element.querySelector(`[data-combatant="${c.id}"]`);
            icon.setAttribute("data-dead", c.hp <= 0);
            icon.setAttribute("data-active", c.isActive);
        });
    }

    init(container) {
        this.createElement();
        this.update();
        container.appendChild(this.element);
    }
}