# Application QuizRT

## Installation

Clonez le dépôt :
    ```
    git clone https://github.com/Londones/web-temps-reel.git
    ```

## Démarrage de l'application

Pour démarrer l'application, exécutez la commande suivante :

1. Build les images Docker :
    ```
    docker compose build
    ```
2. Démarrer Docker :
    ```
    docker compose up
    ````
L'application devrait maintenant être accessible à l'adresse du `localhost`.

## Fonctionalités principales

1. Côté administrateur :
- Créer un QCM de choix multiples et de désigner une ou plusieurs bonnes réponses
- Créer une session de QCM, puis sélectionner un QCM pour commencer avec la session créée

2. Côté utilisateur :
- Rejoindre une salle de QCM avec l'id de session créée par l'administrateur
- Prendre le QCM une fois commencé par l'administrateur
- Chat avec les autres utilisateurs dans la même session

3. QCM :
- Chaque question a une ou plusieurs bonnes réponses
- Minuteur avec un temps limit pour chaque question synchronisé pour tous les utilsiateurs
- Passer automatique à la question suivante à l'expiration du minuteur
- Retour direct si la réponse d'utilisateur est correct ou non
- Affichage le nombre d'utilisateurs ayant choisi chaque option de réponse

## Parcours pour tester

- Se connecter en tant que l'administrateur avec :
    - email : admin@gmail.com
    - password : password
- Aller dans le menu **Dashboard QCM** pour créer un QCM
- Pour chaque question, choisir une ou plusieurs bonnes réponses
- Aller dans le menu **Create session** pour créer une session
- Copier l'id de session créée

- Ouvrir une nouvelle fenêtre et s'inscrire pour un compte utilisateur
- Se connecter en tant que l'utilisateur
- Coller l'id de session et attendre pour que le QCM commence

- Retourner à l'interface administrateur, puis cliquer sur le button **Select quiz for session** pour afficher la liste des QCM
- Cliquer sur le button **Start quiz for session** pour commencer le QCM côté client

- Retourner à l'interface utilisateur pour répondre aux questions

## Contributions de l'équipe
1. Interface de création de quiz :
- Un formulaire simple pour que les administrateurs puissent créer et gérer des quiz. **[Tran Diep Mai Thi]**
- La capacité d'ajouter des questions à choix multiples avec des options et de désigner la bonne réponse. **[Tran Diep Mai Thi]**

2. Communication en temps réel avec Socket.IO :
- Établissement de connexions WebSocket entre le serveur et les clients pour une communication
bidirectionnelle. **[Alicia Saci]**
- Diffusion des questions et réception des réponses en temps réel. **[Tran Diep Mai Thi]**

3. Fonctionnalité de la salle de quiz :
- Mécanisme permettant aux utilisateurs de participer à un quiz en utilisant un identifiant unique pour la
session. **[Alicia Saci]**
- Support pour plusieurs salles où différents quiz peuvent se dérouler simultanément. **[Alicia SACI]**

4. Minuteur côté serveur :
- Un compteur à rebours géré par le serveur pour chaque question afin de garantir un timing synchronisé pour
tous les clients. **[Alicia Saci]**
- Progression automatique vers la prochaine question à l'expiration du minuteur. **[Alicia Saci]**

5. Déroulement des questions et réponses :
- Présentation des questions à tous les clients dans une salle lorsque le quiz commence. **[Tran Diep Mai Thi]**
- Collecte des réponses des clients et verrouillage des réponses à la fin du temps imparti.

6. Retour en direct sur les réponses :
- Un retour immédiat aux clients après chaque question, indiquant si leur réponse était correcte ou non. **[Tran Diep Mai Thi]**
- Affichage en temps réel du nombre de clients ayant choisi chaque option de réponse. **[Tran Diep Mai Thi]**

7. Notation et résultats :
- Calcul des scores côté serveur basé sur la justesse et la rapidité des réponses. **[Awa Bah]**
- Affichage des scores finaux et des bonnes réponses aux clients à la fin du quiz. **[Awa Bah]**

8. Chat en direct lors des quiz : Mettre en place un système de chat où les participants peuvent discuter
pendant un quiz, avec une attention particulière à la gestion des messages en temps réel et à la prévention
de la triche. **[Awa Bah]**

9. Envoyer des annonces ou des alertes concernant les événements du quiz, comme le début du quiz, le passage à la prochaine question, ou les rappels avant la fin du temps imparti pour une question.  **[Alicia Saci]**

10. Notifications en temps réel : Envoyer des annonces ou des alertes concernant les événements du quiz,
comme le début du quiz, le passage à la prochaine question, ou les rappels avant la fin du temps imparti pour
une question. **[Alicia Saci]**
    Les types de notifs faites :
    - notif lorsqu'un utilisateur rejoins une session quiz 
    - notif 10 seconds avant la fin du quiz
    - notif lorsqu'une nouvelle session est crée
    - notif lorsqu'un quiz a débuté

11. Authentification des utilisateurs. **[Awa Bah]**

12. Dockerisation. **[Awa Bah]**

13. Stockage de données persistant. **[Awa Bah, Tran Diep Mai Thi, Alicia Saci]**

