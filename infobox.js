import Component from "./component.js";
export default class Infobox extends Component {
    constructor(app, startingPlayer) {
        super(app);
        this.element = document.createElement("section");
        this.currentPlayer = startingPlayer;
    }
}
