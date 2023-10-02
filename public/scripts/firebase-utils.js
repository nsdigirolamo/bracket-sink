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

export function Tournament (name, participants) {
    this.id = nanoid(10);
    this.name = name;
    this.participants = participants;
}

export function postTournament (tournament) {
    firebase.database().ref(`/tournaments/${tournament.id}`).set(tournament);
}

export async function getTournament (id) {
    return (await firebase.database().ref(`/tournaments/${id}`).get()).toJSON();
}

firebase.initializeApp(firebaseConfig);
