import Board from "./board.js";
import Player from "./player.js";
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
export default function init(id) {
    const gameDiv = document.querySelector(`#${id}`);
    if (!gameDiv)
        throw Error(`Quantik failed to initialize. Do you have an element with  id='${id}' on your page?`);
    const app = new App(gameDiv);
}
