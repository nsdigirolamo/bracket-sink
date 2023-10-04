import { loadCreator } from "./tournament-creator.js";
import { loadViewer } from "./tournament-viewer.js";

/**
 * Functions that use regex to test for a valid url path.
 * @param {string} url (this applies to all functions)
 */
const url_routes = {
    tournaments: (url) => /^\/tournaments\/[\w-]{10}$/.test(url),
    create_tournament: (url) => /^\/tournaments\/create$/.test(url)
}

/**
 * Pushes the given URL path to the page history and clears the page view.
 * @param {string} path
 */
let pushUrl = (path) => history.pushState(path, "", path);

/**
 * Clears the page view.
 */
let clearPageView = () => document.querySelector("#page-view").innerHTML = "";

/**
 * Loads the home screen to the page view.
 */
function loadHome () {

    const creator_nav_button = document.createElement("button");
    creator_nav_button.id = "tournament-creator-nav-button";
    creator_nav_button.textContent = "Test"
    document.querySelector("#page-view").appendChild(creator_nav_button);

    document.querySelector("#tournament-creator-nav-button").addEventListener("click", () => {
        pushUrl("/tournaments/create");
        loadCreator();
    });
}

/**
 * Handles routing by checking the current URL path and loading the proper elements.
 */
async function routeUrl () {

    const path = document.location.pathname;

    if (url_routes.tournaments(path)) {

        const id = path.split("/")[2];
        clearPageView();
        loadViewer(id);

    } else if (url_routes.create_tournament(path)) {

        clearPageView();
        loadCreator();

    } else {

        /**
         * TODO: Right now if a user types the wrong URL in the url bar, the site redirects
         * but doesn't allow the user to go back in the history again. This is because pushUrl
         * Will always put home at the top of the history stack. Find a way of changing the url
         * without pushing to the stack to fix this issue.
         */
        pushUrl("/home");
        clearPageView();
        loadHome();

    }
}

addEventListener("DOMContentLoaded", routeUrl);
addEventListener("popstate", routeUrl);
