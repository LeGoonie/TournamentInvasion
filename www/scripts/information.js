

//André Reis nº170221035
//Bruno Alves nº170221041


/**
 * Abre uma secção recebida por parâmetro e fecha as outras que não são a mesma.
 * @param {string} section - id da secção a abrir.
 */
function openSection(section){
    let allSections = document.getElementsByTagName("section");
    for(var i = 0; i < allSections.length; i++){
        if(allSections[i].id === section){
            allSections[i].style.display = "block";
        } else {
            allSections[i].style.display = "none";
        }
    }
}

/**
 * Classe que guarda a informação toda necessária.
 */
function Information() {
    this.loggedUser = 0;
    this.modalities = [];
    this.games = [];
    this.users = [];
    this.tournaments = [];
    this.tournamentPlayers = new Map();
    this.tournamentTeams = new Map();
};

/**
 * Método que devolve um array com todos os jogadores existentes.
 * @returns {array} players - array de jogadores
 */
function getPlayersArray(){
    var players = [];
    info.tournamentPlayers.forEach(p => p.forEach(z => players.push(z)));
    return players;
}

/**
 * Método que devolve um array com todas as equipas existentes.
 * @returns {array} teams - array de equipas
 */
function getTeamsArray(){
    var teams = [];
    info.tournamentTeams.forEach(p => p.forEach(z => teams.push(z)));
    return teams;
}

/**
 * Método que popula o array de modalidades com os dados de request-handler provenientes da base de dados.
 * @param {string} callback - função secundária a chamar
 */
Information.prototype.getModalities = function (callback) {
    this.modalities = [];
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open("GET", "/modalities");
    var self = this;
    xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                this.response.modalities.forEach(m => {
                    self.modalities.push(new Modality(m.idModalidade, m.nome_modalidade));
                });
                if(callback)
                    callback();
            }
    };
    xhr.send();
};

/**
 * Função que cria o option box de modalidades ao criar um torneio.
 */
async function createModalitiesSelect() {
    setTimeout(function() {
        var select = document.getElementById('modalities');
        for(var i = 0; i < info.modalities.length; i++) {
            var option = info.modalities[i];
            var el = document.createElement('option');
            el.value = option.name;
            el.textContent = option.name;
            select.appendChild(el);
        };
    }, 150);
}

/**
 * Função que popula o array de utilizadores com os dados de request-handler provenientes da base de dados.
 */
Information.prototype.getUsers = function () {
    this.users = [];
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', '/users');
    var self = this;
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            this.response.users.forEach(u => {
                const d = new Date(u.birth_date);
                const dateStr = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate();
                self.users.push(new User(u.idUtilizador, u.username, u.email, dateStr, u.totalScore));
            });
        }
    };
    xhr.send();
};

/**
 * Função que popula o array de torneios com os dados de request-handler provenientes da base de dados.
 */
Information.prototype.getTournaments = function () {
    this.tournaments = [];
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open("GET", "/tournaments");
    var self = this;
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            this.response.tournament.forEach(t => {
                const d = new Date(t.start_date);
                const dateStr = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate();
                pub = t.pub === 1 ? true : false;
                var tor = new Tournament(t.idTorneio, t.idModalidade, t.owner, t.nome, t.progresso, dateStr, pub, t.tipo_torneio);
                self.tournaments.push(tor);
            });
        }
    };
    xhr.send();
};

/* Tournament Players */

/**
 * Função que popula o mapa que relaciona os jogadores com os respetivos torneios.
 */
Information.prototype.getAllPlayers = function(){
    const self = this;
    setTimeout(function() {
        self.tournamentPlayers = new Map();
        for(var i = 0; i < self.tournaments.length; i++){
            self.getTournamentPlayer(self.tournaments[i].id);
        }
    }, 1000);
}

/**
 * Função que popula o array de jogadores de um respetivo torneio com os dados de request-handler provenientes da base de dados.
 * @param {int} idTor - Id de um torneio
 */
Information.prototype.getTournamentPlayer = function (idTor) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open("GET", "/tournaments/" + idTor + "/players");
    var players = [];
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            this.response.torUsers.forEach(t => {
                const player = new Player(t.idJogador, t.username, t.score);
                players.push(player);
            });
        }
    };
    this.tournamentPlayers.set(idTor,players);
    xhr.send();
};

/**
 * Função que popula o mapa que relaciona as equipas com os respetivos torneios.
 */
Information.prototype.getAllTeams = function(){
    const self = this;
    setTimeout(function() {
        self.tournamentTeams = new Map();
        for(var i = 0; i < self.tournaments.length; i++){
            self.getTournamentTeam(self.tournaments[i].id);
        }
    }, 1000);
}

/**
 * Função que popula o array de equipas de um respetivo torneio com os dados de request-handler provenientes da base de dados.
 * @param {int} idTor - Id de um torneio
 */
Information.prototype.getTournamentTeam = function (idTor) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open("GET", "/tournaments/" + idTor + "/teams");
    var teams = [];
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            this.response.torTeams.forEach(t => {
                const team = new Team(t.idEquipa, t.nome, t.score);
                teams.push(team);
            });
        }
    };
    this.tournamentTeams.set(idTor,teams);
    xhr.send();
};

/**
 * Função que remove um torneio do array de torneios, ao pedido de um json-request.
 * @param {int} id - Id de um torneio
 */
Information.prototype.removeTournament = function (id) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/tournaments/' + id);
    const self = this;
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            self.tournaments.splice(self.tournaments.findIndex(i => i.id == id), 1);
            info.showTor();
        }
    };
    xhr.send();
}

/**
 * Função que remove um jogador do array de jogadores num torneio, ao pedido de um json-request.
 * @param {int} idTor - Id de um torneio 
 * @param {int} idPlayer - id de um jogador
 */
