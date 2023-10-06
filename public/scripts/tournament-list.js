import { getTournamentList } from "./firebase-utils.js";
import { Tournament } from "./firebase-utils.js";
import { pushUrl, clearPageView } from "./routing-utils.js";
import { loadViewer } from "./tournament-viewer.js";

/**
 * Creates a new div to display the given Tournament.
 * @param {Tournament} tournament 
 * @returns A div displaying Tournament information.
 */
function createTournamentDiv (tournament) {
    const new_div = document.createElement("div");
    new_div.id = `tournament-${tournament.id}`;
    new_div.innerHTML = JSON.stringify(tournament);

    document.querySelector("#page-view").appendChild(new_div);
    document.querySelector(`#${new_div.id}`).addEventListener("click", () => {
        pushUrl(`/tournaments/${tournament.id}`);
        clearPageView();
        loadViewer(tournament.id);
    });

    return new_div;
}

/**
 * Generates divs to display all Tournaments in the database.
 */
export function loadList () {
    getTournamentList().then(result => {

        let tournament_list = [];
        if (result.val()) tournament_list = Object.values(result.val());

        for (let i = 0; i < tournament_list.length; i++) {
            createTournamentDiv(tournament_list[i]);
        }

    }).catch(error => {
        console.log(error);
    });
}