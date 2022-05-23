import Component from "./component.js"
import Figure, { SHAPES } from "./figure.js"

import type { App } from "app.js"


export default class Player extends Component {
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