import { Tournament, getTournament, postTournament, deleteTournament, decodeTeamData, decodeResultsData, postParticipant } from "./firebase-utils.js";

/**
 * Creates the div that informs users when the Tournament starts.
 * @param {Date} start_date
 * @returns {HTMLElement}
 */
function createTimeDiv (start_date) {
    const time_div = document.createElement("div");
    time_div.id = "time-info";
    time_div.textContent = `This tournament starts on ${start_date.toDateString()}. You can join this tournament at any time before that date.`;
    return time_div;
}

/**
 * Creates the button that allows users to join a Tournament.
 * @return {HTMLElement}
 */
function createJoinButton () {
    const join_button = document.createElement("button");
    join_button.id = "join-button";
    join_button.textContent = "Join Tournament";
    return join_button;
}

/**
 * Creates the button that allows a creator to delete their Tournament.
 * @return {HTMLElement}
 */
function createRemoveButton () {
    const remove_button = document.createElement("button");
    remove_button.id = "remove-button";
    remove_button.textContent = "Delete Tournament";
    return remove_button;
}

/**
 * Creates various elements depending on the state of the given Tournament. These elements will allow
 * a user to join the tournament if it's start date is some time in the future.
 * @param {Tournament}
 * @return {HTMLElement}
 */
function createJoinInfoElements (tournament) {

    const current_date = new Date();
    const start_date = tournament.start_date == null ? null : new Date(tournament.start_date);

    const div = document.createElement("div");
    div.id = "join-info";

    if (tournament.start_date && current_date < start_date) {
    
        const time_div = createTimeDiv(start_date)
        div.appendChild(time_div);

        const join_button = createJoinButton();
        div.appendChild(join_button);

        join_button.addEventListener("click", () => {
            postParticipant(tournament.id, firebase.auth().currentUser);
        });

    } else {
        div.textContent = "This tournament is closed to new members.";
    }

    return div;
}

/**
 * Loads a div containing information about the given tournament.
 * @param {Tournament} tournament
 * @return {HTMLElement} 
 */
function createInfoDiv (tournament) {

    const info_div = document.createElement("div");
    info_div.id = "tournament-info";

    info_div.innerHTML = `
        <h2>${tournament.name}</h2>
        <h5>${tournament.id}</h5>
        <h3>Created by ${tournament.creator_display_name}</h3>
    `;

    return info_div;
}

/**
 * Loads the bracket div.
 * @return {HTMLElement}
 */
export function createBracketDiv () {
    const bracket_div = document.createElement("div");
    bracket_div.id = "tournament-bracket";
    return bracket_div;
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

        const info_div = createInfoDiv(tournament);
        document.querySelector("#page-view").appendChild(info_div);

        if (firebase.auth().currentUser.uid == tournament.creator_uid) {

            const remove_button = createRemoveButton();
            info_div.appendChild(remove_button);

            remove_button.addEventListener("click", () => { 
                deleteTournament(tournament.id);
            });

            $(function() {
                $('#tournament-bracket').bracket({
                    init: tournament.bracket_data,
                    save: (data) => {
                        tournament.bracket_data = data;
                        postTournament(tournament);
                    }
                });
            });

        } else {

            const join_info_elements = createJoinInfoElements(tournament);
            document.querySelector("#page-view").appendChild(join_info_elements);

            /**
             * The save callback is absent if the current user is not the tournament's creator.
             * This makes it so non-creator users can't edit the tournaments.
             */

            $(function() {
                $('#tournament-bracket').bracket({
                    init: tournament.bracket_data
                });
            });

        }

        const bracket_div = createBracketDiv();
        document.querySelector("#page-view").appendChild(bracket_div);

    }).catch(error => {
        console.log(error);
    })

}