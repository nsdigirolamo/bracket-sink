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
    let start_date = "";

    for (let i = 0; i < elements.length; i++) {
        if (elements[i].tagName == "INPUT") {
            if (elements[i].id == "tournament-name") {
                name = elements[i].value;
            } else if (elements[i].id == "tournament-start-date") {
                start_date = new Date(elements[i].value);
            }
        }
    }

    let tournament = new Tournament(name, start_date, bracket_data);
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
        <label id="manual-mode=label" for="manual-mode">Manual Mode:</label>
        <input id="manual-mode" type="checkbox"/>
        <label id="tournament-name-label" for="tournament-name">Tournament Name:</label>
        <input id="tournament-name" type="text"/>
        <label id="tournament-start-date-label" for="tournament-start-date">Tournament Start Date: </label>
        <input id="tournament-start-date" type="datetime-local"/>
        <input id="submit-tournament" type="submit" value="Create Tournament">
    `;

    document.querySelector("#page-view").appendChild(form);

    loadBracketDiv();
    document.querySelector("#tournament-bracket").style.display = "none";

    document.querySelector("#manual-mode").addEventListener("change", () => {
        let display = document.querySelector("#tournament-bracket").style.display;
        document.querySelector("#tournament-start-date-label").style.display = display;
        document.querySelector("#tournament-start-date").style.display = display;
        display = display == "inline" ? "none" : "inline";
        document.querySelector("#tournament-bracket").style.display = display;
    });

    $(function() {
        $('#tournament-bracket').bracket({
            init: { teams: [] },
            save: (data) => { bracket_data = data }
        });
    });

    document.querySelector("#tournament-creator").addEventListener("submit", submitTournament);
}