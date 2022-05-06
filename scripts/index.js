const gameTime = 30;

//Get a reference dom elements
let canvas = document.querySelector("#canvas")
let gameMessageText = document.querySelector("#gameMessage")
let playBtn = document.getElementById("playBtn")
let bgAudioBtn = document.getElementById("bgAudioBtn")
let bgAudio = document.getElementById("bgAudio")
let second = document.getElementById('sec')
let goldId = document.getElementById('gold')
let foodId = document.getElementById('food')
let expId = document.getElementById('exp')
let hero = document.querySelector(".hero")


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

let seconds = gameTime

function playGame(){

    if(playBtn.innerHTML === 'Replay'){
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
        console.log('Time is up')
        endGame()
        clearInterval(intervalId)
        seconds = gameTime
        playBtn.classList.toggle('replay')
        playBtn.classList.toggle('play')
        playBtn.addEventListener('click',playGame)
        }
      },1000)
    }
    
}

function displayTimer(){
  second.innerHTML = seconds
}


// class instantiations
let trail = new Sprite('trail')
let arya = new Player('arya','./images/arya.png')
let whiteWalker = new Monster('whiteWalker','./images/white-walker.png')
let baratheon = new House ('baratheon', './images/baratheon.png')
let lannister = new House('lannister','./images/lannister.png')
let arryn = new House('arryn','./images/arryn.png')
let martell = new House('martell','./images/martell.png')
let targaryen = new House('targaryen','./images/targaryen.png')
let greyjoy = new House('greyjoy','./images/greyjoy.svg')
let tully = new House('tully','./images/tully.png')
let tyrell = new House('tyrell','./images/tyrell.png')
let bolton = new House('bolton','./images/Background.svg')
let stark = new House('stark','./images/stark.png')


/**
 * The game board
 * This is a 2 dimentional array used to create the board area of the game
 * This board holds stationary characters of the game, such as the westeros houses
 */

let board =
[
  [trail, trail,  trail, trail, targaryen, trail, stark],
  [trail, trail,  arryn, trail, trail, trail, trail],
  [baratheon, trail,  trail, trail, trail, tully, trail],
  [trail, trail,  trail, tyrell, trail, trail, trail],
  [trail, martell,  trail, trail, trail, trail, lannister],
  [trail, trail,  trail, trail, bolton, trail, trail]
];

/*
 * The game objects board
 * This is also a 2D array that overlaps the game board
 * This board holds the moving characters if the game, sich as Arya and the White Walker
 */
let gameObjects =
[
  [whiteWalker, trail, trail, trail, trail, trail,  trail],
  [trail, trail, trail, trail, trail, trail,  trail],
  [trail, trail, trail, trail, trail, trail,  trail],
  [trail, trail, trail, trail, trail, trail,  trail],
  [trail, trail, trail, trail, trail, trail,  trail],
  [arya, trail, trail, trail, trail, trail,  trail]
];


//The size of each cell
let SIZE = 96;
//Space between cells
let SPACE = 3;

//The number of rows and columns
let ROWS = board.length;
let COLUMNS = board[0].length;



//Arrow key codes
let UP = 38;
let DOWN = 40;
let RIGHT = 39;
let LEFT = 37;

//The game variables
let food = 10;
let gold = 10;
let experience = 0;
let gameMessage = "Click Play to start game.";
let gameOver = false;

render();

/**
 * Function locates where on the gameObjects array are the starting positions
 * of Arya and the WhiteWalker
 */
function locatePlayerAndMonster(){
  for(let row = 0; row < ROWS; row++) {	
    for(let column = 0; column < COLUMNS; column++) {
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

function endGame(){
  gameOver = true;
  if(board[arya.playerRow][arya.playerColumn].getName() === 'stark'){
    //Display the game message
    gameMessage 
      = "You WIN!<br>Arya has made it to winterfell ALIVE!"; 
  }else if(gameObjects[arya.playerRow][arya.playerColumn].getName()  === 'whiteWalker'){
    gameMessage 
      = "You LOSE!<br>Arya has been killed by a White Walker!";
  }else{
    //Display the game message
    if(arya.gold <= 0){
      gameMessage = "You LOSE!<br>Arya runs out of gold, and is killed by her squire!"; 
    }else if(arya.food <=0){
      gameMessage = "You LOSE!<br>Arya runs out of food!, and dies a painfull death!"; 
    }else{
      gameMessage= "You LOSE!<br>Time's Up! Click Replay to play again."
      gameMessageText.innerHTML = gameMessage
    }
    
  }
  
  window.removeEventListener("keydown", keydownHandler, false);

  // Need to come back to this
  clearInterval(intervalId)
  displayTimer()
  playBtn.classList.toggle('replay')
  playBtn.classList.toggle('play')
  playBtn.innerHTML='Replay'
  playBtn.addEventListener('click',playGame)
}

function render()
{
  //Clear the board of img cells from the previous turn
  if(canvas.hasChildNodes()){
    for(let i = 0; i < ROWS * COLUMNS; i++) {	 
      canvas.removeChild(canvas.firstChild);
    }
  }
  
  //Render the board by looping through the board arrays
  for(let row = 0; row < ROWS; row++){	
    for(let column = 0; column < COLUMNS; column++){ 
      //Create a img tag called cell
      let cell = document.createElement("img");

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
	        cell.style.borderColor = 'green'
          cell.style.boxShadow = '0 0 20px darkgreen'

	        break;   
	        
	      case 'whiteWalker':
	        cell.src = whiteWalker.monsterImage
          cell.style.borderColor = 'red'
          cell.style.boxShadow = '0 0 20px darkred'
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
  goldId.innerHTML = arya.gold
  foodId.innerHTML = arya.food
  expId.innerHTML = arya.experience

  if(gameOver){
    console.log('Game over')
    if(board[arya.playerRow][arya.playerColumn].getName() === 'stark'){
      //Display the game message
      console.log('Arya has won')
      hero.style.border = '3px green solid'
    }else{
      console.log('White Walker has won')
      hero.style.border = '3px red solid'
    }
  }

}



