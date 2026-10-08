'use strict';

var container;
var feindFeld;
var spielM;
var spielF;
var Flotte = [];

var begX;
var begY;
var el = [];
var stellung = true;//true -horizintal Schiffstellung / false- vertical Schiffstellung
var deckCount;//убери инициализацию потом
var countD4 = 1;
var countD3 = 2;
var countD2 = 3;
var countD1 = 4;
var startSpiel = false;
var endSpiel = false;
var myQuery;

////////////////-----------FLOTTE--------------///////////////


class Schiff {
	constructor(leben = true, ...el) {
		this.leben = leben;
		this.el = el[0];//array  dom-elementen div

	}

}




window.onload = () => {
	//Dom-Elemente
	container = document.getElementById('container');
	feindFeld = document.getElementById('feindFeld');
	spielM = document.getElementById('spielM');
	spielF = document.getElementById('spielF');


	document.getElementById('counterD4').innerHTML = countD4; //VierDeckschiff
	document.getElementById('counterD3').innerHTML = countD3;
	document.getElementById('counterD2').innerHTML = countD2;
	document.getElementById('counterD1').innerHTML = countD1;




	feldMConstructor(spielM); //malen mein Spielfeld
	feldFConstructor(spielF); //malen Spielfeld des Feind

	//--------------Wahlen beginnElement für neues Schiff-----------------------	
	schiffBeginnElement();
	//------------------------Schiff bauen wenn passenden Butten drücken-------------------

	var vier = document.getElementById('vierD');
	var drei = document.getElementById('dreiD');
	var zwei = document.getElementById('zweiD');
	var ein = document.getElementById('einD');

	var neuStart = document.getElementById('spielRestart');

	/**Bauen Flotte */
	neuSpiel(neuStart);
	neuSchiff(vier);
	neuSchiff(drei);
	neuSchiff(zwei);
	neuSchiff(ein);
	

	myAngriff();//Machen wir Angriff

	feindAngriff(); //Angriff des Gegner

	
}






/*------------------------------------------------------------------ */
//FUNKTIONEN//////////FUNKTIONEN/////////////FUNKTIONEN//////////FUNKTIONEN
/*------------------------------------------------------------------ */

const neuSpiel = (neuStart) => { ///Neues Spiel startet
	neuStart.onclick = (event) => {

		var event = window.event;


		endSpiel = false;
		countD4 = 1;
		countD3 = 2;
		countD2 = 3;
		countD1 = 4;
		Flotte = [];
		document.getElementById('counterD4').innerHTML = countD4; //VierDeckschiff
		document.getElementById('counterD3').innerHTML = countD3;
		document.getElementById('counterD2').innerHTML = countD2;
		document.getElementById('counterD1').innerHTML = countD1;
		document.getElementById('meinInfo').innerHTML = 'neu Spiel';


		document.getElementById('vierD').disabled = false;
		document.getElementById('dreiD').disabled = false;
		document.getElementById('zweiD').disabled = false;
		document.getElementById('einD').disabled = false;

		var punktF = document.getElementsByClassName('punktF');
		for (var element of punktF) {

			if (element.classList.contains('besetzt')) {
				element.classList.remove('besetzt');
			}
			if (element.classList.contains('verletzt')) {
				element.classList.remove('verletzt');
			}
			if (element.classList.contains('vorbei')) {
				element.classList.remove('vorbei');
			}
		}

		var punktM = document.getElementsByClassName('punktM');
		for (var element of punktM) {

			if (element.classList.contains('besetzt')) {
				element.classList.remove('besetzt');
			}
			if (element.classList.contains('verletzt')) {
				element.classList.remove('verletzt');
			}
			if (element.classList.contains('vorbei')) {
				element.classList.remove('vorbei');
			}
		}
	}
}






