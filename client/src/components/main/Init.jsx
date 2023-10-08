import Overworld from "../overworld/Overworld";

export default function init() {
    const overworld = new Overworld({
        element: document.querySelector(".game-container")
    })
    overworld.init();
}