Information.prototype.removePlayer = function (idTor, idPlayer) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/tournaments/' + idTor + "/players/" + idPlayer);
    const self = this;
    var torPlayers = this.tournamentPlayers.get(idTor);
    xhr.onreadystatechange = function () {
        if(torPlayers !== undefined)
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                torPlayers.splice(torPlayers.findIndex(p => p.id == idPlayer), 1);
                self.showTorPlayers(idTor);
            }
    };
    xhr.send();
}

/**
 * Função que remove uma equipa do array de equipas num torneio, ao pedido de um json-request.
 * @param {int} idTor - Id de um torneio 
 * @param {int} idTeam - id de uma equipa
 */
Information.prototype.removeTeam = function (idTor, idTeam) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/tournaments/' + idTor + "/teams/" + idTeam);
    const self = this;
    var torTeams = this.tournamentTeams.get(idTor);
    xhr.onreadystatechange = function () {
        if(torTeams !== undefined)
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                torTeams.splice(torTeams.findIndex(p => p.id == idTeam), 1);
                self.showTorTeams(idTor);
            }
    };
    xhr.send();
}

/**
 * Função que mostra a tabela com a informação de todos os torneios.
 */
Information.prototype.showTor = function () {
    if(this.loggedUser !== 0){
        openSection("tournaments");
        document.getElementById("divButtonsTournament").style.display = "block";
        var tableBody = document.getElementById("torTable").getElementsByTagName("tbody")[0];
        document.getElementById("titleTor").innerHTML = 'Meus Torneios';
        if(tableBody !== undefined){
            document.getElementById('torTable').removeChild(tableBody);
        }
        var tbody = document.createElement("tbody");
        document.getElementById("torTable").appendChild(tbody); 
        var user = this.getUser();
        for(var i = 0; i < this.tournaments.length; i++){
            if(this.tournaments[i].tipo_torneio == "Individual"){
                const torPlayers = this.tournamentPlayers.get(this.tournaments[i].id);
                if(torPlayers){
                    for(var j= 0; j < torPlayers.length; j++){
                        if(torPlayers[j].username == user.username){ //verificação para não existir jogadores iguais no torneio
                            this.createTournamentLine(this.tournaments[i]);
                        }
                    }
                }
            } else if(this.tournaments[i].tipo_torneio == "Equipas"){
                if(this.tournaments[i].owner == this.loggedUser){
                    this.createTournamentLine(this.tournaments[i]);
                }
            }
        }
    } else{
        showAlert("Inicia sessão para veres o conteúdo!");
    }
};

/**
 * Mostra a secção dos torneios publicos, que seleciona apenas os torneios com a variavel pub a 1.
 */
Information.prototype.showPublicTor = function () {
    openSection("tournaments");
    if(this.loggedUser === 0){
        document.getElementById("divButtonsTournament").style.display = "none";
    }else{
        document.getElementById("divButtonsTournament").style.display = "block";
    }
    document.getElementById("titleTor").innerHTML = 'Torneios Publicos';
    var tableBody = document.getElementById("torTable").getElementsByTagName("tbody")[0];
    if(tableBody !== undefined){
        document.getElementById('torTable').removeChild(tableBody);
    }
    var tbody = document.createElement("tbody");
    document.getElementById("torTable").appendChild(tbody); 
    for(var i = 0; i < info.tournaments.length; i++){
        if(info.tournaments[i].pub == 1)
            this.createTournamentLine(info.tournaments[i]);
    }

};

/**
 * Função que cria uma linha da tabela de torneios, com as informações do torneio recebido por parametros.
 * @param {Torneio} tor - torneio a criar a linha.
 */
Information.prototype.createTournamentLine = function(tor){
    var tableBody = document.getElementById("torTable").getElementsByTagName("tbody")[0];
    var tableRow = document.createElement("tr");

    var cellCheck = document.createElement("td");
    var check = document.createElement("INPUT");
    check.setAttribute("type", "checkbox");
    cellCheck.appendChild(check);
    tableRow.appendChild(cellCheck);

    var cellIdTor = document.createElement("td");
    var textIdTor = document.createTextNode(tor.id);
    cellIdTor.appendChild(textIdTor);
    tableRow.appendChild(cellIdTor);

    var cellIdMod = document.createElement("td");
    var textIdMod = document.createTextNode(this.modalities[tor.idModalidade - 1].name);
    cellIdMod.appendChild(textIdMod);
    tableRow.appendChild(cellIdMod);

    var cellNome = document.createElement("td");
    var textNome = document.createTextNode(tor.nome);
    cellNome.appendChild(textNome);
    tableRow.appendChild(cellNome);

    var progresso = this.getProgressFromTor(tor.id);
    var cellProg = document.createElement("td");
    var textProg = document.createTextNode(progresso+"%");
    cellProg.appendChild(textProg);
    tableRow.appendChild(cellProg);

    var cellData = document.createElement("td");
    var textData = document.createTextNode(tor.start_date);
    cellData.appendChild(textData);
    tableRow.appendChild(cellData);

    var cellPub = document.createElement("td");
    var textPub = document.createTextNode(tor.pub);
    cellPub.appendChild(textPub);
    tableRow.appendChild(cellPub);

    var cellTipo = document.createElement("td");
    var textTipo = document.createTextNode(tor.tipo_torneio);
    cellTipo.appendChild(textTipo);
    tableRow.appendChild(cellTipo);
    
    var cellButton = document.createElement("td");
    var buttonElement = document.createElement("INPUT");
    buttonElement.setAttribute("type", "button");
    buttonElement.value = "Visualizar";
    buttonElement.id = tor.id;
    buttonElement.className = "btn btn-info btn-lg";
    buttonElement.style.fontSize = '15px';
    if(tor.tipo_torneio == "Equipas"){
        buttonElement.setAttribute("onclick", "info.showTorTeams("+tor.id+")");
    } else if(tor.tipo_torneio == "Individual"){
        buttonElement.setAttribute("onclick", "info.showTorPlayers("+tor.id+")");
    }
    cellButton.appendChild(buttonElement);
    tableRow.appendChild(cellButton);

    tableBody.appendChild(tableRow);
}

