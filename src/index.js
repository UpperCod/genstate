export const CLEAR = Symbol();
export const BREAK = Symbol();
export const CONTINUE = Symbol();

export const promiseIgnore = new Promise(() => {});

export function consumer(value, payload, process, id, subscribe) {
	return Promise.resolve(value).then(value => {
		if (typeof value == "function") {
			return consumer(
				value(process.state, payload),
				null,
				process,
				id,
				subscribe
			);
		}

		if (typeof value == "object" && typeof value.next == "function") {
			return new Promise(resolve => {
				function scan(generator) {
					Promise.resolve(generator.next(process.state)).then(
						({ value, done }) =>
							consumer(value, null, process, id, subscribe).then(
								() =>
									done
										? resolve(process.state)
										: scan(generator)
							)
					);
				}
				scan(value);
			});
		}

		return process.next(value, id, subscribe);
	});
}

/**
 * @param {*} state  - initial state
 */
export function State(state) {
	let id = 0;

	let ignore = {};
	let currentFocus;
	let process = {
		state,
		next,
		send
	};

	function next(value, id, subscribe) {
		switch (value) {
			case CLEAR:
				currentFocus = id;
				return process.state;
			case BREAK:
				ignore[id] = true;
				return process.state;
			case CONTINUE:
				return process.state;
		}

		if (currentFocus != null && currentFocus != id) return promiseIgnore;

		if (ignore[id]) return promiseIgnore;

		process.state = value;

		subscribe && subscribe(value);

		return value;
	}

	function send(data, subscribe) {
		return consumer(process.map, data, process, id++, subscribe);
	}

	return process;
}
