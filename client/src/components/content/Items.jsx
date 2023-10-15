export const items = {
    POTION: {
        name: "Potion",
        pluralName: "Potions",
        description: "Restaure 20 PV d'un compagnon.",
        targetType: "friendly",
        price: 100,
        accuracy: 100,
        src: "./media/battle/companions/chevrette.png",
        success: [
            {
                type: "textMessage",
                text: "{CASTER} utilise une {MOVE} !",
            },
            // {
            //     type: "animation",
            //     animation: "POTION",
            // },
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
    FULLHEAL: {
        name: "Traitement",
        pluralName: "Traitements",
        description: "Annule tous les changements de statut.",
        targetType: "friendly",
        price: 400,
        accuracy: 100,
        src: "./media/battle/companions/chevrette.png",
        success: [
            {
                type: "textMessage",
                text: "{CASTER} utilise {MOVE} !",
            },
            // {
            // 	type: "animation",
            // 	animation: "FULLHEAL",
            // },
            {
                type: "stateChange",
                status: null,
            },
            {
                type: "textMessage",
                text: "{CASTER} est en forme !",
            },
        ]
    },
}