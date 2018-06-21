const combineReducers = require('./combineReducers');
const Store = require('./Store');

function createStore(reducer) {
  return new Store(reducer);
}

module.exports = {
  createStore,
  combineReducers
}