/**
 * Função que cria o objeto do torneio, e em seguida faz o POST ou PUT do mesmo com um pedido json, dependendo da ação recebida
 * por parametros. Em seguida ao POST é chamada a função que mostra a tabela de torneios novamente para atualizar.
 * @param {string} action - ação a realizar
 */
Information.prototype.processingTournaments = function (action) {
    if(this.loggedUser === 0){
        showAlert("Inicia sessão para criar um torneio!");
    } else {
        const id = 1;
        var modalidade;
        document.getElementById("modalities").childNodes.forEach(element => {
            if(element.selected === true){
                modalidade = element.value;[]
            }
        });
        var idModalidade;

        for (i = 0; i < info.modalities.length; i++){
            if(this.modalities[i].name == modalidade)
                idModalidade = this.modalities[i].id;
        }
        const nome = document.getElementById('name').value;
        const progresso = 0;
        const d = new Date(document.getElementById('date').value);
        const start_date = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate();
        const pubList = document.getElementById('public');
        const pub = pubList.options[pubList.selectedIndex].value === "public" ? 1 : 0;
        const torTypeList = document.getElementById('team');
        const torType = torTypeList.options[torTypeList.selectedIndex].value;
        const tor = new Tournament(id, idModalidade, this.loggedUser, nome, progresso, start_date, pub, torType);
        const xhr = new XMLHttpRequest();
        var player = null;
        var allPlayers = getPlayersArray();
        if(torType == "Individual"){
            for(var i = 0; i < allPlayers.length; i++){
                if(this.getUser().username == allPlayers[i].username){
                    player = allPlayers[i];
                }
            }
            if(player == null){
                player = this.createPlayerForNewUser(this.getUser());
            }
        }
        xhr.responseType = 'json';
        const self = this;
        var idTor = null;
        if (action === 'create') {
            xhr.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    const newTournament = new Tournament(xhr.response.insertId, idModalidade, self.loggedUser, nome, progresso, start_date, pub, torType);
                    self.tournaments.push(newTournament);
                    idTor = xhr.response.insertId;
                }
            }
            xhr.open('POST', '/tournaments');
        } else if (action === 'update') {
            xhr.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    self.tournaments[self.tournaments.findIndex(i => i.id === id)] = tor;
                }
            }
            xhr.open('PUT', '/tournaments/' + id);
        }
        xhr.setRequestHeader('Content-Type', 'application/json');
        var res = JSON.stringify(tor);
        xhr.send(res);
        setTimeout( function(){
            if(torType == "Individual"){
                self.processingPlayerForTor(player, idTor);
            }
            self.showTor();
        }, 150);
    }
}

/**
 * Função que retorna o utilizador logado neste exato momento.
 */
Information.prototype.getUser = function(){
    for(var i = 0; i < this.users.length; i++){
        if(this.users[i].id == this.loggedUser){
            return this.users[i];
        }
    }
}

/**
 * Método que elimina os torneios que são selecionados na checkbox, do seu array e consequentemente base de dados.
 */
Information.prototype.deleteCheckedTournaments = function(){
    for(const row of document.getElementById("torTable").rows){
        const checkBox = row.cells[0].firstChild;
        const idTor = parseInt(row.cells[1].firstChild.nodeValue);
        if (checkBox && checkBox.checked)
            this.removeTournament(idTor);
    }
    this.showTor();
}

/*Players*/

/**
 * Função que mostra o ranking de todos os jogadores no site, com a pontuação total que eles têm em todos os torneios juntos.
 */
Information.prototype.showPlayers = function () {
    openSection("playersRank");
    var tableBody = document.getElementById("playersTable").getElementsByTagName("tbody")[0];
    if(tableBody !== undefined){
        document.getElementById('playersTable').removeChild(tableBody);
    }
    var tbody = document.createElement("tbody");
    document.getElementById("playersTable").appendChild(tbody); 
    const players = getPlayersArray();
    var playersToShow = [];
    for(var i = 0; i < players.length; i++){
        var index = 0;
        for(var p = 0; p < playersToShow.length; p++){
            if(playersToShow[p].username === players[i].username)
                index = i;
        }
        if(index == 0){
            playersToShow.push(players[i]);
            
        }
    }
    for(var i = 0; i < playersToShow.length; i++){
        this.createElemLine(playersToShow[i], "playersTable", this.getAllScoreFromElem(playersToShow[i].id));
    }
};

/*Teams*/

/**
 * Função que mostra o ranking de todas as equipas no site, com a pontuação total que eles têm em todos os torneios juntos.
 */
/*Information.prototype.showTeams = function () {
    openSection("teamsRank");
    var tableBody = document.getElementById("teamsTable").getElementsByTagName("tbody")[0];
    if(tableBody !== undefined){
        document.getElementById('teamsTable').removeChild(tableBody);
    }
    var tbody = document.createElement("tbody");
    document.getElementById("teamsTable").appendChild(tbody); 
    const teams = getTeamsArray();
    var teamsToShow = [];
    var totalScore = [];
    for(var i = 0; i < teams.length; i++){
        totalScore.push(0);
        var index = 0;
        for(var p = 0; p < teamsToShow.length; p++){
            if(teamsToShow[p].name === teams[i].name)
                index = i;
        }
        if(index == 0){
            teamsToShow.push(teams[i]);
            totalScore[i] = teams[i].totalScore;
        } else{
            totalScore[index] += teams[i].totalScore;
        }
    }
    for(var i = 0; i < teamsToShow.length; i++){
        this.createElemLine(teamsToShow[i], "teamsTable", totalScore[i]);
    }
};
*/

