import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";
import { routeUrl, loadLogin, clearPageView, replaceUrl } from "./routing-utils.js";

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
 * @param {string[]} participants The Tournament's participants.
 * @return {Tournament}
 */
export class Tournament {
    constructor(name, participants) {
        this.id = nanoid(10);
        this.creator_uid = auth.currentUser.uid;
        this.creator_display_name = auth.currentUser.displayName;
        this.date_created = new Date().toJSON();
        this.name = name;
        this.participants = participants;
    }
}

/**
 * Saves the given Tournament to the database.
 * @param {Tournament} tournament 
 */
export function postTournament (tournament) {
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

export function getTournamentList () {
    return firebase.database().ref("/tournaments").get();
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