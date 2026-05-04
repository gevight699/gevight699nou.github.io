/*
    PROGRAMME : Génie en Guerre
    DESCRIPTION : Jeu de bataille navale avec questions de trivia.
    COURS : ICS3U
    AUTEURS : Amazir, Paul, Gevorg

    Concepts utilisés :
    - variables
    - tableaux
    - chaînes de caractères
    - structures conditionnelles if / else et switch
    - boucles for et while
    - fonctions
    - formulaire HTML + JavaScript
*/

// CONSTANTES GLOBALES
const TAILLE = 6;
const NB_NAVIRES = 5;

// VARIABLES GLOBALES
let grilleEnnemi = [];
let grilleJoueur = [];
let tirsEnnemi = [];
let tirsJoueur = [];
let score = 0;
let resteEnnemi = NB_NAVIRES;
let resteJoueur = NB_NAVIRES;
let chargeNuke = 0;
let partieActive = false;
let questionActive = null;
let derniereCaseTouchee = null;
let categorieChoisie = "general";
let difficulte = "normal";

// Tableau de questions
let questions = [
    {
        categorie: "ics",
        question: "Quelle balise permet de connecter un fichier JavaScript externe à une page HTML?",
        choix: ["<css>", "<script>", "<javascript>", "<link-js>"],
        reponse: 1
    },
    {
        categorie: "ics",
        question: "Dans un tableau JavaScript, quel est l'indice du premier élément?",
        choix: ["0", "1", "-1", "10"],
        reponse: 0
    },
    {
        categorie: "ics",
        question: "Quelle méthode peut générer un nombre aléatoire entre 0 et moins de 1?",
        choix: ["Math.number()", "Math.random()", "Number.random()", "random.Math()"],
        reponse: 1
    },
    {
        categorie: "ics",
        question: "Quelle structure répète du code tant qu'une condition demeure vraie?",
        choix: ["if", "while", "switch", "alert"],
        reponse: 1
    },
    {
        categorie: "general",
        question: "Quel océan est le plus grand sur Terre?",
        choix: ["Atlantique", "Arctique", "Pacifique", "Indien"],
        reponse: 2
    },
    {
        categorie: "general",
        question: "Combien de continents y a-t-il généralement sur Terre?",
        choix: ["5", "6", "7", "8"],
        reponse: 2
    },
    {
        categorie: "general",
        question: "Quelle planète est surnommée la planète rouge?",
        choix: ["Mars", "Vénus", "Jupiter", "Mercure"],
        reponse: 0
    },
    {
        categorie: "mixte",
        question: "Quel symbole est utilisé pour écrire un commentaire sur une seule ligne en JavaScript?",
        choix: ["//", "<!-- -->", "##", "**"],
        reponse: 0
    },
    {
        categorie: "mixte",
        question: "Dans une bataille navale, que signifie toucher une case avec un navire?",
        choix: ["Un raté", "Un point gagné", "Une partie terminée", "Une erreur"],
        reponse: 1
    }
];

// Cette fonction démarre complètement une nouvelle partie.
function nouvellePartie() {
    grilleEnnemi = creerGrilleVide();
    grilleJoueur = creerGrilleVide();
    tirsEnnemi = creerGrilleVide();
    tirsJoueur = creerGrilleVide();

    placerNavires(grilleEnnemi);
    placerNavires(grilleJoueur);

    score = 0;
    resteEnnemi = NB_NAVIRES;
    resteJoueur = NB_NAVIRES;
    chargeNuke = 0;
    questionActive = null;
    derniereCaseTouchee = null;
    partieActive = false;

    document.getElementById("listeJournal").innerHTML = "";
    document.getElementById("zoneQuestion").classList.add("cache");
    afficherMessage("Nouvelle mission préparée. Entre ton nom et clique sur Démarrer la mission.");
    mettreAJourAffichage();
    dessinerGrilles();
}

// Crée une grille 6x6 remplie de zéros.
function creerGrilleVide() {
    let grille = [];

    for (let ligne = 0; ligne < TAILLE; ligne++) {
        let rangee = [];

        for (let colonne = 0; colonne < TAILLE; colonne++) {
            rangee.push(0);
        }

        grille.push(rangee);
    }

    return grille;
}

// Place 5 navires à des positions aléatoires.
function placerNavires(grille) {
    let naviresPlaces = 0;

    while (naviresPlaces < NB_NAVIRES) {
        let ligne = Math.floor(Math.random() * TAILLE);
        let colonne = Math.floor(Math.random() * TAILLE);

        if (grille[ligne][colonne] == 0) {
            grille[ligne][colonne] = 1;
            naviresPlaces++;
        }
    }
}

// Démarre le jeu après validation du formulaire.
function demarrerJeu() {
    let nom = document.getElementById("nomJoueur").value.trim();
    difficulte = document.getElementById("niveau").value;
    let radios = document.getElementsByName("categorie");

    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked == true) {
            categorieChoisie = radios[i].value;
        }
    }

    // Validation de la chaîne de caractères du nom.
    if (nom.length < 2) {
        afficherMessage("Erreur : le nom du commandant doit contenir au moins 2 caractères.");
        return;
    }

    document.getElementById("afficheNom").innerHTML = nom;
    partieActive = true;

    let message = "Mission lancée pour le commandant " + nom + ". ";
    message += "Difficulté : " + difficulte + ". Catégorie : " + categorieChoisie + ".";
    afficherMessage(message);
    ajouterJournal("La mission commence.");
}