/**
 * Função que mostra a informação do torneio em cima da tabela quando se abre a mesma
 * @param {string} divTitleId - id do titulo da divisão
 * @param {string} torId - id do torneio
 * @param {string} torInformation - id da div de informação do torneio
 */
Information.prototype.showTorInfoHeader = function(divTitleId, torId, torInformation){
    var tor = this.getTournament(torId);
    document.getElementById(divTitleId).innerHTML = "Torneio " + torId + " - " + tor.nome;
    var divInfoTor = document.getElementById(torInformation);
    divInfoTor.innerHTML = "";
    divInfoTor.style.margin = "15px";
    var divModalidade = document.createElement("div");
    var lblModalidade = document.createTextNode("Modalidade: other");
    var lblPub = tor.pub == true ? document.createTextNode("  Publico  "):document.createTextNode("  Privado  ");
    var lblType = document.createTextNode(tor.tipo_torneio);
    for(var i = 0; i < this.modalities.length; i++){
        if(this.modalities[i].id === tor.idModalidade){
            lblModalidade = document.createTextNode("Modalidade: " + this.modalities[i].name);
        }
    }
    divModalidade.appendChild(lblModalidade);
    divModalidade.style.display ="flex";
    divModalidade.style.justifyContent = "space-around";
    divInfoTor.appendChild(divModalidade);
    divInfoTor.appendChild(lblPub);
    divInfoTor.appendChild(lblType);
}

/*Tournament players*/

/**
 * Função que cria a tabela dos jogadores do respetivo torneio, que é recebido por parametro.
 * @param {string} torId - id do torneio
 */
Information.prototype.showTorPlayers = function (torId) {
    openSection("torInfoPlayers");
    if(this.loggedUser === 0){
        document.getElementById("divButtonsPlayer").style.display = "none";
    }else{
        document.getElementById("divButtonsPlayer").style.display = "block";
    }
    document.getElementById("idTor").innerHTML = "";
    document.getElementById("torInformation").innerHTML ="";
    this.showTorInfoHeader("idTor", torId,"torInformation");

    var tableBody = document.getElementById("torPlayersTable").getElementsByTagName("tbody")[0];
    if(tableBody !== undefined){
        document.getElementById('torPlayersTable').removeChild(tableBody);
    }
    var tbody = document.createElement("tbody");
    document.getElementById("torPlayersTable").appendChild(tbody);
    var players = this.tournamentPlayers.get(torId);
    for (var i = 0; i < players.length; i++){
        this.createElemLine(players[i], "torPlayersTable");
    }
    document.getElementById("btnGamesPlayer").setAttribute("onclick", "info.showTorGames(" + torId + ")");
};

/**
 * Devolve o torneio, percorrendo o array à procura de um torneio com id igual ao recebido
 * @param {string} torId - id do torneio
 */
Information.prototype.getTournament = function(torId){
    for(var i = 0; i< this.tournaments.length; i++){
        if(this.tournaments[i].id == torId){
            return this.tournaments[i];
        }
    }
    return null;
}

/*Tournament teams*/

/**
 * Função que cria a tabela das equipas do respetivo torneio, que é recebido por parametro.
 * @param {string} torId - id do torneio
 */
Information.prototype.showTorTeams = function (torId) {
    openSection("torInfoTeams");
    if(this.loggedUser === 0){
        document.getElementById("divButtonsTeam").style.display = "none";
    }else{
        document.getElementById("divButtonsTeam").style.display = "block";
    }
    document.getElementById("idTorTeam").innerHTML = "";
    document.getElementById("torInformationTeam").innerHTML ="";
    this.showTorInfoHeader("idTorTeam", torId,"torInformationTeam");

    var tableBody = document.getElementById("torTeamsTable").getElementsByTagName("tbody")[0];
    if(tableBody !== undefined){
        document.getElementById('torTeamsTable').removeChild(tableBody);
    }
    var tbody = document.createElement("tbody");
    document.getElementById("torTeamsTable").appendChild(tbody);
    var teams = this.tournamentTeams.get(torId);
    if(teams){
        for (var i = 0; i < teams.length; i++){
            this.createElemLine(teams[i], "torTeamsTable");
        }
    }
    document.getElementById("btnGamesTeam").setAttribute("onclick", "info.showTorGames(" + torId + ")");
};

 /**
 * Função que cria uma linha na tabela dos jogadores/equipas com a informação toda respetiva ao mesmo elemento.
 * @param {Player/Team} element - Elemento que tanto pode ser equipa ou jogador que vai ser criada a linha.
 * @param {string} tableId - id da tabela a alterar
 * @param {int} totalScore - pontuação do elemento
 */
