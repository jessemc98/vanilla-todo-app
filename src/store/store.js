export function createStore(reducers, initialState){
  const state = initialState || {}
  const subscribers = {}
  // emit empty event to cause reducers to be called initialy
  emit({type: 'STORE_INIT'})

  function emit(event) {
    // for each key in reducers
    Object.keys(reducers).forEach(key => {
      // if keys value is array call setReducerToState with each reducer in array
      if (Array.isArray(reducers[key])){
        return reducers[key].forEach(reducer => {
          setReducerToState(key, reducer, event)
        })
      }
      // if not array must be a reducer, call setReducerToState with reducer
      setReducerToState(key, reducers[key], event)
    })
  }

  function getState(){
    return state
  }

  // calls reducer with current state[key] and event and
  // sets state[key] to the return value of reducer
  // if state changes, subscribers are called with new state value
  function setReducerToState(key, reducer, event) {
    const newState = reducer(state[key], event)

    // if state has changed and subscribers exist call subscribers with new state
    if (state[key] !== newState && subscribers[key]) {
      subscribers[key].forEach(subscriber => subscriber(newState))
    }
    // set state to newState
    state[key] = newState
  }
  function subscribe(key, callback) {
    if (!subscribers[key]) subscribers[key] = []
    subscribers[key].push(callback)
  }
  function unsubscribe(key, cb) {
    if (subscribers[key]){
      subscribers[key].forEach((func, i) => {
        return cb === func && subscribers[key].splice(i, 1)
      })
    }
  }
  return {
    emit,
    getState,
    subscribe,
    unsubscribe
  }
}
