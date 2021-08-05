const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world;
var canvas, angle, tower, ground, cannon;

var arr=[[1,2],[3,4],[4,5]]
console.log(arr);

var balls=[];
var boats=[];


function preload() {
  backgroundImg = loadImage("./assets/background.jpeg");
  towerImage = loadImage("./assets/tower.png");

}

function setup() {
  canvas = createCanvas(windowWidth-200 , windowHeight-150 );
  engine = Engine.create();
  world = engine.world;
  angle = -PI / 5;
  ground = new Ground(0, height - 1, width * 2, 1);
  tower = new Tower(width / 2 - 450, height - 220, 350, 350);
  cannon = new Cannon(width / 2 - 410, height / 2 - 150, 120, 40, angle);

  boat = new Boat(width, height - 100, 200, 200, -100);
  
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

 

  Engine.update(engine);
  ground.display();

  
  showBoats();

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    for (var j = 0; j < boats.length; j++) {
      if (balls[i] !== undefined && boats[j] !== undefined) {
        var collision = Matter.SAT.collides(balls[i].body, boats[j].body);
        if (collision.collided) {
          boats[j].remove(j);

          Matter.World.remove(world, balls[i].body);
          balls.splice(i, 1);
          i--;
          
        }
      } 
    }
  }


  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
  }

  cannon.display();
  tower.display();

  
}
//-----------------show multiple boats -------------------------------------------------

function showBoats() {
  if (boats.length > 0) {
    if (
      boats.length < 4 &&
      boats[boats.length - 1].body.position.x < width - 300
    ) {
      var positions = [-130, -50, -120, -80];
      var position = random(positions);
      var boat = new Boat(width,height - 50, 200, 200, position);
      boats.push(boat);
    }

    for (var i = 0; i < boats.length; i++) {
      Matter.Body.setVelocity(boats[i].body, {
        x: -0.9,
        y: 0
      });

      boats[i].display();
    }
  }else {
    var boat = new Boat(width, height - 50, 200, 200, -100);
    boats.push(boat);
  }


}


//---------------------show cannon balls ----------------------------------------------------

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    balls.push(cannonBall);
  }
}

//function to show the ball
function showCannonBalls(ball, index) {
  ball.display();
  if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
    Matter.World.remove(world, ball.body);
    balls.splice(index, 1);
  }
}


function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length - 1].shoot();
  }
}