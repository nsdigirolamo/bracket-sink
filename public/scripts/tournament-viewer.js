import { getTournament } from "./firebase-utils.js";

/**
 * Loads the given tournament to the DOM.
 * @param {Tournament} tournament
 */
export async function loadViewer (tournament_id) {

    const new_div_element = document.createElement("div");
    const div_text = document.createTextNode(JSON.stringify((await getTournament(tournament_id)).val()));
    new_div_element.appendChild(div_text);
    document.body.appendChild(new_div_element);

}