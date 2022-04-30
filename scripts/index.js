//Get a reference to the canvas and output
var canvas = document.querySelector("#canvas");
var output = document.querySelector("#output");

//Add a keyboard listener
window.addEventListener("keydown", keydownHandler, false);


/**
 * The game map
 * This is a 2 dimentional array used to create the canvas area of the game
 * This map holds stationary characters of the game, such as the westeros houses
 */

var map =
[
  [0, 2, 0, 0, 0, 2, 0, 3],
  [0, 0, 0, 1, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1],
  [2, 0, 1, 0, 0, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0]
];

/*
 * The game objects map
 * This is also a 2D array that overlaps the game map
 * This map holds the moving characters if the game, sich as Arya and the White Walker
 */
var gameObjects =
[
  [5, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [4, 0, 0, 0, 0, 0, 0, 0]
];

//Map code
var TRAIL = 0;
var BOOST = 1;
var OBSTACLE = 2;
var HOME = 3;
var PLAYER = 4;
var MONSTER = 5;

//The size of each cell
var SIZE = 96;
//Space between cells
var SPACE = 0;

//The number of rows and columns
var ROWS = map.length;
var COLUMNS = map[0].length;

//Variables to track the start positions of the Player and the Monster
var playerRow;
var playerColumn;
var monsterRow;
var monsterColumn;

// Find start position of Arya and the white walker
locatePlayerAndMonster()

//Arrow key codes
var UP = 38;
var DOWN = 40;
var RIGHT = 39;
var LEFT = 37;

//The game variables
var food = 10;
var gold = 10;
var experience = 0;
var gameMessage = "";

render();

/**
 * Function locates where on the gameObjects array are the starting positions
 * of Arya and the WhiteWalker
 */
function locatePlayerAndMonster(){
  for(var row = 0; row < ROWS; row++) {	
    for(var column = 0; column < COLUMNS; column++) {
      if(gameObjects[row][column] === PLAYER){ 
        playerRow = row;
        playerColumn = column;
      }
      if(gameObjects[row][column] === MONSTER){ 
        monsterRow = row;
        monsterColumn = column;
      }
    }
  }
}

/**
 * Event handler function which is invoked when any key is pressed
 * @param event 
 */
function keydownHandler(event){ 

  //Move player position UP, DOWN, LEFT and BOTTOM
  switch(event.keyCode){
    case UP:
      
       //If row > 0, then set current location of player = 0
       //And reduce playerRow by 1
       //And set current location of player with new row and column value

	    if(playerRow > 0){
	      gameObjects[playerRow][playerColumn] = 0;
	      playerRow--;
	      gameObjects[playerRow][playerColumn] = PLAYER;
	    }
	    break;
	  
	  case DOWN:
      if(playerRow < ROWS - 1){
	      gameObjects[playerRow][playerColumn] = 0;
	      playerRow++;
	      gameObjects[playerRow][playerColumn] = PLAYER;
	    }
	    break;
	    
	  case LEFT:
	    if(playerColumn > 0){
	      gameObjects[playerRow][playerColumn] = 0;
	      playerColumn--;
	      gameObjects[playerRow][playerColumn] = PLAYER;
	    }
	    break;  
	    
	  case RIGHT:
	    if(playerColumn < COLUMNS - 1){
	      gameObjects[playerRow][playerColumn] = 0;
	      playerColumn++;
	      gameObjects[playerRow][playerColumn] = PLAYER;
	    }
	    break; 
  }
  
  //find out what kind of cell the PLAYER is on
  switch(map[playerRow][playerColumn]){
    case TRAIL:
      gameMessage = "Arya walks through the kingdoms."
      break;
    
    case OBSTACLE:
      fight();
      break; 
    
    case BOOST:
      trade();
      break; 
      
    case HOME:
      endGame();
      break;      
  }
  
  //Move the monster
  moveMonster();
  
  //Find out if Arya and WhiteWalker are on the same cell in the gameObjects array
  if(gameObjects[playerRow][playerColumn] === MONSTER){
    endGame();
  }
  
  //Subtract some food each turn
  food--;
  
  //Find out if the PLAYER has run out of food or gold
  if(food <= 0 || gold <= 0)
  {
    endGame();
  }
  
  //Render the game
  render();
}

/**
 * Function moves the White Walker in a random manner to a nearby cell
 */
function moveMonster(){
  //The 4 possible directions that the monster can move
  var UP = 1;
  var DOWN = 2;
  var LEFT = 3;
  var RIGHT = 4;
  
  // An array to save valid directions where the white walker can travel
  var validDirections = [];
  
  // The direction where the white walker will travel. This will be chocen randomly
  var direction = undefined;
  
  if(monsterRow > 0){
    var thingAbove = map[monsterRow - 1][monsterColumn];
    if(thingAbove === TRAIL){
	    validDirections.push(UP);
	  }
  }
  if(monsterRow < ROWS - 1){ 
    var thingBelow = map[monsterRow + 1][monsterColumn];
    if(thingBelow === TRAIL){
	    validDirections.push(DOWN);
	  }
  }
  if(monsterColumn > 0){
    var thingToTheLeft = map[monsterRow][monsterColumn - 1];
    if(thingToTheLeft === TRAIL){
	    validDirections.push(LEFT);
	  }
  } 
  if(monsterColumn < COLUMNS - 1){
    var thingToTheRight = map[monsterRow][monsterColumn + 1];
    if(thingToTheRight === TRAIL){
	    validDirections.push(RIGHT);
	  }
  } 

  // Randomly choose a direction for the whiteWalker to travel
  if(validDirections.length !== 0){
    var randomNumber = Math.floor(Math.random() * validDirections.length);
    direction = validDirections[randomNumber];
  }
  
  //Move the WhiteWalker in the chosen direction
  switch(direction){
    case UP:
      gameObjects[monsterRow][monsterColumn] = 0;
		  monsterRow--; 
		  gameObjects[monsterRow][monsterColumn] = MONSTER;
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


/**
 * When Arya enters territory of a house that owes alligience to 
 * House Stark, she trades her gold coins for food and ale
 * Arya also gains experience trading
 */
function trade(){
  // Calculate how much food the house has
  var BOOSTsFood = experience + gold;
  // Calculate the cost of food
  var cost = Math.ceil(Math.random() * BOOSTsFood);
  
  //Let Arya buy food if she has enough gold
  if(gold > cost){
    food += BOOSTsFood;
    gold -= cost;
    experience += 2;
    
    gameMessage 
      = "Arya bought " + BOOSTsFood + " pieces of bread"
      + " for " + cost + " gold coins."
  }else{
    // Arya does not have enough gold to buy food
     experience += 1;
     gameMessage = "Arya doesn't have enough gold to buy food."
  }
}

/**
 * When Arya enteres a territory of an enemy house, she has to fight
 * If Arya wins, she gets half of the enemies gold
 * If Arya looses, she looses all or part of her gold
 * In either case, Arya gains experience
 */
function fight(){
  
  //Arya's strength
  var PLAYERStrength = Math.ceil((food + gold) / 2);
  
  //House`s strength is a random number between 1 and the Arya's strength
  var OBSTACLEStrength = Math.ceil(Math.random() * PLAYERStrength * 2);
  
  // Opponent House Wins
  if(OBSTACLEStrength > PLAYERStrength){
    var stolenGold = Math.round(OBSTACLEStrength / 2);
    gold -= stolenGold;

    //Arya gains experience
    experience += 1;
    
    //Update the game message
    gameMessage 
    = "Arya fought and LOST " + stolenGold + " gold pieces."

  }else{
    // Arya wins
    var OBSTACLEGold = Math.round(OBSTACLEStrength / 2);
    gold += OBSTACLEGold;
    
    //Arya gains experience  
    experience += 2;
    
    //Update the game message
    gameMessage 
      = "Arya fought and WON " + OBSTACLEGold + " gold pieces."
  } 
}

function endGame()
{
  if(map[playerRow][playerColumn] === HOME)
  {
    //Calculate the score
    var score = food + gold + experience;
    
    //Display the game message
    gameMessage 
      = "Arya has made it to winterfell ALIVE! " + "<br>Final Score: " + score; 
  }
  else if(gameObjects[playerRow][playerColumn] === MONSTER)
  {
    gameMessage 
      = "Arya has been killed by a White Walker!";
  }
  else
  {
    //Display the game message
    if(gold <= 0)
    {
      gameMessage = " <br>Arya runs out of gold!"; 
    }
    else
    {
      gameMessage = " <br>Arya runs out of food!"; 
    }
    
    gameMessage 
      += " , and dies a painfull death!"; 
  }
  
  //Remove the keyboard listener to end the game
  window.removeEventListener("keydown", keydownHandler, false);
}

function render()
{
  //Clear the canvas of img cells from the previous turn
  if(canvas.hasChildNodes()){
    for(var i = 0; i < ROWS * COLUMNS; i++) {	 
      canvas.removeChild(canvas.firstChild);
    }
  }
  
  //Render the canvas by looping through the map arrays
  for(var row = 0; row < ROWS; row++){	
    for(var column = 0; column < COLUMNS; column++){ 
      //Create a img tag called cell
      var cell = document.createElement("img");

      //Set it's CSS class to "cell"
      cell.setAttribute("class", "cell");

      //Add the img tag to the <div id="canvas"> tag
      canvas.appendChild(cell);

      //Find the correct image for this map cell
      switch(map[row][column]){
        case TRAIL:
        cell.style.backgroundColor = 'white'
        break;

        case BOOST:
            cell.src = '/images/boost.png'
          break; 

        case OBSTACLE:
            cell.src = '/images/obstacle.png'
          break; 

        case HOME:
            cell.src = '/images/home.png'
          break;   
      }  
      
      //Add the PLAYER and monster from the gameObjects array
	    switch(gameObjects[row][column]){
	      case PLAYER:
	        cell.src = '/images/arya.png'
	        break;   
	        
	      case MONSTER:
	        cell.src = '/images/ww.png'
	        break;  
	    } 
  
      //Position the cell 
      cell.style.top = row * (SIZE + SPACE) + "px";
      cell.style.left = column * (SIZE + SPACE) + "px";
    }
  }
  
  //Display the game message
	output.innerHTML = gameMessage;
	
	//Display the player's food, gold, and experience
	output.innerHTML 
	  += "<br>Gold: " + gold + ", Food: " 
	  + food + ", Experience: " + experience;
}