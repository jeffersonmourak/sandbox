module.exports = function combineReducers(reducers) {
  const reducersKeys = Object.keys(reducers);

  return (state = {}, action) => {
    let nextState = { ...state };

    for (const key of reducersKeys) {
      const reducer = reducers[key];
      const keyState = state[key];
      const nextKeyState = reducer(keyState, action)
      
      nextState[key] = nextKeyState;
    }

    return nextState;
  }
};