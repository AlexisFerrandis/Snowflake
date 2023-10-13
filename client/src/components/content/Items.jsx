export const items = {
    POTION: {
        name: "Potion",
        pluralName: "Potions",
        description: "Restaure 20 PV d'un compagnon.",
        targetType: "friendly",
        price: 100,
        src: "POTION",
        success: [
            {
                type: "textMessage",
                text: "{CASTER} utilise une {MOVE} !",
            },
            {
                type: "animation",
                animation: "POTION",
            },
            {
                type: "stateChange",
                recover: 20,
            },
            {
                type: "textMessage",
                text: "{CASTER} récupère 20 HP !",
            },
        ]
    },
}