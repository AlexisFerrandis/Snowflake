import React from 'react';

export default class RevealingText extends React.Component {
    constructor(config) {
        super(config);

        this.element = config.element;
        this.text = config.text;
        this.speed = config.speed || 77;

        this.timeout = null;
        this.isDone = false;
    }

    revealCharacter(list) {
        const next = list.splice(0, 1)[0];
        next.span.classList.add("revealed");

        if (list.length > 0) {
            this.timeout = setTimeout(() => {
                this.revealCharacter(list);
            }, next.delayAfter);
        } else {
            this.isDone = true;
        }
    }

    warpToDone() {
        clearTimeout(this.timeout);
        this.isDone = true;
        this.element.querySelectorAll("span").forEach((s) => {
            s.classList.add("revealed");
        });
    }

    init() {
        let characters = [];
        this.text.split("").forEach((character) => {
            // create
            let span = document.createElement("span");
            span.textContent = character;
            this.element.appendChild(span);

            // add
            characters.push({
                span,
                delayAfter: character === " " ? 0 : this.speed,
            });
        });

        this.revealCharacter(characters);
    }
}