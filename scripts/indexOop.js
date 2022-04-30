//Get a reference to the canvas and output
var canvas = document.querySelector("#canvas");
var output = document.querySelector("#output");

//Add a keyboard listener
window.addEventListener("keydown", keydownHandler, false);


// class instantiations
var trail = new Sprite('trail')
var arya = new Player('arya','/images/arya.png')
var whiteWalker = new Monster('whiteWalker','/images/ww.png')
var baratheon = new House ('baratheon', '/images/boost.png')
var lanister = new House('lanister','/images/obstacle.png')
var stark = new House('stark','/images/home.png')

/**
 * The game map
 * This is a 2 dimentional array used to create the canvas area of the game
 * This map holds stationary characters of the game, such as the westeros houses
 */

var map =
[
  [trail, lanister, trail, trail, trail, lanister, trail, stark],
  [trail, trail, trail, baratheon, trail, trail, trail, trail],
  [trail, baratheon, trail, trail, trail, trail, baratheon, trail],
  [trail, trail, trail, trail, lanister, trail, trail, trail],
  [trail, trail, trail, trail, trail, trail, trail, baratheon],
  [trail, trail, baratheon, trail, trail, lanister, trail, trail],
  [trail, trail, trail, trail, trail, trail, trail, trail],
  [trail, trail, trail, trail, trail, baratheon, trail, trail]
];

/*
 * The game objects map
 * This is also a 2D array that overlaps the game map
 * This map holds the moving characters if the game, sich as Arya and the White Walker
 */
var gameObjects =
[
  [whiteWalker, trail, trail, trail, trail, trail, trail, trail],
  [trail, trail, trail, trail, trail, trail, trail, trail],
  [trail, trail, trail, trail, trail, trail, trail, trail],
  [trail, trail, trail, trail, trail, trail, trail, trail],
  [trail, trail, trail, trail, trail, trail, trail, trail],
  [trail, trail, trail, trail, trail, trail, trail, trail],
  [trail, trail, trail, trail, trail, trail, trail, trail],
  [arya, trail, trail, trail, trail, trail, trail, trail]
];


//The size of each cell
var SIZE = 96;
//Space between cells
var SPACE = 0;

//The number of rows and columns
var ROWS = map.length;
var COLUMNS = map[0].length;

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
      let spriteObject = gameObjects[row][column]
      if(spriteObject.getName() === 'arya'){ 
        arya.playerRow = row;
        arya.playerColumn = column;
      }
      if(spriteObject.getName() === 'whiteWalker'){ 
        whiteWalker.monsterRow = row;
        whiteWalker.monsterColumn = column;
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

	    if(arya.playerRow > 0){
	      gameObjects[arya.playerRow][arya.playerColumn] = new Sprite('trail');
	      arya.playerRow--;
	      gameObjects[arya.playerRow][arya.playerColumn] = arya;
	    }
	    break;
	  
	  case DOWN:
      if(arya.playerRow < ROWS - 1){
	      gameObjects[arya.playerRow][arya.playerColumn] = new Sprite('trail');
	      arya.playerRow++;
	      gameObjects[arya.playerRow][arya.playerColumn] = arya;
	    }
	    break;
	    
	  case LEFT:
	    if(arya.playerColumn > 0){
	      gameObjects[arya.playerRow][arya.playerColumn] = new Sprite('trail');
	      arya.playerColumn--;
	      gameObjects[arya.playerRow][arya.playerColumn] = arya;
	    }
	    break;  
	    
	  case RIGHT:
	    if(arya.playerColumn < COLUMNS - 1){
	      gameObjects[arya.playerRow][arya.playerColumn] = new Sprite('trail');
	      arya.playerColumn++;
	      gameObjects[arya.playerRow][arya.playerColumn] = arya;
	    }
	    break; 
  }
  
  //find out what kind of cell the PLAYER is on
  let spriteObject = map[arya.playerRow][arya.playerColumn]
  switch(spriteObject.getName()){
    
    case 'trail':
      gameMessage = "Arya walks through the kingdoms."
      break;
    
    case 'lanister':
      arya.fight();
      break; 
    
    case 'baratheon':
      arya.trade();
      break; 
      
    case 'stark':
      endGame();
      break;      
  }
  
  //Move the monster
  whiteWalker.move()
  //moveMonster();
  
  //Find out if Arya and WhiteWalker are on the same cell in the gameObjects array
  if(gameObjects[arya.playerRow][arya.playerColumn].getName() === 'whiteWalker'){
    endGame();
  }
  
  //Subtract some food each turn
  arya.eat()
  
  //Find out if the PLAYER has run out of food or gold
  if(!arya.hasFood() || !arya.hasGold())
  {
    endGame();
  }
  
  //Render the game
  render();
}

function endGame()
{
  if(map[arya.playerRow][arya.playerColumn].getName() === 'stark')
  {
    //Calculate the score
    var score = arya.food + arya.gold + arya.experience;
    
    //Display the game message
    gameMessage 
      = "Arya has made it to winterfell ALIVE! " + "<br>Final Score: " + score; 
  }
  else if(gameObjects[arya.playerRow][arya.playerColumn].getName()  === 'whiteWalker')
  {
    gameMessage 
      = "Arya has been killed by a White Walker!";
  }
  else
  {
    //Display the game message
    if(arya.gold <= 0)
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
      let spriteObject = map[row][column]
      switch(spriteObject.getName()){
        case 'trail':
        cell.style.backgroundColor = 'white'
        break;

        case 'baratheon':
            cell.src = baratheon.bannerImage
          break; 

        case 'lanister':
            cell.src = lanister.bannerImage
          break; 

        case 'stark':
            cell.src = stark.bannerImage
          break;   
      }  
      
      //Add the PLAYER and monster from the gameObjects array
      spriteObject = gameObjects[row][column]
	    switch(spriteObject.getName()){
	      case 'arya':
	        cell.src = arya.playerImage
	        break;   
	        
	      case 'whiteWalker':
	        cell.src = whiteWalker.monsterImage
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
	  += "<br>Gold: " + arya.gold + ", Food: " 
	  + arya.food + ", Experience: " + arya.experience;
}