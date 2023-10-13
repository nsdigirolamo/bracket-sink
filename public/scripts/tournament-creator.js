import { Tournament, postTournament } from "./firebase-utils.js";
import { routeUrl, replaceUrl } from "./routing-utils.js";
import { loadBracketDiv } from "./tournament-viewer.js";

let bracket_data = null;

/**
 * Parses information from the creator form, constructs a Tournament from the information, and saves the Tournament to the database.
 * @param {SubmitEvent} submitEvent The called event from the creator form's submission.
 */
function submitTournament (submitEvent) {

    submitEvent.preventDefault();
    const elements = submitEvent.target.elements;

    let name = "";

    for (let i = 0; i < elements.length; i++) {
        if (elements[i].tagName == "INPUT") {
            if (elements[i].id == "tournament-name") {
                name = elements[i].value;
            }
        }
    }

    let tournament = new Tournament(name, bracket_data)
    postTournament(tournament);
    replaceUrl(`/tournaments/${tournament.id}`);
    routeUrl();
}

/**
 * Loads the creator form to the page view.
 */
export function loadCreator () {

    const form = document.createElement("form");
    form.id = "tournament-creator";
    form.innerHTML = `
        <label for="tournament-name">Tournament Name: </label>
        <input id="tournament-name" type="text">
        <input id="submit-tournament" type="submit" value="Create Tournament">
    `;

    document.querySelector("#page-view").appendChild(form);

    loadBracketDiv();

    $(function() {
        $('#tournament-bracket').bracket({
            init: { teams: [] },
            save: (data) => { bracket_data = data }
        });
    });

    document.querySelector("#tournament-creator").addEventListener("submit", submitTournament);
}