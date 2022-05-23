import Component from "./component.js";
import Figure, { SHAPES } from "./figure.js";
export default class Player extends Component {
    constructor(app, id) {
        super(app);
        this.element = document.createElement("div");
        this.figures = [];
        this.id = id;
        for (let shape of SHAPES) {
            for (let _ = 0; _ < 2; _++) {
                const f = new Figure(this.app, this, shape);
                this.figures.push(f);
                f.mount(this.element);
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
