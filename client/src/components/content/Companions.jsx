export const companions = {
    "chevrette": {
        name: "Chevrette",
        internalName: "CHEVRETTE",
        type: "NORMAL",
        baseStats: [41, 64, 45, 50, 50, 50],
        //          PV ATCK DEF SPEED SPECIAL
        baseEXP: 60,
        description: "Une chèvre très ordinaire.",
        moves: ["PARALYZER", "HEALING", "TACKLE",],
        imgSrc: "./media/battle/companions/chevrette.png",
        icoSrc: "./assets/battle/companions/rat/rat.png",
    },
    "rat": {
        name: "Rat",
        internalName: "RAT",
        type: "NORMAL",
        baseStats: [30, 56, 35, 72, 25, 35],
        baseEXP: 50,
        description: "Un rat qui aurait bien besoin d'une douche.",
        moves: ["TACKLE",],
        imgSrc: "./media/battle/companions/rat/rat_01.png",
        // imgSrc: [
        //     "../../media/graphic/companion/front/rat/rat.png",
        //     "../../media/graphic/companion/front/rat/rat_01.png",
        // ],
        icoSrc: "./assets/battle/companions/rat/rat.png",
    },
}