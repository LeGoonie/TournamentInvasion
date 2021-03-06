"use strict";
const mysql = require("mysql");
const options = require("./connection-options.json");

/***************Modalidade**************/

/**
 * Função que lê a tabela de modalidades da base de dados e devolve os seus dados em formato json.
 * @param {*} req - request
 * @param {*} res - resposta
 */
function getModalidades(req, res) {
    var connection = mysql.createConnection(options);
    connection.connect();
    var query = "SELECT idModalidade, nome_modalidade FROM modalidade";
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({"message": "Error", "error": err });
        } else {
            res.json({"message": "Success", "modalities": rows });
        }
    });
}
module.exports.getModalidades = getModalidades;



/***************Users**************/
/**
 * Função que lê a tabela de utilizadores da base de dados e devolve os seus dados em formato json.
 * @param {*} req - request
 * @param {*} res - resposta
 */
function getUsers(req, res) {
    var connection = mysql.createConnection(options);
    connection.connect();
    var query = "SELECT idUtilizador, username, email, pw, birth_date, totalScore FROM utilizador";
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({"message": "Error", "error": err });
        } else {
            res.json({"message": "Success", "users": rows });
        }
    });
}
module.exports.getUsers = getUsers;

/**
 * Função que insere na tabela de utilizadores os dados enviados na request json.
 * @param {*} req - request
 * @param {*} res - resposta
 */
function createUsers(req, res) {
    let connection = mysql.createConnection(options);
    let username = req.body.username;
    let email = req.body.email;
    let birth_date = req.body.birth_date;
    let password = req.body.pw;
    let sql = "INSERT INTO utilizador(username, email, birth_date, pw, totalScore) VALUES (?,?,?,?,0)";
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(sql, [username, email, birth_date, password], function (err, rows) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.send(rows);
            }
        });
    });
}
module.exports.createUsers = createUsers;

/**
 * Função que atualiza na tabela de utilizadores os dados enviados na request json.
 * @param {*} req - request
 * @param {*} res - resposta
 */
function updateUser(req, res){
    let connection = mysql.createConnection(options);
    let username = req.body.username;
    let email = req.body.email;
    let birth_date = req.body.birth_date;
    let pw = req.body.pw;
    let sql = "UPDATE utilizador SET username = ?, email = ?, birth_date = ?, pw = ? WHERE idUtilizador = ?";
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(sql, [username, email, birth_date, pw, req.params.id], function (err, rows) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.send(rows);
            }
        });
    });
}
module.exports.updateUser = updateUser;

/***************Tournaments**************/

/**
 * Função que lê a tabela de torneios da base de dados e devolve os seus dados em formato json.
 * @param {*} req - request
 * @param {*} res - resposta
 */
function getTournaments(req, res) {
    var connection = mysql.createConnection(options);
    connection.connect();
    var query = "SELECT idTorneio,idModalidade, owner, nome, progresso, start_date, pub, tipo_torneio FROM torneio";
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({"message": "Error", "error": err });
        } else {
            res.json({"message": "Success", "tournament": rows });
        }
    });
}
module.exports.getTournaments = getTournaments;

/**
 * Função que insere ou atualiza na tabela de torneios os dados enviados na request json.
 * @param {*} req - request
 * @param {*} res - resposta
 */
function createUpdateTournaments(req, res) {
    let connection = mysql.createConnection(options);
    let idModalidade = req.body.idModalidade;
    let owner = req.body.owner;
    let nome = req.body.nome;
    let progresso = req.body.progresso;
    let start_date = req.body.start_date;
    let pub = req.body.pub;
    let tipo = req.body.tipo_torneio;
    let sql = (req.method === 'PUT') ? "UPDATE torneio SET idModalidade = ?, owner = ?, nome = ?, progresso = ?, start_date = ?, pub = ?, tipo_torneio = ? WHERE idTorneio = ?" :
            "INSERT INTO torneio(idModalidade, owner, nome, progresso, start_date, pub, tipo_torneio) VALUES (?,?,?,?,?,?,?)";
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(sql, [idModalidade, owner, nome, progresso, start_date, pub, tipo, req.params.id], function (err, rows) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.send(rows);
            }
        });
    });
}
module.exports.createUpdateTournaments = createUpdateTournaments;

/**
 * Função que remove na tabela de torneios o torneio enviado na request json.
 * @param {*} req - request
 * @param {*} res - resposta
 */
function removeTournaments(req, res) {
    let query = 'DELETE FROM torneio WHERE idTorneio = ?';
    let connection = mysql.createConnection(options);
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(query, [req.params.id], function (err) {
            if (err) {
                res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        });
    });
}
module.exports.removeTournaments = removeTournaments;


/*Jogadores de torneios*/

/**
 * Função que remove na tabela de jogadores participantes no torneio, o jogador do torneio enviado na request json.
 * @param {*} req - request
 * @param {*} res - resposta
 */
function removePlayerFromTournament(req, res) {
    let query = 'DELETE FROM jogador_participante WHERE jogador_participante.idJogador = ? and jogador_participante.idTorneio = ?';
    let connection = mysql.createConnection(options);
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(query, [req.params.idPlayer, req.params.idTor], function (err) {
            if (err) {
                res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        });
    });
}
module.exports.removePlayerFromTournament = removePlayerFromTournament;

/**
 * Função que lê a tabela de jogadores participante do torneio da base de dados e devolve os seus dados em formato json.
 * @param {*} req - request
 * @param {*} res - resposta
 */