Information.prototype.createElemLine = function(element, tableId,totalScore){
    var tableBody = document.getElementById(tableId).getElementsByTagName("tbody")[0];
    var tableRow = document.createElement("tr");

    var id = 0;
    const idTor = parseInt(document.getElementById("idTor").innerHTML.split(" ")[1]);
    const idTorTeam = parseInt(document.getElementById("idTorTeam").innerHTML.split(" ")[1]);
    if(isNaN(idTor)){
        id = idTorTeam;
    } else {
        id = idTor;
    }

    if(tableId === "torPlayersTable" || tableId === "torTeamsTable"){
        var cellCheck = document.createElement("td");
        var check = document.createElement("INPUT");
        check.setAttribute("type", "checkbox");
        cellCheck.appendChild(check);
        tableRow.appendChild(cellCheck);
    }

    var cellIdPlayer = document.createElement("td");
    var textIdPlayer = document.createTextNode(element.id);
    cellIdPlayer.appendChild(textIdPlayer);
    tableRow.appendChild(cellIdPlayer);

    var cellName = document.createElement("td");
    var textName = document.createTextNode("");
    if(element instanceof Player){
        textName = document.createTextNode(element.username);
    } else if(element instanceof Team){
        textName = document.createTextNode(element.name);
    }
    cellName.appendChild(textName);
    tableRow.appendChild(cellName);

    var score = 0;
    var cellScore = document.createElement("td");
    var textScore = document.createTextNode("");
    if(arguments.length === 3){
        score = totalScore;
    }
    else{
        var score = this.getScoreElemFromTor(element.id , id);
    }
    
    textScore = document.createTextNode(score);
    
    cellScore.appendChild(textScore);
    tableRow.appendChild(cellScore);

    if(element instanceof Player){
        var birthDate = null;
        for(var i = 0; i < this.users.length; i++){
            if(this.users[i].username == element.username){
                birthDate = this. users[i].birth_date;
            }
        }
        var cellAge = document.createElement("td");
        var textAge = document.createTextNode(" --- ");
        if(birthDate !== null){
            currentDate = new Date();
            var today = new Date();
            var b = new Date(birthDate);
            var age = today.getFullYear() - b.getFullYear();
            var m = today.getMonth() - b.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < b.getDate())) {
                age--;
            }
            textAge = document.createTextNode(age);
        }
        cellAge.appendChild(textAge);
        tableRow.appendChild(cellAge);

        var cellRegister = document.createElement("td");
        var textRegister = document.createElement("p");
        if(birthDate !== null){
        var textRegister = document.createElement("p");
            textRegister.innerHTML = "Registado";
            textRegister.style.color = "green";
        } else {
            textRegister.innerHTML = "Não Registado";
            textRegister.style.color = "red";
        }
        cellRegister.appendChild(textRegister);
        tableRow.appendChild(cellRegister);
    }

    tableBody.appendChild(tableRow);
}

/**
 * Função que cria o objeto do jogador, e em seguida faz o POST do mesmo com um pedido json.
 * Em seguida ao POST é chamada a função que adiciona o jogador ao torneio.
 */
Information.prototype.processingPlayer = function () {
    const self = this;
    const nome = document.getElementById('playerName').value;
    const players = getPlayersArray();
    var p = null;
    for(var i = 0; i < players.length; i++){
        if(players[i].username == nome)
            p = players[i];
    }
    if(!p){
        var newPlayer = new Player(1, nome, 0);
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                newPlayer.id = xhr.response.insertId;
            }
        }
        xhr.open('POST', '/players');
        xhr.setRequestHeader('Content-Type', 'application/json');
        var res = JSON.stringify(newPlayer);
        xhr.send(res);
        setTimeout( function(){
            self.processingPlayerForTor(newPlayer);
        }, 150);
    }else{
        self.processingPlayerForTor(p);
    }
}

/**
 * Função que cria o objeto da equipa, e em seguida faz o POST da mesma com um pedido json.
 * Em seguida ao POST é chamada a função que adiciona a equipa ao torneio.
 */
Information.prototype.processingTeam = function () {
    const self = this;
    const nome = document.getElementById('teamName').value;
    const teams = getTeamsArray();
    var p = null;
    for(var i = 0; i < teams.length; i++){
        if(teams[i].username == nome)
            p = teams[i];
    }
    if(!p){
        var newTeam = new Team(1, nome, 0);
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                newTeam.id = xhr.response.insertId;
            }
        }
        xhr.open('POST', '/teams');
        xhr.setRequestHeader('Content-Type', 'application/json');
        var res = JSON.stringify(newTeam);
        xhr.send(res);
        setTimeout( function(){
            self.processingTeamForTor(newTeam);
        }, 150);
    }else{
        self.processingTeamForTor(p);
    }
}

/**
 * Função que ao receber o objeto jogador, adiciona-o ao torneio e faz o POST do mesmo com um pedido json.
 * @param {Player} player - jogador
 * @param {string} id - id do torneio 
 */
Information.prototype.processingPlayerForTor = function(player, id){
    function idClass(){ this.idJogador = player.id; }
    var idTor = null;
    if(id){
        idTor = id;
    } else{
        idTor = parseInt(document.getElementById("idTor").innerHTML.split(" ")[1]);
    }
    this.getTournamentPlayer(idTor);
    const torPlayers = this.tournamentPlayers.get(idTor);
    var hasPlayer = false;
    const self = this;
    setTimeout( function(){
        for(var i = 0; i < torPlayers.length; i++){
            if(torPlayers[i].username == player.username){
                hasPlayer = true;
            }
        }
        if(hasPlayer == false){
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    self.tournamentPlayers.get(idTor).push(player);
                }
            }
            xhr.open('POST', '/tournaments/' + idTor + '/players');
            xhr.setRequestHeader('Content-Type', 'application/json');
            var res = JSON.stringify(new idClass());
            xhr.send(res);
            setTimeout( function(){
                info.showTorPlayers(idTor);
            }, 200);
        }else{
            showAlert("O jogador já existe no torneio!");
        }
    }, 200);
}

/**
 * Função que ao receber o objeto equipa, adiciona-o ao torneio e faz o POST do mesmo com um pedido json.
 * @param {Player} team - equipa
 * @param {string} id - id do torneio 
 */
Information.prototype.processingTeamForTor = function(team, id){
    function idClass(){ this.idEquipa = team.id; }
    var idTor = null;
    if(id){
        idTor = id;
    } else{
        idTor = parseInt(document.getElementById("idTor").innerHTML.split(" ")[1]);
    }
    this.getTournamentTeam(idTor);
    const torTeams = this.tournamentTeams.get(idTor);
    if(torTeams == null){
        this.tournamentTeams.set(idTor, [])
    }
    var hasTeam = false;
    const self = this;
    setTimeout( function(){
        for(var i = 0; i < torTeams.length; i++){
            if(torTeams[i].name == team.name){
                hasTeam = true;
            }
        }
        if(hasTeam == false){
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    self.tournamentTeams.get(idTor).push(team);
                }
            }
            xhr.open('POST', '/tournaments/' + idTor + '/teams');
            xhr.setRequestHeader('Content-Type', 'application/json');
            var res = JSON.stringify(new idClass());
            xhr.send(res);
            setTimeout( function(){
                info.showTorTeams(idTor);
            }, 200);
        }else{
            showAlert("A equipa já existe no torneio!");
        }
    }, 200);
}

