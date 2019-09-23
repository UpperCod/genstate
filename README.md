# genstate

Consume promises and generators to create a state with a highly declarative asynchrony. eg:

```js
import { State } from "genstate";

let initialState = {};

State(initialState);

State.map = async function*(state, search) {
    yield {loading : true,search}

    let response = async fetch(`?search=${search}`);

    if(response.status != 200) return {error: true,search};

    return {
        search,
        data : await response.json(),
    }
};

State.send("any...", state => {
	console.log(state);
});
```

## Special effects

### Return of new generators

the host generator, can return other `gestant` generators, consumes the returns recursively.

### Opening concurrent status

for a correct update of the concurrent state in the asynchronous process you must return a function this will concur the concurrent state.

```js
async function* map(state, data) {
	yield state => state + 1;
	yield state => state + 1;
	yield state => state + 1;
	return state => state + 1;
}
```

## Return constants

return constants allow changing state behavior.

### CLEAR

this constant will ignore all the executions already declared, to focus only on the one that declares it is constant, **by means of this constant, you can make the asynchrony have a cancelable effect** optimizing the concurrence.

```js
import { CLEAR } from "genstate";

async function* map(state, data) {
	yield CLEAR;
	yield 1;
	await delay(1000);
	yield 2;
	await delay(1000);
	return 3;
}
```

### BREAK

allows you to ignore asynchronous execution.

### CONTINUE

since `genstate` will read the returns of the promise to define a next state, if you force your promise to return the constant `CONTINUE`, it will wait for the promise but not associate the return of this as a state.

## hooks

```js
import useGenerator from "generator/atomico";

function WebComponent() {
	let [state, send] = useGenerator(async *(state,search)=>{
        yield {loading : true,search}

        let response = async fetch(`?search=${search}`);

        if(response.status != 200) return {error: true,search};

        return {
            search,
            data : await response.json(),
        }
    });
}
```
