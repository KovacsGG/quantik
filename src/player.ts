import Component from "./component.js"
import Figure, { SHAPES } from "./figure.js"

import type { App } from "app.js"


export default class Player extends Component {
    element = document.createElement("div")
    figures: Figure[] = []
    id: 1 | 2
    name: string

    constructor(app: App, id: 1 | 2, name: string) {
        super(app)
        this.id = id
        this.name = name

        this.element.classList.add("player")
        const heading = document.createElement("h1")
        heading.innerHTML = this.name
        const drawer = document.createElement("ul")
        this.element.appendChild(heading)
        this.element.appendChild(drawer)
        for (let shape of SHAPES) {
            for (let _ = 0; _ < 2; _++) {
                const f = new Figure(this.app, this, shape)
                this.figures.push(f)

                const item = document.createElement("li")
                drawer.appendChild(item)
                f.mount(item)
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