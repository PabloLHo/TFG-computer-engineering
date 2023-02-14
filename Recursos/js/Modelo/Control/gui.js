//Script para el manejo del GUI de controles del modelado
var camara;
var camaraCenital;
var escena;
var tipoCamara = "perspectiva";
var tipoModelo = "nube";

function controlEscena(camera, cameraCenital, scene){
	camara = camera;
	camaraCenital = cameraCenital;
	escena = scene;	
}

var gui = new dat.GUI({name: 'GUI', width: 250 });

var system = {
    Zoom: 175,
    rotationX: Math.PI / 4,
    rotationY: 0,
	moverX: 0,
	moverY: 0,
	seleccion: false,
	formato: "nube",
};

var f_b = gui.addFolder('Base');
f_b.open();
f_b.add(system, 'seleccion', false).name("Selección").listen().onChange(function(){ seleccion()});
f_b.add(system, "formato", {Nube: "nube", Textura: "text", Combinación: "combi"}).name("Formato 3D").listen().onChange(function(){ cambioModelo()});
f_b.add(system, 'Zoom', 0,400).name("Zoom").listen().onChange(function(){ aplicarZoom()});
f_b.add(system, 'rotationX', 0,Math.PI / 2.2).name("Rotación X").listen().onChange(function(){ rotar("x")});
f_b.add(system, 'rotationY', 0,2 * Math.PI).name("Rotación Y").listen().onChange(function(){ rotar("y")});


var parameters = {
	Tipo: "perspectiva",
}

var first = gui.addFolder("Camara");
first.add(parameters, "Tipo", {Cenital: "cenital", Perspectiva: "perspectiva", Rotatoria: "rotar"}).name("Tipo Visión").listen().onChange(function(){ setChecked()});
// var pos1 = first.add(parameters, 'cenital').name('Visión Cenital').listen().onChange(function(){setChecked("cenital")});
// var neg1 = first.add(parameters, 'perspectiva').name('Visión Perspectiva').listen().onChange(function(){setChecked("perspectiva")});
// var neu1 = first.add(parameters, 'rotatoria').name('Visión rotatoria').listen().onChange(function(){setChecked("rotatoria")});
first.open();

function setChecked(){
	// for (let param in parameters){
		// parameters[param] = false;
	// }
	// parameters[prop] = true;
	if(parameters["Tipo"] == "perspectiva" || parameters["Tipo"] == "rotar"){
		if(tipoCamara == "cenital"){
			f_b.remove(f_b.__controllers[f_b.__controllers.length - 1]);
			f_b.remove(f_b.__controllers[f_b.__controllers.length - 1]);
			f_b.add(system, 'rotationX', 0,Math.PI / 2.2).name("Rotación X").listen().onChange(function(){ rotar("x")}).setValue(Math.PI / 4);
			f_b.add(system, 'rotationY', 0,2 * Math.PI).name("Rotación Y").listen().onChange(function(){ rotar("y")}).setValue(0);
		}
		escena.activeCamera = camara;
		var CoT = new BABYLON.TransformNode("root");
		camara.parent = null;
		if(parameters["Tipo"] == "rotar"){
			camara.parent = CoT;
			var angle = 0;
			escena.registerBeforeRender(function(){
				CoT.rotation.y = angle;
				angle +=0.001;
			});
		}
		system["seleccion"] = false;
		system["Zoom"] = 175;
	}else{
		f_b.remove(f_b.__controllers[f_b.__controllers.length - 1]);
		f_b.remove(f_b.__controllers[f_b.__controllers.length - 1]);
		f_b.add(system, 'moverX', -100,100).name("Desplazar en X").listen().onChange(function(){ mover()}).setValue(0);
		f_b.add(system, 'moverY', -50,50).name("Desplazar en Y").listen().onChange(function(){ mover()}).setValue(0);
		system["Zoom"] = 200;
		escena.activeCamera = camaraCenital;
	}
	tipoCamara = parameters["Tipo"];
	centrado();
}
	
	
let centrarVista = {Centrar: function(){ centrado() }};
gui.add(centrarVista,'Centrar').name("Centrar visión");
	
	
let irInformacion = {Información: function(){ irPagInformacion() }};
gui.add(irInformacion,'Información').name("Ir Información");
	
	
let volverInformacion = {Volver: function(){ volverPagInformacion() }};
gui.add(volverInformacion,'Volver').name("Volver Información");
	

	

//Control de funciones
function aplicarZoom(){	
	if(seleccionActivo && tipoCamara == "cenital"){
		zoom.value = 200;
	}else{
		if(tipoCamara == "cenital"){
			camaraCenital.position = new BABYLON.Vector3(0,system["Zoom"],0);
		}else{
			camara.radius = system["Zoom"];
		}
	}
}

