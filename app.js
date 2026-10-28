
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


/* FIREBASE CONFIG */

const firebaseConfig = {
    apiKey: "AIzaSyC0PcCPBvloqwc3hZOPYLiavpXQd9j_t94",
    authDomain: "safesensecom.firebaseapp.com",
    databaseURL: "https://safesensecom-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "safesensecom",
    storageBucket: "safesensecom.firebasestorage.app",
    messagingSenderId: "729003484731",
    appId: "1:729003484731:web:24e75a810033e058dc9e1e",
    measurementId: "G-01483Q4BSY"
};


/* INITIALIZE FIREBASE */

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);


/* EMPLOYEE DATABASE PATH */

const employeeId = "EMP001";
const helmetRef = ref(database, "helmets/" + employeeId);


/* SIGN IN */

document.getElementById("connectionStatus").textContent =
    "Connecting to Firebase...";

signInWithEmailAndPassword(
    auth,
    "25h51a66r9@cmrcet.ac.in",
    "9553557789"
)
.then(() => {

    console.log("Firebase login successful");

    /* READ LIVE SENSOR DATA */

    onValue(
        helmetRef,

        (snapshot) => {

            const data = snapshot.val();

            console.log("Firebase data:", data);

            if (!data) {
                document.getElementById("connectionStatus").textContent =
                    "Connected - No helmet data";
                return;
            }

            /* EMPLOYEE ID */

            document.getElementById("employeeId").textContent =
                data.employeeId || employeeId;


            /* STATUS */

            const statusElement = document.getElementById("status");

            statusElement.textContent = data.status || "UNKNOWN";

            statusElement.classList.toggle(
                "danger",
                String(data.status).toUpperCase() === "DANGER"
            );


            /* ACTIVITY STATUS */

            document.getElementById("activityStatus").textContent =
                data.activityStatus || "UNKNOWN";


            /* ALERT */

            const alertElement = document.getElementById("alert");

            alertElement.textContent = data.alert || "NONE";

            alertElement.classList.toggle(
                "danger",
                String(data.alert).toUpperCase() !== "NONE"
            );


            /* GAS LEVEL */

            document.getElementById("gas").textContent =
                data.gas ?? 0;


            /* ACCELERATION */

            document.getElementById("acceleration").textContent =
                data.acceleration !== undefined
                    ? Number(data.acceleration).toFixed(2) + " g"
                    : "0 g";


            /* LATITUDE */

            document.getElementById("latitude").textContent =
                data.latitude !== undefined
                    ? Number(data.latitude).toFixed(6)
                    : "0";


            /* LONGITUDE */

            document.getElementById("longitude").textContent =
                data.longitude !== undefined
                    ? Number(data.longitude).toFixed(6)
                    : "0";


            /* GOOGLE MAP */

            if (
                data.latitude !== undefined &&
                data.longitude !== undefined
            ) {
                document.getElementById("mapLink").href =
                    "https://www.google.com/maps/search/?api=1&query=" +
                    data.latitude + "," + data.longitude;
            }


            /* LAST UPDATE */

            document.getElementById("lastUpdate").textContent =
                new Date().toLocaleTimeString();


            /* CONNECTION STATUS */

            document.getElementById("connectionStatus").textContent =
                "✓ Connected to Firebase";
        },

        (error) => {

            console.error("Firebase read error:", error);

            document.getElementById("connectionStatus").textContent =
                "✗ Firebase read error: " + error.code;
        }
    );

})
.catch((error) => {

    console.error(
        "Firebase login failed:",
        error.code,
        error.message
    );

    document.getElementById("connectionStatus").textContent =
        "✗ Firebase login failed: " + error.code;
});
