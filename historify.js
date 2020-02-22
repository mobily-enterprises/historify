// Historify's source code
// ======================
//
// historify.js is a simple set of functions that facilitate history management
// for single page applications.

export let history = []
export let navigatePreprocessor = null

export function historifySetup (func = null) {
  navigatePreprocessor = func

  window.addEventListener('popstate', e => popStateCallback(window.location, e))
  popStateCallback(window.location, null)
}

function emitArtificialPopstate (state) {
  state = { ...state, artificial: true }
  const e = new PopStateEvent('popstate', { state })
  window.dispatchEvent(e)
}

export function go (path, state = {}) {
  window.history.pushState(state, '', path)
  emitArtificialPopstate(state)
}

export function teleport (path, state = {}) {
  history[history.length - 1] = path
  window.history.replaceState({}, '', path)
  state = { ...state, noHistory: true }
  emitArtificialPopstate(state)
}

export function back (state = {}) {
  if (history.length > 1) {
    history.pop()
    const path = history[history.length - 1]
    window.history.replaceState(state, '', path)
    state = { ...state, noHistory: true }
  }
}

export function getHistory () {
  return history
}

// This is the default navigate action
async function popStateCallback (path, e) {
  if (navigatePreprocessor) {
    const allClear = await navigatePreprocessor(path, e)
    if (!allClear) return
  }

  // Push the new page in the artificial history
  // (unless noHistory was in the popstate state)
  if (!e || !e.state || !e.state.noHistory) history.push(path)

  // For PURE browser popstate event (different to the artificial ones emitted with
  // status set as { artificial: true }, reset the artificial history to this page
  if (e && e.type === 'popstate' && e.state && !e.state.artificial) {
    const where = history.indexOf(path)
    if (where !== -1) history = history.slice(0, where + 1)
  }
}
