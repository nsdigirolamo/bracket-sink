import { Tournament, getTournament, postTournament, deleteTournament } from "./firebase-utils.js";

/**
 * Parses through a list of participants and properly divides them into pairs for a bracket.
 * @param {string[]} participants 
 * @returns An object containing initial bracket information.
 */
function initializeBrackets (participants) {

    let init_teams = [];
    let is_even = true;
    let has_spare = false;

    console.log(participants);

    for (let i = 0; i < participants.length; i += 2) {
        if (i + 1 < participants.length) {
            init_teams.push([participants[i], participants[i + 1]]);
            is_even = !is_even;
        } else {
            init_teams.push([participants[i], null]);
            has_spare = true;
        }
    }

    if (is_even && has_spare) {
        const to_be_divided = init_teams.splice(-2, 1)[0];
        init_teams.push([to_be_divided[0], null]);
        init_teams.push([to_be_divided[1], null]);
    } else if (!is_even && !has_spare) {
        const to_be_divided = init_teams.splice(-1, 1)[0];
        init_teams.push([to_be_divided[0], null]);
        init_teams.push([to_be_divided[1], null]);
    }

    return {
        teams: init_teams,
        results: []
    }

}

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

    for (let i = 0; i < tournament.participants.length; i++) {
        const participant_li = document.createElement("li");
        participant_li.textContent = tournament.participants[i];
        document.querySelector("#participants-list").appendChild(participant_li);
    }

    if (firebase.auth().currentUser.uid == tournament.creator_uid) {

        const update_button = document.createElement("button");
        update_button.id = "update-button";
        update_button.textContent = "Update Me!";
        info_div.appendChild(update_button);

        document.querySelector("#update-button").addEventListener("click", () => {
            postTournament(tournament);
        });

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
 * Loads a div containing the bracket for the given tournament.
 * @param {Tournament} tournament 
 */
function loadBracketDiv (tournament) {

    const bracket_div = document.createElement("div");
    bracket_div.id = "tournament-bracket";

    document.querySelector("#page-view").appendChild(bracket_div);
     
    $(function() {
        $('#tournament-bracket').bracket({
            init: initializeBrackets(tournament.participants)
        });
    });
}

/**
 * Loads a Tournament to the page view.
 * @param {string} tournament_id The id of the Tournament to be loaded.
 */
export function loadViewer (tournament_id) {

    getTournament(tournament_id).then(result => {

        const tournament = result.val();
        loadInfoDiv(tournament);
        loadBracketDiv(tournament);

    }).catch(error => {
        console.log(error);
    })

}