"use strict";

const express = require("express");
let server = express();
server.use(express.static("public"));

const http = require("http");
let httpServer = http.Server(server);

const socketIo = require("socket.io");
let io = socketIo(httpServer);

// VARIABLEN
let angemeldeteSpieler = [];
var clients = [];

// KLASSEN
class Spieler {
  constructor(id, name = "") {
    this.id = id;
    this.name = name;
  }
}

// WEBSOCKET

// Auf Verbindungsaufbau warten
io.on("connection", (socket) => {
  console.log("Neue Verbindung: ", socket.id);
  socket.on("disconnect", (data) => {
    for (var i = 0, len = clients.length; i < len; ++i) {
      var c = clients[i];
      var j = 0;
      if (clients[i].socket.id == socket.id) {
        if (i == 0) j = 1;
        if (clients[j].socket.id != socket.id) {
          clients[j].socket.emit(
            "uups",
            JSON.stringify("Gegner ist weg, Spiel ist beendet"),
          );
        }

        clients.splice(0, 2);

        console.log("Spiel ist beendet");

        break;
      }
    }
  });
  socket.on("init", (dataStr) => {
    const data = JSON.parse(dataStr); //becommen data von client
    console.log("Got data: " + dataStr);

    var clientInfo = {
      nickName: data.nickName,
      socket: socket,
    };
    if (clients.length < 2) {
      console.log(clients.length);
      clients.push(clientInfo);
    } else {
      console.log("Spielabsage");

      clientInfo.socket.emit("absage", JSON.stringify(`Spiel ist unmöglich`));
    }
    if (clients.length == 1) {
      clients[0].socket.emit(
        "wart",
        JSON.stringify("warten Sie bitte ihre Gegner"),
      ); // THIS DOESNOT
    }

    clients.forEach((el, i) => {
      console.log(i + " Client: " + el.socket.id);
    });
    if (clients.length == 2) {
      clients[0].socket.emit("myQuery", JSON.stringify(false));
      clients[1].socket.emit("myQuery", JSON.stringify(true));
    }

    // socket.emit('nachricht', JSON.stringify(`Hallo ${data.nickName}`));
  });

  socket.on("schuss", (daten) => {
    //обстрел

    console.log(JSON.parse(daten));

    console.log("bomba_absender: " + socket.id); //узнаем id клиента отправившего бомбу

    for (var element of clients) {
      if (element.socket.id != socket.id) {
        //узнаем id клиента ожидающего бомбу

        console.log("bomba_adressat :" + element.socket.id);
        element.socket.emit("bomba", daten); //отправка бомбы
      } else {
      }
    }
  });

  socket.on("antwort", (rez) => {
    console.log(JSON.parse(rez));
    for (var element of clients) {
      if (element.socket.id != socket.id) {
        //узнаем id клиента ожидающего ответ

        console.log("antwort_adressat :" + element.socket.id);
        element.socket.emit("resultat", rez); //отправка ответа
      }
    }
  });

  socket.on("endeSpiel", (data) => {
    clients.splice(0, 2);
  });
  /*
    socket.on('antwort', rez=>{// результат обстрела
        for (var element of clients){
            if(element.socket.id != socket.id){//узнаем id клиента ожидающего ответ
                console.log('antwort_adressat :' + element.socket.id);
                element.socket.emit('resultat', rez);//sendung result des Schlag
               
            }
        }           
    })*/
});

// FUNKTIONEN
const zufallErzeugen = (min = 0, max = 100) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const updateClients = () => {};

// Interval, der alle Informationen an alle verbundenen Spieler sendet
//setInterval ( updateClients, 30 );// отправка информации должна происходить по клику на кнопку

// WEBSERVER
httpServer.listen(8080, () => {
  console.log("Server Läuft");
});

/*


 socket.on('disconnect', data => {
        for (var i = 0, len = clients.length; i < len; ++i) {
            var c = clients[i];

            if (c.clientId == socket.id) {
                clients.splice(i, 1);
                break;
            }
        }
    });
*/
