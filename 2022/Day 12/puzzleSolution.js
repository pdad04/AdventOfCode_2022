const fs = require("fs");


/*
    -- Day 12: Hill Climbing Algorithm ---
    You try contacting the Elves using your handheld device, but the river you're following must be too low to get a decent signal.

    You ask the device for a heightmap of the surrounding area (your puzzle input). The heightmap shows the local area from above broken into a grid; the elevation of each square of the grid is given by a single lowercase letter, where a is the lowest elevation, b is the next-lowest, and so on up to the highest elevation, z.

    Also included on the heightmap are marks for your current position (S) and the location that should get the best signal (E). Your current position (S) has elevation a, and the location that should get the best signal (E) has elevation z.

    You'd like to reach E, but to save energy, you should do it in as few steps as possible. During each step, you can move exactly one square up, down, left, or right. To avoid needing to get out your climbing gear, the elevation of the destination square can be at most one higher than the elevation of your current square; that is, if your current elevation is m, you could step to elevation n, but not to elevation o. (This also means that the elevation of the destination square can be much lower than the elevation of your current square.)

    For example:

    Sabqponm
    abcryxxl
    accszExk
    acctuvwj
    abdefghi
    Here, you start in the top-left corner; your goal is near the middle. You could start by moving down or right, but eventually you'll need to head toward the e at the bottom. From there, you can spiral around to the goal:

    v..v<<<<
    >v.vv<<^
    .>vv>E^^
    ..v>>>^^
    ..>>>>>^
    In the above diagram, the symbols indicate whether the path exits each square moving up (^), down (v), left (<), or right (>). The location that should get the best signal is still E, and . marks unvisited squares.

    This path reaches the goal in 31 steps, the fewest possible.

    What is the fewest steps required to move from your current position to the location that should get the best signal?

    Your puzzle answer was 383.
*/


