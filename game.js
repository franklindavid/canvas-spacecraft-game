//objetos importantes para canvas
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
//crear objeto de la nave
var nave ={
	x:10,
	y:200,
	width:40,
	height:40
}
var juego={
	estado:'iniciando'
}
var puntaje=0;
var velocidad=500;
var ve=1;
var teclado={}
var flag =0;
//array para los disparos
var disparos=[];
var enemigos=[];
//definir variables para las imagenes
var fondo,imgnave,imgdisparo;
//var imagenes = ['smile.jpg'];
//var preloader;
//definicion de funciones
var explosion,explosion1,muerto,musicafondo,perdi;
function loadMedia(){
	//preloader = new PreloadJS();
	//preloader.onProgress = progresocarga;
	//cargar();
	fondo=new Image();
	fondo.src = 'smile.jpg';
	imgnave=new Image();
	imgnave.src = 'nave.png';
	imgenemigo=new Image();
	imgenemigo.src = 'enemigo.png';
	imgdisparo=new Image();
	imgdisparo.src = 'disparo.png';
	explosion1=document.createElement('audio');
	document.body.appendChild(explosion1);
	explosion1.setAttribute('src','explosion1.mp3');
	perdi=document.createElement('audio');
	document.body.appendChild(perdi);
	perdi.setAttribute('src','perdi.mp3');
	muerto=document.createElement('audio');
	document.body.appendChild(muerto);
	muerto.setAttribute('src','muerto.ogg');
	explosion=document.createElement('audio');
	document.body.appendChild(explosion);
	explosion.setAttribute('src','explosion.ogg')
	musicafondo=document.createElement('audio');
	document.body.appendChild(musicafondo);
	musicafondo.setAttribute('src','winter.mp3');
	fondo.onload = function (){
		var intervalo = window.setInterval(frameloop,1000/55);
	}
		
}
//function cargar(){
//	while(imagenes.length>0){
//		var imagen = imagenes.shift();
//		preloader.loadFile(imagen);
//	}
//}

//function progresocarga(){
//	console.log(parseInt(preloader.progress *100)+"%");
//	if (preloader.progress ==1){
//		var interval =window.setInterval(frameloop,1000/55);
//	}
//}

function dibujarnave(){
ctx.save();
//ctx.fillStyle = 'yellow';
//ctx.fillRect(nave.x,nave.y,nave.width,nave.height);
ctx.drawImage(imgnave,nave.x,nave.y,nave.width,nave.height);
ctx.restore();
}

function dibujarfondo(){
	ctx.drawImage(fondo,0,0);
}

function agregareventoteclado(){
	agregarevento(document,"keydown",function(e){
		//ponemos un true la tecla presionada
		teclado[e.keyCode]=true;
	});
	agregarevento(document,"keyup",function(e){
		//ponemos un false la tecla no presionada
		teclado[e.keyCode]=false;
	});
	function agregarevento(elemento,nombreevento,funcion){
if(elemento,addEventListener){
	//navegadores de verdad
	elemento.addEventListener(nombreevento,funcion,false);
}
else if (elemento.attachEvent) {
	//internet explorer
	elemento.attachEvent(nombreevento,funcion);
}
	}
}

function pausa () {	
if (teclado[80]){
	musicafondo.pause();
juego.estado='pausado';
}
//else {		
//	juego.estado='pausado';
//	console.log("estado: ",juego.estado);
//}
}
function reiniciar(){
if (teclado[82]){
	juego.estado='iniciando';
	musicafondo.currentTime=0;
	nave.x=10;
	nave.y=200;
	puntaje=0;
	window.clearInterval(intervalo);
	enemigos=enemigos.filter(function(enemigos){
    return enemigos.x<0;});
    disparos=disparos.filter(function(disparos){
    return disparos.x<0;});
}}

function reanudar(){
if (teclado[79]){
juego.estado='jugando';
}
}
function movernave(){
	if (flag==0){
	if(teclado[38]){
		//movimiento arriba
		nave.y-=10;
		if (nave.y<0) nave.y=0;
	}
	if(teclado[40]){
		//movimiento abajo
		var limite = canvas.height - nave.height;
		nave.y+=10;
		if (nave.y>limite) nave.y=limite;
	}
	if(teclado[37]){
		//movimiento izquierda
		nave.x-=10;
		if (nave.x<0) nave.x=0;
	}
	if(teclado[39]){
		//movimiento derecha
		var limite = canvas.width - nave.width;
		nave.x+=10;
		if (nave.x>limite) nave.x=limite;
	}

	
if (teclado[32]){
	explosion1.pause();
				explosion1.currentTime=0;
				explosion1.play();
		if(!teclado.fuego){
		fuego();
		teclado.fuego=true;
		}

	}
	else teclado.fuego=false;
}}
function moverdisparos(){
for (var i in disparos) {
	var disparo = disparos[i];
	disparo.x += 20;
}
disparos=disparos.filter(function(disparos){
return disparo.x<canvas.width;
});
}