function getTournamentPlayers(req, res) {
    var connection = mysql.createConnection(options);
    connection.connect();
    var query = "Select jogador.idJogador, jogador.username, jogador_participante.score FROM jogador join jogador_participante on jogador.idJogador = jogador_participante.idJogador WHERE jogador_participante.idTorneio = ?";
    connection.query(query, [req.params.id], function (err, rows) {
        if (err) {
            res.json({"message": "Error", "error": err });
        } else {
            res.json({"message": "Success", "torUsers": rows });
        }
    });
}
module.exports.getTournamentPlayers = getTournamentPlayers;

/**
 * Função que insere na tabela de jogadores os dados enviados na request json.
 * @param {*} req - request
 * @param {*} res - resposta
 */
function addPlayer(req, res) {
    let connection = mysql.createConnection(options);
    let username = req.body.username;
    let sql = "INSERT INTO jogador(username) VALUES (?)";
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(sql, [username], function (err, rows) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.send(rows);
            }
        });
    });
}
module.exports.addPlayer = addPlayer;

/**
 * Função que insere na tabela de jogadores participantes os dados enviados na request json.
 * @param {*} req - request
 * @param {*} res - resposta
 */
function addPlayerToTournament(req, res){
    let connection = mysql.createConnection(options);
    let idPlayer = req.body.idJogador;
    let sql = "insert into jogador_participante values (?,?,0);"
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(sql, [req.params.id, idPlayer], function (err, rows) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.send(rows);
            }
        });
    });
}
module.exports.addPlayerToTournament = addPlayerToTournament;

/*Equipas de torneios*/

/**
 * Função que remove na tabela de equipas participantes no torneio, o jogador do torneio enviado na request json.
 * @param {*} req - request
 * @param {*} res - resposta
 */
function removeTeamFromTournament(req, res) {
    let query = 'DELETE FROM equipa_participante WHERE equipa_participante.idEquipa = ? and equipa_participante.idTorneio = ?';
    let connection = mysql.createConnection(options);
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(query, [req.params.idEquipa, req.params.idTor], function (err) {
            if (err) {
                res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        });
    });
}
module.exports.removeTeamFromTournament = removeTeamFromTournament;

/**
 * Função que lê a tabela de equipas participante do torneio da base de dados e devolve os seus dados em formato json.
 * @param {*} req - request
 * @param {*} res - resposta
 */
function getTournamentTeams(req, res) {
    var connection = mysql.createConnection(options);
    connection.connect();
    var query = "Select equipa.idEquipa, equipa.nome, equipa_participante.score FROM equipa join equipa_participante on equipa.idEquipa = equipa_participante.idEquipa WHERE equipa_participante.idTorneio = ?";
    connection.query(query, [req.params.id], function (err, rows) {
        if (err) {
            res.json({"message": "Error", "error": err });
        } else {
            res.json({"message": "Success", "torTeams": rows });
        }
    });
}
module.exports.getTournamentTeams = getTournamentTeams;

/**
 * Função que insere na tabela de equipas os dados enviados na request json.
 * @param {*} req - request
 * @param {*} res - resposta
 */
function addTeam(req, res) {
    let connection = mysql.createConnection(options);
    let username = req.body.name;
    let sql = "INSERT INTO equipa(nome) VALUES (?)";
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(sql, [username], function (err, rows) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.send(rows);
            }
        });
    });
}
module.exports.addTeam = addTeam;

/**
 * Função que insere na tabela de equipas participantes os dados enviados na request json.
 * @param {*} req - request
 * @param {*} res - resposta
 */
function addTeamToTournament(req, res){
    let connection = mysql.createConnection(options);
    let idEquipa = req.body.idEquipa;
    let sql = "insert into equipa_participante values (?,?,0);"
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(sql, [req.params.id, idEquipa], function (err, rows) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.send(rows);
            }
        });
    });
}
module.exports.addTeamToTournament = addTeamToTournament;

/*Jogos*/
/**
 * Função que remove na tabela de jogos, o jogo que tem id de torneio igual ao da request json.
 * @param {*} req - request
 * @param {*} res - resposta
 */
function removeGameFromTournament(req, res) {
    let query = 'DELETE FROM jogo WHERE idTorneio = ? and idJogo = ?';
    let connection = mysql.createConnection(options);
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(query, [req.params.idTor, req.params.idGame], function (err) {
            if (err) {
                res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        });
    });
}
module.exports.removeGameFromTournament = removeGameFromTournament;

/**
 * Função que lê a tabela de jogos de um certo torneio da base de dados e devolve os seus dados em formato json.
 * @param {*} req - request
 * @param {*} res - resposta
 */
function getTournamentGames(req, res) {
    var connection = mysql.createConnection(options);
    connection.connect();
    var query = "Select idTorneio, idJogo, game_datetime, location, id1, score1, id2, score2 FROM jogo WHERE idTorneio = ?";
    connection.query(query, [req.params.idTor], function (err, rows) {
        if (err) {
            res.json({"message": "Error", "error": err });
        } else {
            res.json({"message": "Success", "torGames": rows });
        }
    });
}
module.exports.getTournamentGames = getTournamentGames;

/**
 * Função que insere na tabela de jogos os dados enviados na request json.
 * @param {*} req - request
 * @param {*} res - resposta
 */
function addGame(req, res) {
    let connection = mysql.createConnection(options);
    let datetime = req.body.game_datetime;
    let location = req.body.location;
    let id1 = req.body.id1;
    let score1 = req.body.score1;
    let id2 = req.body.id2;
    let score2 = req.body.score2;
    let sql = "INSERT INTO jogo(idTorneio, game_datetime, location, id1, score1, id2, score2) VALUES (?,?,?,?,?,?,?)";
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(sql, [req.params.idTor, datetime, location, id1, score1, id2, score2], function (err, rows) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.send(rows);
            }
        });
    });
}
module.exports.addGame = addGame;