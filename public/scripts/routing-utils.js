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
 * Handles routing by checking the current URL path and loading the proper elements.
 */
async function routeUrl () {

    const path = document.location.pathname;

    if (url_routes.tournaments(path)) {

        const id = path.split("/")[2];
        loadViewer(id);

    } else if (url_routes.create_tournament(path)) {

        loadCreator();

    } else {

        history.pushState(null, "", "/home");

    }
}

addEventListener("DOMContentLoaded", routeUrl);
