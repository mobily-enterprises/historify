# Using historify.js on an open-wc project

In order to use historify, you need to have a single page application (SPA) that manages routing.

This guide assumes that you have the end result of the guide [Standard open-wc project to a routing-aware app in 6 steps](https://mobily-enterprises.github.io/routify/guides/02-open-wc-to-routify.html), which will get you to the point of having a one-page application.

The aim of this guide is to add navigation ability (e.g. a back button and a "go to" button) to that example.

So, first of all  make sure that you have a working version of the routing-app from that guide.

Then, don't forget to install historify.js:

(NOTE: we are not yet sure we have access to the `historify` domain in NPM)

````
npm install historify
````

## Changes to RoutingApp.js

The changes needed to `RoutingApp.js` are surprisingly simple.

First of all, import historify:

    import { go, back, teleport, historifySetup } from 'historify/historify.js'

Then, add the buttons just under the `<header>` elememnt:

````
<button @click="${this._back}">BACK</button>
<button @click="${this._goAbout}">ABOUT (go)</button>
<button @click="${this._teleportAbout}">ABOUT (teleport)</button>
````

Finally, implement the calls attached to the `@click` events for those buttons:

````
_back () {
  back()
}

_goAbout () {
  go('/page-about')
}

_teleportAbout () {
  teleport('/page-about')
}
````

You are done: reload the application, and see how you can now press `back`. Also notice how the `ABOUT` buttons are different: the "go" version will make sure that the history is maintained. The "teleport" version will simply swap the current page.

Finally, notice how the back and forward buttons of the browser are fully functional, even if you keep them pressed and use them to just to random pages in the application.

Navigation nirvana!