function fuego(){
disparos.push({
	x:nave.x+15,
	y:nave.y+19,
	width:15,
	height:5
});
}

function dibujardisparo(){
	ctx.save();
	ctx.fillStyle='red';
	for(var i in disparos){
		var disparo=disparos[i];
		//ctx.fillRect(disparo.x,disparo.y,disparo.width,disparo.height);
		ctx.drawImage(imgdisparo,disparo.x,disparo.y,disparo.width,disparo.height);
	}
	ctx.restore();
}

function dibujarenemigos(){
	for(var i in enemigos){
		var enemigo = enemigos[i];
		ctx.save();
		if (enemigo.estado == 'vivo') ctx.fillStyle='black';
		if (enemigo.estado =='muerto')ctx.fillStyle='blue';
		//ctx.fillRect(enemigo.x,enemigo.y,enemigo.width,enemigo.height);
	      ctx.drawImage(imgenemigo,enemigo.x,enemigo.y,enemigo.width,enemigo.height);
	}
}
function dibujartexto(){
	ctx.fillStyle='white';
	ctx.fillRect(5,15,100,20);
	ctx.fillStyle='BLACK';
	ctx.font = 'bold 10pt arial';
	ctx.fillText("PUNTAJE: ",10,30);
	ctx.fillText(puntaje,75,30);
}
//function aumentarvelocidad(){
 //   window.clearInterval(intervalo);
 //   juego.estado='iniciando';	
//	velocidad=velocidad-10;
//}

function actualizaenemigos(){
if(juego.estado=='iniciando'){

  juego.estado ='jugando';
	
	intervalo = window.setInterval(function(){
	var alet = Math.floor(Math.random()*(399-1+1))+1;
	if (juego.estado!='pausado'){
			enemigos.push({

		x:750,
		y:alet,
		height:40,
		width:80,
		estado:'vivo'});

			ve = ve +0.2;

	puntaje=puntaje+10;
	//aumentarvelocidad();
	console.log("puntaje",puntaje);}
	},velocidad);
	console.log("velocidad",velocidad);		
}
//for (var i in enemigos){
//	var enemigo = enemigos[i];
	//enemigos=enemigos.filter(function(enemigos){
//if(enemigo&&enemigo.estado!='muerto') return true;
//return false;
//});}
}
function moverenemigos(){
	//ve = ve +1;
for (var i in enemigos) {
	var enemigo = enemigos[i];
	enemigo.x -= ve;
}
enemigos=enemigos.filter(function(enemigos){
return enemigos.x>0;
});
}

function hit(a,b){
	var hit = false;
	if(b.x+b.width>=a.x&&b.x<a.x+a.width){
		if(b.y+b.height>=a.y&&b.y<a.y+a.height){
      //if(b.y+b.height>=a.y&&b.y+<a.y+a.height){
       	hit=true;
       }
	}
		if(b.x<=a.x&&b.x+b.width>=a.x+a.width){
			if(b.y<=a.y&&b.y+b.height>=a.y+a.height){
				hit=true;
			}

		}
			if(a.x<=b.x&&a.x+a.width>=b.x+b.width){
			if(a.y<=b.y&&a.y+a.height>=b.y+b.height){
				hit=true;
			}
         
		}
		return hit;
}
function verificarcolisiondisparo(){

	for(var i in disparos){		
		var disparo = disparos[i];
		for(j in enemigos){
			var enemigo = enemigos[j];
			if(hit(disparo,enemigo)){
				explosion.pause();
				explosion.currentTime=0;
				explosion.play();
				enemigo.estado = 'muerto';
				console.log('hubo contacto');
				enemigo.y=500;
				puntaje=puntaje+50;
				console.log("puntaje",puntaje);
			}
		}
	}
}
function verificarcolision(){
	for(var i in enemigos){		
		var enemigo = enemigos[i];
	        if(hit(nave,enemigo)){
	        	muerto.pause();
				muerto.currentTime=0;
	        	muerto.play();
	        	musicafondo.pause();
	        	musicafondo.currentTime=0;
	        	perdi.pause();
				perdi.currentTime=0;
	        	perdi.play();
	        	//flag=1;
			alert("has muerto")
            console.log('me mori ');
            velocidad=500;
            nave.x=10;
            nave.y=200;
            puntaje=0;
            ve=1;
            enemigos=enemigos.filter(function(enemigos){
                return enemigos.x<0;});
            break;				
			}
		}
	}

	

function frameloop() {
	if (juego.estado!='pausado'){
	movernave();
	verificarcolisiondisparo();
	verificarcolision();
	actualizaenemigos();
	moverdisparos();
	moverenemigos();
	dibujarfondo();
	dibujardisparo();
	dibujarnave();
	dibujarenemigos();
	dibujartexto();
	musicafondo.play();
    }
    
    console.log(velocidad);
    reiniciar();
    pausa();
    reanudar();
}
//ejecucion de funcoines
//window.addEventListener('load',init);
//function init(){

loadMedia();
agregareventoteclado();
//}

