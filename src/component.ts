import type { App } from "./app.js"

export default class Component{
    element: null|Element = null
    app: App
    constructor(app: App) {
        this.app = app
    }
    mount(parent: Element) {
        if (this.element) parent.appendChild(this.element)
    }
}