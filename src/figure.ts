import Component from "./component.js"
import Player from "./player.js"

import type { App } from "./app.js"

export const SHAPES = [1, 2, 3, 4]
const ICONS = ["square", "triangle", "circle", "cross"]
type shape = typeof SHAPES[0]


export default class Figure extends Component {
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