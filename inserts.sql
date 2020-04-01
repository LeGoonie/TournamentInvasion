insert into modalidade(nome_modalidade) values('ping-pong');
insert into modalidade(nome_modalidade) values('snooker');
insert into modalidade(nome_modalidade) values('dardos');
insert into modalidade(nome_modalidade) values('outra');

insert into utilizador(username, email, birth_date, pw, totalScore) values("primoO", "primo@gmail.com", "1999-04-05", "1", 0);
insert into utilizador(username, email, birth_date, pw, totalScore) values("goonie", "goonie@gmail.com", "1999-04-05", "1", 0);

insert into jogador(username) values("primoO");
insert into jogador(username) values("goonie");
insert into jogador(username) values("nuno");
insert into jogador(username) values("andré");

insert into equipa(nome) values("SharpShooters");
insert into equipa(nome) values("Danados");

insert into torneio(idModalidade, owner,nome,progresso,start_date,pub,tipo_torneio) values (2, 1, "Snooker Tournament", 0, "2019-07-11", 1, "Individual");
insert into torneio(idModalidade, owner,nome,progresso,start_date,pub,tipo_torneio) values (1, 2, "PingPong para Noobs", 0, "2019-07-09", 1, "Individual");
insert into torneio(idModalidade, owner,nome,progresso,start_date,pub,tipo_torneio) values (3, 1, "Primo's Darts", 0, "2019-07-05", 0, "Equipas");

insert into jogador_participante(idTorneio, idJogador, score) values(1,1,0);
insert into jogador_participante(idTorneio, idJogador, score) values(1,2,0);
insert into jogador_participante(idTorneio, idJogador, score) values(1,3,0);

insert into jogador_participante(idTorneio, idJogador, score) values(2,1,0);
insert into jogador_participante(idTorneio, idJogador, score) values(2,2,0);
insert into jogador_participante(idTorneio, idJogador, score) values(2,3,0);
insert into jogador_participante(idTorneio, idJogador, score) values(2,4,0);

insert into equipa_participante(idTorneio, idEquipa, score) values(3,1,0);
insert into equipa_participante(idTorneio, idEquipa, score) values(3,2,0);

insert into jogo(idTorneio, game_datetime, location, id1, id2, score1, score2) values(1, "2019-07-06T14:12", "Setúbal", 2, 1,100 , 50);
insert into jogo(idTorneio, game_datetime, location, id1, id2, score1, score2) values(1, "2019-07-24T16:10", "Corroios", 2, 1,100 , 40);

insert into jogo(idTorneio, game_datetime, location, id1, id2, score1, score2) values(2, "2019-07-06T15:10", "Setúbal", 2, 1,100 , 50);
insert into jogo(idTorneio, game_datetime, location, id1, id2, score1, score2) values(2, "2019-07-24T16:10", "Corroios", 1, 4,100 , 40);
insert into jogo(idTorneio, game_datetime, location, id1, id2, score1, score2) values(2, "2019-08-07T12:10", "Lisboa", 3, 4,100, 60);

insert into jogo(idTorneio, game_datetime, location, id1, id2, score1, score2) values(3, "2019-05-24T16:10", "Borba", 1, 2,50 ,100);
insert into jogo(idTorneio, game_datetime, location, id1, id2, score1, score2) values(3, "2019-08-07T12:10", "Faro", 2, 1,100 , 60);

