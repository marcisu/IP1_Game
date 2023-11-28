/*
The Game Project - Part 7
Marcis Upitis
*/

// Positional Variables
var floorPos_y;
var gameChar_x;
var gameChar_y;
var cameraPosX;

// State Variables
var isLeft;
var isRight;
var isPlummeting;
var isFalling;
var isGameOver;
var hasFallen;
var hasLost;

// Object Variables
var trees_x;
var trees_h;
var trees;
var canyons;
var clouds;
var mountains;
var collectables;
var gate;
var enemies;
var platforms;

// Score Variables
var game_score;
var lives;

// Sounds
var jumpSound;
var backgroundMusic;
var stabSound;
var fallSound;
var collectSound;
var gameOverSound;
var successSound;

function preload()
{
    soundFormats('mp3','wav');
    
    // preLoaded sounds:
    backgroundMusic = loadSound('assets/koto_shimasen.wav');
    
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.3);
    
    stabSound = loadSound('assets/Stab.wav');
    stabSound.setVolume(0.6);
    
    fallSound = loadSound('assets/fall.wav');
    fallSound.setVolume(0.3);
    
    collectSound = loadSound('assets/shrine.wav');
    collectSound.setVolume(0.6);
    
    gameOverSound = loadSound('assets/gameOver.wav');
    gameOverSound.setVolume(0.3);
    
    successSound = loadSound('assets/success.mp3');
    
}

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4
    lives = 3;
    startGame();
    backgroundMusic.loop();
    trees = [];
    trees_h = [];
    for (var i = 0; i < trees_x.length; i++)
    {
        trees_h.push(random(80,180));
        trees.push(
        {
            x_pos: trees_x[i],
            height: trees_h[i],
            y_pos: floorPos_y - trees_h[i],
            variation: random(-5,25),
            shading: random(0,1)     
        })
    }
}  

function draw()
{
    cameraPosX = gameChar_x - width/2;
	
    ///////////DRAWING CODE//////////

    drawBackdrop();
    
    // for character scrolling
    push();
    translate(-cameraPosX, 0);
    
    // draw elements of the game
    drawSun();
    drawClouds();
    drawMountains();
    drawTrees();
    insertCanyons();
    insertPlatforms();
    insertCollectables();
    insertEnemies();  
    renderGate();
    drawCharacter(gameChar_x, gameChar_y);
    
    // lives check
    checkPlayerDie();
    
    pop();
    
    // draw game score board
    drawScoreBoard();
    
    // draw live token count
    drawLives();
    
    // end of game messages
    checkGameOver();

	///////////INTERACTION CODE//////////
    
    if(isLeft && !isGameOver)
    {
        if(gameChar_x > -1000)
            {
                gameChar_x -= 5;
            }
        else
        {
            cameraPosX += 5;
        }   
    }
    
    if(isRight && !isGameOver)
    {
        if(gameChar_x < 3500)
        {
            gameChar_x += 5;
        }
        else
        {
            cameraPosX -= 5;
        }  
    }
    
    if(gameChar_y < floorPos_y)
    {
        var isContact = false;
        for (var i = 0; i < platforms.length; i++)
        {
            if (platforms[i].checkContact(gameChar_x, gameChar_y))
                {
                    isContact = true;
                    isFalling = false;
                    break;
                }  
        }
        if(isContact == false)
            {
                isFalling = true;
                gameChar_y += 5;
            }
    }
    else
    {
        isFalling = false;
    }
    
    if(isPlummeting)
    {
        isLeft = false;
        isRight = false
        gameChar_y += 4;
        if (hasFallen == false)
        {
            fallSound.play();
            hasFallen = true;
        }
    }
    
    if (gate.isReached == false)
    {
        checkGate();
    }
}

function keyPressed()
{ 
    if(!isGameOver)
    {
        if(!isPlummeting)
        {
            if(keyCode == 65){
                isLeft = true;
            }
            else if (keyCode == 68){
                isRight = true;
            }
            if(keyCode == 87){
                if(!isFalling){
                    jumpSound.play();
                    gameChar_y -= 130;
                }
            }
        }
    }
    
    // This allows you to reload the game using the space bar
    if (isGameOver){
        if (keyCode == 32)
        {
            location.reload();
        }
    }
}

