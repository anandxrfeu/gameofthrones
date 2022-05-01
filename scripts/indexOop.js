//Get a reference dom elements
var canvas = document.querySelector("#canvas");
var gameMessageText = document.querySelector("#gameMessage");
var playBtn = document.getElementById("play")
var bgAudioBtn = document.getElementById("bgAudioBtn")
var bgAudio = document.getElementById("bgAudio")
var minute = document.getElementById('min')
var second = document.getElementById('sec')

playBtn.addEventListener('click',playGame)
bgAudioBtn.addEventListener('click',toggleMusic)

function toggleMusic(){
  if(bgAudioBtn.innerHTML === 'Music OFF'){
    bgAudioBtn.innerHTML = 'Music ON'
    bgAudio.play()
  }else{
    bgAudioBtn.innerHTML = 'Music OFF'
    bgAudio.pause()
  }
}

var seconds = 70

function playGame(){

    if(playBtn.innerHTML === 'replay'){
      console.log('im in replay')
      location.reload()
    }else{
      //Logic to disable play button
      playBtn.classList.toggle('play')
      playBtn.classList.toggle('replay')
      playBtn.removeEventListener('click',playGame)

      intervalId = setInterval(()=>{
        seconds--
        displayTimer()
        //Add a keyboard listener
        window.addEventListener("keydown", keydownHandler);
        // Find start position of Arya and the white walker
        locatePlayerAndMonster()

      if(seconds === 0){
        endGame()
        clearInterval(intervalId)
        seconds = 70
        playBtn.classList.toggle('replay')
        playBtn.classList.toggle('play')
        playBtn.addEventListener('click',playGame)
        }
      },1000)
    }
    
}

function displayTimer(){
  minute.innerHTML = Math.floor(seconds / 60)
  second.innerHTML = seconds % 60
}


// class instantiations
var trail = new Sprite('trail')
var arya = new Player('arya','/images/arya.png')
var whiteWalker = new Monster('whiteWalker','/images/white-walker.png')
var baratheon = new House ('baratheon', '/images/baratheon.png')
var lannister = new House('lannister','/images/lannister.png')
var arryn = new House('arryn','/images/arryn.png')
var martell = new House('martell','/images/martell.png')
var targaryen = new House('targaryen','/images/targaryen.png')
var greyjoy = new House('greyjoy','/images/greyjoy.svg')
var tully = new House('tully','/images/tully.png')
var tyrell = new House('tyrell','/images/tyrell.png')
var bolton = new House('bolton','/images/Background.svg')
var stark = new House('stark','/images/stark.png')


/**
 * The game board
 * This is a 2 dimentional array used to create the board area of the game
 * This board holds stationary characters of the game, such as the westeros houses
 */

var board =
[
  [trail, lannister, trail, trail, trail, targaryen, trail, stark],
  [trail, trail, trail, arryn, trail, trail, trail, trail],
  [trail, baratheon, trail, trail, trail, trail, tully, trail],
  [trail, trail, trail, trail, tyrell, trail, trail, trail],
  [trail, trail, trail, trail, trail, trail, trail, greyjoy],
  [trail, trail, martell, trail, trail, lannister, trail, trail],
  [trail, trail, trail, trail, trail, trail, trail, trail],
  [trail, trail, trail, trail, trail, bolton, trail, trail]
];

/*
 * The game objects board
 * This is also a 2D array that overlaps the game board
 * This board holds the moving characters if the game, sich as Arya and the White Walker
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
var ROWS = board.length;
var COLUMNS = board[0].length;



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
  let visitingHouse = board[arya.playerRow][arya.playerColumn]
  switch(visitingHouse.getName()){
    
    case 'trail':
      gameMessage = "Arya wanders through Westeroes."
      break;
    
    case 'lannister':
    case 'targaryen':
    case 'tyrell':
    case 'bolton':
    case 'greyjoy':
      arya.fight(visitingHouse);
      break; 
    
    case 'baratheon':
    case 'tully':
    case 'martell':
    case 'arryn':
      arya.trade(visitingHouse);
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
  if(board[arya.playerRow][arya.playerColumn].getName() === 'stark')
  {
    //Calculate the score
    var score = arya.food + arya.gold + arya.experience;
    
    //Display the game message
    gameMessage 
      = "Arya has made it to winterfell ALIVE!<br>"; 
  }else if(gameObjects[arya.playerRow][arya.playerColumn].getName()  === 'whiteWalker'){
    gameMessage 
      = "Arya has been killed by a White Walker!<br>";
  }else{
    //Display the game message
    if(arya.gold <= 0){
      gameMessage = "Arya runs out of gold, and is killed by her squire!"; 
    }else{
      gameMessage = "Arya runs out of food!, and dies a painfull death!"; 
    }
    
//    gameMessage += ", and dies a painfull death!"; 
  }
  
  //Remove the keyboard listener to end the game
  window.removeEventListener("keydown", keydownHandler, false);

  // Need to come back to this
  clearInterval(intervalId)
  displayTimer()
  playBtn.classList.toggle('replay')
  playBtn.classList.toggle('play')
  playBtn.innerHTML='replay'
  playBtn.addEventListener('click',playGame)
}

function render()
{
  //Clear the board of img cells from the previous turn
  if(canvas.hasChildNodes()){
    for(var i = 0; i < ROWS * COLUMNS; i++) {	 
      canvas.removeChild(canvas.firstChild);
    }
  }
  
  //Render the board by looping through the board arrays
  for(var row = 0; row < ROWS; row++){	
    for(var column = 0; column < COLUMNS; column++){ 
      //Create a img tag called cell
      var cell = document.createElement("img");

      //Set it's CSS class to "cell"
      cell.setAttribute("class", "cell");

      //Add the img tag to the <div id="canvas"> tag
      canvas.appendChild(cell);

      //Find the correct image for this board cell
      let spriteObject = board[row][column]
      switch(spriteObject.getName()){
        case 'trail':
          cell.style.backgroundColor = 'white'
          break;

        case 'baratheon':
          cell.src = baratheon.bannerImage
          break; 

        case 'lannister':
          cell.src = lannister.bannerImage
          break; 

        case 'stark':
          cell.src = stark.bannerImage
          break;   

        case 'arryn':
          cell.src = arryn.bannerImage
          break;

        case 'martell':
          cell.src = martell.bannerImage
          break;

        case 'targaryen':
          cell.src = targaryen.bannerImage
          break;

        case 'tully':
          cell.src = tully.bannerImage
          break;

        case 'tyrell':
          cell.src = tyrell.bannerImage
          break;         
        
        case 'bolton':
          cell.src = bolton.bannerImage
          break;  
          
        case 'greyjoy':
          cell.src = greyjoy.bannerImage
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
	gameMessageText.innerHTML = gameMessage;
	
	//Display the player's food, gold, and experience
	gameMessageText.innerHTML 
	  += "<br>Gold: " + arya.gold + ", Food: " 
	  + arya.food + ", Experience: " + arya.experience;
}

