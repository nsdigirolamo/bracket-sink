import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";

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

/**
 * Returns a Tournament object with the given name and participants.
 * @param {string} name 
 * @param {string[]} participants
 * @return {Tournament}
 */
export function Tournament (name, participants) {
    this.id = nanoid(10);
    this.name = name;
    this.participants = participants;
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

firebase.initializeApp(firebaseConfig);
