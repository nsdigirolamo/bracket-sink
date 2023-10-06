import { getTournament, postTournament, deleteTournament } from "./firebase-utils.js";

/**
 * Loads a Tournament to the page view.
 * @param {string} tournament_id The id of the Tournament to be loaded.
 */
export function loadViewer (tournament_id) {

    getTournament(tournament_id).then(result => {

        const tournament = result.val();

        const new_div = document.createElement("div");
        new_div.id = `tournament-view-${tournament.id}`;

        new_div.innerHTML = `
            <h2>${tournament.name}</h2>
            <h3>Created by ${tournament.creator_display_name}</h3>
        `;

        document.querySelector("#page-view").appendChild(new_div);

        if (firebase.auth().currentUser.uid == tournament.creator_uid) {

            const update_button = document.createElement("button");
            update_button.id = `update-${tournament.id}`;
            update_button.textContent = "Update Me!";
            new_div.appendChild(update_button);

            document.querySelector(`#update-${tournament.id}`).addEventListener("click", () => {
                postTournament(tournament);
            });

            const remove_button = document.createElement("button");
            remove_button.id = `remove-${tournament.id}`;
            remove_button.textContent = "Delete Me!";
            new_div.appendChild(remove_button);

            document.querySelector(`#remove-${tournament.id}`).addEventListener("click", () => {
                deleteTournament(tournament.id);
            });
        }

    }).catch(error => {
        console.log(error);
    })

}