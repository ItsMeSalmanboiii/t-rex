//example of JSON -javascript object notation
/*var ball = {
  x:20,
  y:30,
  r:20,
  color:["blue","yellow","red"]
}
function draw(){
  background(220)
  fill(ball.color[0])
  circle(ball.x,ball.y,ball.r)
  
}*/

//example of switch statements
 /*var input, heading 
 function setup(){
  createCanvas(300,200)
  background(178,255,102)

  input=createInput()
  input.position(5,60)

  heading=createElement("h4","Enter any alphabet:")
  heading.position(5,20)

  textAlign(CENTER)
  textSize(50)
 }

 function draw(){
  const value= input.value();
  switch(value){
    case 'a':
      console.log("Vowel")
      break;

      case 'e':
      console.log("Vowel")
      break;

      case 'i':
      console.log("Vowel")
      break;

      case 'o':
      console.log("Vowel")
      break;

      case 'u':
      console.log("Vowel")
      break;

      default:
        console.log("Please enter any word")
    
  }
 }


//example of array
var marks=[30,35,40,20,55]

function score_average(){
var sum=marks[0]+marks[1]+marks[2]+marks[3]+marks[4]
var avg= sum/marks.length
console.log(avg)
}
*/

var trex, trex_running,trex_collided ;
var ground, groundImage
var invisible_ground
var cloud, cloudImage,cloudsGroup
var obstacle,obstaclesGroup
var score=0
var PLAY=1
var END=0
var gameState=PLAY
var gameover,gameoverImage
var restart,restartImage
var checkpointSound,jumpSound,dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png")
  groundImage = loadImage ("ground2.png")
  cloudImage=loadImage ("cloud.png")
  obstacle1=loadImage("obstacle1.png")
  obstacle2=loadImage("obstacle2.png")
  obstacle3=loadImage("obstacle3.png")
  obstacle4=loadImage("obstacle4.png")
  obstacle5=loadImage("obstacle5.png")
  obstacle6=loadImage("obstacle6.png")
  gameoverImage=loadImage("gameOver.jpg")
  restartImage=loadImage("restart.jpg")
  checkpointSound=loadSound('checkpoint.mp3')
  jumpSound=loadSound('jump.mp3')
  dieSound=loadSound('die.mp3')
}

function setup() {
  createCanvas(600,200);
  
  trex=createSprite(50, 160, 20, 50);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5
  trex.setCollider ('rectangle',0,0,trex.width,trex.height)
  trex.debug=false
 
  ground=createSprite(200, 180, 400, 20);
  ground.addImage ("ground",groundImage);
  
  ground.x=ground.width/2

  invisible_ground=createSprite(200, 190, 400, 10);
  invisible_ground.visible=false

  gameover=createSprite(300,100)
  gameover.addImage(gameoverImage);
  
  restart=createSprite(300,140)
  restart.addImage(restartImage);

  gameover.scale = 0.5;
  restart.scale = 0.5;

  gameover.visible = false;
  restart.visible = false;


  obstaclesGroup = new Group()
  cloudsGroup = new Group()
  
  edges=createEdgeSprites()
 
}

function draw() {
  background(180);  
  
  text('Score: '+ score, 500, 50)
  

  if (gameState===PLAY) {
    ground.velocityX=-6;
   
    score=score+Math.round(getFrameRate()/60);
    if(score>0 && score%500===0){
      checkpointSound.play()
    }

    ground.velocityX=-(4+2*score/100)
     if (ground.x<0){
        ground.x=ground.width/2
  }
  if(keyDown("space") && trex.y >= 159) {
    trex.velocityY=-10
    jumpSound.play()
  }

  trex.velocityY=trex.velocityY+0.5

  spawnClouds()
  spawnObstacles()

  if (obstaclesGroup.isTouching (trex)){
    trex.velocityY=-10
    jumpSound.play()
     dieSound.play()
     gameState=END
  }

  }
  else if (gameState===END) {
    ground.velocityX=0
    trex.velocityY=0
    trex.changeAnimation("collided",trex_collided);

  trex.velocityY=trex.velocityY+0.5

    gameover.visible = true;
    restart.visible = true;

  obstaclesGroup.setLifetimeEach(-1)
  cloudsGroup.setLifetimeEach(-1)  
  
  obstaclesGroup.setVelocityXEach(0)
  cloudsGroup.setVelocityXEach(0)  
  }
  

 
  

  trex.collide(invisible_ground)

  if (mousePressedOver(restart)) {
   reset();
  }

  drawSprites();
}

function reset(){
  gameState=PLAY
  gameover.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  trex.changeAnimation('running', trex_running)
  score=0 
}

function spawnClouds(){
  if (frameCount%60===0){
cloud=createSprite(600,30,40,10)
cloud.addImage(cloudImage)
cloud.scale=0.2
cloud.y=Math.round(random(1,70)) 
cloud.velocityX=-3

cloud.lifetime=250

cloud.depth=trex.depth
trex.depth=trex.depth+1

cloudsGroup.add(cloud)
  }
}

function spawnObstacles(){
  if (frameCount%60===0){
    obstacle=createSprite(600,170,40,10)
    obstacle.velocityX=-(6+2*score/100)
    obstacle.scale=0.09
    obstacle.velocityX=-6
    obstacle.lifetime=250
    
    var ran=Math.round(random(1,6))
    switch(ran){
      case 1: obstacle.addImage(obstacle1)
              break;
      case 2: obstacle.addImage(obstacle2)
              break;
      case 3: obstacle.addImage(obstacle3)
              break;
      case 4: obstacle.addImage(obstacle4)
              break;
      case 5: obstacle.addImage(obstacle5)
              break;
      case 6: obstacle.addImage(obstacle6)
              break;
      default: break;
    }
    
    obstacle.depth=trex.depth
    trex.depth=trex.depth+1
    
    obstaclesGroup.add(obstacle)
      }
}