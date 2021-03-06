class Sprite{
    constructor(name){
        this.name = name
    }

    getName(){
        return this.name
    }
}

class Player extends Sprite{
    constructor(name, playerImage){
        super(name)
        this.playerImage = playerImage
        this.playerRow = undefined
        this.playerColumn = undefined
        this.food = 10
        this.gold = 10
        this.experience = 0
        this.strength = Math.ceil((this.food + this.gold) / 2);
    }

    eat(){
        this.food--
    }

    hasFood(){
        return this.food > 0 ? true : false
    }

    hasGold(){
        return this.gold > 0 ? true : false
    }

    fight(house){
        
        //House`s strength is a random number between 1 and the Arya's strength
        let opponentStrength = Math.ceil(Math.random() * this.strength * 2);
        
        // Opponent House Wins
        if(opponentStrength > this.strength){
            let stolenGold = Math.round(opponentStrength / 2);
            this.gold -= stolenGold;

            //Arya gains experience
            this.experience += 1;
            
            //Update the game message
            gameMessage 
            = "Arya fought House "+ capitalize(house.getName()) +",and LOST " + stolenGold + " gold coins."

        }else{
            // Arya wins
            let opponentGold = Math.round(opponentStrength / 2);
            this.gold += opponentGold;
            
            //Arya gains experience  
            this.experience += 2;
            
            //Update the game message
            gameMessage 
            = "Arya fought House "+capitalize(house.getName())+",and WON " + opponentGold + " gold coins."
        } 
    }

    trade(house){
        // Calculate how much food the house has
        let hostFood = this.experience + this.gold;
        // Calculate the cost of food
        let cost = Math.ceil(Math.random() * hostFood);
        
        //Let Arya buy food if she has enough gold
        if(this.gold > cost){
          this.food += hostFood;
          this.gold -= cost;
          this.experience += 2;
          
          gameMessage 
            = "Arya snuck into the lands of House "+ capitalize(house.getName())+", and bought " +hostFood + " pieces of bread"
            + " in exchange of " + cost + " gold coins."
        }else{
          // Arya does not have enough gold to buy food
           this.experience += 1;
           gameMessage = "Arya doesn't have enough gold to buy food."
        }
      }
}

class Monster extends Sprite{
    constructor(name, monsterImage){
        super(name)
        this.monsterImage = monsterImage
        this.monsterRow = undefined
        this.monsterColumn = undefined
    }

    move(){
        //The 4 possible directions that the monster can move
        const UP = 1;
        const DOWN = 2;
        const LEFT = 3;
        const RIGHT = 4;
        
        // An array to save valid directions where the white walker can travel
        const validDirections = [];
        
        // The direction where the white walker will travel. This will be chocen randomly
        let direction = undefined;
        
        if(this.monsterRow > 0){
            let thingAbove = board[this.monsterRow - 1][this.monsterColumn];
            if(thingAbove.getName() === 'trail'){
                validDirections.push(UP);
            }
        }
        if(this.monsterRow < ROWS - 1){ 
            let thingBelow = board[this.monsterRow  + 1][this.monsterColumn];
            if(thingBelow.getName() === 'trail'){
                validDirections.push(DOWN);
            }
        }
        if(this.monsterColumn > 0){
            let thingToTheLeft = board[this.monsterRow ][this.monsterColumn - 1];
            if(thingToTheLeft.getName() === 'trail'){
                validDirections.push(LEFT);
            }
        } 
        if(this.monsterColumn < COLUMNS - 1){
            let thingToTheRight = board[this.monsterRow ][this.monsterColumn + 1];
            if(thingToTheRight.getName() === 'trail'){
                validDirections.push(RIGHT);
            }
        } 

        // Randomly choose a direction for the whiteWalker to travel
        if(validDirections.length !== 0){
            let randomNumber = Math.floor(Math.random() * validDirections.length);
            direction = validDirections[randomNumber];
        }
        
        //Move the WhiteWalker in the chosen direction
        switch(direction){
            case UP:
                gameObjects[this.monsterRow][this.monsterColumn] = new Sprite('trail');
                this.monsterRow--; 
                gameObjects[this.monsterRow][this.monsterColumn] = this;
                break;
            
            case DOWN:
                gameObjects[this.monsterRow][this.monsterColumn] = new Sprite('trail');
                this.monsterRow++;
                gameObjects[this.monsterRow][this.monsterColumn] = this;
                break;
            
            case LEFT:
                gameObjects[this.monsterRow][this.monsterColumn] = new Sprite('trail');
                this.monsterColumn--;
                gameObjects[this.monsterRow][this.monsterColumn] = this;
                break;
            
            case RIGHT:
                gameObjects[this.monsterRow][this.monsterColumn] = new Sprite('trail');
                this.monsterColumn++;
                gameObjects[this.monsterRow][this.monsterColumn] = this;
        }
    }
}

class House extends Sprite{
    constructor(name, bannerImage){
        super(name)
        this.bannerImage = bannerImage
    }
}


const capitalize = (str) => {
    if(typeof str === 'string') {
        return str.replace(/^\w/, c => c.toUpperCase());
    } else {
        return '';
    }
};