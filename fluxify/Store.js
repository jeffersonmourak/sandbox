module.exports = class Store {
  constructor(reducer) {
    if (!reducer) {
      throw new Error(`Missing Reducer!`);
    }

    this._reducer = reducer;
    this._store = this._reducer( undefined, {
      type: `INIT`,
    });


    this._subscribers = {};
    this._isDispatching = false;
  }

  // PRIVATE

  _broadcast(state) {
    for (let hashKey of Object.keys(this._subscribers)) {
      let subscriber = this._subscribers[hashKey];

      subscriber(state);
    }
  }

  _generateHash() {
    return Math.random().toString(36).substr(4, 6);
  }

  _unSubscribeListerner(hashKey) {
    delete this._subscribers[hashKey];
  }
  
  // PUBLIC

  getState() {
    if (!this._isDispatching) {
      return this._store;
    }

    throw new Error('You cannot get state while the reducer is executing');
  }

  dispatch(action) {
    if (!this._isDispatching) {
      this._store = this._reducer(this._store, action);
      this._broadcast(this._store);

      return;
    }

    throw new Error('You cannot dispatch action while the reducer is executing');
  }

  subscribe(listener) {
    if (!this._isDispatching) {
      let hashKey = this._generateHash();

      this._subscribers[hashKey] = listener;

      return () => this._unSubscribeListerner(hashKey);
    }

    throw new Error('You cannot subscribe while the reducer is executing');
  }
}
