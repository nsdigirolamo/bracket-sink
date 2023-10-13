import { Tournament, getTournament, postTournament, deleteTournament, decodeTeamData, decodeResultsData } from "./firebase-utils.js";

/**
 * Loads a div containing information about the given tournament.
 * @param {Tournament} tournament 
 */
function loadInfoDiv (tournament) {

    const info_div = document.createElement("div");
    info_div.id = "tournament-info";

    info_div.innerHTML = `
        <h2>${tournament.name}</h2>
        <h3>Created by ${tournament.creator_display_name}</h3>
        <h4>Participants:</h4>
        <ul id="participants-list"></ul>
    `;

    document.querySelector("#page-view").appendChild(info_div);

    if (firebase.auth().currentUser.uid == tournament.creator_uid) {

        const remove_button = document.createElement("button");
        remove_button.id = "remove-button";
        remove_button.textContent = "Delete Me!";
        info_div.appendChild(remove_button);

        document.querySelector("#remove-button").addEventListener("click", () => {
            deleteTournament(tournament.id);
        });
    }
}

/**
 * Loads the bracket div.
 */
export function loadBracketDiv () {

    const bracket_div = document.createElement("div");
    bracket_div.id = "tournament-bracket";

    document.querySelector("#page-view").appendChild(bracket_div);
}

/**
 * Loads a Tournament to the page view.
 * @param {string} tournament_id The id of the Tournament to be loaded.
 */
export function loadViewer (tournament_id) {

    getTournament(tournament_id).then(result => {

        const tournament = result.val();
        tournament.bracket_data.teams = decodeTeamData(tournament.bracket_data.teams);
        tournament.bracket_data.results = decodeResultsData(tournament.bracket_data.results);

        loadInfoDiv(tournament);
        loadBracketDiv(tournament);

        $(function() {
            $('#tournament-bracket').bracket({
                init: tournament.bracket_data,
                save: (data) => {
                    tournament.bracket_data = data;
                    postTournament(tournament);
                }
            });
        });

    }).catch(error => {
        console.log(error);
    })

}