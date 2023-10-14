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
    HEALING: {
        name: "Premiers soins",
        description: "Permet au porteur de se soigner légèrement pendant les trois prochains tours.",
        moveType: "NORMAL",
        targetType: "friendly",
        accuracy: 100,
        success: [
            {
                type: "textMessage",
                text: "{CASTER} prépare sa guérison !",
            },
            {
                type: "stateChange",
                status: {
                    type: "hea",
                    verb: "soignée",
                    expiresIn: 3
                }
            },
        ]
    },
    PARALYZER: {
        name: "Paralyzer",
        description: "Paralyse la cible.",
        moveType: "NORMAL",
        accuracy: 100,
        success: [
            {
                type: "textMessage",
                text: "{CASTER} paralyse {TARGET} !",
            },
            {
                type: "stateChange",
                status: {
                    type: "par",
                    verb: "parlisé",
                    expiresIn: 3
                }
            },
            {
                type: "textMessage",
                text: "{TARGET} aura du mal à attaquer !",
            },
        ]
    },
}