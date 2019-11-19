function newElement(tagName, className){
    const element = document.createElement(tagName);
    element.className = className;

    return element;
}

function Barrier(reversed = false){
    this.element = newElement('div', 'barrier');

    const edge = newElement('div', 'edge');
    const body = newElement('div', 'body');

    this.element.appendChild(reversed ? body : edge);
    this.element.appendChild(reversed ? edge : body);

    this.setHeight = height => body.style.height = `${height}px`;
}

function PairBarrier(height, opening, x){
    this.element = newElement('div', 'pair-barrier');

    this.higher = new Barrier(true);
    this.bottom = new Barrier();

    this.element.appendChild(this.higher.element);
    this.element.appendChild(this.bottom.element);

    this.raffleOpening = () => {
        const heightHigher = Math.random() * (height - opening);
        const heightBottom = height - heightHigher - opening;

        this.higher.setHeight(heightHigher);
        this.bottom.setHeight(heightBottom);
    };

    this.getX = () => parseInt(this.element.style.left.split('px')[0]);
    this.setX = x => this.element.style.left = `${x}px`;

    this.getWidth = () => this.element.clientWidth;

    //initial values
    this.raffleOpening();
    this.setX(x);
}

function Barriers(height, width, opening, space, displacement, notifyPoint){
    this.pairs = [
        new PairBarrier(height, opening, width),
        new PairBarrier(height, opening, width + space),
        new PairBarrier(height, opening, width + space * 2),
        new PairBarrier(height, opening, width + space * 3)
    ];

    this.animate = () => {
        this.pairs.forEach(pair => {
            pair.setX(pair.getX() - displacement);

            //barrier restart
            if(pair.getX() < -pair.getWidth()){
                pair.setX(pair.getX() + space * this.pairs.length);
                pair.raffleOpening();
            }

            const mid = width / 2;
            const crossedMid = pair.getX() + displacement >= mid && pair.getX() < mid;
            if(crossedMid) {
                notifyPoint();
            }
        });
    };
}

function Bird(heightGame){
    let flying = false;

    this.element = newElement('img', 'bird');
    this.element.src = '../img/bird.png';

    this.getY = () => parseInt(this.element.style.bottom.split('px')[0]);
    this.setY = y => this.element.style.bottom = `${y}px`;

    window.onkeydown = e => flying = true;
    window.onkeyup = e => flying = false;

    this.animate = () => {
        const newY = this.getY() + (flying ? 8 : -6);
        const heightMax = heightGame - this.element.clientHeight;

        if(newY > 0 && newY < heightGame) {
            this.setY(newY);
        } else if(newY > heightMax) {
            this.setY(heightMax);
        } else {
            this.setY(0);
        }
    };

    //initial values
    this.setY(heightGame / 2);
}

function Progress(){
    this.element = newElement('span', 'progress');

    this.updatePoint = points => {
        this.element.innerHTML = points;
    };

    this.updatePoint(0);
}

function areOverlapping(elementA, elementB){
    const a = elementA.getBoundingClientRect();
    const b = elementB.getBoundingClientRect();

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;

    return horizontal && vertical;
}

function collision(bird, barriers){
    let collision = false;
    barriers.pairs.forEach(pair => {
        if(!collision) {
            const higher = pair.higher.element;
            const bottom = pair.bottom.element;

            collision = areOverlapping(bird.element, higher) || areOverlapping(bird.element, bottom);
        }
    });

    return collision;
}

function FlappyBird(difficult){
    let points = 0;

    const gameArea = document.querySelector('[flappy]');
    const heightGame = gameArea.clientHeight;
    const widthGame = gameArea.clientWidth;

    const progress = new Progress();
    const barriers = new Barriers(heightGame, widthGame, 
        difficults[difficult].opening, 
        difficults[difficult].space,
        difficults[difficult].displacement, 
        () => progress.updatePoint(++points));
    const bird = new Bird(heightGame);

    gameArea.appendChild(progress.element);
    gameArea.appendChild(bird.element);
    barriers.pairs.forEach(pair => gameArea.appendChild(pair.element));

    this.start = () => {
        const timer = setInterval(() => {
            barriers.animate();
            bird.animate();

            if(collision(bird, barriers)){
                clearInterval(timer);
            }
        }, 20);
    };
}

const difficults = {
    easy: {
        displacement: 2,
        opening: 230,
        space: 400
    },
    normal: {
        displacement: 5,
        opening: 210,
        space: 380
    },
    hard: {
        displacement: 8,
        opening: 170,
        space: 340
    }
};

function start(){
    const button = document.getElementById('button-start');
    const select = document.getElementById('select-difficult');

    button.onclick = e => {
        document.querySelector('div.difficult').style.display = 'none';
        document.querySelector('[flappy]').style.display = 'block';

        const game = new FlappyBird(select.options[select.selectedIndex].value);
        game.start();
    };
}

start();