import { getTournament } from "./firebase-utils.js";

/**
 * Loads a Tournament to the page view.
 * @param {string} tournament_id The id of the Tournament to be loaded.
 */
export function loadViewer (tournament_id) {

    const new_div_element = document.createElement("div");

    getTournament(tournament_id).then(result => {
        new_div_element.textContent = JSON.stringify(result.val());
    }).catch(error => {
        new_div_element.textContent = "You don't have permission!";
    })

    document.querySelector("#page-view").appendChild(new_div_element);

}