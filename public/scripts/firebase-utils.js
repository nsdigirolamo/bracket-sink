import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";
import { routeUrl, replaceUrl } from "./routing-utils.js";

const firebaseConfig = {
    apiKey: "AIzaSyDFK2v1m8prU3lD80WGvGlRvEyErXp-HVc",
    authDomain: "bracket-sink.firebaseapp.com",
    databaseURL: "https://bracket-sink-default-rtdb.firebaseio.com",
    projectId: "bracket-sink",
    storageBucket: "bracket-sink.appspot.com",
    messagingSenderId: "439045307982",
    appId: "1:439045307982:web:a29b6d98e8364d75954d1f",
    measurementId: "G-4DZYNB3GBF"
};

firebase.initializeApp(firebaseConfig);

export let initial_login_attempted = false;

/**
 * Creates a new Tournament.
 * @param {string} name The name of the Tournament.
 * @param {Date} start_date The tournament's start date if not in manual mode.
 * @param {BracketInitData<TTeam, TScore, TMData>} bracket_data Data containing information regarding the tournmanent's brackets.
 * @return {Tournament}
 */
export class Tournament {
    constructor(name, start_date, bracket_data) {
        this.id = nanoid(10);
        this.creator_uid = firebase.auth().currentUser.uid;
        this.creator_display_name = firebase.auth().currentUser.displayName;
        this.date_created = new Date().toJSON();
        this.date_updated = new Date().toJSON();
        this.name = name;
        this.start_date = start_date.toJSON();
        this.bracket_data = bracket_data;
    }
}

/**
 * Saves the given Tournament to the database.
 * @param {Tournament} tournament 
 */
export function postTournament (tournament) {
    tournament.date_updated = new Date().toJSON();
    if (tournament.bracket_data == null) {
        tournament.bracket_data = {
            teams: [[null, null]],
            results: [[[[null, null]]]]
        }
    }
    tournament.bracket_data.teams = encodeTeamData(tournament.bracket_data.teams);
    tournament.bracket_data.results = encodeResultsData(tournament.bracket_data.results);
    firebase.database().ref(`/participant-lists/${tournament.id}/creator_uid`).set(tournament.creator_uid);
    firebase.database().ref(`/participant-lists/${tournament.id}/start_date`).set(Date.parse(new Date(tournament.start_date)));
    firebase.database().ref(`/tournaments/${tournament.id}`).set(tournament);
}

/**
 * Attempts to retrieve a Tournament from the database with the given ID.
 * @param {string} id
 * @returns {Promise<DataSnapshot>}
 */
export function getTournament (id) {
    return firebase.database().ref(`/tournaments/${id}`).get();
}

/**
 * Attempts to retrieve a list of all Tournaments from the database.
 * @returns {Promise<DataSnapshot>}
 */
export function getTournamentList () {
    return firebase.database().ref("/tournaments").get();
}

/**
 * Attempts to remove a Tournament from the database with the given ID.
 * @param {string} id 
 */
export function deleteTournament (id) {
    firebase.database().ref(`/tournaments/${id}`).remove();
}

/**
 * Appends the given user to the list of participants for the Tournament with the given ID.
 * @param {string} id
 * @param {firebase.User} user 
 */
export function postParticipant (id, user) {
    firebase.database().ref(`/participant-lists/${id}/participants/${user.uid}`).set(user.displayName);
}

/**
 * Attempts to retrieve the participant list for the Tournament with the given ID.
 * @param {string} id 
 * @returns {Promise<DataSnapshot}
 */
export function getParticipants (id) {
    return firebase.database().ref(`/participant-lists/${id}/participants`).get();
}

/**
 * Firebase can't store the null values that the bracket plugin needs. This function
 * converts the null values to empty strings to be stored in firebase.
 * @param {string[][]} teams 
 * @returns {string[][]} The team data with null values replaced with empty strings.
 */
function encodeTeamData (teams) {
    for (let i = 0; i < teams.length; i++) {
        teams[i][0] = teams[i][0] == null ? "" : teams[i][0];
        teams[i][1] = teams[i][1] == null ? "" : teams[i][1];
    }
    return teams;
}

/**
 * Firebase can't store the null values that the bracket plugin needs. This function
 * converts the empty strings in firebase back to null values.
 * @param {string[][]} teams 
 * @returns {string[][]} The team data with emptry strings replaced with null values.
 */
export function decodeTeamData (teams) {
    for (let i = 0; i < teams.length; i++) {
        teams[i][0] = teams[i][0] == "" ? null : teams[i][0];
        teams[i][1] = teams[i][1] == "" ? null : teams[i][1];
    }
    return teams;
}

/**
 * Firebase can't store the null values that the bracket plugin needs. This function
 * converts the null values to -1 values.
 * @param {*} results
 * @returns {*} The results data with empty strings replaced with -1 values.
 */
function encodeResultsData (results) {
    for (let i = 0; i < results.length; i++) {
        for (let j = 0; j < results[i].length; j++) {
            for (let k = 0; k < results[i][j].length; k++) {
                results[i][j][k][0] = results[i][j][k][0] == null ? "" : results[i][j][k][0];
                results[i][j][k][1] = results[i][j][k][1] == null ? "" : results[i][j][k][1];
            }
        }
    }
    return results;
}

/**
 * Firebase can't store the null values that the bracket plugin needs. This function
 * converts the -1 values in firebase back to null values.
 * @param {*} results
 * @returns {*} The results data with empty strings replaced with -1 values.
 */
export function decodeResultsData (results) {
    for (let i = 0; i < results.length; i++) {
        for (let j = 0; j < results[i].length; j++) {
            for (let k = 0; k < results[i][j].length; k++) {
                results[i][j][k][0] = results[i][j][k][0] == "" ? null : results[i][j][k][0];
                results[i][j][k][1] = results[i][j][k][1] == "" ? null : results[i][j][k][1];
            }
        }
    }
    return results;
}

/**
 * Prompts the user for their login information and attempts to log them in.
 * @returns {Promise<UserCredential>}
 */
export function getLogin () {
    let provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.querySelector("#display-user").textContent = user.displayName;
        document.querySelector("#sign-out-button").style.visibility = "visible";
    } else {
        document.querySelector("#display-user").textContent = "Not Signed In.";
        document.querySelector("#sign-out-button").style.visibility = "hidden";
        replaceUrl("/login");
        routeUrl();
    }
});

document.querySelector("#sign-out-button").addEventListener("click", () => { firebase.auth().signOut() });