const myAngriff = () => {
	var punktF = document.getElementsByClassName('punktF');
	var tempElement;

	for (var element of punktF) {
		tempElement = 0;
		element.onclick = (event) => {


			//var event = window.event;
			var currElement = event.srcElement || event.target;
			if (event && (endSpiel == false)) {/////test
				tempElement = currElement;
				if (myQuery == true) {
					//myQuery = false;
					var x = currElement.getAttribute('posX');
					var y = currElement.getAttribute('posY');
					let daten = {
						posX: x,
						posY: y
					};
					console.log('Ziel - corX: ' + x + '; corY: ' + y);
					socket.emit('schuss', JSON.stringify(daten));//schiken koordinaten des Zieles
					socket.on('resultat', result => {
						var res = JSON.parse(result);
						console.log(result);

						//currElement.classList.add(res);
						//console.log('test element' + tempElement);


						if (res == 'verletzt') {
							tempElement.classList.add(res);
							myQuery = true;
							document.getElementById('meinInfo').innerHTML = 'Ihren Schritt';
							console.log('Resultat des Angriff: ' + res + ' ' + myQuery);
						} else if (res == 'winn') {
							tempElement.classList.add('verletzt');
							myQuery = false;
							endSpiel = true;
							document.getElementById('meinInfo').innerHTML = 'Herzlich Glückwunsch!!! Sie sind Winner!';


						} else {
							tempElement.classList.add(res);
							myQuery = false;
							document.getElementById('meinInfo').innerHTML = 'Vorbei! Gegner schlägt!';
							console.log('Resultat des Angriff: ' + res + ' ' + myQuery);

						}

					})
				} else {
					console.log('Warten Sie bitte! Gegner schlägt!');
					document.getElementById('meinInfo').innerHTML = 'Warten Sie bitte! Gegner schlägt!';
				}


			}

		}
	}
}

/**---------------------------------------------------------------------- */
/**------------------FeindAngriff---------------------------------------------------- */

const feindAngriff = () => {


	socket.on('bomba', bomba => {

		console.log(JSON.parse(bomba)); //bekommen wir coordienaten Feindschlag
		var bam = JSON.parse(bomba);
		console.log('X ' + bam.posX + ' Y: ' + bam.posY);
		if (zielTest(bam.posX, bam.posY) == true) {
			console.log('result:my schiff verletzt');
			console.log('x y ' + bam.posX + ' ' + bam.posY);
			document.getElementById('meinInfo').innerHTML = 'Gegner schiesst vorbei; Ihren Schritt';

			var res = flottePrüfung(bam.posX, bam.posY);//suchen verleztes Schiff und prüfen wir ob es  versunken ist, FLotte test
			console.log('mein Zustand');
			if (res == 2) {
				socket.emit('antwort', JSON.stringify('verletzt'));
			}
			else if (res == 0) {
				socket.emit('antwort', JSON.stringify('winn'));//WINN
				document.getElementById('meinInfo').innerHTML = 'Schade! Sie haben verloren!';

				endSpiel = true;
				socket.emit('endeSpiel', JSON.stringify('true'));/////TEST es geht/////////////////////////////////////////////////////////
			} else {
				socket.emit('antwort', JSON.stringify('verletzt'));//schiff verloren
			}
			myQuery = false; //необязательно

		} else {
			document.getElementById('meinInfo').innerHTML = 'Gegner schiesst vorbei; Ihren Schritt';
			console.log('result: Gegnerschuss geht vorbai, jetzt ist mein Schritt!');
			myQuery = true; //переход хода
			socket.emit('antwort', JSON.stringify('vorbei'));
		}
	})

}


/**--------------------------------Feind Angriff------------------------------------------------------- */








/**------------------Ziel Uberprüfung------------------------------ */





const zielTest = (x, y) => {//занят ли этот элемент кораблем

	var el = document.querySelector(`[posX = "${x}"][posY = "${y}"]`);
	/* if (el.classList.contains('verlezt')) {
		 //проверка что элемент подбит лучше на клиенте который наносит удар 
	 }*/
	if (el.classList.contains('besetzt')) {//punktM??


		el.classList.add('verletzt');
		console.log('mein schiff verletzt');



		return true;




	} else {
		el.classList.add('vorbei');
		console.log('bombe schlägt vorbei !!');
		return false;
		//смена хода
	}


}

