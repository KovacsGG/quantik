import Component from "./component.js";
import Figure from "./figure.js";
export default class Board extends Component {
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