function keyReleased()
{ 
    if(keyCode == 65)
    {
        isLeft = false;
    }
    else if(keyCode == 68)
    {
        isRight = false;
    }
}

function drawBackdrop()
{
    background(255,160,122);
	noStroke();
	fill(139, 69, 19);
	rect(0, floorPos_y, width, height - floorPos_y);
    fill(222, 184, 135);
    rect(0, floorPos_y, width, 10);    
}

function drawSun()
{
    fill(255, 69, 0);
    ellipse(2100, 160, 150, 150);
}

function drawClouds()
{
    for (var i = 0; i < clouds.length; i++) 
    {
        fill(255, 255, 255);
        ellipse(clouds[i].x_pos, clouds[i].y_pos, clouds[i].size*80, clouds[i].size*80);
        ellipse(clouds[i].x_pos - 40, clouds[i].y_pos + 10, clouds[i].size*60, clouds[i].size*60);
        ellipse(clouds[i].x_pos + 40, clouds[i].y_pos, clouds[i].size*70, clouds[i].size*70);
        ellipse(clouds[i].x_pos + 80, clouds[i].y_pos, clouds[i].size*60, clouds[i].size*60);
    }
}

function drawMountains()
{
    for (var i = 0; i < mountains.length; i++) 
    {
        fill(96, 96, 96);
        triangle(mountains[i].x_pos - mountains[i].size*100, mountains[i].y_pos, mountains[i].x_pos, mountains[i].y_pos - mountains[i].size*252, mountains[i].x_pos + mountains[i].size*100, mountains[i].y_pos);

        fill(255, 255, 255);
        triangle(mountains[i].x_pos + mountains[i].size*40, mountains[i].y_pos - mountains[i].size*150, mountains[i].x_pos, mountains[i].y_pos - mountains[i].size*252, mountains[i].x_pos - mountains[i].size*40, mountains[i].y_pos - mountains[i].size*150);
    }
}

function drawTrees()
{
    for (var i = 0; i < trees.length; i++) 
    {
        //trunk
        fill(120, 100, 40);
        rect(trees[i].x_pos, trees[i].y_pos, 50, trees[i].height);
        stroke(77, 42, 8);
        strokeWeight(2);
        line(trees[i].x_pos + 10, trees[i].y_pos, trees[i].x_pos + 10, trees[i].y_pos + trees[i].height);
        line(trees[i].x_pos + 25, trees[i].y_pos, trees[i].x_pos + 25, trees[i].y_pos + trees[i].height);
        line(trees[i].x_pos + 40, trees[i].y_pos, trees[i].x_pos + 40, trees[i].y_pos + trees[i].height);
        noStroke();
        //branches
        if (trees[i].shading >= 0.5)
        {
            fill(255, 182, 193);
            ellipse(trees[i].x_pos, trees[i].y_pos, 60 + trees[i].variation, 50 + trees[i].variation);
            ellipse(trees[i].x_pos + 75, trees[i].y_pos - 30, 80 + trees[i].variation, 70 + trees[i].variation);
            ellipse(trees[i].x_pos + 50, trees[i].y_pos - 50, 70 + trees[i].variation, 75 + trees[i].variation);
            ellipse(trees[i].x_pos - 15, trees[i].y_pos - 30, 90 + trees[i].variation, 95 + trees[i].variation);
            ellipse(trees[i].x_pos + 40, trees[i].y_pos + 20, 100 + trees[i].variation, 75 + trees[i].variation);   

            fill(255, 192, 203);
            ellipse(trees[i].x_pos + 50, trees[i].y_pos, 50 + trees[i].variation, 60 + trees[i].variation);
            ellipse(trees[i].x_pos + 5, trees[i].y_pos - 40, 75 + trees[i].variation, 80 + trees[i].variation);
            ellipse(trees[i].x_pos - 5, trees[i].y_pos + 10, 90 + trees[i].variation, 90 + trees[i].variation); 
            ellipse(trees[i].x_pos + 65, trees[i].y_pos - 30, 60 + trees[i].variation, 55 + trees[i].variation);   
        }
        else
        {
            fill(255, 192, 203);
            ellipse(trees[i].x_pos, trees[i].y_pos, 60 + trees[i].variation, 50 + trees[i].variation);
            ellipse(trees[i].x_pos + 75, trees[i].y_pos - 30, 80 + trees[i].variation, 70 + trees[i].variation);
            ellipse(trees[i].x_pos + 50, trees[i].y_pos - 50, 70 + trees[i].variation, 75 + trees[i].variation);
            ellipse(trees[i].x_pos - 15, trees[i].y_pos - 30, 90 + trees[i].variation, 95 + trees[i].variation);
            ellipse(trees[i].x_pos + 40, trees[i].y_pos + 20, 100 + trees[i].variation, 75 + trees[i].variation);   

            fill(255, 182, 193);
            ellipse(trees[i].x_pos + 50, trees[i].y_pos, 50 + trees[i].variation, 60 + trees[i].variation);
            ellipse(trees[i].x_pos + 5, trees[i].y_pos - 40, 75 + trees[i].variation, 80 + trees[i].variation);
            ellipse(trees[i].x_pos - 5, trees[i].y_pos + 10, 90 + trees[i].variation, 90 + trees[i].variation); 
            ellipse(trees[i].x_pos + 65, trees[i].y_pos - 30, 60 + trees[i].variation, 55 + trees[i].variation); 
        }
    }
}

