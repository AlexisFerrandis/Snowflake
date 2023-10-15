export const enemies = {
    npc_01: {
        name: "npc_01",
        src: "./media/battle/characters/medusa.png",
        firstLineOfDialog: "Je n'ai peur de rien !",
        lastLineOfDialog: "Quoi ? C'est impensable !",
        companions: {
            a: {
                companionId: "rat",
                maxHp: 20,
                level: 2,
                // atk bonus: ...
                // item to use: ...
            },
            // b: {
            //     companionId: "rat",
            //     maxHp: 29,
            //     level: 5,
            // },
        },
        giveMoney: 248,
    },
}