// Dessine les deux grilles dans la page.
function dessinerGrilles() {
    let divEnnemi = document.getElementById("grilleEnnemi");
    let divJoueur = document.getElementById("grilleJoueur");

    divEnnemi.innerHTML = "";
    divJoueur.innerHTML = "";

    for (let ligne = 0; ligne < TAILLE; ligne++) {
        for (let colonne = 0; colonne < TAILLE; colonne++) {
            let boutonEnnemi = document.createElement("button");
            boutonEnnemi.className = "case";
            boutonEnnemi.innerHTML = coordonneeTexte(ligne, colonne);
            boutonEnnemi.onclick = function() {
                attaquer(ligne, colonne);
            };

            if (tirsJoueur[ligne][colonne] == 1) {
                boutonEnnemi.disabled = true;

                if (grilleEnnemi[ligne][colonne] == 1) {
                    boutonEnnemi.classList.add("touche");
                    boutonEnnemi.innerHTML = "✹";
                } else {
                    boutonEnnemi.classList.add("rate");
                    boutonEnnemi.innerHTML = "•";
                }
            }

            divEnnemi.appendChild(boutonEnnemi);

            let caseJoueur = document.createElement("button");
            caseJoueur.className = "case";
            caseJoueur.disabled = true;

            if (grilleJoueur[ligne][colonne] == 1) {
                caseJoueur.classList.add("navire");
                caseJoueur.innerHTML = "▣";
            } else {
                caseJoueur.innerHTML = coordonneeTexte(ligne, colonne);
            }

            if (tirsEnnemi[ligne][colonne] == 1) {
                if (grilleJoueur[ligne][colonne] == 1) {
                    caseJoueur.classList.remove("navire");
                    caseJoueur.classList.add("detruit");
                    caseJoueur.innerHTML = "X";
                } else {
                    caseJoueur.classList.add("rate");
                    caseJoueur.innerHTML = "•";
                }
            }

            divJoueur.appendChild(caseJoueur);
        }
    }
}

// Transforme les coordonnées en texte comme A1, B2...
function coordonneeTexte(ligne, colonne) {
    let lettres = "ABCDEF";
    return lettres.charAt(ligne) + (colonne + 1);
}

// Attaque une case ennemie.
function attaquer(ligne, colonne) {
    if (partieActive == false) {
        afficherMessage("Tu dois d'abord démarrer la mission.");
        return;
    }

    if (questionActive != null) {
        afficherMessage("Réponds d'abord à la question de trivia avant de continuer.");
        return;
    }

    if (tirsJoueur[ligne][colonne] == 1) {
        afficherMessage("Cette case a déjà été attaquée.");
        return;
    }

    tirsJoueur[ligne][colonne] = 1;

    if (grilleEnnemi[ligne][colonne] == 1) {
        resteEnnemi--;
        score += 100;
        derniereCaseTouchee = coordonneeTexte(ligne, colonne);

        afficherMessage("Touché! Tu as trouvé un navire ennemi en " + derniereCaseTouchee + ". Réponds à la question pour charger la frappe nucléaire.");
        ajouterJournal("Touché en " + derniereCaseTouchee + " : +100 points.");
        afficherQuestion();
    } else {
        score -= 10;
        afficherMessage("Raté en " + coordonneeTexte(ligne, colonne) + ". L'ordinateur prépare sa contre-attaque.");
        ajouterJournal("Raté en " + coordonneeTexte(ligne, colonne) + " : -10 points.");
        tourOrdinateur();
    }

    verifierFinPartie();
    mettreAJourAffichage();
    dessinerGrilles();
}

// Choisit et affiche une question selon la catégorie.
function afficherQuestion() {
    let questionsPossibles = [];

    for (let i = 0; i < questions.length; i++) {
        if (categorieChoisie == "mixte" || questions[i].categorie == categorieChoisie || questions[i].categorie == "mixte") {
            questionsPossibles.push(questions[i]);
        }
    }

    let index = Math.floor(Math.random() * questionsPossibles.length);
    questionActive = questionsPossibles[index];

    document.getElementById("zoneQuestion").classList.remove("cache");
    document.getElementById("texteQuestion").innerHTML = questionActive.question;

    let divChoix = document.getElementById("choixQuestion");
    divChoix.innerHTML = "";

    for (let i = 0; i < questionActive.choix.length; i++) {
        divChoix.innerHTML +=
            "<label><input type='radio' name='choixTrivia' value='" + i + "'> " +
            questionActive.choix[i] +
            "</label>";
    }
}

