import { Tournament, postTournament, deleteTournament } from "./firebase-utils.js";

let participant_count = 0;

/**
 * Adds a participant text input element to the creator form.
 */
function addParticipantTextInputElement () {

    participant_count++;
    const new_div = document.createElement("div");
    new_div.className = "participant-input";
    new_div.innerHTML = `
        <label for="participant-${participant_count}">Participant ${participant_count}:</label>
        <input id="participant-${participant_count}" type="text">
    `; 

    const tournament_participant_fieldset = document.querySelector("#tournament-participants");
    const add_participant_button = document.querySelector("#add-participant");
    tournament_participant_fieldset.insertBefore(new_div, add_participant_button);
}

/**
 * Parses information from the creator form, constructs a Tournament from the information, and saves the Tournament to the database.
 * @param {SubmitEvent} submitEvent The called event from the creator form's submission.
 */
function submitTournament (submitEvent) {

    submitEvent.preventDefault();
    const elements = submitEvent.target.elements;

    let name = "";
    let participants = [];

    for (let i = 0; i < elements.length; i++) {
        if (elements[i].tagName == "INPUT") {
            if (elements[i].id == "tournament-name") {
                name = elements[i].value;
            } else if (/participant-\d/.test(elements[i].id)) {
                participants.push(elements[i].value);
            }
        }
    }

    postTournament(new Tournament(name, participants));
}

/**
 * Loads the creator form to the page view.
 */
export function loadCreator () {

    participant_count = 0;

    const form = document.createElement("form");
    form.id = "tournament-creator";
    form.innerHTML = `
        <label for="tournament-name">Tournament Name: </label>
        <input id="tournament-name" type="text">
        <fieldset id="tournament-participants">
            <legend>Tournament Participants</legend>
            <button id="add-participant" type="button">Add Participants</button>
        </fieldset>
        <input id="submit-tournament" type="submit" value="Create Tournament">
    `;

    document.querySelector("#page-view").appendChild(form);

    document.querySelector("#tournament-creator").addEventListener("submit", submitTournament);
    document.querySelector("#add-participant").addEventListener("click", addParticipantTextInputElement);

    // Initialize the form with two pre-exisiting participant fields.
    addParticipantTextInputElement(participant_count);
    addParticipantTextInputElement(participant_count);
}