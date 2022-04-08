import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDemA7mICzAwO7oPo2wGOavqaidtZQ2ClY",
  authDomain: "nplace-dc920.firebaseapp.com",
  databaseURL: "https://nplace-dc920-default-rtdb.firebaseio.com",
  projectId: "nplace-dc920",
  storageBucket: "nplace-dc920.appspot.com",
  messagingSenderId: "14714079764",
  appId: "1:14714079764:web:c75768a64d42faf5247501"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = {
  app, db
}