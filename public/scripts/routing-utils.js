import { loadCreator } from "./tournament-creator.js";
import { loadViewer } from "./tournament-viewer.js";
import { getLogin } from "./firebase-utils.js";
import { loadList } from "./tournament-list.js";

/**
 * A map of functions that test for valid URL paths using regex.
 */
const url_routes = {
    login: (url) => /^\/login$/.test(url),
    create_tournament: (url) => /^\/tournaments\/create$/.test(url),
    tournament_list: (url) => /^\/tournaments$/.test(url),
    tournament: (url) => /^\/tournaments\/[\w-]{10}$/.test(url),
};

/**
 * Changes the URL to the given path and adds the path to the browser history.
 * @param {string} path
 */
export let pushUrl = (path) => history.pushState(path, "", path);

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

    const list_nav_button = document.createElement("button");
    list_nav_button.id = "tournament-list-nav-button";
    list_nav_button.textContent = "Tournament List";
    document.querySelector("#page-view").appendChild(list_nav_button);

    document.querySelector("#tournament-list-nav-button").addEventListener("click", () => {
        pushUrl("/tournaments");
        clearPageView();
        loadList();
    });
}

/**
 * Loads the login screen to the page view.
 */
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

    } else if (url_routes.tournament(path)) {

        const id = path.split("/")[2];
        loadViewer(id);

    } else if (url_routes.tournament_list(path)) {

        loadList();

    } else {

        replaceUrl("/home");
        loadHome();

    }
}

addEventListener("DOMContentLoaded", routeUrl);
addEventListener("popstate", () => {
    if (!firebase.auth().currentUser) replaceUrl("/login");
    routeUrl();
});