const partOne = () => {
    const grid = fs.readFileSync("puzzleInput.txt",{encoding: "utf-8"})
        .replace(/\r/g, "")
        .split("\n")
        .map(elevation => elevation.split(""));


    // Treat the grid as a graph and use a SPF algorithm
    class River{
        constructor(){
            this.adjacencyList = {};
            this.start = null;
            this.end = null;

        }

        addElevation(rowIdx, row){
            for(let i = 0; i < row.length; i++){
                const vertex = `${rowIdx},${i}`
                this.adjacencyList[vertex] = [];

                let currentSquareCode = grid[rowIdx][i].charCodeAt(0);
                let elevationDiff = 0;

                // Check if square is the starting point (S)
                if(currentSquareCode === 83) {
                    this.start = `${rowIdx},${i}`;
                    // 'S' square gets assigned elevation of 'a'
                    currentSquareCode = "a".charCodeAt(0);
                }

                // Check if square is the ending point (E)
                // If it is we don't need to fill in the adjacent
                // squares as 'E' is the end.
                if(currentSquareCode === 69) {
                    this.end = `${rowIdx},${i}`;
                    continue;
                }

                /*************************************************************** 
                *    Check all directions for adjacency.                       *
                *    If 'E' is adjacent then we will use the char code for 'z' *
                *    as this is what the instructions stated.                  *
                ****************************************************************/

                // Check left to see if it's adjacent
                if(i > 0){
                    const leftSquareCode = grid[rowIdx][i - 1] === "E" ? "z".charCodeAt(0) : grid[rowIdx][i - 1].charCodeAt(0);
                    elevationDiff = leftSquareCode - currentSquareCode
                    if(elevationDiff <= 1) this.adjacencyList[vertex].push({"square":`${rowIdx},${i - 1}`, "elevation": 1 }) 
                }

                // Check right to see if it's adjacent
                if(i < row.length - 1){
                    const rightSquareCode = grid[rowIdx][i + 1] === "E" ? "z".charCodeAt(0) : grid[rowIdx][i + 1].charCodeAt(0);
                    elevationDiff = rightSquareCode - currentSquareCode;
                    if(elevationDiff <= 1) this.adjacencyList[vertex].push({"square":`${rowIdx},${i + 1}`, "elevation": 1})
                }

                // Check up
                if(rowIdx > 0){
                    const topSquareCode = grid[rowIdx - 1][i] === "E" ? "z".charCodeAt(0) : grid[rowIdx - 1][i].charCodeAt(0);
                    elevationDiff = topSquareCode - currentSquareCode;
                    if(elevationDiff <= 1) this.adjacencyList[vertex].push({"square": `${rowIdx - 1},${i}`, "elevation": 1});
                }

                // Check down
                if(rowIdx < grid.length - 1){
                    const bottomSquareCode = grid[rowIdx + 1][i] === "E" ? "z".charCodeAt(0) : grid[rowIdx + 1][i].charCodeAt(0);
                    elevationDiff = bottomSquareCode - currentSquareCode;
                    if(elevationDiff <= 1) this.adjacencyList[vertex].push({"square": `${rowIdx + 1},${i}`, "elevation": 1});
                }
            }
        }

        findShortestPath(start, end){
            const squares = new PriorityQueue();
            const distances = {};
            const previous = {};
            let smallest;
            // Setting initial state
            for(let vertex in this.adjacencyList){
                if(vertex === start){
                    distances[vertex] = 0;
                    squares.enqueue(vertex,0)
                }else{
                    distances[vertex] = Infinity;
                    squares.enqueue(vertex, Infinity);
                }
                previous[vertex] = null;
            }
            
            while(squares.values.length){
                smallest = squares.dequeue().val;
                if(smallest === end){
                    console.log("Shortest Path from A to E: ", distances[end]);
                    return;
                }

                if(smallest || distances[smallest] !== Infinity){
                    for(let neighbor in this.adjacencyList[smallest]){
                        // find neighbor node
                        let nextSquare = this.adjacencyList[smallest][neighbor]
                        // calculate new distance to neighbor
                        let candidate = distances[smallest] + nextSquare.elevation
                        let nextNeighbor = nextSquare.square
                        if(candidate < distances[nextNeighbor]){
                            distances[nextNeighbor] = candidate;
                            previous[nextNeighbor] = smallest;
                            squares.enqueue(nextNeighbor, candidate);
                        }
                    }
                }
            }
        }
    }

    // PQ using basic sorting.
    class PriorityQueue {
        constructor(){
            this.values = [];
        }

        enqueue(val, priority){
            this.values.push({val, priority});
            this.sort();
        }

        dequeue(){
            return this.values.shift();
        }

        sort(){
            this.values.sort((a,b) => a.priority - b.priority);
        }
    }

    const river = new River();
    for(let i = 0; i < grid.length; i++){
        river.addElevation(i, grid[i]);
    }

    river.findShortestPath(river.start, river.end);
}

partOne();

/*
    --- Part Two ---
    As you walk up the hill, you suspect that the Elves will want to turn this into a hiking trail. The beginning isn't very scenic, though; perhaps you can find a better starting point.

    To maximize exercise while hiking, the trail should start as low as possible: elevation a. The goal is still the square marked E. However, the trail should still be direct, taking the fewest steps to reach its goal. So, you'll need to find the shortest path from any square at elevation a to the square marked E.

    Again consider the example from above:

    Sabqponm
    abcryxxl
    accszExk
    acctuvwj
    abdefghi
    Now, there are six choices for starting position (five marked a, plus the square marked S that counts as being at elevation a). If you start at the bottom-left square, you can reach the goal most quickly:

    ...v<<<<
    ...vv<<^
    ...v>E^^
    .>v>>>^^
    >^>>>>>^
    This path reaches the goal in only 29 steps, the fewest possible.

    What is the fewest steps required to move starting from any square with elevation a to the location that should get the best signal?

Your puzzle answer was 377.
*/