function drawCanyon(t_canyon)
{
    fill(255,160,122);
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, height - floorPos_y);
}

function insertCanyons()
{
    // draw canyons
    for (var i = 0; i < canyons.length; i++)
    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }   
}

function createPlatforms(x, y, length)
{
    var p = {
        x: x,
        y: y, 
        length: length,
        draw: function()
        {
            fill(189,183,107);        
            rect(this.x, this.y, this.length, 20);
            fill(85,107,47);
            rect(this.x, this.y, this.length, 5);
        },
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if (d >= 0  && d < 2)
                {
                    return true;
                }
            }    
            return false;
        }
    }
    return p;
}

function insertPlatforms()
{
    /// draw platforms
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
}

function drawCollectable(t_collectable)
{
        stroke(0, 0, 0);
        fill(255, 255, 255);
        ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size, t_collectable.size);
        fill(0, 0, 0);
        arc(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size, t_collectable.size, 0, PI);
        noStroke();
        fill(255, 255, 255);
        ellipse(t_collectable.x_pos + t_collectable.size/4, t_collectable.y_pos, t_collectable.size/2, t_collectable.size/2);
        fill(0, 0, 0);
        ellipse(t_collectable.x_pos - t_collectable.size/4, t_collectable.y_pos, t_collectable.size/2, t_collectable.size/2);
        fill(255, 255, 255);
        ellipse(t_collectable.x_pos - t_collectable.size/4, t_collectable.y_pos, t_collectable.size/5.7, t_collectable.size/5.7);
        fill(0, 0, 0);
        ellipse(t_collectable.x_pos + t_collectable.size/4, t_collectable.y_pos, t_collectable.size/5.7, t_collectable.size/5.7);
}

function insertCollectables()
{
    // draw collectable
    for (var i = 0; i < collectables.length; i++)
    {
        if(!collectables[i].isFound)
        {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }   
}

function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if (this.currentX >= (this.x + this.range))
        {
            this.inc = -1;
        }
        else if (this.currentX < this.x)
        {
            this.inc = 1;
        }  
    }
    this.draw = function() /// Enemy: Ninja Design
    {
        this.update();
        fill(0,0,0);
        ellipse(this.currentX, this.y, 40, 40);
        fill(255);
        rect(this.currentX - 15, this.y - 8, 30, 6);
        fill(0);
        ellipse(this.currentX - 5, this.y - 5, 5, 5);
        ellipse(this.currentX + 5, this.y - 5, 5, 5);
        stroke(178, 34, 34);
        strokeWeight(2);
        line(this.currentX - 18, this.y + 5, this.currentX + 18, this.y + 5);
        noStroke();
    
    }
    this.checkContact = function(gc_x, gc_y) 
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y);
        if (d < 36)
        {
            return true;
        }
        return false;
    }
}

function insertEnemies()
{
    /// draw enemies
    for (var i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();
        var isContact = enemies[i].checkContact(gameChar_x, gameChar_y);
        
        if(isContact)
        {
            if(lives > 0)
            {
                lives--;
                stabSound.play();
                startGame();
                break;
            }
        }
    }    
}

