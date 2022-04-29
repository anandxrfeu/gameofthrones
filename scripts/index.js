// map array
const map = [
    [0,1,0,0,0,2,0,3],
    [0,0,2,0,0,0,1,0],
    [0,0,0,0,0,0,0,0],
    [1,2,0,0,1,0,0,0],
    [0,0,0,0,0,0,0,0],
    [1,0,2,0,0,2,1,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,2,0,0,1,0],
    ]

const WATER = 0
const PIRATE = 1
const FOOD = 2
const HOME = 3

const ROWS = map.length
const COLUMNS = map[0].length
const SIZE = 96
const SPACE = 0

const gameObjects = [
    [0,0,0,0,0,0,0,0],
    [0,5,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [4,0,0,0,0,0,0,0],
]
const PLAYER = 4
const MONSTER = 5
var playerRow
var playerColumn
var monsterRow
var monsterColumn

var food = 10
var gold = 5
var experience = 0
var gameMessage = "Use the arrow keys to find your way home.";

// get access to stage
var stage = document.querySelector('#stage')

// set Player and Monster Row and Column Variables
for (let row = 0; row < ROWS; row++){
for(let column = 0; column< COLUMNS; column++){
    if(gameObjects[row][column] == PLAYER){
        playerRow = row
        playerColumn = column
    }
    switch(gameObjects[row][column] ){
        case PLAYER:
            playerRow = row
            playerColumn = column
            break
        case MONSTER:
            monsterRow = row
            monsterColumn = column
    }
}
}

render()

function render(){

for(var i = 0; i< (ROWS*COLUMNS) ; i++){
if(stage.hasChildNodes()){
    stage.removeChild(stage.firstChild)
}     
}

for (let row = 0; row < ROWS; row++){
for(let column = 0; column< COLUMNS; column++){
    var cell = document.createElement('div')
    cell.setAttribute('class','cell')
    stage.appendChild(cell)

    cell.style.top = row * (SIZE + SPACE) + 'px'
    cell.style.left = column * (SIZE + SPACE) + 'px'

    switch(map[row][column]){
        case WATER:
            cell.innerHTML = 'W'
            cell.style.backgroundColor = 'lightblue'
            break;
        case PIRATE:
            cell.innerHTML = 'Obstacle'
            cell.style.backgroundColor = 'purple'
            break;       
        case FOOD:
            cell.innerHTML = 'Boost'
            cell.style.backgroundColor = 'green'
            break;
        case HOME:
            cell.innerHTML = 'Home'
            cell.style.backgroundColor = 'gold'
            break;           
        
    }

    switch(gameObjects[row][column]){
        case PLAYER:
            cell.innerHTML = 'Player'
            cell.style.background = 'brown'
            break;
        case MONSTER:
            cell.innerHTML = 'Monster'
            cell.style.backgroundColor = 'black'
            cell.style.color = 'white'
    }

}
}

}

window.addEventListener('keyup',keyupEventHandler)

function keyupEventHandler(event){

    switch(event.keyCode){
    case 38:
        if(playerRow > 0){
            gameObjects[playerRow][playerColumn] = 0
            playerRow--
            gameObjects[playerRow][playerColumn] = 4
        }
        break;
    case 40:
        if(playerRow < (ROWS-1)){
            gameObjects[playerRow][playerColumn] = 0
            playerRow++
            gameObjects[playerRow][playerColumn] = 4               
        }
        break;             
    case 37:
        if(playerColumn > 0 ){
            gameObjects[playerRow][playerColumn] = 0
            playerColumn--
            gameObjects[playerRow][playerColumn] = 4           
        }
        break;   
    case 39:
        if(playerColumn < (COLUMNS -1) ){
            gameObjects[playerRow][playerColumn] = 0
            playerColumn++
            gameObjects[playerRow][playerColumn] = 4          
        }
        break;
    }


    switch(map[playerRow][playerColumn]){
        case WATER:
            console.log('Im in Water')
            break;
        case PIRATE:
            fight()
            break;
        case FOOD:
            trade()
            break;
        case HOME:
            endGame()
            break;
    }

    //every move will consume food
    food--

    if(food <=0 || gold <=0){
        endGame()
    }

    //monster code
    moveMonster()

    console.log('Score: ',food+experience+gold)
    console.log('food: ',food,'gold: ',gold,'exp: ',experience)
    // Render the game
    render()
}

function moveMonster(){
    var UP = 1
    var DOWN = 2
    var LEFT = 3
    var RIGHT = 4

    // Array to store all valid directions
    var validDirections = []
    var direction = undefined

    if(monsterRow>0){
        var thingAbove = map[monsterRow-1][monsterColumn]
        if(thingAbove === WATER){
            validDirections.push(UP)
        }
    }
    if(monsterRow<(ROWS-1)){
        var thingBelow = map[monsterRow+1][monsterColumn]
        if(thingBelow === WATER){
            validDirections.push(DOWN)
        }
    }
    if(monsterColumn > 0 ){
        var thingToTheLeft = map[monsterRow][monsterColumn-1]
        if(thingToTheLeft === WATER){
            validDirections.push(LEFT)
        }
    }
    if(monsterColumn < (COLUMNS -1)){
        var thingToTheRight = map[monsterRow][monsterColumn+1]
        if(thingToTheRight === WATER){
            validDirections.push(RIGHT)
        }
    }
    console.log(validDirections)
    if(validDirections.length){
        var randomNumber = Math.floor(Math.random()*validDirections.length)
        direction = validDirections[randomNumber]
    }
    
    //print direction - to be deleted
    switch(direction){
        case UP:
            console.log("UP")
            break;
        case DOWN:
            console.log("DOWN")
            break;
        case LEFT:
            console.log("LEFT")
            break;
        case RIGHT:
            console.log("RIGHT")
            break;
    }


    //Move the monster in the chosen direction
    switch(direction){
        case UP:
            gameObjects[monsterRow][monsterColumn] = 0
            monsterRow--
            gameObjects[monsterRow][monsterColumn] = MONSTER
            break;
        
        case DOWN:
            gameObjects[monsterRow][monsterColumn] = 0;
            monsterRow++;
            gameObjects[monsterRow][monsterColumn] = MONSTER;
            break;
          
        case LEFT:
            gameObjects[monsterRow][monsterColumn] = 0;
            monsterColumn--;
            gameObjects[monsterRow][monsterColumn] = MONSTER;
            break;
          
        case RIGHT:
            gameObjects[monsterRow][monsterColumn] = 0;
            monsterColumn++;
            gameObjects[monsterRow][monsterColumn] = MONSTER;
    }

}

function trade(){
    console.log('trade for food')
    var foodAvailable = gold + experience
    var foodCost = Math.floor(Math.random()*foodAvailable)
    if(gold > foodCost){
    gold -= foodCost
    food += foodAvailable
    } else{
    experience++
    console.log('Sorry! You dont have enogh gold for food')
    }
}

function fight(){
    console.log('Fight a pirate')
    var shipStrength = food + gold
    var pirateStrength = Math.floor(Math.random()*shipStrength)

    if(pirateStrength > shipStrength){
    var stolenGold = Math.round(pirateStrength/2)
    gold -= stolenGold
    experience++
    }else{
    var pirateGold = Math.round(pirateStrength/2)
    gold += pirateGold
    experience += 2
}
}

function endGame(){
    console.log('Game OVER')
    if(map[playerRow][playerColumn]==3){
    var score = food + gold + experience
    console.log('you have won!')
    }
    if(gold < 0){
    console.log('you have run out of gold')

    } else if(food < 0){
    console.log('you have run out of food')
    }

    window.removeEventListener('keyup',keyupEventHandler)
}