import { Tournament, postTournament, getTournament } from "./firebase-utils.js";

let participant_count = 0

function addParticipantTextInputElement () {
    participant_count++;
    const new_id = "participant-" + participant_count;

    let new_label_element = document.createElement("label");
    new_label_element.htmlFor = new_id;
    let new_label = document.createTextNode("Participant " + participant_count + ": ");
    new_label_element.appendChild(new_label);

    let new_input_element = document.createElement("input");
    new_input_element.type = "text";
    new_input_element.id = new_id;

    const tournament_participant_fieldset = document.querySelector("#tournament-participants")
    const add_participant_button = document.querySelector("#add-participant");
    tournament_participant_fieldset.insertBefore(new_label_element, add_participant_button);
    tournament_participant_fieldset.insertBefore(new_input_element, add_participant_button);
}

function submitBracket (event) {
    event.preventDefault();

    let elements = event.target.elements;

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

document.querySelector("#tournament-creator").addEventListener("submit", submitBracket);
document.querySelector("#add-participant").addEventListener("click", addParticipantTextInputElement);

// Initialize the form with two pre-exisiting participant fields.
addParticipantTextInputElement(participant_count);
addParticipantTextInputElement(participant_count);