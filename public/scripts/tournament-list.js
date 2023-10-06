import { getTournamentList } from "./firebase-utils.js";
import { Tournament } from "./firebase-utils.js";

/**
 * Creates a new div to display the given Tournament.
 * @param {Tournament} tournament 
 * @returns A div displaying Tournament information.
 */
function createTournamentDiv (tournament) {
    const new_div = document.createElement("div");
    new_div.id = `tournament-${tournament.id}`;
    new_div.innerHTML = JSON.stringify(tournament);
    return new_div;
}

/**
 * Generates divs to display all Tournaments in the database.
 */
export function loadList () {
    getTournamentList().then(result => {
        const tournament_list = Object.values(result.val());
        for (let i = 0; i < tournament_list.length; i++) {
            const tournamentDiv = createTournamentDiv(tournament_list[i]);
            document.querySelector("#page-view").appendChild(tournamentDiv);
        }
    }).catch(error => {
        console.log(error);
    });
}