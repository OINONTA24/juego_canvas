var canvas = null,
    ctx = null,
    x = 50,
    y = 50,
    presionar = null,
    dir = 0,
    score = 0,
    player = null,
    food = null,
    wall = new Array(),
    gameover = true;
    
    KEY_LEFT = 37, //Flecha izq
    KEY_UP = 38,   //Flecha arriba
    KEY_RIGHT = 39, //Fecha der
    KEY_DOWN = 40, //Flecha abajo
    KEY_ENTER = 13,
    pause = true;


/*En caso de que el navegador no sea compatible con el tipo de animacion*/
window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 17);
        };
}());

document.addEventListener('keydown',function (evt){
    presionar = evt.which;
}, false);

function Rectangle(x, y, width, height) {
    this.x = (x == null) ? 0 : x;
    this.y = (y == null) ? 0 : y;
    this.width = (width == null) ? 0 : width;
    this.height = (height == null) ? this.width : height;

    this.intersects = function (rect) {
        if (rect == null) {
            window.console.warn('Missing parameters on function intersects');
        } else {
            return (this.x < rect.x + rect.width &&
                this.x + this.width > rect.x &&
                this.y < rect.y + rect.height &&
                this.y + this.height > rect.y);
        }
    };

    this.fill = function (ctx) {
        if (ctx == null) {
            window.console.warn('Missing parameters on function fill');
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
}

function random(max) {
    return Math.floor(Math.random() * max);
}

function reset(){
    score = 0;
    dir = 1;
    player.x = 40;
    player.y = 40;
    food.x = random(canvas.width / 10 - 1) * 10;
    food.y = random(canvas.height / 10 - 1) * 10;
    gameover = false;
}

function paint(ctx) {
    var i=0,
        l=0;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //jugador
    ctx.fillStyle = '#0f0';
    player.fill(ctx);

    //comida
    ctx.fillStyle = '#f00';
    food.fill(ctx);

    ctx.fillStyle = '#fff';

    //puntuaje
    ctx.fillText('Score: ' + score, 0, 10);

    //muros
    ctx.fillStyle = '#999';
    for(i=0, l = wall.length; i < l; i += 1){
        wall[i].fill(ctx);
    }

    //pausa inicial
    if(pause){
        ctx.textAlign = 'center';
        if(!gameover){
            ctx.fillText('Game over',150,75);
        }else{
            ctx.fillText('Pause',150,75);
        }
        ctx.textAlign = 'left';
    }
}

function act(){
    var i,l;
    if(!pause){
        if(gameover){
            reset();
        }
         // cambio direccion
        if (presionar == KEY_UP) {
            dir = 0;
        }
        if (presionar == KEY_RIGHT) {
            dir = 1;
        }
        if (presionar == KEY_DOWN) {
            dir = 2;
        }
        if (presionar == KEY_LEFT) {
            dir = 3;
        }

        
        // movimiento cuadro
        if (dir == 0) {
            player.y -= 10;
        }
        if (dir == 1) {
            player.x += 10;
        }
        if (dir == 2) {
            player.y += 10;
        }
        if (dir == 3) {
            player.x -= 10;
        }

        // Limite pantalla
        if (player.x > canvas.width - 1) {
            player.x = 0;
        }
        if (player.y > canvas.height - 1) {
            player.y = 0;
        }
        if (player.x < 0) {
            player.x = canvas.width;
        }
        if (player.y < 0) {
            player.y = canvas.height;
        }
        if(player.intersects(food)){
            score += 1;
            food.x = random(canvas.width / 10 - 1) * 10;
            food.y = random(canvas.height / 10 - 1) * 10;
        }
        //interseccion de los muros
        for (i = 0, l = wall.length; i < l; i += 1) {
            if (food.intersects(wall[i])) {
                food.x = random(canvas.width / 10 - 1) * 10;
                food.y = random(canvas.height / 10 - 1) * 10;
            }
    
            if (player.intersects(wall[i])) {
                pause = true;
            }
        }
    }
    //pasua durante el juego
    if(presionar == KEY_ENTER){
        pause = !pause;
        presionar = null;
    }
}

function repaint(){
    window.requestAnimationFrame(repaint);
    paint(ctx);
}

function run(){
    setTimeout(run, 50);
    act()
}

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    player = new Rectangle(40,40,10,10);
    food = new Rectangle(80,80,10,10);

    wall.push(new Rectangle(100,50,10,10));
    wall.push(new Rectangle(100,100,10,10));
    wall.push(new Rectangle(200,50,10,10));
    wall.push(new Rectangle(200,100,10,10));

    run()
    repaint();
}
window.addEventListener('load', init, false);


