import { loadCreator } from "./tournament-creator.js";
import { loadViewer } from "./tournament-viewer.js";
import { getLogin } from "./firebase-utils.js";

/**
 * Functions that use regex to test for a valid url path.
 * @param {string} url (this applies to all functions)
 */
const url_routes = {
    login: (url) => /^\/login$/.test(url),
    create_tournament: (url) => /^\/tournaments\/create$/.test(url),
    tournaments: (url) => /^\/tournaments\/[\w-]{10}$/.test(url),
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
export let replaceUrl = (path) => history.replaceState(path, "", path);

/**
 * Clears the page view.
 */
export let clearPageView = () => document.querySelector("#page-view").innerHTML = "";

/**
 * Loads the home screen to the page view.
 */
async function loadHome () {

    const creator_nav_button = document.createElement("button");
    creator_nav_button.id = "tournament-creator-nav-button";
    creator_nav_button.textContent = "Create Tournament";
    document.querySelector("#page-view").appendChild(creator_nav_button);

    document.querySelector("#tournament-creator-nav-button").addEventListener("click", () => {
        pushUrl("/tournaments/create");
        clearPageView();
        loadCreator();
    });
}

export function loadLogin () {

    const intro_div = document.createElement("div");
    intro_div.id = "intro-text";
    intro_div.textContent = "This is the login page. You need to log in to continue.";
    document.querySelector("#page-view").appendChild(intro_div);

    const login_button = document.createElement("button");
    login_button.id = "login-button";
    login_button.textContent = "Login";
    document.querySelector("#page-view").appendChild(login_button);

    document.querySelector("#login-button").addEventListener("click", () => {
        getLogin().then(
            (result) => {
                clearPageView();
                replaceUrl("/home");
                loadHome();
            },
            (error) => {
                console.log(error);
            }
        );
    });
}

/**
 * Handles routing by checking the current URL path and loading the proper elements.
 */
export function routeUrl () {

    const path = document.location.pathname;
    clearPageView();

    if (url_routes.login(path)) {

        loadLogin();

    } else if (url_routes.create_tournament(path)) {

        loadCreator();

    } else if (url_routes.tournaments(path)) {

        const id = path.split("/")[2];
        loadViewer(id);

    } else {

        replaceUrl("/home");
        loadHome();

    }
}

addEventListener("DOMContentLoaded", routeUrl);
addEventListener("popstate", routeUrl);
