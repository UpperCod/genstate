import { State } from "./index";
import { useState } from "atomico";

export default function useGenerator(generator, initialState) {
	let [state, setState] = useState(() => {
		let ref = State(initialState);

		let send = () => ref.send(data, state => setState(state));

		return { ref, send };
	});

	return [state.ref.state, state.send];
}