const flottePrüfung = (x, y) => {
	var winFlag = 2;
	var flotteLeben = false;

	//for (schiff of Flotte) {
	for (let schiff of Flotte) {
		//перебираем корабли флота
		var dasSchiff = false;
		if (schiff.leben == true) {
			console.log(schiff.leben + ' - schiffleben');

			for (let teil of schiff.el) {
				var temp = document.querySelector(`[posX = "${x}"][posY = "${y}"]`);
				console.log('x ' + schiff.el[0].getAttribute('posX') + ' ' + x);

				//console.log(teil.classList.length+'testtesttest!!!!: '+ test);
				if ((teil.getAttribute('posX') == x) && teil.getAttribute('posY') == y) {  //teil[0] == x && teil[1] == y)
					console.log('unseres schiff');
					dasSchiff = true; //wir haben verletzten Schiff gefunden
				}
			}
			if (dasSchiff == true) {//das schiff ist verlezt
				var testFlag = true;
				for (let teil of schiff.el) {

					//var temp = document.querySelector(`[posX = "${teil[0]}"][posY = "${teil[1]}"]`);

					if (teil.classList.contains('verletzt')) {
						console.log('noch ein verlezt');


					} else {
						testFlag = false; //Schiff lebt noch
						break;
					}
				}
				if (testFlag == true) {
					schiff.leben = false;
					console.log('Schiff ist versunken!!');
					winFlag = 1;
					document.getElementById('meinInfo').innerHTML = 'Ihr Schiffe sind versunken!';
					for (let teil of schiff.el) {
						//teil.innerHTML = 'X';
						//var temp = document.querySelector(`[posX = "${teil[0]}"][posY = "${teil[1]}"]`);
						//teil.innerHTML = 'X';
					}

				}
			}

		}
		if (schiff.leben == true) {
			flotteLeben = true;
		}
	}
	if (flotteLeben == false) {
		winFlag = 0;
		console.log('Verloren!!!!!!!!!!!!!!!!!!!!');
		document.getElementById('meinInfo').innerHTML = 'Ihre Schiffe sind versunken, Sie sind verlohren';
		
	}
	return winFlag;

}



/*///////////////////////////////////////////////////////////////////////////
 * 
 *  {Neues  Schiff einlegen} 
 */
/////////////////////////////////////////////////////////////////////////////////////////////
const neuSchiff = (schiffart) => {
	schiffart.onclick = (event) => {
		var countSchiff;
		var event = window.event;
		var zeichner;

		//Prüfung welche Schiff gewählt ist
		if (schiffart.id == 'vierD') {
			deckCount = 4;
			countSchiff = countD4;
			zeichner = document.getElementById('counterD4');
		} else if (schiffart.id == 'dreiD') {
			deckCount = 3;
			countSchiff = countD3;
			zeichner = document.getElementById('counterD3');
		} else if (schiffart.id == 'zweiD') {
			deckCount = 2;
			countSchiff = countD2;
			zeichner = document.getElementById('counterD2');
		} else if (schiffart.id == 'einD') {
			deckCount = 1;
			countSchiff = countD1;
			zeichner = document.getElementById('counterD1');
		}

		//horizontal oder vertical???
		var rad = document.getElementsByName('radio');
		if (rad[0].checked) {
			stellung = true;
			console.log('Schifflage ist horizontal');
		} else {
			stellung = false;
			console.log('Schifflage ist vertical');
		}

		// console.log('corX: ' + begX + '; corY: ' + begY);
		//sammeln schiffelementen
		el = SchiffBau(deckCount, begX, begY, stellung);


		if (el.length > 0) { //schiffbau ist möglich
			var s2 = new Schiff(true, el); //создание корабля
			Flotte.push(s2); //addieren in Flotte
			console.log('Flottegröße:' + Flotte.length);
			console.log('Schiff: ' + s2.el[0]);
			//countSchiff--;
			//zeichner.innerHTML = countSchiff;
			if (schiffart.id == 'vierD') {
				countD4--;
				zeichner.innerHTML = countD4;
				countSchiff = countD4;

			} else if (schiffart.id == 'dreiD') {
				countD3--;
				zeichner.innerHTML = countD3;
				countSchiff = countD3;
			} else if (schiffart.id == 'zweiD') {
				countD2--;
				zeichner.innerHTML = countD2;
				countSchiff = countD2;
			} else if (schiffart.id == 'einD') {
				countD1--;
				zeichner.innerHTML = countD1;
				countSchiff = countD1;
			}


			if (countSchiff == 0) {
				//document.getElementById("vierD").disabled = true;
				schiffart.disabled = true;
			}

			//Flotte ist schon bereit, kann mann spielen
			if (countD4 == 0 && countD3 == 0 && countD2 == 0 && countD1 == 0) {
				console.log('Spiel ist gestartet');
				startSpiel = true;
				document.getElementById('begrüss').innerHTML = 'Flötte ist bereit!';
				console.log(Flotte);
				init();//test
			}

		} else {
			alert('Falsch gedrückt')
		}
	}

}
///**--------------Wahlen element wo möchten wir schiff legen */
const schiffBeginnElement = (event) => {
	var punktM = document.getElementsByClassName('punktM');
	//console.log(punktM[5])


	for (var element of punktM) {
		//console.log(el);

		element.onclick = (event) => {
			//var event = window.event;
			var currElement = event.srcElement || event.target;

			//var event = window.event;
			//var currElement = event.target;

			//var enent = event || window.event;


			//var enent = event || window.event;

			if (event) {
				begX = currElement.getAttribute('posX');
				begY = currElement.getAttribute('posY');
				console.log('corX: ' + begX + '; corY: ' + begY);

			}
		};
	}
}

