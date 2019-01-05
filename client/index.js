import { throttle } from "underscore";
import ReactDOM from "react-dom";
import React from "react";

const toBase64 = (data = "AAAA==") => `data:image/jpeg;charset=utf-8;base64,${data}`;
const ws = new WebSocket(`ws://localhost:8080`);

class App extends React.Component {
	constructor(props) {
		super();

		this.state = {
			formValues: {
				message: "test",
				x: 10,
				y: 10
			},
			imageData: toBase64()
		};
		
		ws.onmessage = this.onReceiveImageData.bind(this);
		ws.onopen = this.onWebsocketConnected.bind(this);
		this.onChange = this.onChange.bind(this);
		this.requestImage = throttle(this.requestImage.bind(this));
	}

	onReceiveImageData(res) {
		console.log(res);
		this.setState({ imageData: toBase64(res.data) })
	}

	onChange(e) {
		let state = { ...this.state.formValues };
		const data = new FormData(e.currentTarget);
		for (const [key, val] of data.entries()) {
			state[key] = val;
		}
		this.setState({ formValues: state });
		this.requestImage();
	}

	requestImage() {
		ws.send(JSON.stringify(this.state.formValues));
	}

	onWebsocketConnected() {
		this.requestImage();
	}

	render() {
		return (
			<section>
				<form onChange={this.onChange}>
					<input name="message" value={this.state.formValues.message}/>
					<input name="x" type="number" value={this.state.formValues.x}/>
					<input name="y" type="number" value={this.state.formValues.y}/>
				</form>
				<img src={this.state.imageData} />
			</section>
		);
	}
}

ReactDOM.render(<App />, document.getElementById(`App`));