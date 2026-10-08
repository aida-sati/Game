'use strict';
// import { startSpiel } from './seeschlach.js';
console.log( 'Startspiel: ' + startSpiel );

//const seeschlach = require('./seeschlach');

// VARIABLEN

var socket = io.connect();
var spielerName = "";
var Coordinaten = class {
    constructor(x, y, flag = false) {
        this.x = x;
        this.y = y;
        this.flag = flag;
    }

}
var Spieler = class {
    constructor(id, name, Coor) {
        this.id = id;
        this.name = name;
        this.Сoordinaten = Object.assign(Object.create(Object.getPrototypeOf(Coor
        )), Coor);

        
    }
}
/*while(spielerName == ''){
    spielerName = prompt('Wie heißen Sie?');

}*/


spielerName = 'test' + new Date();
console.log('Simulate name ' + spielerName);

// WEBSOCKET

const init = ()=>{

socket.on ( 'absage', daten => {
    console.log('Spiel absage');
    var absage = document.querySelector('#begrüss');
        absage.innerHTML =  JSON.parse ( daten );
   
});


socket.on ( 'wart', daten => {
    var begruess = document.querySelector('#begrüss');
        begruess.innerHTML =  JSON.parse ( daten );
   
});

socket.on ( 'uups', daten => {
    console.log('Spiel absage');
    var absage = document.querySelector('#begrüss');
        absage.innerHTML =  JSON.parse ( daten );
   
});

/*socket.on ( 'nachricht', daten => {
    var begruess = document.querySelector('#begrüss');
        begruess.innerHTML =  JSON.parse ( daten );
   
});*/
socket.emit ( 'init', JSON.stringify ( {nickName: spielerName} ) );
socket.on('myQuery', data => {
    console.log('Got new message (testMsg): ' + data);
    myQuery = JSON.parse(data);
    console.log('myQuery (testMsg): ' + data);
    if(JSON.parse(data)){
        document.getElementById('meinInfo').innerHTML ='Ihren Schritt';
    }else{
        document.getElementById('meinInfo').innerHTML ='Gegner Schritt';
    }
    var begruess = document.querySelector('#begrüss');
        begruess.innerHTML =  'Geit\'s los';
});

}
/*
document.addEventListener("DOMContentLoaded", function(event) {  
});
console.log("DOM fully loaded and parsed");*/