function rotar(eje){
	if(eje == "x"){
		if(tipoCamara == "cenital"){
		}else{
			camara.beta = system["rotationX"];
		}
	}else if(eje == "y"){
		if(tipoCamara == "cenital"){
		}else{
			camara.alpha = system["rotationY"];
		}
	}else{

	}
}

function mover(){
	
	camaraCenital.position = new BABYLON.Vector3(system["moverX"],200,system["moverY"]);
	
}

function centrado(){
	if(tipoCamara == "cenital"){
		camaraCenital.setTarget(BABYLON.Vector3.Zero());
		camaraCenital.position = new BABYLON.Vector3(0,200,0);
	}else{
		camara.setTarget(new BABYLON.Vector3(0,1,0));
		camara.beta = Math.PI / 6;
		camara.alpha = 0;
	}
}

function volverPagInformacion(){
	location.href = "InformacionParcela.php?modelo=" + nombre_modelo;
}

function irPagInformacion(){
	location.href = "InformacionSeleccion.php?modelo=" + nombre_modelo;
}

function seleccion(){
	if(tipoCamara != "cenital"){
		system["seleccion"] = false;
		seleccionActivo = system["seleccion"];
	}else{
		seleccionActivo = system["seleccion"];
		if (seleccionActivo) {
			if (activacion) {
				seleccionPoligonal(escena, camaraCenital);
				activacion = false;
			} else {
				puntos = 0;
				coordenadas = [];
				finSeleccion = false;
			}
			crearRecorte();
			camaraCenital.speed = 0;
		}else{
			camaraCenital.speed = 0.75;
			if(lineasSeleccion){
				lineasSeleccion.dispose();
				lineasSeleccion = null;
			}
			eliminarRecorte();
		}
	}
	
}

function crearRecorte(){
	
	var recorteFolder = gui.addFolder('Recorte');
	let recortar = {Recortar: function(){ recorte() }};
	recorteFolder.add(recortar,'Recortar').name("Recortar Parcela");
	
	let eliminarSelec = {EliminarSeleccion: function(){ eliminarSeleccion() }};
	recorteFolder.add(eliminarSelec,'EliminarSeleccion').name("Eliminar Selección");
	
	recorteFolder.open();
	
}

function eliminarRecorte(){
	
	gui.removeFolder(gui.__folders["Recorte"]);
	
}

function recorte(){
	
	if(finSeleccion){
		for(var i = 0; i < coordenadas.length - 1; i++){
			coordenadas[i].x = coordenadas[i].x * coordenadas[i].y;
			coordenadas[i].z = coordenadas[i].z * coordenadas[i].y;
		}
		if(lineasSeleccion){
			lineasSeleccion.dispose();
			lineasSeleccion = null;
		}
		eliminarRecorte();
		pcs.dispose();
		recorteParcela(scene);
	}else{
		alert("La selección no esta completa");
	}
	
}

function eliminarSeleccion(){
	
	if(lineasSeleccion){
		lineasSeleccion.dispose();
		lineasSeleccion = null;
		puntos = 0;
		coordenadas = [];
		finSeleccion = false;
	}
		
}

function cambioModelo(){
	if(system["formato"] == "nube"){
		ground.dispose();
		if(tipoModelo != "combi"){
			creacionParcela(escena);			
		}
		tipoModelo = "nube";
	}else if(system["formato"] == "text"){
		if(system["seleccion"] == true){
			eliminarRecorte();
		}
		system["seleccion"] = false;
		pcs.dispose();
		if(tipoModelo != "combi"){
			var groundMaterial = new BABYLON.StandardMaterial("ground", escena);
			groundMaterial.diffuseTexture = new BABYLON.Texture("Recursos/imagenes/ParcelaMarmolejo.jpg", escena);
	
			ground = new BABYLON.MeshBuilder.CreateGround("ground", {height: 40, width: 126, subdivisions: 4});
			ground.material = groundMaterial;			
		}
		tipoModelo = "text";
	}else{
		tipoModelo = "combi";
		if(tipoModelo == "nube"){
			var groundMaterial = new BABYLON.StandardMaterial("ground", escena);
			groundMaterial.diffuseTexture = new BABYLON.Texture("Recursos/imagenes/ParcelaMarmolejo.jpg", escena);
		
			ground = new BABYLON.MeshBuilder.CreateGround("ground", {height: 40, width: 126, subdivisions: 4});
			ground.material = groundMaterial;
		}else{
			creacionParcela(escena);
		}
	}
}