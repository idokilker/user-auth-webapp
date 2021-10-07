// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBxRABlEa0XWLHbk59x9L3Hd9zOx81U7a8",
    authDomain: "user-auth-webapp-789a5.firebaseapp.com",
    databaseURL: "https://user-auth-webapp-789a5-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "user-auth-webapp-789a5",
    storageBucket: "user-auth-webapp-789a5.appspot.com",
    messagingSenderId: "524748292557",
    appId: "1:524748292557:web:3a0303e5c1f08dd7bec484"
};
const app = firebase.initializeApp(firebaseConfig);

//make auth reference
const auth = app.auth();

//make database reference
const db = app.database().ref();

var login_state = false;

//Submit login form
el = document.getElementById("loginForm")
if (el) {
    el.addEventListener('submit', login);
}

function login(e) {
    e.preventDefault();
    // console.log("sumbit clicked");

    //get user inputs
    var userEmail = document.getElementById("email").value;
    var userPassword = document.getElementById("password").value;

    sessionStorage.setItem('stored_email', userEmail);
    sessionStorage.setItem('stored_password', userPassword);

    var email_stored = sessionStorage.getItem('stored_email');
    // console.log(email_stored);
    var pass_stored = sessionStorage.getItem('stored_password');
    // console.log(pass_stored);

    // window.alert("Welcome! " + userEmail + " " + userPassword);

    //authenticate user inputs with data stored in the realtime db
    auth.signInWithEmailAndPassword(userEmail, userPassword).then((userCredential) => {
        // console.log(userCredential.user)
        // window.alert("logged-in successfully!");

        //redirect to profile page and load data from db
        loadDataFromDB(userEmail, userPassword);
    })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert(errorMessage);
            // console.log("not logged in");

            //clear form
            document.getElementById("loginForm").reset()
        });
}

//load data of specific user from DB and display it
function loadDataFromDB(email, password) {
    //get data of specific user and display it
    db.child("users").orderByChild("email").equalTo(email).once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            // console.log("loadFromDB")
            var data_arr = [];
            data_arr.push(childSnapshot.val().name);
            data_arr.push(childSnapshot.val().address);
            data_arr.push(childSnapshot.val().email);
            data_arr.push(childSnapshot.val().birth_date);
            data_arr.push(childSnapshot.val().password);

            // console.log(data_arr);

            //display Data on screen
            displayData(data_arr);
        });
    });
}

function displayData(data_arr) {
    //display by TABLE
    var title = document.createElement("h1");
    title.classList.add("form__title");
    var columns_arr = ["Name:", "Address:", "Email:", "Birth Date:", "Password:"];
    var table = document.createElement("TABLE");
    for (i = 0; i < data_arr.length; i++) {
        var tr = document.createElement("TR");
        var txt = document.createTextNode(columns_arr[i]); // Create a text node
        var node2 = document.createElement("TD");
        node2.classList.add("prop");
        node2.appendChild(txt);
        tr.appendChild(node2);

        //create propery value node
        var node = document.createElement("TD");  // Create a <th> node
        var textnode = document.createTextNode(data_arr[i]); // Create a text node
        node2.classList.add("val");
        node.appendChild(textnode);
        tr.appendChild(node);

        //create welcome by user
        if (columns_arr[i] == "Name:") {
            title.innerHTML = "Welcome " + data_arr[i] + "!";
            document.getElementById("data").prepend(title);
        }
        table.appendChild(tr);
    }
    document.getElementById("data").appendChild(table);
    console.log("here");
}


//make sure user is logged in on every page change. if not - redirect to index.html
window.onload = function () { chekcLogin() }

function chekcLogin() {

    var email_stored = sessionStorage.getItem('stored_email');
    // console.log(email_stored);
    var pass_stored = sessionStorage.getItem('stored_password');
    // console.log(pass_stored);

    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            login_state = true;
            // uid = user.uid;
            // console.log("login");
            if (document.URL.includes("index.html")) {
                window.location.replace("../profile.html");
            }
        } else {
            // User is not signed in
            login_state = false;
            uid = null;
            if (!document.URL.includes("index.html")) {
                sessionStorage.clear();
                window.location.replace("../index.html");
            }
            // console.log("you are not logged in");
        }
    });

    if (document.URL.includes("profile.html")) {
        //redirect to profile page and load data from db
        var userEmail = sessionStorage.getItem('stored_email');
        // console.log(userEmail);
        var userPassword = sessionStorage.getItem('stored_password');
        // console.log(userPassword);
        loadDataFromDB(userEmail, userPassword);
    }

}


//logout
elm = document.getElementById("loginForm")
if (elm) {
    elm.addEventListener('logout', logout);
}

function logout(e) {
    auth.signOut();
    // console.log("Signed out");
}