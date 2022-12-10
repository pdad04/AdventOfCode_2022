const fs = require("fs");


/*
    --- Day 8: Treetop Tree House ---
    The expedition comes across a peculiar patch of tall trees all planted carefully in a grid. The Elves explain that a previous expedition planted these trees as a reforestation effort. Now, they're curious if this would be a good location for a tree house.

    First, determine whether there is enough tree cover here to keep a tree house hidden. To do this, you need to count the number of trees that are visible from outside the grid when looking directly along a row or column.

    The Elves have already launched a quadcopter to generate a map with the height of each tree (your puzzle input). For example:

    30373
    25512
    65332
    33549
    35390
    Each tree is represented as a single digit whose value is its height, where 0 is the shortest and 9 is the tallest.

    A tree is visible if all of the other trees between it and an edge of the grid are shorter than it. Only consider trees in the same row or column; that is, only look up, down, left, or right from any given tree.

    All of the trees around the edge of the grid are visible - since they are already on the edge, there are no trees to block the view. In this example, that only leaves the interior nine trees to consider:

    The top-left 5 is visible from the left and top. (It isn't visible from the right or bottom since other trees of height 5 are in the way.)
    The top-middle 5 is visible from the top and right.
    The top-right 1 is not visible from any direction; for it to be visible, there would need to only be trees of height 0 between it and an edge.
    The left-middle 5 is visible, but only from the right.
    The center 3 is not visible from any direction; for it to be visible, there would need to be only trees of at most height 2 between it and an edge.
    The right-middle 3 is visible from the right.
    In the bottom row, the middle 5 is visible, but the 3 and 4 are not.
    With 16 trees visible on the edge and another 5 visible in the interior, a total of 21 trees are visible in this arrangement.

    Consider your map; how many trees are visible from outside the grid?

    Your puzzle answer was 1698.
*/

const partOne = () => {
    const data = fs
        .readFileSync("puzzleInput.txt", {encoding: "utf-8"})
        .replace(/\r/g, "")
        .split("\n")
        .map(el => el.split(""));

    let visibleTrees = (data.length - 2) * 2 + data[0].length * 2;

    for(let i = 1; i < data.length - 1; i++){
        for(let j = 1; j < data[i].length - 1; j++){
            let rightTrees = j + 1;
            let leftTrees = j - 1;
            let topTrees = i - 1;
            let belowTrees = i + 1;
            let currentTree = data[i][j]
            let visible = true;
            
            // Check Right of current tree
            while(rightTrees < data[i].length){
                if(currentTree > data[i][rightTrees]){
                    rightTrees++
                    continue;
                }
                visible = false;
                break;
            }
            // The tree is visible from the right
            // add it to total and move on to next 
            // iteration of the loop.
            if(visible){
                visibleTrees++;
                continue;
            }
            
            // Check left of current tree
            visible = true;
            while(leftTrees >= 0){
                if(currentTree > data[i][leftTrees]){
                    leftTrees--;
                    continue;
                }
                visible = false;
                break;
            }
            
            if(visible){
                visibleTrees++;
                continue;
            }

            // Check up current tree;
            visible = true;
            while(topTrees >= 0){
                if(currentTree > data[topTrees][j]){
                    topTrees--
                    continue;
                }
                visible = false;
                break;
            }

            if(visible){
                visibleTrees++;
                continue;
            }

            // Check below current tree;
            visible = true;
            while(belowTrees < data.length){
                if(currentTree > data[belowTrees][j]){
                    belowTrees++;
                    continue;
                }
                visible = false;
                break;
            }

            if(visible) visibleTrees++;
        }
    }
    console.log(visibleTrees)  
}

partOne(); 

