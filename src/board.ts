import Component from "./component.js"
import Figure from "./figure.js"

import type { App } from "app.js"


export default class Board extends Component{
    element = document.createElement("table")
    state: Figure[][] = []

    constructor(app: App) {
        super(app)
        for (let y = 0; y < 4; y++) {
            const row = document.createElement("tr")

            const stateRow = []

            for (let x = 0; x < 4; x++) {
                const cell = document.createElement("td")
                row.appendChild(cell)
                cell.addEventListener("click", () => this.app.hitCell(x, y))

                const figure = new Figure(this.app)
                stateRow.push(figure)
                figure.mount(cell)
            }
            this.element.appendChild(row)

            this.state.push(stateRow)
        }
    }

    setFigure(x: number, y: number, figure: Figure) {
        this.getCell(x, y).update(figure.player, figure.shape)
    }

    getCell(x: number, y: number) {
        return this.state[y][x]
    }

    getColumn(x: number) {
        return this.state.map(row => row[x]).filter(f => f.hasShape())
    }

    getRow(y: number) {
        return this.state[y].filter(f => f.hasShape())
    }

    getArea(x: number, y: number) {
        const alt = (i: number) => i + 1 - i % 2 * 2
        return [
            this.getCell(x, y),
            this.getCell(y, alt(x)),
            this.getCell(alt(y), x),
            this.getCell(alt(y), alt(x)),
        ]. filter(f => f.hasShape())
    }
}