/** //--------------------Malen mein Spielfeld------------------------------------------*/
const feldMConstructor = (eltern) => {
	let spielFeld = document.createElement('div');
	spielFeld.classList.add('spielFeld');
	for (let i = 1; i < 101; i++) {            //create Wiese mit karierten Elementen
		let punkt = document.createElement('div');
		punkt.classList.add('punktM');
		spielFeld.appendChild(punkt);

	}
	eltern.appendChild(spielFeld);
	//geben coordinaten zum jeden Punkt
	let punkt = document.getElementsByClassName('punktM');
	let i = 0;
	for (let y = 10; y > 0; y--) {
		for (let x = 1; x < 11; x++) { //Einstellung der koordinaten für karierten Elementen
			punkt[i].setAttribute('posX', x);
			punkt[i].setAttribute('posY', y);
			i++;
		}
	}
}
/** //--------------------ENDE Malen mein Spielfeld------------------------------------------*/


/**----------------------//malen Spielfeld des Gegner//------------------------------------- */


const feldFConstructor = (eltern) => {
	let spielFeld = document.createElement('div');
	spielFeld.classList.add('spielFeld');
	for (let i = 1; i < 101; i++) {            //create Wiese mit karierten Elementen
		let punkt = document.createElement('div');
		punkt.classList.add('punktF');
		spielFeld.appendChild(punkt);

	}
	eltern.appendChild(spielFeld);
	//geben coordinaten zum jeden Punkt
	let punkt = document.getElementsByClassName('punktF');
	let i = 0;
	for (let y = 10; y > 0; y--) {
		for (let x = 1; x < 11; x++) { //Einstellung der koordinaten für karierten Elementen
			punkt[i].setAttribute('posX', x);
			punkt[i].setAttribute('posY', y);

			i++;
		}
	}
}
/**----------------------//ENDE malen Spielfeld des Gegner//------------------------------------- */



/*-------------------Schiff Bau------------------------------------------------------------------*/


const SchiffBau = (deckCount, corX, corY, art = true) => {	//count des Deck und art = horizontal(true)/verticale(false)

	var el = [];
	var temp = document.querySelector(`[posX = "${corX}"][posY = "${corY}"]`); //x2, y7 ,d4  Wir becommen DOM-element
	if (temp.classList.contains('besetzt')) {// platz ist nicht frei!
		return el;
	}

	if (corX != 1) {
		if ((document.querySelector(`[posX = "${+corX - 1}"][posY = "${corY}"]`)).classList.contains('besetzt')) { return el; }

	}
	if (corX != 10) {
		if ((document.querySelector(`[posX = "${+corX + 1}"][posY = "${corY}"]`)).classList.contains('besetzt')) { return el; }

	}
	if (corY != 1) {
		if ((document.querySelector(`[posX = "${corX}"][posY = "${+corY - 1}"]`)).classList.contains('besetzt')) { return el; }

	}
	if (corY != 10) {
		if ((document.querySelector(`[posX = "${corX}"][posY = "${+corY + 1}"]`)).classList.contains('besetzt')) { return el; }
	}
	//////////////////////////////////////////////////////////////////////////////////////////////
	var count = deckCount;
	var corX = corX;
	var corY = corY
	if (art == true) {
		var x = Schiffhor(count, corX, corY); //bauen horizontales Schiff

		if (x != null) {
			corX = x;
			for (let i = 0; i < count; i++) {
				var temp = document.querySelector(`[posX = "${corX}"][posY = "${corY}"]`);
				temp.classList.add('besetzt');
				el.push(temp);
				corX++;

			}

		} else {
			console.log('Falsch gedrükt');

		}
	} else {
		var y = SchiffVer(count, corX, corY); //bauen verticales Schiff

		if (y != null) {
			corY = y;
			for (let i = 0; i < count; i++) {
				var temp = document.querySelector(`[posX = "${corX}"][posY = "${corY}"]`);
				temp.classList.add('besetzt');
				el.push(temp);
				corY++;


			}

		} else {
			console.log('Falsch gedrükt');

		}

	}
	if (el) { console.log('TESTX: ' + el[0].getAttribute('posX')); }///TEST ARBEITET
	return el;
}


