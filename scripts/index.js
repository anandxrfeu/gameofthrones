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
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [4,0,0,0,0,0,0,0],
]
const PLAYER = 4
var playerRow
var playerColumn

var food = 10
var gold = 5
var experience = 0
var gameMessage = "Use the arrow keys to find your way home.";

// get access to stage
var stage = document.querySelector('#stage')

// set Player Row and Column Variables
for (let row = 0; row < ROWS; row++){
for(let column = 0; column< COLUMNS; column++){
if(gameObjects[row][column]){
    playerRow = row
    playerColumn = column
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

console.log('Score: ',food+experience+gold)
console.log('food: ',food,'gold: ',gold,'exp: ',experience)
// Render the game
render()
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