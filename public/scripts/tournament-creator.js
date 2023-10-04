import { Tournament, postTournament, getTournament } from "./firebase-utils.js";

let participant_count = 0

/**
 * Adds a participant text input element to the creator form.
 */
function addParticipantTextInputElement () {
    participant_count++;
    const new_id = "participant-" + participant_count;

    const new_label_element = document.createElement("label");
    new_label_element.htmlFor = new_id;
    const new_label = document.createTextNode("Participant " + participant_count + ": ");
    new_label_element.appendChild(new_label);

    const new_input_element = document.createElement("input");
    new_input_element.type = "text";
    new_input_element.id = new_id;

    const tournament_participant_fieldset = document.querySelector("#tournament-participants")
    const add_participant_button = document.querySelector("#add-participant");
    tournament_participant_fieldset.insertBefore(new_label_element, add_participant_button);
    tournament_participant_fieldset.insertBefore(new_input_element, add_participant_button);
}

/**
 * Called by an event listener, parses information from the creator form and POSTs the constructed tournament to the database.
 * @param {SubmitEvent} event 
 */
function submitTournament (event) {
    event.preventDefault();

    const elements = event.target.elements;

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
 * Loads the creator form onto the DOM.
 */
export async function loadCreator () {

    const form = document.createElement("form");
    form.id = "tournament-creator"
    form.innerHTML = `
        <label for="tournament-name">Tournament Name: </label>
        <input id="tournament-name" type="text">
        <fieldset id="tournament-participants">
            <legend>Tournament Participants</legend>
            <button id="add-participant" type="button">Add Participants</button>
        </fieldset>
        <input id="submit-tournament" type="submit" value="Create Tournament">
    `;

    document.body.appendChild(form);

    document.querySelector("#tournament-creator").addEventListener("submit", submitTournament);
    document.querySelector("#add-participant").addEventListener("click", addParticipantTextInputElement);

    // Initialize the form with two pre-exisiting participant fields.
    addParticipantTextInputElement(participant_count);
    addParticipantTextInputElement(participant_count);
}