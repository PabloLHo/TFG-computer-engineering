/*Archivos JS encargado de la correcta inicialización de babylon y su correspondiente llamada al modelado oportuno*/
var canvas = document.getElementById("renderCanvas");
var startRenderLoop = function (engine, canvas) {
	engine.runRenderLoop(function () {
		if (sceneToRender && sceneToRender.activeCamera) {
			sceneToRender.render();
		}
	});
}
var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };

window.initFunction = async function() {
	var asyncEngineCreation = async function() {
		try {
			return createDefaultEngine();
		} catch(e) {
			console.log("the available createEngine function failed. Creating the default engine instead");
			return createDefaultEngine();
		}
	}
	window.engine = await asyncEngineCreation();
	if (!engine) throw 'engine should not be null.';
	startRenderLoop(engine, canvas);
	window.scene = createScene("Parcela");
};
	
	
initFunction().then(() => {
	sceneToRender = scene   
});

// Resize
window.addEventListener("resize", function () {
	engine.resize();
});

/*Crea la ventana de visualización para una escena
	modelo: El nombre de la función de visualización a la que llamar
*/
const createScene = (modelo) => {
	return window[modelo](nombre_Modelo);
}