// Valide la réponse à la question.
function validerReponse() {
    if (questionActive == null) {
        afficherMessage("Il n'y a pas de question active.");
        return;
    }

    let choix = document.getElementsByName("choixTrivia");
    let reponseUtilisateur = -1;

    for (let i = 0; i < choix.length; i++) {
        if (choix[i].checked == true) {
            reponseUtilisateur = parseInt(choix[i].value);
        }
    }

    if (reponseUtilisateur == -1) {
        afficherMessage("Choisis une réponse avant de valider.");
        return;
    }

    if (reponseUtilisateur == questionActive.reponse) {
        score += 50;
        chargeNuke++;

        afficherMessage("Bonne réponse! La frappe nucléaire se charge. Tu gagnes +50 points.");
        ajouterJournal("Bonne réponse de trivia : +50 points et +1 charge nucléaire.");
    } else {
        score -= 25;

        afficherMessage("Mauvaise réponse. La bonne réponse était : " + questionActive.choix[questionActive.reponse] + ".");
        ajouterJournal("Mauvaise réponse : -25 points.");
    }

    questionActive = null;
    document.getElementById("zoneQuestion").classList.add("cache");

    tourOrdinateur();
    verifierFinPartie();
    mettreAJourAffichage();
    dessinerGrilles();
}

// Lancement de la frappe nucléaire.
function lancerNuke() {
    if (partieActive == false) {
        afficherMessage("La partie n'est pas active.");
        return;
    }

    if (chargeNuke < 3) {
        afficherMessage("La frappe nucléaire n'est pas encore prête.");
        return;
    }

    chargeNuke = 0;
    let attaques = 4;

    // La difficulté change le nombre de cases touchées par la frappe.
    switch (difficulte) {
        case "facile":
            attaques = 5;
            break;
        case "normal":
            attaques = 4;
            break;
        case "difficile":
            attaques = 3;
            break;
        default:
            attaques = 4;
    }

    let touches = 0;
    let essais = 0;

    while (attaques > 0 && essais < 100) {
        let ligne = Math.floor(Math.random() * TAILLE);
        let colonne = Math.floor(Math.random() * TAILLE);

        if (tirsJoueur[ligne][colonne] == 0) {
            tirsJoueur[ligne][colonne] = 1;
            attaques--;

            if (grilleEnnemi[ligne][colonne] == 1) {
                resteEnnemi--;
                score += 150;
                touches++;
            }
        }

        essais++;
    }

    afficherMessage("Frappe nucléaire lancée! Navires touchés : " + touches + ".");
    ajouterJournal("Frappe nucléaire : " + touches + " navire(s) touché(s).");

    verifierFinPartie();
    mettreAJourAffichage();
    dessinerGrilles();
}

// Tour automatique de l'ordinateur.
function tourOrdinateur() {
    if (partieActive == false) {
        return;
    }

    let ligne = Math.floor(Math.random() * TAILLE);
    let colonne = Math.floor(Math.random() * TAILLE);

    while (tirsEnnemi[ligne][colonne] == 1) {
        ligne = Math.floor(Math.random() * TAILLE);
        colonne = Math.floor(Math.random() * TAILLE);
    }

    tirsEnnemi[ligne][colonne] = 1;

    if (grilleJoueur[ligne][colonne] == 1) {
        resteJoueur--;
        ajouterJournal("L'ordinateur touche ton navire en " + coordonneeTexte(ligne, colonne) + ".");
    } else {
        ajouterJournal("L'ordinateur rate son tir en " + coordonneeTexte(ligne, colonne) + ".");
    }
}

// Vérifie si la partie est terminée.
function verifierFinPartie() {
    if (resteEnnemi <= 0) {
        partieActive = false;
        afficherMessage("VICTOIRE! Tu as détruit toute la flotte ennemie. Score final : " + score + ".");
        ajouterJournal("Victoire finale.");
    } else if (resteJoueur <= 0) {
        partieActive = false;
        afficherMessage("DÉFAITE! Ta flotte est détruite. Score final : " + score + ".");
        ajouterJournal("Défaite finale.");
    }
}

// Met à jour les statistiques visibles.
function mettreAJourAffichage() {
    document.getElementById("score").innerHTML = score;
    document.getElementById("resteEnnemi").innerHTML = resteEnnemi;
    document.getElementById("resteJoueur").innerHTML = resteJoueur;
    document.getElementById("etatNuke").innerHTML = chargeNuke + "/3";

    if (chargeNuke >= 3 && partieActive == true) {
        document.getElementById("btnNuke").disabled = false;
    } else {
        document.getElementById("btnNuke").disabled = true;
    }
}

// Affiche un message principal.
function afficherMessage(texte) {
    document.getElementById("message").innerHTML = texte;
}

// Ajoute une ligne dans le journal de bataille.
function ajouterJournal(texte) {
    let liste = document.getElementById("listeJournal");
    let element = document.createElement("li");

    let maintenant = new Date();
    let heure = maintenant.getHours().toString().padStart(2, "0");
    let minute = maintenant.getMinutes().toString().padStart(2, "0");

    element.innerHTML = "[" + heure + ":" + minute + "] " + texte;
    liste.prepend(element);
}

// Le jeu se prépare automatiquement au chargement de la page.
nouvellePartie();
