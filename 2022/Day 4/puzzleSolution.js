const fs = require("fs");
const readline = require("readline"); 


const partOne = async () => {
    const rl = readline.createInterface({
        input: fs.createReadStream("puzzleInput.txt"),
        crlfDelay: Infinity,
    });

    let fullOverlap = 0;

    rl.on("line", line => {
        const pair = line.split(",");
        const pairs = [];
        pair.map(el => pairs.push(el.split("-")));

        if(Number(pairs[1][0]) >= Number(pairs[0][0] ) && Number(pairs[1][1]) <= Number(pairs[0][1])) {
            fullOverlap++
        }else if(Number(pairs[0][0]) >= Number(pairs[1][0]) && Number(pairs[0][1])  <= Number(pairs[1][1])) {
            fullOverlap++;
        }
    })

    await new Promise(res => rl.once("close", res));
    console.log(fullOverlap);

}

// partOne();

const partTwo = async () =>{
    const rl = readline.createInterface({
        input: fs.createReadStream("puzzleInput.txt"),
        crlfDelay: Infinity,
    });

    let overlap = 0;

    rl.on("line", line => {
        const pair = line.split(",");
        const pairs = [];
        pair.map(el => pairs.push(el.split("-")));
        pairs.sort((a,b) => Number(a[0]) - Number(b[0]));

        if(Number(pairs[1][0]) >= Number(pairs[0][0] ) && Number(pairs[1][0]) <= Number(pairs[0][1])) {
            overlap++
        }
    })

    await new Promise(res => rl.once("close", res));
    console.log(overlap);
}

partTwo();