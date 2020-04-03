# historify.js API


**historifySetup (excludeHashes)**

It sets up the listener for the browser's popState event (which happens when the browser's history changes). The listener is responsible of adding an entry to a local copy of the history.

If `excludeHashes` is passed, then two locations with the same paths but different hashes will be considered the same path. The practical consequence is that pressing `back` on the application button will not cycle through visited hashes within the same path.

**go (path, state = {})**

This function simply uses the browser's `history.pushState()` function to change the browser's address bar to the new `path`. An optional `state` can be passed. This function also emits a popState event, which is what would normally happen if a user clicks on a link or presses the back or forward button on their browser. As a result of `go()` being called, the new location will be part of the browser's history as well as historify's copy of the history.

**teleport (path, state = {})**

This function simply uses the browser's `history.replaceState()` function to change the browser's address bar to the new `path`. An optional `state` can be passed. This function also emits a popState event, which is what would normally happen if a user clicks on a link or presses the back or forward button on their browser. As a result of `go()` being called, the new location **will not** be part of the browser's history **nor** part of historify's copy of the history.


**back (state = {})**

This function simply uses the browser's `history.replaceState()` function to change the browser's address bar to the second-last path visited. An optional `state` can be passed. This function also emits a popState event, which is what would normally happen if a user clicks on a link or presses the back or forward button on their browser. As a result of `back()` being called, the last entry of the artificial history will be zapped.

**getHistory ()**

This function returns historify.js' copy of the browser history.