const partTwo = () => {
    const grid = fs.readFileSync("puzzleInput.txt",{encoding: "utf-8"})
        .replace(/\r/g, "")
        .split("\n")
        .map(elevation => elevation.split(""));

    // Since we have multiple starting points now, the start
    // for this class will be an array of all the starting points.
    class River{
        constructor(){
            this.adjacencyList = {};
            this.start = [];
            this.end = null;

        }

        addElevation(rowIdx, row){
            for(let i = 0; i < row.length; i++){
                const vertex = `${rowIdx},${i}`
                this.adjacencyList[vertex] = [];

                let currentSquareCode = grid[rowIdx][i].charCodeAt(0);
                let elevationDiff = 0;

                // Check if square is the starting point (S) or "a"
                if(currentSquareCode === 83 || currentSquareCode === 97) {
                    this.start.push(`${rowIdx},${i}`);
                    // 'S' square gets assigned elevation of 'a'
                    currentSquareCode = "a".charCodeAt(0);
                }
                // Check if square is the ending point (E)
                if(currentSquareCode === 69) {
                    this.end = `${rowIdx},${i}`;
                    continue;
                    // 'E' square getsa assigned elevation of 'z'
                    currentSquareCode = "z".charCodeAt(0);
                }

                // Check left to see if it's adjacent
                if(i > 0){
                    const leftSquareCode = grid[rowIdx][i - 1] === "E" ? "z".charCodeAt(0) : grid[rowIdx][i - 1].charCodeAt(0);
                    elevationDiff = leftSquareCode - currentSquareCode
                    if(elevationDiff <= 1) this.adjacencyList[vertex].push({"square":`${rowIdx},${i - 1}`, "elevation": 1 }) 
                }

                // Check right to see if it's adjacent
                if(i < row.length - 1){
                    const rightSquareCode = grid[rowIdx][i + 1] === "E" ? "z".charCodeAt(0) : grid[rowIdx][i + 1].charCodeAt(0);
                    elevationDiff = rightSquareCode - currentSquareCode;
                    if(elevationDiff <= 1) this.adjacencyList[vertex].push({"square":`${rowIdx},${i + 1}`, "elevation": 1})
                }

                // Check up
                if(rowIdx > 0){
                    const topSquareCode = grid[rowIdx - 1][i] === "E" ? "z".charCodeAt(0) : grid[rowIdx - 1][i].charCodeAt(0);
                    elevationDiff = topSquareCode - currentSquareCode;
                    if(elevationDiff <= 1) this.adjacencyList[vertex].push({"square": `${rowIdx - 1},${i}`, "elevation": 1});
                }

                // Check down
                if(rowIdx < grid.length - 1){
                    const bottomSquareCode = grid[rowIdx + 1][i] === "E" ? "z".charCodeAt(0) : grid[rowIdx + 1][i].charCodeAt(0);
                    elevationDiff = bottomSquareCode - currentSquareCode;
                    if(elevationDiff <= 1) this.adjacencyList[vertex].push({"square": `${rowIdx + 1},${i}`, "elevation": 1});
                }
            }
        }

        findShortestPath(start, end){
            const squares = new PriorityQueue();
            const distances = {};
            const previous = {};
            let smallest;
            // Setting initial state
            for(let vertex in this.adjacencyList){
                if(vertex === start){
                    distances[vertex] = 0;
                    squares.enqueue(vertex,0)
                }else{
                    distances[vertex] = Infinity;
                    squares.enqueue(vertex, Infinity);
                }
                previous[vertex] = null;
            }
            
            while(squares.values.length){
                smallest = squares.dequeue().val;
                if(smallest === end){
                    // console.log("Shortest Path from A to E: ", distances[end]);
                    return distances[end];
                }

                if(smallest || distances[smallest] !== Infinity){
                    for(let neighbor in this.adjacencyList[smallest]){
                        // find neighbor node
                        let nextSquare = this.adjacencyList[smallest][neighbor]
                        // calculate new distance to neighbor
                        let candidate = distances[smallest] + nextSquare.elevation
                        let nextNeighbor = nextSquare.square
                        if(candidate < distances[nextNeighbor]){
                            distances[nextNeighbor] = candidate;
                            previous[nextNeighbor] = smallest;
                            squares.enqueue(nextNeighbor, candidate);
                        }
                    }
                }
            }
        }
    }

    class PriorityQueue {
        constructor(){
            this.values = [];
        }

        enqueue(val, priority){
            this.values.push({val, priority});
            this.sort();
        }

        dequeue(){
            return this.values.shift();
        }

        sort(){
            this.values.sort((a,b) => a.priority - b.priority);
        }
    }

    const river = new River();
    const allDistances = [];
    for(let i = 0; i < grid.length; i++){
        river.addElevation(i, grid[i]);
    }

    // Find the shortest path for all starting points.
    for(const start of river.start){
        allDistances.push(river.findShortestPath(start,river.end));
    }
    // Get the smallest of all the shortest paths.
    console.log(Math.min(...allDistances));

}

partTwo();