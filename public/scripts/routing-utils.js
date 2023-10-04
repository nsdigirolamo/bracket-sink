import { loadCreator } from "./tournament-creator.js";
import { loadViewer } from "./tournament-viewer.js";

/**
 * Functions that use regex to test for a valid url path.
 * @param {string} url (this applies to all functions)
 */
const url_routes = {
    tournaments: (url) => /^\/tournaments\/[\w-]{10}$/.test(url),
    create_tournament: (url) => /^\/tournaments\/create$/.test(url)
};

/**
 * Changes the URL to the given path and adds the path to the browser history.
 * @param {string} path
 */
let pushUrl = (path) => history.pushState(path, "", path);

/**
 * Changes the URL to the given path but does not add the path to the browser history.
 * @param {string} path
 */
let replaceUrl = (path) => history.replaceState(path, "", path);

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
    creator_nav_button.textContent = "Test";
    document.querySelector("#page-view").appendChild(creator_nav_button);

    document.querySelector("#tournament-creator-nav-button").addEventListener("click", () => {
        pushUrl("/tournaments/create");
        clearPageView();
        loadCreator();
    });
}

/**
 * Handles routing by checking the current URL path and loading the proper elements.
 */
async function routeUrl () {

    const path = document.location.pathname;
    clearPageView();

    if (url_routes.tournaments(path)) {

        const id = path.split("/")[2];
        loadViewer(id);

    } else if (url_routes.create_tournament(path)) {

        loadCreator();

    } else {

        replaceUrl("/home");
        loadHome();

    }
}

addEventListener("DOMContentLoaded", routeUrl);
addEventListener("popstate", routeUrl);
