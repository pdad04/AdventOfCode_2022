const fs = require("fs");

const partOne = async () => {
    const data = fs
    .readFileSync("puzzleExample.txt", {encoding: "utf-8"})
    .replace(/\r/g,"")
    .split("\n")

    let mostCalories = 0;
    let individualCals = 0;

    data.forEach(entry => {
        if(entry === ""){
            if(individualCals > mostCalories){
                mostCalories = individualCals;
            }
            individualCals = 0;
        }else{
            individualCals += Number(entry);
        }
    });
    console.log(mostCalories);
}

partOne();

const partTwo = async () => {
    const data = fs
    .readFileSync("puzzleInput.txt", {encoding: "utf-8"})
    .replace(/\r/g,"")
    .split("\n")

    let mostCalories = [];
    let individualCals = 0;
    data.forEach((entry, idx) => {
        
        if(entry === ""){
            mostCalories.push(individualCals);
            individualCals = 0;
        }else{
            individualCals += Number(entry);
        }
    });
    mostCalories.push(individualCals);

    console.log(mostCalories.sort((a,b) => b- a).slice(0,3).reduce((curr, accum) => curr + accum, 0));
}

partTwo();