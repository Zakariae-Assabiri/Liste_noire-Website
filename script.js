// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBmMi3UVqmqXg-xUQF4Gaq1SsBBzHzjDak",
    authDomain: "black-liste-c5643.firebaseapp.com",
    projectId: "black-liste-c5643",
    storageBucket: "black-liste-c5643.appspot.com",
    messagingSenderId: "755525338251",
    appId: "1:755525338251:ios:6c5e62b61c28e9fb6dc08e"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
document.addEventListener("DOMContentLoaded", function () {
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const database = firebase.database();
});
// Fonction de connexion
function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById("login-container").style.display = "none";
            document.getElementById("app-container").style.display = "block";
        })
        .catch(error => {
            document.getElementById("error-message").innerText = error.message;
        });
}

// Fonction de déconnexion
function logout() {
    auth.signOut().then(() => {
        document.getElementById("app-container").style.display = "none";
        document.getElementById("login-container").style.display = "block";
    });
}

// Fonction pour afficher les pages internes
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => page.style.display = "none");
    document.getElementById(pageId).style.display = "block";
}

// Fonction pour ajouter un client (simulation)
function ajouterClient() {
    let clientNom = document.getElementById("client-nom").value.trim();
    let clientPrenom = document.getElementById("client-prenom").value.trim();
    let clientMotif = document.getElementById("client-motif").value.trim();
    let resultMessage = document.getElementById("resultADD-message");

    if (!clientNom || !clientPrenom || !clientMotif) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    let newClientRef = database.ref("noms").push();
    newClientRef.set({
        nom: clientNom.toUpperCase(), // On met en majuscules pour uniformiser la base
        prenom: clientPrenom.toUpperCase(),
        motif: clientMotif
    }).then(() => {
        resultMessage.textContent = "Client ajouté avec succès !";
        resultMessage.className = "success"; // Message en vert
    }).catch((error) => {
        resultMessage.textContent = "Erreur lors de l'ajout : " + error.message;
        resultMessage.className = "error"; // Message en rouge
    });

    resultMessage.style.display = "block";
}


// Fonction pour rechercher un client (simulation)
function rechercherClient() {
    let searchName = document.getElementById("search-client").value.trim().toLowerCase();
    let resultMessage = document.getElementById("result-message");
    let searchButton = document.getElementById("search-button");

    if (!resultMessage || !searchButton) {
        console.error("Impossible de trouver les éléments HTML 'result-message' ou 'search-button'.");
        return;
    }

    database.ref("noms").once("value", (snapshot) => {
        let clients = snapshot.val();
        let found = false;
        let displayText = "";

        for (let key in clients) {
            let clientNom = (clients[key].nom || "").trim().toLowerCase();
            let clientPrenom = (clients[key].prenom || "").trim().toLowerCase();
            let fullName = clientNom + " " + clientPrenom;
            let motif = clients[key].motif || "Client valide";

            if (searchName === fullName) {
                // Recherche par nom complet (nom + prénom) → afficher tout
                found = true;
                displayText = `Mauvais client - Motif : ${motif}`;
                break;
            } else if (searchName === clientNom) {
                // Recherche uniquement par nom → afficher le PREnom et le motif
                found = true;
                displayText = `${clients[key].prenom} Mauvais client - Motif : ${motif}`;
                break;
            }
        }

        if (!found) {
            resultMessage.textContent = "Client non trouvé";
            resultMessage.className = "success"; // Affichage en vert
            searchButton.disabled = true;
        } else {
            resultMessage.textContent = displayText;
            resultMessage.className = "error"; // Affichage en rouge
            searchButton.disabled = false;
        }

        resultMessage.style.display = "block";
    });
}
