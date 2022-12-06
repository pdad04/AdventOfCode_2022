const fs = require("fs");
const readline = require("readline"); 


const partOne = async() => {
    const one = ["B","V","W","T","Q","N","H","D"];
    const two = ["B","W","D"];
    const three = ["C","J","W","Q","S","T"];
    const four = ["P","T","Z","N","R","J","F"];
    const five = ["T","S","M","J","V","P","G"];
    const six = ["N","T","F","W","B"];
    const seven = ["N","V","H","F","Q","D","L","B"];
    const eight = ["R","F","P","H"]
    const nine = ["H","P","N","L","B","M","S","Z"];


    const moveMap = new Map([[1, one], [2,two],[3, three],[4,four],[5,five],[6,six],[7,seven],[8,eight],[9,nine]]);

    const rl = readline.createInterface({
        input: fs.createReadStream("puzzleInput.txt"),
        crlfDelay: Infinity,
    });

    rl.on("line", line => {
        const moves = line.split(/\W/).filter(el => Number(el) > 0).map(el => Number(el));
        const fromStack = moveMap.get(moves[1]);
        const toStack = moveMap.get(moves[2]);
        let movedCount = 0;

        while(movedCount < moves[0] && fromStack.length){   
            toStack.unshift(fromStack.shift());
            movedCount++;

        }
        
    })


    await new Promise(res => rl.once("close", res));
    
    let topOfStack = "";
    for(let i = 1; i <= 9; i++){
        topOfStack += moveMap.get(i).shift();
    }
    console.log(topOfStack);

}

partOne();