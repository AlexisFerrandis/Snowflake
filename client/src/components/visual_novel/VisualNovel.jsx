import React from 'react';

import "./visual-novel.scss"

export default class VisualNovel extends React.Component {
    // eslint-disable-next-line react/prop-types
    constructor({ enemy, onComplete }) {
        super(enemy)

        this.enemy = enemy;
        this.onComplete = onComplete;

        this.combatants = {};

        this.activeCombatants = {
            player: null,
            enemy: null,
        };
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("visual-novel");

        this.element.innerHTML = `
            <div class="container"></div>
        `;

    }

    init(container) {
        this.createElement();
        container.appendChild(this.element)
    }
}