/*-------------------ENDE Schiff Bau------------------------------------------------------------------*/




/*-----------------für-HORIZONTALSchiff ELEMENTE SAMMELN------------------------------------------------------------------*/

const Schiffhor = (count, corX, corY) => {
	var x = corX;//2
	var y = corY;//7
	var flag = true;
	for (let i = 1; i < count; i++) {// gibt es  freie platzt nach recht?

		if (x < 10) {
			//x++;
			var temp = document.querySelector(`[posX = "${x}"][posY = "${y}"]`);

			if (temp.classList.contains('besetzt')) {//если элемент занят пробуем идти на два шага назад
				if (x > 2) {
					corX = x - 2;//-2

					if (document.querySelector(`[posX = "${+corX - 1}"][posY = "${corY}"]`).classList.contains('besetzt') ||
						(document.querySelector(`[posX = "${corX}"][posY = "${corY}"]`)).classList.contains('besetzt')) {
						return null;
					}

					flag = false;
					break;
				}
				else {
					return null;
				}
			}

			if ((document.querySelector(`[posX = "${+x + 1}"][posY = "${corY}"]`).classList.contains('besetzt'))) { //если следующий элемент занят

				corX = x - 1;//-2
				flag = false;
				break;
			}
			x++;
		} else {
			corX = x;
			flag = false;
			break;
		}
	}

	if (flag == false) {
		flag = true;
		for (let i = 0; i < count - 1; i++) {// gibt es  freie platzt nach links
			//var temp = document.querySelector(`[posX = "${x}"][posY = "${y}"]`);

			if (corX > 1) {
				corX--
				var temp = document.querySelector(`[posX = "${corX}"][posY = "${y}"]`);
				if (temp.classList.contains('besetzt')) {

					flag = false;
					break;
				}
				if (corX > 1) {
					if (document.querySelector(`[posX = "${+corX - 1}"][posY = "${y}"]`).classList.contains('besetzt')) {
						flag = false;
						break;
					}
				}
			} else {
				flag = false;
				break;
			}

		}
	}
	if (flag == true) {
		return corX;
	}
	else {
		return null;
	}

}
/*-----------------für-HORIZONTALSchiff ELEMENTEN SAMMELN------------------------------------------------------------------*/


/*-----------------für-VERTICALSchiff ELEMENTEN SAMMELN------------------------------------------------------------------*/

const SchiffVer = (count, corX, corY) => {
	var x = corX;//2
	var y = corY;//7
	var flag = true;
	for (let i = 1; i < count; i++) {// gibt es  freie platzt nach recht?

		if (y < 10) {

			var temp = document.querySelector(`[posX = "${x}"][posY = "${y}"]`);

			if (temp.classList.contains('besetzt')) {//если элемент занят пробуем идти на два шага назад
				if (y > 2) {
					corY = y - 2;//-2

					if (document.querySelector(`[posX = "${corX}"][posY = "${+corY - 1}"]`).classList.contains('besetzt') ||
						(document.querySelector(`[posX = "${corX}"][posY = "${corY}"]`)).classList.contains('besetzt')) {
						return null;
					}

					flag = false;
					break;
				}
				else {
					return null;
				}
			}

			if ((document.querySelector(`[posX = "${corX}"][posY = "${+y + 1}"]`).classList.contains('besetzt'))) { //если следующий элемент занят

				corY = y - 1;//-2
				flag = false;
				break;
			}
			y++;
		} else {
			corY = y;
			flag = false;
			break;
		}
	}

	if (flag == false) {
		flag = true;
		for (let i = 0; i < count - 1; i++) {// gibt es  freie platzt nach links
			//var temp = document.querySelector(`[posX = "${x}"][posY = "${y}"]`);

			if (corY > 1) {
				corY--
				var temp = document.querySelector(`[posX = "${corX}"][posY = "${corY}"]`);
				if (temp.classList.contains('besetzt')) {

					flag = false;
					break;
				}
				if (corX > 1) {
					if (document.querySelector(`[posX = "${corX}"][posY = "${+corY - 1}"]`).classList.contains('besetzt')) {
						flag = false;
						break;
					}
				}
			} else {
				flag = false;
				break;
			}

		}
	}
	if (flag == true) {
		return corY;
	}
	else {
		return null;
	}

}
/*-----------------ENDE für-VERTICALSchiff ELEMENTEN SAMMELN------------------------------------------------------------------*/


///////////AddSCHIFF////////////////////

