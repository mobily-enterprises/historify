# historify.js API


**historifySetup (navigateProcessor)**

It sets up the listener for the browser's popState event (which happens when the browser's history changes). The listener is responsible of adding an entry to a local copy of the history.
You can pass an async `navigateProcessor` function as parameter, which will be called before adding the entry to the history. If the `navigateProcessor` function returns false, it's assumed that navigation was derailed and nothing is added to the history.


Example of usage:

````
import { historifySetup, teleport } from 'historify/historify.js'

// ...

async function navigateProcessor () {
 const userInfo = window.userInfo

 if (userInfo.loggedIn) {
   if (path === '/') {
     teleport('/dashboard')
     return false
   }
 } else {
   if (path !== '/login') {
     teleport('/login')
     return false
   }
 }

 // Work out the page to load, and attempt to load it
 const cleanPath = path.split(/[#?/]/)[1]
 const mod = await importModuleForPath(cleanPath)
 if (!mod) {
   teleport('/view404')
   return false
 }

 // All clear: historify will add entry to the history
 return true
}

historifySetup(navigateProcessor)

````

You can see that an attempt to navigate to `/` will be derailed to the dashboard (if the user is logged in) or to the login page (if the user is not logged in). Also, dynamic module loading is implemented, working out the name of the module from the URL.

**go (path, state = {})**

This function simply uses the browser's `history.pushState()` function to change the browser's address bar to the new `path`. An optional `state` can be passed. This function also emits a popState event, which is what would normally happen if a user clicks on a link or presses the back or forward button on their browser. As a result of `go()` being called, the new location will be part of the browser's history as well as historify's copy of the history.

**teleport (path, state = {})**

This function simply uses the browser's `history.replaceState()` function to change the browser's address bar to the new `path`. An optional `state` can be passed. This function also emits a popState event, which is what would normally happen if a user clicks on a link or presses the back or forward button on their browser. As a result of `go()` being called, the new location **will not** be part of the browser's history **nor** part of historify's copy of the history.


**back (state = {})**

This function simply uses the browser's `history.replaceState()` function to change the browser's address bar to the second-last path visited. An optional `state` can be passed. This function also emits a popState event, which is what would normally happen if a user clicks on a link or presses the back or forward button on their browser. As a result of `back()` being called, the last entry of the artificial history will be zapped.

**getHistory ()**

This function returns historify.js' copy of the browser history.