function renderGate()
{
    push();
    strokeWeight(10);
    stroke(227, 66, 52);
    line(gate.x_pos, floorPos_y, gate.x_pos, floorPos_y - 130);
    line(gate.x_pos + 100, floorPos_y, gate.x_pos + 100, floorPos_y - 130);
    line(gate.x_pos - 30, floorPos_y - 110, gate.x_pos + 130, floorPos_y - 110);
    line(gate.x_pos - 20, floorPos_y - 130, gate.x_pos + 120, floorPos_y - 130);
    line(gate.x_pos - 20, floorPos_y - 130, gate.x_pos - 40, floorPos_y - 135);
    line(gate.x_pos + 120, floorPos_y - 130, gate.x_pos + 140, floorPos_y - 135);
    
    //lanterns
    line(gate.x_pos - 30, floorPos_y, gate.x_pos - 30, floorPos_y - 30);
    line(gate.x_pos + 130, floorPos_y, gate.x_pos + 130, floorPos_y - 30);
    strokeWeight(4);
    rect(gate.x_pos - 40, floorPos_y - 60, 20, 30);
    rect(gate.x_pos + 120, floorPos_y - 60, 20, 30);
    
    //highlights
    strokeWeight(12);
    stroke(61, 65, 114);
    line(gate.x_pos, floorPos_y, gate.x_pos, floorPos_y - 20);
    line(gate.x_pos + 100, floorPos_y, gate.x_pos + 100, floorPos_y - 20);
    line(gate.x_pos - 20, floorPos_y - 138, gate.x_pos + 120, floorPos_y - 138);
    line(gate.x_pos - 20, floorPos_y - 138, gate.x_pos - 40, floorPos_y - 143);
    line(gate.x_pos + 120, floorPos_y - 138, gate.x_pos + 140, floorPos_y - 143);
    
    strokeWeight(3);
    stroke(218, 165, 32);
    fill(0);
    rect(gate.x_pos + 45, floorPos_y - 130, 10, 20);
    
    
    stroke(227, 66, 52);
    
    if(gate.isReached)
    {
        fill(218, 165, 32);
        rect(gate.x_pos - 40, floorPos_y - 60, 20, 30);
        line(gate.x_pos - 40, floorPos_y - 45, gate.x_pos - 20, floorPos_y - 45);
        line(gate.x_pos - 30, floorPos_y - 60, gate.x_pos - 30, floorPos_y - 30);
        
        rect(gate.x_pos + 120, floorPos_y - 60, 20, 30);
        line(gate.x_pos + 120, floorPos_y - 45, gate.x_pos + 140, floorPos_y - 45);
        line(gate.x_pos + 130, floorPos_y - 60, gate.x_pos + 130, floorPos_y - 30);
    }
    else
    {
        fill(0, 0, 0);
        rect(gate.x_pos - 40, floorPos_y - 60, 20, 30);
        line(gate.x_pos - 40, floorPos_y - 45, gate.x_pos - 20, floorPos_y - 45);
        line(gate.x_pos - 30, floorPos_y - 60, gate.x_pos - 30, floorPos_y - 30);
        
        rect(gate.x_pos + 120, floorPos_y - 60, 20, 30);
        line(gate.x_pos + 120, floorPos_y - 45, gate.x_pos + 140, floorPos_y - 45);
        line(gate.x_pos + 130, floorPos_y - 60, gate.x_pos + 130, floorPos_y - 30);
    }
    pop();
}

