import { getTournament } from "./firebase-utils.js";
import { loadCreator } from "./tournament-creator.js";

/**
 * Functions that use regex to test for a valid url path.
 * @param {string} url (this applies to all functions)
 */
const url_routes = {
    tournaments: (url) => /^\/tournaments\/[\w-]{10}$/.test(url),
    create_tournament: (url) => /^\/tournaments\/create$/.test(url)
}

/**
 * Loads the given tournament to the DOM.
 * @param {Tournament} tournament
 */
function loadTournament (tournament) {
    const new_path = `/tournaments/${tournament.id}`;
    history.pushState(tournament, "unused", path);
}

/**
 * Handles routing by checking the current URL path and loading the proper elements.
 */
async function routeUrl () {

    const path = document.location.pathname;

    if (url_routes.tournaments(path)) {

        const tournament_id = path.split("/")[2];

        const new_div_element = document.createElement("div");
        const div_text = document.createTextNode(JSON.stringify((await getTournament(tournament_id)).val()));
        new_div_element.appendChild(div_text);

        const body = document.body
        body.appendChild(new_div_element);

    } else if (url_routes.create_tournament(path)) {

        loadCreator();

    } else {

        history.pushState(null, "", "/home");

    }
}

addEventListener("DOMContentLoaded", routeUrl);
