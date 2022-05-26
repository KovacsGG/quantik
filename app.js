import Board from "./board.js";
import Player from "./player.js";
import Infobox from "./infobox.js";
class App {
    constructor(element, name1, name2) {
        this.board = new Board(this);
        this.selected = null;
        this.element = element;
        const gameBoard = document.createElement("section");
        const info = document.createElement("section");
        this.player1 = new Player(this, 1, name1);
        this.player2 = new Player(this, 2, name2);
        this.infobox = new Infobox(this, this.player1);
        this.board.mount(gameBoard);
        this.infobox.mount(info);
        this.player1.mount(info);
        this.player2.mount(info);
        this.element.append(gameBoard, info);
        this.currentPlayer = this.player1;
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
export default function init(id) {
    const gameDiv = document.querySelector(`#${id}`);
    if (!gameDiv)
        throw Error(`Quantik failed to initialize. Do you have an element with  id='${id}' on your page?`);
    const p1 = document.createElement("input");
    p1.classList.add("playerInput");
    const p2 = p1.cloneNode();
    p1.placeholder = "1. játékos";
    p2.placeholder = "2. játékos";
    const start = document.createElement("button");
    start.innerHTML = "Start";
    gameDiv.append(p1, p2, start);
    start.addEventListener("click", () => {
        const p1Name = p1.value || p1.placeholder;
        const p2Name = p2.value || p2.placeholder;
        gameDiv.innerHTML = "";
        new App(gameDiv, p1Name, p2Name);
    });
}
