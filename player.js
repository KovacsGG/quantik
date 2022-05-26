import Component from "./component.js";
import Figure, { SHAPES } from "./figure.js";
export default class Player extends Component {
    constructor(app, id, name) {
        super(app);
        this.element = document.createElement("section");
        this.figures = [];
        this.id = id;
        this.name = name;
        this.element.classList.add("player");
        const heading = document.createElement("h1");
        heading.innerHTML = this.name;
        const drawer = document.createElement("ul");
        this.element.appendChild(heading);
        this.element.appendChild(drawer);
        for (const shape of SHAPES) {
            for (let _ = 0; _ < 2; _++) {
                const f = new Figure(this.app, this, shape);
                this.figures.push(f);
                const item = document.createElement("li");
                drawer.appendChild(item);
                f.mount(item);
            }
        }
    }
    use(figure) {
        this.figures = this.figures.filter(f => f !== figure);
        figure.update(null, null);
    }
    has(figure) {
        return this.figures.some(f => f === figure);
    }
}