/**
 * Função que elimina os jogadores que são selecionados na checkbox, do seu array e consequentemente base de dados.
 */
Information.prototype.deleteCheckedPlayers = function(){
    const idTor = parseInt(document.getElementById("idTor").innerHTML.split(" ")[1]);
    for(const row of document.getElementById("torPlayersTable").rows){
        const checkBox = row.cells[0].firstChild;
        const idPlayer = parseInt(row.cells[1].firstChild.nodeValue);
        if (checkBox && checkBox.checked)
            this.removePlayer(idTor, idPlayer);
    }
    const self = this;
    setTimeout( function(){
        self.showTorPlayers(idTor);
    }, 100);
}

/**
 * Função que elimina as equipas que são selecionados na checkbox, do seu array e consequentemente base de dados.
 */
Information.prototype.deleteCheckedTeams = function(){
    const idTor = parseInt(document.getElementById("idTor").innerHTML.split(" ")[1]);
    for(const row of document.getElementById("torTeamsTable").rows){
        const checkBox = row.cells[0].firstChild;
        const idTeam = parseInt(row.cells[1].firstChild.nodeValue);
        if (checkBox && checkBox.checked)
            this.removeTeam(idTor, idTeam);
    }
    const self = this;
    setTimeout( function(){
        self.showTorTeams(idTor);
    }, 100);
}

/**
 * Função que ao receber um utilizador , cria um jogador com os dados do mesmo e faz POST para os /players.
 * @param {User} user - utilizador
 */
Information.prototype.createPlayerForNewUser = function(user){
    var newPlayer = new Player(1, user.username, 0);
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            newPlayer.id = xhr.response.insertId;
        }
    }
    xhr.open('POST', '/players');
    xhr.setRequestHeader('Content-Type', 'application/json');
    var res = JSON.stringify(newPlayer);
    xhr.send(res);
    return newPlayer;
}

/* Tournament Games*/

/**
 * Função que devolve todos os jogos existentes na classe informação.
 */
Information.prototype.getAllGames = function(){
    const self = this;
    setTimeout(function() {
        for(var i = 0; i < self.tournaments.length; i++){
            self.getTournamentGames(self.tournaments[i].id);
        }
    }, 1000);
}

/**
 * Função que devolve todos os jogos de um respetivo torneio recebido por parâmetros.
 * @param {string} idTor - id do torneio
 */
Information.prototype.getTournamentGames = function (idTor) {
    const xhr = new XMLHttpRequest();
    const self = this;
    xhr.responseType = 'json';
    xhr.open("GET", "/tournaments/" + idTor + "/games");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            this.response.torGames.forEach(t => {
                const game = new Game(t.idJogo, t.idTorneio, t.game_datetime,t.location, t.id1, t.score1, t.id2, t.score2);
                self.games.push(game);
            });
        }
    };
    xhr.send();
};

/**
 * Função que remove um jogo do array de jogos num torneio, ao pedido de um json-request.
 * @param {int} idTor - Id de um torneio 
 * @param {int} idGame - id de um jogo
 */
Information.prototype.removeGame = function (idGame, idTor) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/tournaments/' + idTor + '/games/' + idGame);
    const self = this;
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            self.games.splice(self.games.findIndex(i => i.id == idGame), 1);
            info.showTorGames(idTor);
        }
    };
    xhr.send();
}

/**
 * Função que cria o objeto do jogo, e em seguida faz o POST do mesmo com um pedido json.
 */
Information.prototype.processingGame = function(){
    var hasGame = false;
    const idTor = parseInt(document.getElementById("idTor").innerHTML.split(" ")[1]);
    const date = document.getElementById("game_date").value;
    const location = document.getElementById("location").value;
    const elem1List = document.getElementById('element1');
    const elem1 = elem1List.options[elem1List.selectedIndex].value;
    const score1 = parseInt(document.getElementById("score1").value);
    const elem2List = document.getElementById('element2');
    const elem2 = elem2List.options[elem2List.selectedIndex].value;
    const score2 = parseInt(document.getElementById("score2").value);
    var id1 = 0, id2 = 0;
    const players = getPlayersArray();
    for(var i = 0; i < players.length; i++){
        if(players[i].username == elem1){
            id1 = players[i].id;
        }
        if(players[i].username == elem2){
            id2 = players[i].id;
        }
    }
    var dateAux = new Date(date);
    if(id1 === id2){
        showAlert("Inseriu dois elementos iguais!");
    } else if(idTor == null || date === "" || location == null || score1 == null || score2 == null){
        showAlert("Um dos campos está vazio!");
    } else{
        var game = new Game(1, idTor, date, location, id1, score1, id2, score2);
        const self = this;
        for(var i = 0; i < this.games.length; i++){
            if(this.games[i].id1 == game.id1 && this.games[i].id2 == game.id2 && this.games[i].game_datetime == game.game_datetime){
                hasGame = true;
            }
        }
        if(hasGame == false){
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    game.id = xhr.response.insertId;
                    self.games.push(game);
                }
            }
            xhr.open('POST', '/tournaments/' + idTor + '/games');
            xhr.setRequestHeader('Content-Type', 'application/json');
            var res = JSON.stringify(game);
            xhr.send(res);
            setTimeout( function(){
                self.showTorGames(idTor);
            }, 200);
        }else{
            showAlert("Já existe um jogo entre estas equipas para a mesma data!");
        }
    }
}

