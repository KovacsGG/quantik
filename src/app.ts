const SHAPES = [1, 2, 3, 4]
const ICONS = ["square", "triangle", "circle", "cross"]
type shape = typeof SHAPES[0]


class Component{
    element: null|Element = null
    app: App
    constructor(app: App) {
        this.app = app
    }
    mount(parent: Element) {
        if (this.element) parent.appendChild(this.element)
    }
}

class Figure extends Component {
    player: null|Player
    shape: null|shape
    element: HTMLImageElement

    constructor(app: App, player: null|Player = null, shape: null|shape = null) {
        super(app)
        this.player = player
        this.shape = shape
        this.element = document.createElement("img")
        this.element.classList.add("figure")
        this.element.addEventListener("click", () => {this.app.selectFigure(this)})
        
        this.update(this.player, this.shape)
    }

    update(player: typeof this.player, shape: typeof this.shape) {
        this.player = player
        this.shape = shape

        if (this.player && this.shape !== null) {
            this.element.classList.add("player" + this.player.id)
            this.element.src = `assets/${ICONS[this.shape - 1]}.svg`
            this.element.alt = `Player ${this.player.id}'s ${ICONS[this.shape - 1]}`
            
        } else {
            this.element.removeAttribute("src")
            this.element.removeAttribute("alt")
        }
    }

    hasShape() {
        return this.shape !== null
    }

    select() {
        this.element.classList.add("selected")
    }

    deselect() {
        this.element.classList.remove("selected")
    }
}

class Board extends Component{
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

class Player extends Component {
    element = document.createElement("div")
    figures: Figure[] = []
    id: 1 | 2

    constructor(app: App, id: 1 | 2) {
        super(app)
        this.id = id
        for (let shape of SHAPES) {
            for (let _ = 0; _ < 2; _++) {
                const f = new Figure(this.app, this, shape)
                this.figures.push(f)
                f.mount(this.element)
            }

        }
    }

    use(figure: Figure) {
        this.figures = this.figures.filter(f => f !== figure)
        figure.update(null, null)
    }

    has(figure: Figure) {
        return this.figures.some(f => f === figure)
    }
}

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

function init(id: string) {
    const gameDiv = document.querySelector(`#${id}`)
    if(!gameDiv) throw Error(`Quantik failed to initialize. Do you have an element with  id='${id}' on your page?`)
    const app = new App(gameDiv)

}

init("quantik-game")