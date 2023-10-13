export const moves = {
    TACKLE: {
        name: "Cogne",
        description: "Le lanceur se rue sur la cible et la percute de tout son poids.",
        moveType: "NORMAL",
        accuracy: 100,
        success: [
            {
                type: "textMessage",
                text: "{CASTER} charge sa cible !",
            },
            {
                type: "animation",
                animation: "TACKLE",
                color: "#db32a5"
            },
            {
                type: "stateChange",
                damage: 40,
            },
        ]
    },
}