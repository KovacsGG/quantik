export default class Component {
    constructor(app) {
        this.element = null;
        this.app = app;
    }
    mount(parent) {
        if (this.element)
            parent.appendChild(this.element);
    }
}
