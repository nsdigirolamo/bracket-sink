import { getTournament } from "./firebase-utils.js";

/**
 * Loads the given tournament to the page view.
 * @param {Tournament} tournament
 */
export async function loadViewer (tournament_id) {

    const new_div_element = document.createElement("div");
    new_div_element.textContent = JSON.stringify((await getTournament(tournament_id)).val());
    document.querySelector("#page-view").appendChild(new_div_element);

}