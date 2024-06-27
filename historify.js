// Historify's source code
// ======================
//
// historify.js is a simple set of functions that facilitate history management
// for single page applications.
//
// The module works by keeping an artificial copy of the history, and making
// sure that the browser's history and the artificial history are as in sync
// as possible.

// The default variables are set at the beginning of the module:

export let history = []
export let excludeHashes = false
export let backFrom = ''

// In order for historify to work, it needs to be set up and it needs to listen
// to popstate events (which will indicate a change of path).
// This is done through the function `historifySetup()`, which is passed a
// navigatePostprocessor function called every time the browser location changes.

export function historifySetup (_excludeHashes = false) {
  excludeHashes = _excludeHashes

  window.addEventListener('popstate', e => popStateCallback(window.location, e))
  popStateCallback(window.location, null)
}

// Since changing the location with `pushState` and `replaceState` doesn't trigger
// `popstate`, the module will emit its own artificial one. The state
// is marked as `{ artificial: true }` -- this will have implication later
// when the history is manipulated

function emitArtificialPopstate (state) {
  state = { ...state, artificial: true }
  const e = new PopStateEvent('popstate', { state })
  window.dispatchEvent(e)
}

// It's time to implement the actual navigation methods.
// `go() will go to a URL by using pushState() and emitting the artificial
// `popstate` event.

export function go (path, state = {}) {
  backFrom = ''
  window.history.pushState(state, '', path)
  emitArtificialPopstate(state)
}

// The `teleport()` method is similar to `go()`, except that it doesn't affect the
// history. For the browser's history, this is a natural consequence of using
// `replaceState()`. For the module itself, the last entry in the history is
// modified, _and_ the artificual `popstate` event is generated with the
// property `noHistory` set to `true`, which will prevent the module from
// adding the entry in the history
export function teleport (path, state = {}) {
  backFrom = ''
  history[history.length - 1] = path
  state = { ...state, noHistory: true }
  window.history.replaceState(state, '', path)
  emitArtificialPopstate(state)
}

// The back button works as expected: if there are entries in the history,
// the browser's `back()` method is called, and the artificial history is then
// shortened by 1.
// Note that there is no need to emit an artificial `popstate` event, since
// `history.back()` will emit a real one
export function back (state = {}) {
  if (history.length > 1) {
    backFrom = history[history.length -1 ]
    history.pop()
    window.history.back()
  }
}

// The history is made available to the external world

export function getHistory () {
  return history
}

// When the location changes, the `popstate` event is emitted. This might happen
// either organically, coming from the browser, or artificially by calling
// `emitArtificialPopstate()`.
//
// This is where the new URL is actually added to the history (unless the
// `noHistory` property is set in the event, as it happens in `teleport()`).
//
// If an event isn't marked as `artificial`, it means that the user has clicked
// on one of the forward/back buttons on the browser, or has clicked on
// a link.
//
// If the event is not artificial, then the module will make sure that the
// artificial history is properly in sync with the browser's history, by
// truncating the artificial history to the latest matching entry.

async function popStateCallback (location, e) {
  const path = decodeURIComponent(location.pathname) + (excludeHashes ? '' : location.hash)
  backFrom = ''

  /* Push the new page in the artificial history */
  /* (unless noHistory was in the popstate state) */
  if (!e || !e.state || !e.state.noHistory) history.push(path)

  /* For PURE browser popstate event (different to the artificial ones emitted with */
  /* status set as { artificial: true }, reset the artificial history to this page */
  if (e && e.type === 'popstate' && (!e.state || !e.state.artificial)) {
  /* if (e && e.type === 'popstate' && e.state && !e.state.artificial) { */
    const where = history.lastIndexOf(path)
    if (where !== -1) history = history.slice(0, where + 1)
  }
}