function drawCharacter(t_gameChar_x, t_gameChar_y)
{
    if(isLeft && isFalling)
	{
		//jumping-left code
        //head
        fill(51, 25, 0);
        ellipse(t_gameChar_x, t_gameChar_y - 65, 15, 22);
        ellipse(t_gameChar_x - 8, t_gameChar_y - 65, 5, 5);
        //body
        fill(255, 99, 71);
        ellipse(t_gameChar_x, t_gameChar_y - 40, 18, 35);
        triangle(t_gameChar_x, t_gameChar_y - 55, t_gameChar_x + 15, t_gameChar_y - 15, t_gameChar_x - 15, t_gameChar_y - 15);
        stroke(178, 34, 34);
        strokeWeight(3);
        line(t_gameChar_x + 6, t_gameChar_y - 50, t_gameChar_x - 13, t_gameChar_y - 16);
        stroke(100);
        strokeWeight(1);
        //feet
        noStroke();
        fill(51, 25, 0);
        rect(t_gameChar_x + 4, t_gameChar_y - 15, 10, 10);
        rect(t_gameChar_x - 15, t_gameChar_y - 15, 10, 10);
        //hands
        fill(51, 25, 0);
        ellipse(t_gameChar_x - 15, t_gameChar_y - 45, 15, 10);
        ellipse(t_gameChar_x + 15, t_gameChar_y - 45, 15, 10);

	}
	else if(isRight && isFalling)
	{
		//jumping-right code
        //Head
        fill(51, 25, 0);
        ellipse(t_gameChar_x, t_gameChar_y - 65, 15, 22);
        ellipse(t_gameChar_x + 8, t_gameChar_y - 65, 5, 5);
        //Body
        fill(255, 99, 71);
        ellipse(t_gameChar_x, t_gameChar_y - 40, 18, 35);
        triangle(t_gameChar_x, t_gameChar_y - 55, t_gameChar_x + 15, t_gameChar_y - 15, t_gameChar_x - 15, t_gameChar_y - 15);
        stroke(178, 34, 34);
        strokeWeight(3);
        line(t_gameChar_x - 6, t_gameChar_y - 50, t_gameChar_x + 13, t_gameChar_y - 16);
        stroke(100);
        strokeWeight(1);
        //Feet
        noStroke();
        fill(51, 25, 0);
        rect(t_gameChar_x + 5, t_gameChar_y - 15, 10, 10);
        rect(t_gameChar_x - 14, t_gameChar_y - 15, 10, 10);
        //Hand
        fill(51, 25, 0);
        ellipse(t_gameChar_x - 15, t_gameChar_y - 45, 15, 10);
        ellipse(t_gameChar_x + 15, t_gameChar_y - 45, 15, 10);

	}
	else if(isLeft)
	{
		//walking left code
        //Head
        fill(51, 25, 0);
        ellipse(t_gameChar_x, t_gameChar_y - 62, 18, 25);
        ellipse(t_gameChar_x - 9, t_gameChar_y - 62, 5, 5);
        //Body
        fill(255, 99, 71);
        ellipse(t_gameChar_x, t_gameChar_y - 35, 18, 35);
        triangle(t_gameChar_x, t_gameChar_y - 50, t_gameChar_x + 15, t_gameChar_y - 10, t_gameChar_x - 15, t_gameChar_y - 10);
        stroke(178, 34, 34);
        strokeWeight(3);
        line(t_gameChar_x + 6, t_gameChar_y - 45, t_gameChar_x - 12, t_gameChar_y - 12);
        stroke(100);
        strokeWeight(1);
        //Feet
        noStroke();
        fill(51, 25, 0);
        rect(t_gameChar_x + 4, t_gameChar_y - 10, 10, 10);
        rect(t_gameChar_x - 15, t_gameChar_y - 10, 10, 10);
        //Hand
        fill(51, 25, 0);
        ellipse(t_gameChar_x - 15, t_gameChar_y - 40, 15, 10);
        ellipse(t_gameChar_x + 15, t_gameChar_y - 30, 15, 10);
	}
	else if(isRight)
	{
		//walking right code
        //Head
        fill(51, 25, 0);
        ellipse(t_gameChar_x, t_gameChar_y - 62, 18, 25);
        ellipse(t_gameChar_x + 9, t_gameChar_y - 62, 5, 5);
        //Body
        fill(255, 99, 71);
        ellipse(t_gameChar_x, t_gameChar_y - 35, 18, 35);
        triangle(t_gameChar_x, t_gameChar_y - 50, t_gameChar_x + 15, t_gameChar_y - 10, t_gameChar_x - 15, t_gameChar_y - 10);
        stroke(178, 34, 34);
        strokeWeight(3);
        line(t_gameChar_x - 6, t_gameChar_y - 45, t_gameChar_x + 12, t_gameChar_y - 12);
        stroke(100);
        strokeWeight(1);
        //Feet
        noStroke();
        fill(51, 25, 0);
        rect(t_gameChar_x + 5, t_gameChar_y - 10, 10, 10);
        rect(t_gameChar_x - 14, t_gameChar_y - 10, 10, 10);
        //Hand
        fill(51, 25, 0);
        ellipse(t_gameChar_x - 15, t_gameChar_y - 30, 15, 10);
        ellipse(t_gameChar_x + 15, t_gameChar_y - 40, 15, 10);

	}
	else if(isFalling || isPlummeting)
	{
		//jumping facing forwards code
        //Head
        fill(51, 25, 0);
        ellipse(t_gameChar_x, t_gameChar_y - 62, 20, 20);
        //Body
        fill(255, 99, 71);
        ellipse(t_gameChar_x, t_gameChar_y - 40, 20, 30);
        triangle(t_gameChar_x, t_gameChar_y - 50, t_gameChar_x + 15, t_gameChar_y - 15, t_gameChar_x - 15, t_gameChar_y - 15);
        stroke(178, 34, 34);
        strokeWeight(3);
        line(t_gameChar_x + 7, t_gameChar_y - 48, t_gameChar_x - 11, t_gameChar_y - 16);
        stroke(100);
        strokeWeight(1);
        //Feet
        noStroke();
        fill(51, 25, 0);
        rect(t_gameChar_x + 1, t_gameChar_y - 15, 10, 10);
        rect(t_gameChar_x - 11, t_gameChar_y - 15, 10, 10);
        //Hand
        fill(51, 25, 0);
        ellipse(t_gameChar_x - 16, t_gameChar_y - 40, 14, 9);
        ellipse(t_gameChar_x + 16, t_gameChar_y - 40, 14, 9);
	}
	else
	{
		//standing front facing code
        //Head
        fill(51, 25, 0);
        ellipse(t_gameChar_x, t_gameChar_y - 62, 25, 25);
        //Body
        fill(255, 99, 71);
        ellipse(t_gameChar_x, t_gameChar_y - 35, 30, 35);
        triangle(t_gameChar_x, t_gameChar_y - 50, t_gameChar_x + 15, t_gameChar_y - 10, t_gameChar_x - 15, t_gameChar_y - 10);
        stroke(178, 34, 34);
        strokeWeight(3);
        line(t_gameChar_x + 11, t_gameChar_y - 45, t_gameChar_x - 12, t_gameChar_y - 12);
        stroke(100);
        strokeWeight(1);
        //Feet
        noStroke();
        fill(51, 25, 0);
        rect(t_gameChar_x + 1, t_gameChar_y - 10, 10, 10);
        rect(t_gameChar_x - 11, t_gameChar_y - 10, 10, 10);
	}
}