/*
    --- Part Two ---
    Content with the amount of tree cover available, the Elves just need to know the best spot to build their tree house: they would like to be able to see a lot of trees.

    To measure the viewing distance from a given tree, look up, down, left, and right from that tree; stop if you reach an edge or at the first tree that is the same height or taller than the tree under consideration. (If a tree is right on the edge, at least one of its viewing distances will be zero.)

    The Elves don't care about distant trees taller than those found by the rules above; the proposed tree house has large eaves to keep it dry, so they wouldn't be able to see higher than the tree house anyway.

    In the example above, consider the middle 5 in the second row:

    30373
    25512
    65332
    33549
    35390
    Looking up, its view is not blocked; it can see 1 tree (of height 3).
    Looking left, its view is blocked immediately; it can see only 1 tree (of height 5, right next to it).
    Looking right, its view is not blocked; it can see 2 trees.
    Looking down, its view is blocked eventually; it can see 2 trees (one of height 3, then the tree of height 5 that blocks its view).
    A tree's scenic score is found by multiplying together its viewing distance in each of the four directions. For this tree, this is 4 (found by multiplying 1 * 1 * 2 * 2).

    However, you can do even better: consider the tree of height 5 in the middle of the fourth row:

    30373
    25512
    65332
    33549
    35390
    Looking up, its view is blocked at 2 trees (by another tree with a height of 5).
    Looking left, its view is not blocked; it can see 2 trees.
    Looking down, its view is also not blocked; it can see 1 tree.
    Looking right, its view is blocked at 2 trees (by a massive tree of height 9).
    This tree's scenic score is 8 (2 * 2 * 1 * 2); this is the ideal spot for the tree house.

    Consider each tree on your map. What is the highest scenic score possible for any tree?

    Your puzzle answer was 672280.
*/
const partTwo = () => {
    const data = fs
    .readFileSync("puzzleInput.txt", {encoding: "utf-8"})
    .replace(/\r/g, "")
    .split("\n")
    .map(el => el.split(""));

    let scenicScore = 0;

    for(let i = 1; i < data.length - 1; i++){
        for(let j = 1; j < data[i].length - 1; j++){
            let rightTrees = j + 1;
            let leftTrees = j - 1;
            let topTrees = i - 1;
            let belowTrees = i + 1;
            let currentTree = data[i][j]
            let visible = true;
            
            // Check Right of current tree
            while(rightTrees < data[i].length){
                if(currentTree > data[i][rightTrees]){
                    rightTrees++
                    continue;
                }
                visible = false;
                break;
            }
            // The tree is visible from the right
            // add it to total and move on to next 
            // iteration of the loop.
            if(visible){
                scenicScore = Math.max(calculateScore(i,j, data), scenicScore);
                continue;
            }
            
            // Check left of current tree
            visible = true;
            while(leftTrees >= 0){
                if(currentTree > data[i][leftTrees]){
                    leftTrees--;
                    continue;
                }
                visible = false;
                break;
            }
            
            if(visible){
                scenicScore = Math.max(calculateScore(i,j, data), scenicScore);
                continue;
            }

            // Check up current tree;
            visible = true;
            while(topTrees >= 0){
                if(currentTree > data[topTrees][j]){
                    topTrees--;
                    continue;
                }
                visible = false;
                break;
            }

            if(visible){
                scenicScore = Math.max(calculateScore(i,j, data), scenicScore);
                continue;
            }

            // Check below current tree;
            visible = true;
            while(belowTrees < data.length){
                if(currentTree > data[belowTrees][j]){
                    belowTrees++;
                    continue;
                }
                visible = false;
                break;
            }

            if(visible) {
                scenicScore = Math.max(calculateScore(i,j, data), scenicScore);
            }
        }


        function calculateScore(i, j, data){
            const current = data[i][j];
            let up = i - 1;
            let down = i + 1
            let left = j - 1;
            let right = j + 1;
            let rCount = 0;
            let lCount = 0;
            let uCount = 0;
            let dCount = 0;

            

            while(up >= 0){
                if(data[up][j] < current){
                    uCount++
                    up--;
                    continue;
                }else if(current === data[up][j] || data[up][j] > current){
                    uCount++;
                }
                break;
            }

            while(down < data.length){
                if(data[down][j] < current){
                    dCount++;
                    down++;
                    continue;
                }else if(data[down][j] === current || data[down][j] > current){
                    dCount++;
                }
                break;
            }

            while(left >= 0){
                if(data[i][left] < current){
                    lCount++;
                    left--;
                    continue;
                }else if(data[i][left] === current || data[i][left] > current){
                    lCount++;
                }
                break;
            }

            while(right < data[i].length){
                if(data[i][right] < current){
                    rCount++;
                    right++;
                    continue;
                }else if(data[i][right] === current || data[i][right] > current){
                    rCount++;
                }
                break;
            }

            return uCount * dCount * lCount * rCount;
        }
    }

    console.log(scenicScore);

}

partTwo();
