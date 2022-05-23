import Board from "./board.js"
import Player from "./player.js"
import Figure from "./figure.js"

class App {
    element: Element
    board = new Board(this)
    player1 = new Player(this, 1)
    player2 = new Player(this, 2)
    
    currentPlayer = this.player1
    selected: null|Figure = null

    constructor(element: Element) {
        this.element = element
        this.board.mount(this.element)
        this.player1.mount(this.element)
        this.player2.mount(this.element)
    }

    selectFigure(figure: Figure) {
        if (!this.currentPlayer.has(figure)) return
        if (this.selected) this.selected.deselect()
        this.selected = figure
        figure.select()
        console.log(this.selected);
        
    }

    hitCell(x: number, y: number) {
        if (!this.selected) return
        if (!this.validMove(this.selected, x, y)) return
        this.board.setFigure(x, y, this.selected)
        this.currentPlayer.use(this.selected)
        this.selected.deselect()
        this.selected = null
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1
    }

    validMove(figure: Figure, x: number, y: number) {
        if (this.board.getCell(x, y).hasShape()) return false
        const influence = [...this.board.getColumn(x), ...this.board.getRow(y), ...this.board.getArea(x, y)]
        return !influence.some(f => figure.shape === f.shape)
    }
}

export type { App }

export default function init(id: string) {
    const gameDiv = document.querySelector(`#${id}`)
    if(!gameDiv) throw Error(`Quantik failed to initialize. Do you have an element with  id='${id}' on your page?`)
    const app = new App(gameDiv)

}