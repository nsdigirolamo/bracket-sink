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

const auth = firebase.auth();

/**
 * Creates a new Tournament.
 * @param {string} name
 * @param {string[]} participants
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
 * POSTs the given Tournament to the database.
 * @param {Tournament} tournament 
 */
export function postTournament (tournament) {
    firebase.database().ref(`/tournaments/${tournament.id}`).set(tournament);
}

/**
 * GETs the Tournament with the given id from the database and returns a Promise to corresponding DataSnapshot.
 * @param {string} id
 * @returns {Promise<DataSnapshot>}
 */
export function getTournament (id) {
    return firebase.database().ref(`/tournaments/${id}`).get();
}

/**
 * Prompts the user for login and logs them in using the given credentials.
 * @returns {Promise<UserCredential>}
 */
export function getLogin () {
    let provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
}

auth.onAuthStateChanged((user) => {
    if (user) {
        routeUrl();
        document.querySelector("#display-user").textContent = user.displayName;
        document.querySelector("#sign-out-button").style.visibility = "visible";
    } else {
        clearPageView();
        replaceUrl("/login");
        loadLogin();
        document.querySelector("#display-user").textContent = "Not Signed In.";
        document.querySelector("#sign-out-button").style.visibility = "hidden";
    }
});

document.querySelector("#sign-out-button").addEventListener("click", () => {
    auth.signOut();
});