/**
 * Função que cria a tabela dos jogos do respetivo torneio, que é recebido por parametro.
 * @param {string} torId - id do torneio
 */
Information.prototype.showTorGames = function(idTor){
    openSection("torGames");

    this.showTorInfoHeader("idTorGames", idTor, "torInformationGames");

    if(this.loggedUser === 0){
        document.getElementById("divButtonsGame").style.display = "none";
    }else{
        document.getElementById("divButtonsGame").style.display = "block";
    }
    
    var tableBody = document.getElementById("torGamesTable").getElementsByTagName("tbody")[0];
    if(tableBody !== undefined){
        document.getElementById('torGamesTable').removeChild(tableBody);
    }
    var tbody = document.createElement("tbody");
    document.getElementById("torGamesTable").appendChild(tbody);
    for(var i = 0; i < this.games.length; i++){
        console.log(this.games[i].idTorneio + " - " + idTor);
        if(this.games[i].idTorneio === idTor)
            this.createGameLine(this.games[i]);
    }
}

/**
 * Função que cria uma linha da tabela de jogos, com as informações do jogo recebido por parametros.
 * @param {Torneio} game - jogo a criar a linha.
 */
Information.prototype.createGameLine = function(game){
    var tableBody = document.getElementById("torGamesTable").getElementsByTagName("tbody")[0];
    var tableRow = document.createElement("tr");

    var cellCheck = document.createElement("td");
    var check = document.createElement("INPUT");
    check.setAttribute("type", "checkbox");
    cellCheck.appendChild(check);
    tableRow.appendChild(cellCheck);

    var cellIdJogo = document.createElement("td");
    var textIdJogo = document.createTextNode(game.id);
    cellIdJogo.appendChild(textIdJogo);
    tableRow.appendChild(cellIdJogo);
    
    
    var gameDate = new Date(game.game_datetime);
    var date = gameDate.getFullYear() + "/" +(gameDate.getMonth()+1) + "/" +gameDate.getDate() + "  "+gameDate.getHours()+":";
    if(gameDate.getMinutes() < 10){
        date += "0"+gameDate.getMinutes();
    } else{
        date += gameDate.getMinutes();
    }
    var cellDate = document.createElement("td");
    var textDate = document.createTextNode(date);
    cellDate.appendChild(textDate);
    tableRow.appendChild(cellDate);

    var cellLocation = document.createElement("td");
    var textLocation = document.createTextNode(game.location);
    cellLocation.appendChild(textLocation);
    tableRow.appendChild(cellLocation);

    var textElement1 = document.createTextNode("");
    var textElement2 = document.createTextNode("");
    var players = getPlayersArray(); 
    for(var i = 0; i < players.length; i++){
        if(game.id1 == players[i].id){
            textElement1 = document.createTextNode(players[i].username);
        }
        if(game.id2 == players[i].id){
            textElement2 = document.createTextNode(players[i].username);
        }
    }

    var cellElement1 = document.createElement("td");
    cellElement1.appendChild(textElement1);
    tableRow.appendChild(cellElement1);
    
    var cellScore1 = document.createElement("td");
    var textScore1 = document.createTextNode(game.score1);
    cellScore1.appendChild(textScore1);
    tableRow.appendChild(cellScore1);
    
    var cellEmpty = document.createElement("td");
    var textEmpty = document.createTextNode(" - ");
    cellEmpty.appendChild(textEmpty);
    tableRow.appendChild(cellEmpty);

    var cellElement2 = document.createElement("td");
    cellElement2.appendChild(textElement2);
    tableRow.appendChild(cellElement2);
    
    var cellScore2 = document.createElement("td");
    var textScore2 = document.createTextNode(game.score2);
    cellScore2.appendChild(textScore2);
    tableRow.appendChild(cellScore2);

    tableBody.appendChild(tableRow);
}

/**
 * Função que elimina os jogos que são selecionados na checkbox, do seu array e consequentemente base de dados.
 */
Information.prototype.deleteCheckedGames = function(){
    const idTor = parseInt(document.getElementById("idTor").innerHTML.split(" ")[1]);
    for(const row of document.getElementById("torGamesTable").rows){
        const checkBox = row.cells[0].firstChild;
        const idGame = parseInt(row.cells[1].firstChild.nodeValue);
        if (checkBox && checkBox.checked)
            this.removeGame(idGame, idTor);
    }
    this.showTorGames(idTor);
}

/**
 * Função que popula as options dos elementos ao criar um jogo, com os jogadores que estão no respetivo torneio
 */
Information.prototype.loadPlayers = function(){
    var id = 0;
    const idTor = parseInt(document.getElementById("idTor").innerHTML.split(" ")[1]);
    const idTorTeam = parseInt(document.getElementById("idTorTeam").innerHTML.split(" ")[1]);
    if(isNaN(idTor)){
        id = idTorTeam;
    } else {
        id = idTor;
    }
    const self = this;
    setTimeout(function(){
        var select1 = document.getElementById("element1");
        var select2 = document.getElementById("element2");
        var elems = [];
        if(self.getTournament(id).tipo_torneio == "Individual"){
            elems = self.tournamentPlayers.get(id);
        }else{
            elems = self.tournamentTeams.get(id);
        }
        for(var i = 0; i < elems.length; i++){
            var option = elems[i];
            var el = document.createElement("option");
            var el1 = document.createElement("option");
            if(self.getTournament(id).tipo_torneio == "Individual"){
                el.value = option.username;
                el.textContent = option.username;
                el1.value = option.username;
                el1.textContent = option.username;
            }else{
                el.value = option.name;
                el.textContent = option.name;
                el1.value = option.name;
                el1.textContent = option.name;
            }
            select1.appendChild(el);
            select2.appendChild(el1);
        }
    }, 150);
    
};

/* Login */

/**
 * Função que cria o objeto do utilizador, e em seguida faz o POST do mesmo com um pedido json.
 */
