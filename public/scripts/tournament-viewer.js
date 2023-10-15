import { Tournament, getTournament, postTournament, deleteTournament, decodeTeamData, decodeResultsData, postParticipantRequest, getParticipantRequests, denyParticipantRequest, acceptParticipantRequest, getParticipantAccepts, getParticipantDenies } from "./firebase-utils.js";
import { clearPageView, routeUrl } from "./routing-utils.js";

/**
 * Creates the div that informs users when the Tournament starts.
 * @param {Date} start_date The Tournament's start date.
 * @returns {HTMLElement}
 */
function createTimeDiv (start_date) {
    const time_div = document.createElement("div");
    time_div.id = "time-info";
    time_div.textContent = `This tournament starts on ${start_date.toDateString()}. You can request to join this tournament at any time before that date.`;
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
 * @param {Tournament} tournament The tournament to be deleted
 * @return {HTMLElement}
 */
function createRemoveButton (tournament) {
    const button = document.createElement("button");
    button.id = "remove-button";
    button.textContent = "Delete Tournament";
    button.addEventListener("click", () => { 
        deleteTournament(tournament.id);
    });
    return button;
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
            postParticipantRequest(tournament.id, firebase.auth().currentUser);
        });

    } else {
        div.textContent = "This tournament is closed to new members.";
    }

    return div;
}

/**
 * Creates a button for accepting a participant to the bracket.
 * @param {Tournament} tournament The tournament the participant is being accepted to.
 * @param {string} id The user's unqiue ID.
 * @param {string | null} name The user's display name.
 */
function createParticipantAcceptButton (tournament, id, name) {
    const button = document.createElement("button");
    button.id = `accept-button-${id}`;
    button.textContent = "Accept";

    button.addEventListener("click", () => {

        let teams = tournament.bracket_data.teams;
        let results = tournament.bracket_data.results;
        let accepted_participant = false;

        for (let i = 0; i < teams.length; i++) {
            if (teams[i][0] == null) {
                teams[i][0] = name;
                accepted_participant = true;
                break;
            } else if (teams[i][1] == null) {
                teams[i][1] = name;
                accepted_participant = true;
                break;
            }
        }

        if (!accepted_participant) {
            teams.push([name, null]);
            results[0][0].push([null, null]);
            if (teams.length % 2 == 1) { 
                teams.push([null, null]);
                results[0][0].push([null, null]);
            }
        }

        postTournament(tournament);
        acceptParticipantRequest(tournament.id, id, name);
        clearPageView();
        routeUrl();
    });

    return button;
}

/**
 * Creates a button for denying a participant to the bracket.
 * @param {Tournament} tournament The tournament the participant is being denied from.
 * @param {string} id The user's unqiue ID.
 * @param {string | null} name The user's display name.
 */
function createParticipantDenyButton (tournament, id, name) {
    const button = document.createElement("button");
    button.id = `deny-button-${id}`;
    button.textContent = "Deny";

    button.addEventListener("click", () => {
        denyParticipantRequest(tournament.id, id, name);
        clearPageView();
        routeUrl();
    });

    return button;
}

/**
 * Creates an element for a participant list.
 * @param {Tournament} tournament The participant's potential tournament.
 * @param {string} id The user's unique ID.
 * @param {string} name The user's display name.
 * @return {HTMLElement}
 */
function createParticipant (tournament, id, name) {
    const participant = document.createElement("li");
    participant.id = `participant-${id}`;
    participant.textContent = name;

    const add_button = createParticipantAcceptButton(tournament, id, name);
    participant.appendChild(add_button);
    const remove_button = createParticipantDenyButton(tournament, id, name);
    participant.appendChild(remove_button);

    return participant;
}

/**
 * Creates a list of potential participants that the Tournament creator can add to their Tournament.
 * @param {Tournament} tournament The tournament the participants are trying to join.
 * @param {string[]} participants An array of participants to construct the list from.
 */
function createPotentialParticipantList (tournament, participants) {
    const participant_list = document.createElement("ul");
    participant_list.id = "participant-list";
    participant_list.textContent = "These participants have requested to join your bracket:";

    for (let i = 0; i < participants.length; i++) {
        const id = participants[i][0];
        const name = participants[i][1];
        const participant = createParticipant(tournament, id, name);
        participant_list.appendChild(participant);
    }

    return participant_list;
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
 * Loads a Tournament with the given ID to the page view.
 * @param {string} id
 */
export function loadViewer (id) {

    getTournament(id).then(result => {

        const tournament = result.val();
        tournament.bracket_data.teams = decodeTeamData(tournament.bracket_data.teams);
        tournament.bracket_data.results = decodeResultsData(tournament.bracket_data.results);

        const info_div = createInfoDiv(tournament);
        document.querySelector("#page-view").appendChild(info_div);

        // TODO: Break up this huge if statement. Has lots of embedded then statements that need work.

        if (firebase.auth().currentUser.uid == tournament.creator_uid) {

            const remove_button = createRemoveButton(tournament);
            info_div.appendChild(remove_button);

            const current_date = new Date();
            const start_date = tournament.start_date == null ? null : new Date(tournament.start_date);

            if (start_date && current_date < start_date) {

                getParticipantRequests(tournament.id).then((result) => {
                    const participants = result.val();
                    const participant_values = []
                    if (participants) {
                        for (const [key, value] of Object.entries(participants)) {
                            participant_values.push([key, value]);
                        }
                    }
                    const participant_list = createPotentialParticipantList(tournament, participant_values)
                    info_div.appendChild(participant_list);
                });
            } else {

                const bracket_div = createBracketDiv();
                document.querySelector("#page-view").appendChild(bracket_div);

                $(function() {
                    $('#tournament-bracket').bracket({
                        init: tournament.bracket_data,
                        save: (data) => {
                            tournament.bracket_data = data;
                            postTournament(tournament);
                        }
                    });
                });
            }

        } else {

            const participant_div = document.createElement("div");
            participant_div.id = "participant-info";

            if (tournament.start_date) {
                const join_info_elements = createJoinInfoElements(tournament);
                document.querySelector("#page-view").appendChild(join_info_elements);
                const bracket_div = createBracketDiv();
                document.querySelector("#page-view").appendChild(bracket_div);
            } else {
                const bracket_div = createBracketDiv();
                document.querySelector("#page-view").appendChild(bracket_div);
            }

            $(function() {
                $('#tournament-bracket').bracket({
                    init: tournament.bracket_data
                });
            });

        }
    });
}