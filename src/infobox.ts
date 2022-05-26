import Component from "./component.js"
import Player from "./player.js"

import type { App } from "./app.js"

export default class Infobox extends Component {
	element = document.createElement("section")
	currentPlayer: Player

	constructor(app: App, startingPlayer: Player) {
		super(app)

		this.currentPlayer = startingPlayer
	}
}