function checkPlayerDie()
{  
    if (gameChar_y > height)
    {
        if (lives > 0)
        {
            lives --;
            startGame();
        }
    }
}

function checkCollectable(t_collectable)
{
    if(dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < t_collectable.size)
    {
        t_collectable.isFound = true;
        collectSound.play();
        game_score += 1;
    }
}

function checkCanyon(t_canyon)
{
    if(gameChar_x > t_canyon.x_pos && gameChar_x < (t_canyon.x_pos + t_canyon.width))
    {
        if(gameChar_y >= floorPos_y)
        {
            isPlummeting = true; 
        }
        else
        {
            isPlummeting = false;
        }
    }
}

function checkGate()
{
    var d = abs(gameChar_x - (gate.x_pos + 50));
    
    if (d < 15)
    {
        gate.isReached = true;
        backgroundMusic.stop();
        successSound.play();
    }
}

function drawScoreBoard()
{
    fill(0);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);
    text("score: " + game_score, 20, 20);    
}

function drawLives()
{
    for (var i = 0; i < lives; i++)
    {
        fill(227, 66, 52);
        ellipse(i*21 + 30, 50, 19, 19);
    }    
}

function checkGameOver()
{  
    if (lives < 1)
    {
        fill(0);
        noStroke();
        textSize(20);
        textAlign(CENTER, CENTER);
        text("Game over. Press space to continue", width/2, height/2 - 50);
        isGameOver = true;
        if (hasLost == false)
        {
            backgroundMusic.stop();
            gameOverSound.play();
            hasLost = true;
        }
        return;
    }

    else
    {
        if (gate.isReached == true)
        {
            fill(0);
            noStroke();
            textSize(20);
            textAlign(CENTER, CENTER);
            isGameOver = true;
            if (game_score < 6) 
            {
                text("Level complete. Press space to continue", width/2, height/2 - 50); 
                return;
            }
            else // secret ending if you find the hidden token by going left first and collecting 6 items
            {
                text("You have reached Enlightenment!", width/2, height/2 - 50); 
                gameChar_y -= 10; 
                return;
            }  
        }
    }
}

