drop database if exists project;
create database project;

use project;

create table utilizador(
	idUtilizador int not null auto_increment,
    username varchar(20) not null,
    email varchar(45) not null,
    birth_date date,
    pw varchar(20) not null,
    totalScore int not null,
    primary key(idUtilizador)
);


CREATE TABLE modalidade (
    idModalidade INT NOT NULL auto_increment,
    nome_modalidade VARCHAR(20) NOT NULL,
    PRIMARY KEY (idModalidade)
);

create table torneio(
	idTorneio int not null auto_increment,
    idModalidade int  not null,
    owner int not null,
    nome varchar(45) not null,
    progresso int not null,
    start_date date not null,
    pub int not null,
    tipo_torneio varchar(10) NOT NULL,
    foreign key(idModalidade) references modalidade(idModalidade),
    primary key(idTorneio)
);

create table jogo(
	idJogo int not null auto_increment,
    idTorneio int not null,
    game_datetime datetime,
    location varchar(45),
    id1 int not null,
    id2 int not null,
    score1 int,
    score2 int,
    foreign key(idTorneio) references torneio(idTorneio),
    primary key(idJogo)
);

create table equipa(
	idEquipa int not null auto_increment,
    nome varchar(45) not null,
    primary key(idEquipa)
);

create table equipa_participante(
	idTorneio int not null,
    idEquipa int not null,
    score int not null,
    foreign key(idTorneio) references torneio(idTorneio),
    foreign key(idEquipa) references equipa(idEquipa)
);

create table jogador(
	idJogador int not null auto_increment,
    username varchar(45) not null,
    primary key(idJogador)
);

create table jogador_participante(
	idTorneio int not null,
    idJogador int not null,
    score int not null,
    foreign key(idTorneio) references torneio(idTorneio),
    foreign key(idJogador) references jogador(idJogador)
);

DELIMITER //
CREATE TRIGGER on_torneio_delete_jogador before delete
on torneio
for each row 
BEGIN
	delete from jogador_participante 
    where jogador_participante.idTorneio = OLD.idTorneio;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER on_torneio_delete_equipa before delete
on torneio
for each row 
BEGIN
	delete from equipa_participante 
    where equipa_participante.idTorneio = OLD.idTorneio;
END//
DELIMITER ;