Information.prototype.processingNewUser = function(action){
    const id = 1;
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('email').value;
    const d = new Date(document.getElementById('date').value);
    const birthDate = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate();
    const pw = document.getElementById('registerPassword').value;
    const user = new User(id, username, email, birthDate, pw);
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    const self = this;
    if (action === 'create') {
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                self.loggedUser = xhr.response.insertId;
                user.id = xhr.response.insertId;
                self.users.push(user);
                setLoggedInNav();
            }
        }
        xhr.open('POST', '/users');
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    var res = JSON.stringify(user);
    xhr.send(res);
}

/**
 * Função que verifica se o utilizador e password recebido no formulário existem na base de dados.
 * Se existir muda a variavel para se saber qual o utilizador logado.
 */
Information.prototype.processingLogin = function(){
    const username = document.getElementById("username").value;
    const pw = document.getElementById("password").value;
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', '/users');
    const self = this;
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            var correct = false;
            this.response.users.forEach(t => {
                if(t.username == username && t.pw == pw){
                    self.loggedUser = t.idUtilizador; 
                    correct = true;
                }
            });
            if(correct === true){
                setLoggedInNav();
            } else {
                showAlert("Credenciais erradas!");
            }
        }
    }
    xhr.send();
}

/**
 * Função que mostra as opções de ir ao perfil e de dar log out e esconde a opção de dar login e registar.
 */
function setLoggedInNav(){
    document.getElementById("loggedOut").style.display = "none";
    document.getElementById("loggedOut1").style.display = "none";
    
    document.getElementById("loggedIn").style.display = "block";
    document.getElementById("loggedIn1").style.display = "block";
}

/**
 * Função que mostra as opções de dar login e registar e esconde a opção de ir ao perfil e de dar log out .
 */
function setLoggedoutNav(){
    info.loggedUser = 0;
    document.getElementById("loggedOut").style.display = "block";
    document.getElementById("loggedOut1").style.display = "block";
    
    document.getElementById("loggedIn").style.display = "none";
    document.getElementById("loggedIn1").style.display = "none";
}

/**
 * Função que mostra o perfil do utilizador logado.
 */
Information.prototype.showProfileSection = function(){
    openSection('profile');
    for(var i = 0; i < this.users.length; i++){
        if(this.loggedUser == this.users[i].id){
            document.getElementById('profileId').innerHTML = this.users[i].id;
            document.getElementById('profileUsername').innerHTML = this.users[i].username;
            document.getElementById('profileEmail').innerHTML = this.users[i].email;
            document.getElementById('profileDate').innerHTML = this.users[i].birth_date;
            document.getElementById('profileScore').innerHTML = this.users[i].totalScore;
        }
    }
}

/**
 * Função que devolve todos os jogadores de um certo torneio
 * @param {string} idTor - id do torneio
 */
Information.prototype.getAllGamesFromTor = function(idTor){
    var gamesArray = [];
    for(var i = 0; i < this.games.length; i++){
        if(this.games[i].idTorneio == idTor){
            gamesArray.push(this.games[i]);
        }
    }
    return gamesArray;
}

/**
 * Função que devolve a pontuação de um elemento num certo torneio
 * @param {string} idElem - id do elemento
 * @param {string} idTor - id do torneio
 */
Information.prototype.getScoreElemFromTor = function(idElem, idTor){
    var gamesArray = this.getAllGamesFromTor(idTor);
    console.log("jogos - "+gamesArray);
    var totalScore = 0;
    for(var i = 0; i < gamesArray.length; i++){
        if(gamesArray[i].id1 == idElem){
            totalScore+= gamesArray[i].score1;
        }
        if(gamesArray[i].id2 == idElem){
            totalScore+= gamesArray[i].score2;
        }
    }
    return totalScore;
}

/**
 * Função que devolve toda a pontuação de um certo elemento
 * @param {string} idElem - id do elemento
 */
Information.prototype.getAllScoreFromElem = function(idElem){
    var totalScore = 0;
    for(var i = 0; i < this.tournaments.length ; i++){
        totalScore += this.getScoreElemFromTor(idElem,this.tournaments[i].id);
    }
    return totalScore;
}

/**
 * Função que devolve todo o progresso de um certo torneio.
 * @param {string} idTor - id do torneio
 */
Information.prototype.getProgressFromTor = function(idTor){
    var allGames = this.getAllGamesFromTor(idTor);
    if(allGames.length === 0){
        return 0;
    }
    var actualDate = new Date();
    var doneGames = 0;
    console.log("Torneio nr "+idTor+" Games length "+allGames.length);
    for(var i= 0; i < allGames.length; i++){
        console.log("Data atual : "+actualDate);
        console.log("Data jogo : "+new Date(allGames[i].game_datetime));
        if(actualDate > new Date(allGames[i].game_datetime)){
            doneGames++;
        }
    }
    console.log("Jogos feitos "+doneGames);
    console.log("Progresso " +doneGames/allGames.length);
    return Math.round((doneGames/allGames.length)*100 * 100) / 100;
}

/**
 * Função que mostra a divisão de alertas com a mensagem escolhida e depois de 3 segundos, fecha a mesma.
 * @param {string} mensagem - mensagem a mostrar no alerta
 */
function showAlert(mensagem){
    openAlert();
    document.getElementById("alert").innerHTML = mensagem;
    setTimeout(function(){
        closeAlert();
    }, 3000);
}

/**
 * Abre o alerta
 */
function openAlert(){
    document.getElementById("alert").style.display = "block";
}

/**
 * Fecha o alerta
 */
function closeAlert(){
    document.getElementById("alert").style.display = "none";
}

//Começa e carrega toda a informação.
const info = new Information();
info.getUsers();
info.getTournaments();
info.getAllPlayers();
info.getAllTeams();
info.getAllGames();
info.getModalities();