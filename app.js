//"use strict";
const express = require("express");
const requestHandlers = require("./scripts/request-handlers.js");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("www"));

//Modalidade
app.get("/modalities", requestHandlers.getModalidades);

//Users
app.get("/users", requestHandlers.getUsers);
app.post("/users", requestHandlers.createUsers);
app.put("/users/:id", requestHandlers.updateUser);

//Tournaments
app.get("/tournaments", requestHandlers.getTournaments);
app.post("/tournaments", requestHandlers.createUpdateTournaments);
app.put("/tournaments/:id", requestHandlers.createUpdateTournaments);
app.delete("/tournaments/:id", requestHandlers.removeTournaments);

//Players
app.get("/tournaments/:id/players", requestHandlers.getTournamentPlayers);
app.post("/tournaments/:id/players", requestHandlers.addPlayerToTournament);
app.post("/players", requestHandlers.addPlayer);
app.delete("/tournaments/:idTor/players/:idPlayer", requestHandlers.removePlayerFromTournament);

//Teams
app.delete("/tournaments/:idTor/teams/:idTeam", requestHandlers.removeTeamFromTournament);
app.get("/tournaments/:id/teams", requestHandlers.getTournamentTeams);
app.post("/teams", requestHandlers.addTeam);
app.post("/tournaments/:id/teams", requestHandlers.addTeamToTournament);

//Games
app.get("/tournaments/:idTor/games", requestHandlers.getTournamentGames);
app.post("/tournaments/:idTor/games", requestHandlers.addGame);
app.delete("/tournaments/:idTor/games/:idGame", requestHandlers.removeGameFromTournament);

app.listen(8081, function () {
    console.log("Server running at http://localhost:8081");
});