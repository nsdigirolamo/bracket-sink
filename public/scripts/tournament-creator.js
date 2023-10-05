import { Tournament, postTournament } from "./firebase-utils.js";

let participant_count = 0;

/**
 * Adds a participant text input element to the creator form.
 */
function addParticipantTextInputElement () {

    participant_count++;
    const new_id = "participant-" + participant_count;

    const new_label_element = document.createElement("label");
    new_label_element.htmlFor = new_id;
    new_label_element.textContent = `Participant ${participant_count}:`

    const new_input_element = document.createElement("input");
    new_input_element.type = "text";
    new_input_element.id = new_id;

    const tournament_participant_fieldset = document.querySelector("#tournament-participants");
    const add_participant_button = document.querySelector("#add-participant");
    tournament_participant_fieldset.insertBefore(new_label_element, add_participant_button);
    tournament_participant_fieldset.insertBefore(new_input_element, add_participant_button);
}

/**
 * Parses information from the creator form, constructs a Tournament from this information, and saves the Tournament to the database.
 * @param {SubmitEvent} submitEvent The called event from the creator form's submission.
 */
function submitTournament (submitEvent) {

    event.preventDefault();
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