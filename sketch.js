//Crear estados del juego END y PLAY
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//Crear variables de objetos del programa
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

//Crea variables del puntaje
var score;

//Crea las variables para el gameover
var gameOverImg,restartImg, gameOver, restart;

function preload(){
  //Precargar imagen del trex corriendo
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  //Precargar imagen del suelo
  groundImage = loadImage("ground2.png");
  
  //Precargar imagen de las nubes
  cloudImage = loadImage("cloud.png");
  
  //Precargar imagenes de los obstaculos
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  //Precargar las imagenes de gameOver y Restart
   gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  //precargar sonidos
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  
}

function setup() {
  createCanvas(600, 200);
  
  //Crea el Sprite del trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  
  //radio de colicionar
  trex.setCollider("circle",0,0,40);
  trex.debug = false;
  
  //crea el Sprite del suelo
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
    
     
  //crea el suelo invisible
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //crea grupo de obstaculos y grupo de nubes
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  //crea sprites de gameOver y restart
  gameOver = createSprite(300,70,100,40);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.6;
  gameOver.visible = false;
  
  restart = createSprite(300,140,100,40);
  restart.addImage(restartImg);
  restart.scale = 0.6;
  restart.visible = false;
  
  //console.log("Hello" + 5);
  
  //variable de score
  score = 0;
  
}

function draw() {
  //establece el color de fondo
  background("lavender");
  //crea el texto de la puntuación en la pantalla
  fill("midnightblue");
  stroke("white");
  text("Puntuación: "+ score, 500,50);
  
  //muestra en la consola el estado del juego
  console.log("Estado del juego ",gameState);
  
  //agrega estados del juego
  if(gameState === PLAY){
    //mueve el suelo
    ground.velocityX = -(6 + 3 * score/200);
    //puntuación
    score = score + Math.round(getFrameRate()/60);
    
    //condición para que suene cada 100 puntos
    if(score>0 && score%100 === 0){
      checkPointSound.play();
    }
        
    //hace que el suelo reestablezca su posición
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //salta cuando preciono la barra espaciadora
    if(keyDown("space")&& trex.y >= 150) {
      trex.velocityY = -10; 
      jumpSound.play(); 
    }
    
    //agrega gravedada al trex
    trex.velocityY = trex.velocityY + 0.8
  
    //aparecen las nubes
    spawnClouds();
  
    //aparecen los obtaculos en el suelo
    spawnObstacles();
    
    //condición para que si el trex toca un obstaculo el juego cambie de estado
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
    }
  }
   else if (gameState === END) {
     //detiene el suelo
     ground.velocityX = 0;
     //detiene la velocidad de salto del trex
     trex.velocityY = 0;
     
     //Detiene el grupo de obstaculos y nubes
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     
     
    //cambia la animación del trex
      trex.changeAnimation("collided", trex_collided);

     //Mantiene las nubes y obstaculos en pantalla aunque el trex colicione, nunca desaparecerán
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     //letrero de gameOver y reset visble
      gameOver.visible = true;
      restart.visible = true;
     
   }
  
  if(mousePressedOver(restart)){
    reset();
  }
 
  //evita que el trex caiga
  trex.collide(invisibleGround);
    
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //genera obstaculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asigna escala y ciclo de vida al obstaculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 170;
   
   //añade cada obstaculo al grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escribe el código para aparecer las nubes
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.6;
    cloud.velocityX = -(3+score/200);
    
     //asigna ciclo de vida a la variable nubes
    cloud.lifetime = 220;
    
    //ajusta la profundidad del trex con relacion a las nubes
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //añade cada nube al grupo de nubes
    cloudsGroup.add(cloud);
    }
}

function reset(){
  gameState = PLAY;
  restart.visible = false;
  gameOver.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score = 0;
}
