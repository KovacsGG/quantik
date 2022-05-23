"use strict";
const SHAPES = [1, 2, 3, 4];
const ICONS = ["square", "triangle", "circle", "cross"];
class Component {
    constructor(app) {
        this.element = null;
        this.app = app;
    }
    mount(parent) {
        if (this.element)
            parent.appendChild(this.element);
    }
}
class Figure extends Component {
    constructor(app, player = null, shape = null) {
        super(app);
        this.player = player;
        this.shape = shape;
        this.element = document.createElement("img");
        this.element.classList.add("figure");
        this.element.addEventListener("click", () => { this.app.selectFigure(this); });
        this.update(this.player, this.shape);
    }
    update(player, shape) {
        this.player = player;
        this.shape = shape;
        if (this.player && this.shape !== null) {
            this.element.classList.add("player" + this.player.id);
            this.element.src = `assets/${ICONS[this.shape - 1]}.svg`;
            this.element.alt = `Player ${this.player.id}'s ${ICONS[this.shape - 1]}`;
        }
        else {
            this.element.removeAttribute("src");
            this.element.removeAttribute("alt");
        }
    }
    hasShape() {
        return this.shape !== null;
    }
    select() {
        this.element.classList.add("selected");
    }
    deselect() {
        this.element.classList.remove("selected");
    }
}
class Board extends Component {
    constructor(app) {
        super(app);
        this.element = document.createElement("table");
        this.state = [];
        for (let y = 0; y < 4; y++) {
            const row = document.createElement("tr");
            const stateRow = [];
            for (let x = 0; x < 4; x++) {
                const cell = document.createElement("td");
                row.appendChild(cell);
                cell.addEventListener("click", () => this.app.hitCell(x, y));
                const figure = new Figure(this.app);
                stateRow.push(figure);
                figure.mount(cell);
            }
            this.element.appendChild(row);
            this.state.push(stateRow);
        }
    }
    setFigure(x, y, figure) {
        this.getCell(x, y).update(figure.player, figure.shape);
    }
    getCell(x, y) {
        return this.state[y][x];
    }
    getColumn(x) {
        return this.state.map(row => row[x]).filter(f => f.hasShape());
    }
    getRow(y) {
        return this.state[y].filter(f => f.hasShape());
    }
    getArea(x, y) {
        const alt = (i) => i + 1 - i % 2 * 2;
        return [
            this.getCell(x, y),
            this.getCell(y, alt(x)),
            this.getCell(alt(y), x),
            this.getCell(alt(y), alt(x)),
        ].filter(f => f.hasShape());
    }
}
class Player extends Component {
    constructor(app, id) {
        super(app);
        this.element = document.createElement("div");
        this.figures = [];
        this.id = id;
        for (let shape of SHAPES) {
            for (let _ = 0; _ < 2; _++) {
                const f = new Figure(this.app, this, shape);
                this.figures.push(f);
                f.mount(this.element);
            }
        }
    }
    use(figure) {
        this.figures = this.figures.filter(f => f !== figure);
        figure.update(null, null);
    }
    has(figure) {
        return this.figures.some(f => f === figure);
    }
}
class App {
    constructor(element) {
        this.board = new Board(this);
        this.player1 = new Player(this, 1);
        this.player2 = new Player(this, 2);
        this.currentPlayer = this.player1;
        this.selected = null;
        this.element = element;
        this.board.mount(this.element);
        this.player1.mount(this.element);
        this.player2.mount(this.element);
    }
    selectFigure(figure) {
        if (!this.currentPlayer.has(figure))
            return;
        if (this.selected)
            this.selected.deselect();
        this.selected = figure;
        figure.select();
        console.log(this.selected);
    }
    hitCell(x, y) {
        if (!this.selected)
            return;
        if (!this.validMove(this.selected, x, y))
            return;
        this.board.setFigure(x, y, this.selected);
        this.currentPlayer.use(this.selected);
        this.selected.deselect();
        this.selected = null;
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }
    validMove(figure, x, y) {
        if (this.board.getCell(x, y).hasShape())
            return false;
        const influence = [...this.board.getColumn(x), ...this.board.getRow(y), ...this.board.getArea(x, y)];
        return !influence.some(f => figure.shape === f.shape);
    }
}
function init(id) {
    const gameDiv = document.querySelector(`#${id}`);
    if (!gameDiv)
        throw Error(`Quantik failed to initialize. Do you have an element with  id='${id}' on your page?`);
    const app = new App(gameDiv);
}
init("quantik-game");
