/**
 * Classe que representa o torneio
 * @param {*} id - id do torneio
 * @param {*} idModalidade - id da modalidade
 * @param {*} owner - id do utilizador que começou o torneio
 * @param {*} nome - nome do torneio
 * @param {*} progresso - % de progresso do torneio
 * @param {*} start_date - data de começo do torneio
 * @param {*} pub - se o torneio é publico ou não
 * @param {*} tipo_torneio - tipo de torneio
 */
function Tournament(id, idModalidade, owner, nome, progresso, start_date, pub, tipo_torneio) {
    this.id = id;
    this.idModalidade = idModalidade;
    this.owner = owner;
    this.nome = nome;
    this.progresso = progresso;
    this.start_date = start_date;
    this.pub = pub;
    this.tipo_torneio = tipo_torneio;
};

/**
 * Classe que representa o jogador
 * @param {*} id - id do jogador
 * @param {*} username - nome do jogador
 * @param {*} score - pontuação total do jogador
 */
function Player(id, username, score){
    this.id = id;
    this.username = username;
    this.score = score;
}

/**
 * Classe que representa a equipa
 * @param {*} id - id da equipa
 * @param {*} name - nome da equipa
 * @param {*} score - pontuação total da equipa
 */
function Team(id, name, score){
    this.id = id;
    this.name = name;
    this.score = score;
}

/**
 * Classe que representa o jogo
 * @param {*} id - id do jogo
 * @param {*} idTorneio - id do torneio em que o jogo está
 * @param {*} game_datetime - data e horas do jogo
 * @param {*} location - localização do jogo
 * @param {*} id1 - id do primeiro elemento
 * @param {*} score1 - pontuação do primeiro elemento
 * @param {*} id2 - id do segundo elemento
 * @param {*} score2 - pontuação do segundo elemento
 */
function Game(id, idTorneio, game_datetime, location, id1, score1, id2, score2){
    this.id = id;
    this.idTorneio = idTorneio;
    this.game_datetime = game_datetime;
    this.location = location;
    this.id1 = id1;
    this.score1 = score1;
    this.id2 = id2;
    this.score2 = score2;
}

/**
 * Classe que representa o utilizador
 * @param {*} id - id do utilizador
 * @param {*} username - nome do utilizador
 * @param {*} email - email do utilizador
 * @param {*} birth_date - data de nascimento do utilizador
 * @param {*} pw - password do utilizador
 */
function User(id, username, email, birth_date, pw) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.birth_date = birth_date;
    this.pw = pw;
    this.totalScore = 0;
};

/**
 * Classe que representa as modalidades
 * @param {*} id - id da modalidade
 * @param {*} name - nome da modalidade
 */
function Modality(id, name){
	this.id = id;
	this.name = name;
}