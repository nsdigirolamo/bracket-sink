import { getTournament } from "./firebase-utils.js";

/**
 * Loads the given tournament to the page view.
 * @param {Tournament} tournament
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