function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    cameraPosX = 0;
    
    isLeft = false;
    isRight = false;
    isPlummeting = false;
    isFalling = false;
    isGameOver = false;
    
    trees_x = [-500, -200, 0, 250, 720, 940, 1250, 1550, 1750, 3210];
    
    canyons = [
        {x_pos: 560, width: 120},
        {x_pos: 1340, width: 60},
        {x_pos: 2100, width: 100},
        {x_pos: 2300, width: 500},
        {x_pos: 2650, width: 90}
    ];
    
    clouds = [
        {x_pos: -500, y_pos: 100, size: 1.0},
        {x_pos: -300, y_pos: 100, size: 1.4},
        {x_pos: -150, y_pos: 140, size: 1.2},
        {x_pos: 50, y_pos: 30, size: 1.6},
        {x_pos: 200, y_pos: 150, size: 1.0},
        {x_pos: 400, y_pos: 120, size: 0.8},
        {x_pos: 700, y_pos: 80, size: 1.4},
        {x_pos: 900, y_pos: 190, size: 1.3},
        {x_pos: 1300, y_pos: 150, size: 1.3},
        {x_pos: 1600, y_pos: 120, size: 0.8},
        {x_pos: 1875, y_pos: 80, size: 1.4},
        {x_pos: 2000, y_pos: 100, size: 1.4},
        {x_pos: 2200, y_pos: 190, size: 1.4},
        {x_pos: 2400, y_pos: 150, size: 0.7},
        {x_pos: 2500, y_pos: 170, size: 0.9},
        {x_pos: 2800, y_pos: 130, size: 1.3},
        {x_pos: 3000, y_pos: 120, size: 0.8}
    ];
    
    mountains = [
        {x_pos: -800, y_pos: 432, size: 1.7},
        {x_pos: -40, y_pos: 432, size: 1.4},
        {x_pos: 320, y_pos: 432, size: 1.2},
        {x_pos: 450, y_pos: 432, size: 1.0},
        {x_pos: 840, y_pos: 432, size: 1.6},
        {x_pos: 1150, y_pos: 432, size: 1.8},
        {x_pos: 3300, y_pos: 432, size: 2.0}
    ];
    
    collectables = [
        {x_pos: -310, y_pos: 250, size: 50, isFound: false},
        {x_pos: 620, y_pos: 250, size: 50, isFound: false},
        {x_pos: 1250, y_pos: 320, size: 50, isFound: false},
        {x_pos: 1830, y_pos: 60, size: 50, isFound: false},
        {x_pos: 2250, y_pos: 400, size: 50, isFound: false},
        {x_pos: 2600, y_pos: 250, size: 50, isFound: false}
    ];
    
    // Platforms - Factory Pattern
    platforms = [];
    
    platforms.push(createPlatforms(-360, floorPos_y - 90, 100));
    platforms.push(createPlatforms(580, floorPos_y - 90, 80));
    
    platforms.push(createPlatforms(1450, floorPos_y - 90, 100));
    platforms.push(createPlatforms(1580, floorPos_y - 170, 450));
    platforms.push(createPlatforms(1750, floorPos_y - 260, 150));
    
    platforms.push(createPlatforms(2320, floorPos_y - 90, 100));
    platforms.push(createPlatforms(2540, floorPos_y - 90, 120));
    
    // Enemies - Constructor
    
    enemies = [];
    enemies.push(new Enemy(100, floorPos_y - 20, 100));
    enemies.push(new Enemy(900, floorPos_y - 20, 250));
    enemies.push(new Enemy(960, floorPos_y - 20, 350));
    enemies.push(new Enemy(1650, floorPos_y - 190, 350));
    enemies.push(new Enemy(1620, floorPos_y - 20, 450));    
    
    game_score = 0;
    
    gate = {isReached: false, x_pos: 3000};
    
    hasFallen = false;
    
    hasLost = false;

}
