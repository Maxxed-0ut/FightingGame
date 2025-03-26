const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;

canvas.width = width; 
canvas.height = height;

context.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;

class Sprite
{
    constructor({ position, velocity, color = 'red', offset})
    {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = { position: { x: this.position.x, y: this.position.y }, offset: offset, width: 100, height: 50 };
        this.color = color;
        this.isAttacking = false;
        
    }
    draw()
    {
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
        if (this.isAttacking)
        {
            context.fillStyle = 'green';
            context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }
    }
    update()
    {
        
        this.draw();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.height + this.position.y + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        }
        else
        {
            this.velocity.y += gravity;
        }
    }
    attack()
    {
        this.isAttacking = true;
        setTimeout(() => { this.isAttacking = false }, 100);
    }

}

const player = new Sprite(
    { position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      color: 'red',
      offset: { x: 0, y: 0 }
    });


const enemy = new Sprite(
    { position: { x: 400, y: 100 },
      velocity: { x: 0, y: 0 },
      color: 'blue',
      offset: {x: -50, y: 0}
    });
enemy.draw();

console.log(player);

const keys =
{
    a: { pressed: false }, d: { pressed: false }, w: { pressed: false },
    ArrowRight: { pressed: false }, ArrowLeft: { pressed: false }, ArrowUp: {pressed: false}
}


function RectColl({rect1, rect2 }) {

    return (rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x
        && rect1.attackBox.position.x <= rect2.position.x + rect2.width
        && rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y
        && rect1.attackBox.position.y <= rect2.position.y + rect2.height)
}
function animate()
{
    window.requestAnimationFrame(animate);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    if (keys.a.pressed && player.lastKey === 'a') {

        player.velocity.x = -5;
    }
    else if (keys.d.pressed && player.lastKey === 'd')
    {
        player.velocity.x = 5;
    }

    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' ) {

        enemy.velocity.x = -5;
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
    }

    if (RectColl({ rect1: player, rect2: enemy }) && player.isAttacking)
    {
        player.isAttacking = false;
        console.log('ow :(');
    }

    if (RectColl({ rect1: enemy, rect2: player }) && enemy.isAttacking) {

        enemy.isAttacking = false;
        console.log('mwahaha >:)');
    }
}


animate();

window.addEventListener('keydown', (event) =>
{
    event.preventDefault();
    switch (event.key)
    {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            keys.w.pressed = true;
            player.velocity.y = -10;
            break;

        case ' ':
            player.attack();
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = true;
            enemy.velocity.y = -10;
            break;
        case 'Enter':
            enemy.attack();
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;

    }
});