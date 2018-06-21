console.log(`INIT EXAMPLE`);

const { createStore, combineReducers } = require('./index');

function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([ action.text ])
    default:
      return state
  }
}

let exampleStore = createStore(combineReducers({
  todos,
  counter
}));

let examples = [
  exampleStore.subscribe( state => {
    console.log('listener 1', state);
  } ),
  exampleStore.subscribe( state => {
    console.log('listener 2', state);
  } ),
  exampleStore.subscribe( state => {
    console.log('listener 3', state);
  } ),
  exampleStore.subscribe( state => {
    console.log('listener 4', state);
  } ),
  exampleStore.subscribe( state => {
    console.log('listener 5', state);
  } )
]

let i = 0;
setInterval(() => {
  exampleStore.dispatch({
    type: 'INCREMENT'
  });

  exampleStore.dispatch({
    type: 'ADD_TODO',
    text: `adding for ${i + 1} time`
  })

  if (i % 2 === 0) {
    let unsubscribe = examples.pop();

    if (unsubscribe) {
      unsubscribe();
    } 
  }

  i++;
}, 500);