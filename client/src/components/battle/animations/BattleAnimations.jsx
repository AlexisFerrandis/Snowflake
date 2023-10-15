import "./battle-animations.scss"
import "./moves-animations.scss"

import { wait } from "../../../Utils";

export const battleAnimations = {

    async TACKLE(event, onComplete) {
        const element = event.caster.companionElement;
        const animationClassName = event.caster.team === "player" ? "battle-movement-right" : "battle-movement-left";
        element.classList.add(animationClassName);

        const team = event.caster.team === "player" ? "enemy" : "player";
        document.querySelector(`.${team}-animation`).classList.add("TACKLE");

        element.addEventListener("animationend", () => {
            element.classList.remove(animationClassName);
            document.querySelector(`.${team}-animation`).classList.remove("TACKLE");
        }, { once: true });

        element.addEventListener("animationend", () => {
            element.classList.remove(animationClassName);
        }, { once: true });

        await wait(400);
        onComplete();
    },
}