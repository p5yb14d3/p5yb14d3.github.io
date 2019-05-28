
var ui;

$(document).ready(function() { 
	ui = new classUI();
	ui.init();
	ui.space.drawObject();
});

function classSpace(ui) {
	hide3DCssSolarSystem();
	
	
	var space = this;
	var front = {};
	var hover = {};
	var objects = {};
	var object = "";
	var object_name = "";
	this.ui = ui;
	this.wireframe = false;
	this.force_controls = true; // ALLOWS FOR MANUAL POSITIONING OF PLANETS
	this.allow_controls_affect_camera = true; 
	this.object_name = "earth";
	
	var container = document.getElementById('container');
	var sunflareColor = new THREE.Color( 0xffffff );

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(container);
		return;
	}

	// PLANET PARAMS
	front["sun"] = {'name':'sun', 'radius':30, 'scale':8, 'segments': 100, 'position':[0,0,0], 'rotate':[0, 0, 90], 'rotation': 0, 'directional_light': true, 'directional_position': [5, 3, 5], 'directional_color': 0x111111, 'directional_intensity': 10, 'ambient_color':0x111111, 'ambient_intensity':1, 'texture':'textures/sunmap.jpg'};
	front["mercury"] = {'name':'mercury', 'radius':30, 'scale':3, 'segments': 100, 'position':[0,0,0], 'rotate':[0, 0, 90], 'rotation': 0.0005, 'directional_light': true, 'directional_position': [5, 3, 5], 'directional_color': 0x111111, 'directional_intensity': 5, 'ambient_color':0xffffff, 'ambient_intensity':1, 'texture':'textures/mercurymap.jpg'};
	front["venus"] = {'name':'venus', 'radius':30, 'scale':5, 'segments': 100, 'position':[0,0,0], 'rotate':[0, 0, 90], 'rotation': 0.0001, 'directional_light': false, 'directional_position': [5, 3, 5], 'directional_color': 0x111111, 'directional_intensity': 10, 'ambient_color':0xffffff, 'ambient_intensity':1, 'texture':'textures/venusmap.jpg'};
	front["earth"] = {'name':'earth', 'radius':30, 'scale':5, 'segments': 100, 'position':[0,0,0], 'rotate':[0, 0, 90], 'rotation': 0.001, 'directional_light': false, 'directional_position': [5, 3, 5], 'directional_color': 0x111111, 'directional_intensity': 10, 'ambient_color':0xffffff, 'ambient_intensity':1, 'texture':'textures/land_ocean_ice_cloud_2048.jpg'};
	front["moon"] = {'name':'moon', 'radius':30, 'scale':3.32, 'segments': 100, 'position':[0,0,0], 'rotate':[0, 0, 90], 'rotation': 0, 'directional_light': true, 'directional_position': [0, 0, 10], 'directional_color': 0x333333, 'directional_intensity': 10, 'ambient_color':0x333333, 'ambient_intensity':1, 'texture':'textures/moonmap1k.jpg'};
	front["mars"] = {'name':'mars', 'radius':30, 'scale':4.66, 'segments': 100, 'position':[0,0,0], 'rotate':[0, 0, 90], 'rotation': 0.001, 'directional_light': false, 'directional_position': [5, 3, 5], 'directional_color': 0x111111, 'directional_intensity': 10, 'ambient_color':0xffffff, 'ambient_intensity':1, 'texture':'textures/marsmap1k.jpg'};
	front["jupiter"] = {'name':'jupiter', 'radius':30, 'scale':10.66, 'segments': 100, 'position':[0,0,0], 'rotate':[0, 0, 90], 'rotation': 0.001, 'directional_light': true, 'directional_position': [5, 3, 5], 'directional_color': 0x0f0f0f, 'directional_intensity': 13, 'ambient_color':0x111111, 'ambient_intensity':1, 'texture':'textures/jupitermap.jpg'};
	front["saturn"] = {'name':'saturn', 'radius':30, 'scale':9.33, 'segments': 100, 'position':[0,0,0], 'rotate':[0, 0, 90], 'rotation': 0.002, 'directional_light': true, 'directional_position': [-7, 3, 5], 'directional_color': 0x111111, 'directional_intensity': 10, 'ambient_color':0x222222, 'ambient_intensity':1, 'texture':'textures/saturnmap.jpg'};
	front["uranus"] = {'name':'uranus', 'radius':30, 'scale':6.66, 'segments': 100, 'position':[0,0,0], 'rotate':[0, 0, 90], 'rotation': 0.001, 'directional_light': true, 'directional_position': [5, 3, 5], 'directional_color': 0x111111, 'directional_intensity': 10, 'ambient_color':0x1a1a1a, 'ambient_intensity':1, 'texture':'textures/uranusmap.jpg'};
	front["neptune"] = {'name':'neptune', 'radius':30, 'scale':6.66, 'segments': 100, 'position':[0,0,0], 'rotate':[0, 0, 90], 'rotation': 0.001, 'directional_light': true, 'directional_position': [5, 3, 5], 'directional_color': 0x111111, 'directional_intensity': 10, 'ambient_color':0x1a1a1a, 'ambient_intensity':1, 'texture':'textures/neptunemap.jpg'};
	front["pluto"] = {'name':'pluto', 'radius':30, 'scale':2, 'segments': 100, 'position':[0,0,0], 'rotate':[0, 0, 90], 'rotation': 0.0008, 'directional_light': true, 'directional_position': [5, 3, 5], 'directional_color': 0x111111, 'directional_intensity': 10, 'ambient_color':0x1a1a1a, 'ambient_intensity':1, 'texture':'textures/plutomap1k.jpg'};
	front["asteroids"] = {'name':'asteroids', 'radius':30, 'scale':0.1, 'segments': 100, 'position':[0,0,0], 'rotate':[0, 0, 90], 'rotation': 0.001, 'directional_light': true, 'directional_position': [5, 3, 5], 'directional_color': 0xff7f24, 'directional_intensity': 5, 'ambient_color':0xffffff, 'ambient_intensity':10, 'texture':'textures/sunmap.jpg'};
	
	// PLANET HOVER PARAMS
	hover["sun"] = {'name':'sun', 'radius':30, 'scale':1, 'segments': 100, 'position':[0,-32,740], 'rotate':'off', 'rotation': 0, 'directional_light': true, 'directional_position': [0,120,-150], 'directional_color': 0xcccccc, 'directional_intensity': 10, 'ambient_color':0x222222, 'ambient_intensity':0, 'texture':'textures/sunmap.jpg'};
	hover["mercury"] = {'name':'mercury', 'radius':30, 'scale':1, 'segments': 100, 'position':[0,-32,740], 'rotate':[0, 0, 90], 'rotation': 0.00015, 'directional_light': true, 'directional_position': [0,120,-150], 'directional_color': 0xcccccc, 'directional_intensity': 10, 'ambient_color':0x222222, 'ambient_intensity':0, 'texture':'textures/mercurymap.jpg'};
	hover["venus"] = {'name':'venus', 'radius':30, 'scale':1, 'segments': 100, 'position':[0,-32,740], 'rotate':[0, 0, 90], 'rotation': 0.00015, 'directional_light': true, 'directional_position': [0,120,-150], 'directional_color': 0xcccccc, 'directional_intensity': 10, 'ambient_color':0x222222, 'ambient_intensity':0, 'texture':'textures/venusmap.jpg'};
	hover["earth"] = {'name':'earth', 'radius':30, 'scale':1, 'segments': 100, 'position':[0,-32,740], 'rotate':[0, 0, 90], 'rotation': 0.00015, 'directional_light': true, 'directional_position': [0,120,-150], 'directional_color': 0xcccccc, 'directional_intensity': 10, 'ambient_color':0x222222, 'ambient_intensity':0, 'texture':'textures/land_ocean_ice_cloud_2048.jpg'};
	hover["moon"] = {'name':'moon', 'radius':30, 'scale':1, 'segments': 100, 'position':[0,-32,740], 'rotate':[0, 0, 90], 'rotation': 0.00015, 'directional_light': true, 'directional_position': [0,120,-150], 'directional_color': 0xcccccc, 'directional_intensity': 10, 'ambient_color':0x222222, 'ambient_intensity':0, 'texture':'textures/moonmap1k.jpg'};
	hover["mars"] = {'name':'mars', 'radius':30, 'scale':1, 'segments': 100, 'position':[0,-32,740], 'rotate':[0, 0, 90], 'rotation': 0.00015, 'directional_light': true, 'directional_position': [0,120,-150], 'directional_color': 0xcccccc, 'directional_intensity': 10, 'ambient_color':0x222222, 'ambient_intensity':0, 'texture':'textures/marsmap1k.jpg'};
	hover["jupiter"] = {'name':'jupiter', 'radius':30, 'scale':1, 'segments': 100, 'position':[0,-32,740], 'rotate':[0, 0, 90], 'rotation': 0.00015, 'directional_light': true, 'directional_position': [0,120,-150], 'directional_color': 0xcccccc, 'directional_intensity': 10, 'ambient_color':0x222222, 'ambient_intensity':0, 'texture':'textures/jupitermap.jpg'};
	hover["saturn"] = {'name':'saturn', 'radius':30, 'scale':1, 'segments': 100, 'position':[0,-32,740], 'rotate':[0, 0, 90], 'rotation': 0.00015, 'directional_light': true, 'directional_position': [0,120,-150], 'directional_color': 0xcccccc, 'directional_intensity': 10, 'ambient_color':0x222222, 'ambient_intensity':0, 'texture':'textures/saturnmap.jpg'};
	hover["uranus"] = {'name':'uranus', 'radius':30, 'scale':1, 'segments': 100, 'position':[0,-32,740], 'rotate':[0, 0, 90], 'rotation': 0.00015, 'directional_light': true, 'directional_position': [0,120,-150], 'directional_color': 0xcccccc, 'directional_intensity': 10, 'ambient_color':0x222222, 'ambient_intensity':0, 'texture':'textures/uranusmap.jpg'};
	hover["neptune"] = {'name':'neptune', 'radius':30, 'scale':1, 'segments': 100, 'position':[0,-32,740], 'rotate':[0, 0, 90], 'rotation': 0.00015, 'directional_light': true, 'directional_position': [0,120,-150], 'directional_color': 0xcccccc, 'directional_intensity': 10, 'ambient_color':0x222222, 'ambient_intensity':0, 'texture':'textures/neptunemap.jpg'};
	hover["pluto"] = {'name':'pluto', 'radius':30, 'scale':1, 'segments': 100, 'position':[0,-32,740], 'rotate':[0, 0, 90], 'rotation': 0.00015, 'directional_light': true, 'directional_position': [0,120,-150], 'directional_color': 0xcccccc, 'directional_intensity': 10, 'ambient_color':0x222222, 'ambient_intensity':0, 'texture':'textures/plutomap1k.jpg'};
	hover["asteroids"] = {'name':'asteroids', 'radius':30, 'scale':0.1, 'segments': 100, 'position':[0,0,0], 'rotate':[0, 0, 90], 'rotation': 0.001, 'directional_light': true, 'directional_position': [5, 3, 5], 'directional_color': 0xff7f24, 'directional_intensity': 5, 'ambient_color':0xffffff, 'ambient_intensity':10, 'texture':'textures/sunmap.jpg'};
	
	var objects = {"front":front, "hover":hover};
	var view_previous = "";
	var view = "front";
	
	var default_radius = 200;
	var default_segments = 100
	
	var scene = new THREE.Scene();
	// scene.fog = new THREE.FogExp2( 0xffffff, 0.0005 ); // FOR ASTEROIDS

	// var renderer = new THREE.WebGLRenderer();
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	// FOR ASTEROIDS
	renderer.setClearColor(0x000000);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		
	var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );
	// var camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 3000 ); // FOR SUN
	
	var ambient = new THREE.AmbientLight();
	scene.add(ambient);
	
	var light = new THREE.DirectionalLight();
	scene.add(light);
	
	var controls = new THREE.TrackballControls(camera);
	controls.minDistance = 500;
	controls.maxDistance = 1000;
	controls.rotateSpeed = 0.005;
	controls.noPan = true;
	// var controls = new THREE.OrbitControls(camera, renderer.domElement);
	
	// SET UP SHADER
	var oldTime = new Date().getTime();
	
	var uniforms1 = {
		time: 	{ value: 1.0 },
		scale: 	{ value: 1.5 }
	};

	if (view == "hover") var vertexShader = "vertexShader_hover"; else var vertexShader = "vertexShader1";
	var material = new THREE.ShaderMaterial( {
		uniforms: uniforms1,
		fragmentShader: document.getElementById('fragmentShader1').textContent,
		vertexShader: document.getElementById(vertexShader).textContent,
	});
	var material_sun_hover = new THREE.ShaderMaterial( {
		uniforms: uniforms1,
		fragmentShader: document.getElementById('fragmentShader1').textContent,
		vertexShader: document.getElementById(vertexShader).textContent,
	});
	var material_glow = new THREE.ShaderMaterial({
		fragmentShader: document.getElementById('fragmentShaderGlow').textContent,
		vertexShader: document.getElementById('vertexShaderGlow').textContent,
	});
	
	var default_radius = 30;
	var sphere = createSphere(default_radius, default_segments, "");
	scene.add(sphere);
	var material_original = sphere.material;
	
	// /* DONT DELETE */
	// // TO DRAW SUN WITH GLOW USE THIS.
	// var glow_geometry = new THREE.SphereGeometry(100, 60, 60);
	// var glow_material = new THREE.ShaderMaterial({
		// uniforms: {},
		// vertexShader: document.getElementById('vertexShaderGlow').textContent,
		// fragmentShader: document.getElementById('fragmentShaderGlow').textContent,
		// side: THREE.BackSide,
		// blending: THREE.AdditiveBlending,
		// transparent: true
	// });
	// var sphere_glow = THREE.SceneUtils.createMultiMaterialObject( glow_geometry, [glow_material]);
	// scene.add(sphere_glow);
	// sphere_glow.position.set(0, 0, 0);
	// sphere_glow.scale.x = 9;
	// sphere_glow.scale.y = 9;
	// sphere_glow.scale.z = 9;

	// var geometry = new THREE.SphereGeometry( 1, 64, 32 );
	// var mesh = new THREE.Mesh( geometry, material );
	// mesh.position.x = 0;
	// mesh.position.y = 1;
	// mesh.position.z = 140;
	
	// mesh.material = material;
	// scene.add(mesh);
	
	var stars = createStars(1000, 100);
	scene.add(stars);
	var ring = createFlatTorus();
	ring.rotation.x = Math.PI / 2;
	ring.name = "ring";
	
	var asteroids = createAsteroids();
	
	container.appendChild(renderer.domElement);
	animate();
	
	// SET UP SUN BEGIN
	scene.fog = new THREE.Fog( 0x000000, 3500, 15000 );
	scene.fog.color.setHSL( 0.51, 0.4, 0.01 );
		
	// var textureFlare0 = THREE.ImageUtils.loadTexture( "./textures/lensflare/lensflare0.png" );
	// sunflareColor.setHSL( 5, 1, 1 + 0.4 ); // a,b,c+d (d:1~ 0.1 flare magnitude. at 0.1 it turns green, 0.3 = yellow, 0.4 orange, 0.5 orange-red-with-corona)
											// c:0.5 default, 1: larger corona; 5:even larger
	// var lensFlare = new THREE.LensFlare( textureFlare0, window.innerWidth, 0.0, THREE.AdditiveBlending, sunflareColor );
	// lensFlare.name = "lensFlare";
	
	// lensflares
	var textureLoader = new THREE.TextureLoader();
	var textureFlare0 = textureLoader.load( 'textures/lensflare/lensflare0.png' );
	var lensFlare = new THREE.Lensflare();
	lensFlare.addElement( new THREE.LensflareElement( textureFlare0, window.innerWidth, 0, sunflareColor) );
	lensFlare.addElement( new THREE.LensflareElement( textureFlare0, window.innerWidth, 0, sunflareColor) ); // TWO TIMES TO MAKE SUN BRIGHTER
	lensFlare.name = "lensFlare";

	
	this.drawObject = function(iobject_name) {	
		if (typeof iobject_name !== "undefined") this.object_name = iobject_name; 
		// LOAD INFO AND STATS
		object_name = this.object_name;
		ui.hud.loadInfoAndStats(this.object_name);
		
		// SPHERE POSITION PRESETS
		object = objects[view][this.object_name];
		// object = front[object_name];
		// // // CLOSEUPS: FOR RADIUS 400
		// // sphere.position.set(0,-320,400); // VERY LOW: GOOD
		// // sphere.position.set(0,-320,300);
		// // sphere.position.set(0,-300,300); // GOOD
		// // sphere.position.set(0,-340,200); // HIGHER: GOOD
		// // sphere.position.set(0,-320,400); // VERY LOW
		// // sphere.position.set(0,-320,500); // VERY LOW
		// // sphere.position.set(0,-320,700); // VERY LOW
		
		// // // // CLOSEUPS: FOR RADIUS 40
		// // sphere.position.set(0,-30,720); // VERY LOW
		// // sphere.position.set(0,-30,740); // VERY LOW
		// sphere.position.set(0,-32,740); // VERY LOW //GOOD
		
		// // sphere.position.set(0,-43,735); // VERY LOW


		if (object.position != "off") {
			// sphere.position.set(object.position[0],object.position[1],object.position[2]); // VERY LOW object.position[0]
			sphere.position.z = object.position[2];
			sphere.position.y = object.position[1];
			sphere.position.x = object.position[0];
			// mesh.position.set(object.position[0],object.position[1],object.position[2]); // VERY LOW object.position[0]
		}
		
		// SET CAMERA
		if ((object.name == "saturn") && (view == "front")) {
			camera.position.z = 750
			camera.position.y = 100
			camera.position.x = 100
			camera.up = new THREE.Vector3(0,0.05,-0.2); // for saturn
		} else if (this.object_name == "asteroids") {
			camera.position.z = 0;
			camera.position.y = 0;
			camera.position.x = 1000;
			camera.up = new THREE.Vector3(-90,90,0); // for saturn
		} else if (this.object_name == "sun") {
			camera.position.z = 750;
			camera.position.y = 0;
			camera.position.x = 0;
		} else {
			camera.position.z = 750;
			camera.position.y = 0;
			camera.position.x = 0;
		}

		// SET AMBIENT LIGHT
		ambient.color.setHex(object.ambient_color, object.ambient_intensity);
		// ambient.color.setHex(0x222222, 0);

		// SET DIRECTIONAL LIGHT
		if (object.directional_light) { // if light is on
			light.color.setHex(object.directional_color);
			light.intensity = object.directional_intensity;
			// console.log("@@@@@@@@@@@@", object.directional_position);
			light.position.set(object.directional_position[0], object.directional_position[1], object.directional_position[2],);
			light.target = sphere;
		} else { // if light is off
			light.intensity = 0; // turns off lights
		}
		
		// // TESTING
		// // light.color.setHex(0xcccccc);
		// light.position.set(0, 120, -150);
		// light.target = sphere;
		// light.intensity = 10;
			
		// SET RING MESH
		if ((object.name == "saturn") && (view == "front"))  {
			scene.add(ring);
		}
		else { // REMOVE RING MESH
			// var selectedObject = scene.getObjectByName("ring");
			// scene.remove( selectedObject );
			scene.remove(ring);
		}
		
		// ADD/REMOVE ASTEROIDS
		if (object.name == "asteroids") {
			this.showAsteroids();
		} else {
			this.hideAsteroids();
		}
		
		// SET SUN
		if (object.name == "sun") {
			scene.add( lensFlare );
			scene.remove(lensFlare);
		}
		else {
			scene.remove(lensFlare);
		}
		
		// SET SPHERE 
		if (object.name == "sun") {
			scene.add(sphere);
			// scene.add(mesh);
		} else if (object.name == "asteroids") {
			scene.remove(sphere);
		} else {
			// console.log("sphere.position", sphere.position);
			scene.add(sphere);
		}

		// // SET POINT LIGHT
		// // Create a light, set its position, and add it to the scene.
		// var light = new THREE.PointLight(0xffffff);
		// light.position.set(-100,200,100);
		// scene.add(light);

		// SET RADIUS (THE 150, AND 200 VALUE HERE ARE ARBITARY
		var scale = 1;
		sphere.scale.x = object.scale;
		sphere.scale.y = object.scale;
		sphere.scale.z = object.scale;

		// SET MATERIAL MAP AND ROTATION MATRIX
		if (this.object_name == "sun") {
			// HERE WE RESET THE ROTATION TO ORIGINAL SO THAT WE CAN MAP THE SUN MATERIAL
			sphere.rotation.set(0,0,0);
			sphere.updateMatrix();
			
			
			// MAP MATERIAL
			sphere.material = material;
			// AND AFTER MAPPING THE MATERIAL, AND IF THE VIEW IS HOVER, THEN WE ROTATE THE OBJECT
			if (view == "hover") rotateObject(sphere, object.rotate[0],object.rotate[1],object.rotate[2]);	
		}
		else if (this.object_name == "asteroid") {
			
		}
		else {
			// HERE WE RESET THE ROTATION TO ORIGINAL BEFORE WE CHANGE THE MATERIAL
			// IF NOT, THE MATERIAL WILL BE MAP UPRIGHT ON A NON-UPRIGHT ROTATION MATRIX
			sphere.rotation.set(0,0,0);
			sphere.updateMatrix();
			// MAP MATERIAL
			sphere.material = material_original
			sphere.material.map = THREE.ImageUtils.loadTexture(object.texture);
			sphere.material.shininess = 1;
			// console.log('@@@@@@@@@@@@@@@@@material', sphere.material);
			// AND AFTER MAPPING THE MATERIAL, AND IF THE VIEW IS HOVER, THEN WE ROTATE THE OBJECT
			if (view == "hover") rotateObject(sphere, object.rotate[0],object.rotate[1],object.rotate[2]);	
		}
		
		if (this.wireframe) {
			// WIREFRAME
			sphere.material = new THREE.MeshPhongMaterial({
			color: 0xBD9779,
			wireframe: true,
			side: THREE.DoubleSide});
		}
		
		
		// // SET MATERIAL COLOR
		// sphere.material.color.setHex(hex);
			
		// SET ROTATION
		if (view == "front") {
			sphere.rotation.x = object.rotation; // VERY IMPORTANT. OTHERWISE OBJECT WONT APPEAR. NOT SURE WHY YET
			sphere.rotation.y = object.rotation; 
		}
		else {
			sphere.rotation.y = object.rotation; 
			sphere.rotation.x = object.rotation;
		}

		// report = report + ("camera position:"+camera.position[0]+","+camera.position[1]+","+camera.position[2]);
		// $("h1").html("$("h1").html("camera position:"+camera.position.x+","+camera.position.y+","+camera.position.z+" sphere position:"+sphere.position.x+","+sphere.position.y+","+sphere.position.z);
	}
	

	function updateRotations() {
		console.log('object_name: '+object_name);
		if (object_name == "sun") {
			var time = new Date().getTime();
			var delta = 0.005 * ( time - oldTime );
			oldTime = time;

			uniforms1.time.value += 0.1 * delta; // original:0.275 
		}
		if (view == "front") {
			sphere.rotation.y += object.rotation;
		}
		else {
			sphere.rotation.x += object.rotation;
		}
		stars.rotation.y += 0.00005;
		if (object_name == "asteroids") {
			asteroids.forEach(function(obj){
				  obj.rotation.x -= obj.r.x;
				  obj.rotation.y -= obj.r.y;
				  obj.rotation.z -= obj.r.z;
			})
		}
	}
	
	function animate() {
		updateRotations();
		requestAnimationFrame(animate);
		
		renderer.render(scene, camera);
		controls.update();
	}
	
	function createFlatTorus() {
		return new THREE.Mesh(
			new THREE.TorusGeometry( 460, 80 , 2 , 160), // 350, 90 , 1.99 ,150 for radisu 200
			new THREE.MeshPhongMaterial({
				// map:         THREE.ImageUtils.loadTexture('textures/land_ocean_ice_cloud_2048.jpg'),
				// map:         THREE.ImageUtils.loadTexture('textures/jupitermap.jpg'),
				map:         THREE.ImageUtils.loadTexture('textures/saturnringpattern.gif'),
				transparent	: true,
				opacity : 0.8,
				//specular:    new THREE.Color('textures/saturnringpattern.gif')								
			})
		);
	}

	function createSphere(radius, segments, texture) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				// map:         THREE.ImageUtils.loadTexture('textures/land_ocean_ice_cloud_2048.jpg'),
				// map:         THREE.ImageUtils.loadTexture('textures/jupitermap.jpg'),
				map:         THREE.ImageUtils.loadTexture(texture),
				// bumpMap:     THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
				// bumpScale:   0.1,
				// specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
				specular:    new THREE.Color('grey'),
				shininess: 5,				
			})
		);
	}

	// function createClouds(radius, segments) {
		// return new THREE.Mesh(
			// new THREE.SphereGeometry(radius + 0.003, segments, segments),			
			// new THREE.MeshPhongMaterial({
				// map:         THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
				// transparent: true
			// })
		// );		
	// }

	function createStars(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments), 
			new THREE.MeshBasicMaterial({
				map:  THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'), 
				side: THREE.BackSide
			})
		);
	}

	function randomInt(start,end){
		   return Math.floor(Math.random() * (end - start + 1) + start);
	}	
		
		
	// ASTEROIDS
	function createAsteroids(){
		var maxWidth = 1000;
		var maxHeight = 200;
		var maxDepth = 200;
		var asteroids = [];
		for(var i=0;i<7;i++){
			asteroids.push(createAsteroid(5+Math.random()*50,5000,maxWidth,Math.random()*800,Math.random()*800));
		}
		for(var i=0;i<30;i++){
			asteroids.push(createAsteroid(5+Math.random()*20,5000,maxWidth,Math.random()*800,Math.random()*800));
		}
		for(var i=0;i<160;i++){
			asteroids.push(createAsteroid(2+Math.random()*5,5000,maxWidth,Math.random()*800,Math.random()*800));
		}
		return asteroids;
	}



	function createAsteroid(size, spreadX, maxWidth, maxHeight, maxDepth) {
		geometry = new THREE.DodecahedronGeometry(size, 1);
		geometry.vertices.forEach(function(v){
			v.x += (0-Math.random()*(size/4));
			v.y += (0-Math.random()*(size/4));
			v.z += (0-Math.random()*(size/4));
		})
		var color = '#111111';
		color = ColorLuminance(color,2+Math.random()*10);
		// console.log(color);
		if (space.wireframe) {
			// WIREFRAME
			texture = new THREE.MeshPhongMaterial({
				color: "lime",
				wireframe: true,
				side: THREE.DoubleSide,
			});
		}
		else {
			texture = new THREE.MeshPhongMaterial({color:color,
				flatShading: THREE.FlatShading,
				shininess: 0.01,
				map: THREE.ImageUtils.loadTexture('textures/asteroid.jpg'),
			});
		}

		cube = new THREE.Mesh(geometry, texture);
		cube.castShadow = true;
		cube.receiveShadow = true;
		cube.scale.set(1+Math.random()*0.4,1+Math.random()*0.8,1+Math.random()*0.4);
		//cube.rotation.y = Math.PI/4;
		//cube.rotation.x = Math.PI/4;
		var x = spreadX/2-Math.random()*spreadX;
		var centeredness = 1-(Math.abs(x)/(maxWidth/2));
		var y = (maxHeight/2-Math.random()*maxHeight)*centeredness
		var z = (maxDepth/2-Math.random()*maxDepth)*centeredness
		cube.position.set(x,y,z)
		cube.r = {};
		cube.r.x = Math.random() * 0.005;
		cube.r.y = Math.random() * 0.005;
		cube.r.z = Math.random() * 0.005;
		return cube;
	};
	
	function ColorLuminance(hex, lum) {

		// validate hex string
		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		if (hex.length < 6) {
			hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		}
		lum = lum || 0;

		// convert to decimal and change luminosity
		var rgb = "#", c, i;
		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i*2,2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			rgb += ("00"+c).substr(c.length);
		}

		return rgb;
	}
	


	this.select3DCssSolarSystem = function(planet_name) {
		$("#solar-system").removeClass().addClass(planet_name);
		$("."+planet_name).parent().find('a').removeClass('active');
		$("."+planet_name).addClass('active');
	}
	
	this.showHover = function() {
		if ($('#universe').is(":visible") || (view != "hover")) {
			view = "hover";
			audioPlay("switch"); 
			$('#universe').hide();
			$('#controls').hide();
			$(".line").hide();
			
			// HAVE TO FORCE RESET OF CAMERA AND CONTROLS. OTHERWISE PLANET WILL BE DISPLACED.
			camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );
			controls = new THREE.TrackballControls(camera);
			controls.minDistance = 500;
			controls.maxDistance = 1000;
			controls.rotateSpeed = 0.005;
			if ((this.wireframe) || (this.force_controls)) controls.enabled = true; else controls.enabled = false;
			controls.noPan = true;
			
			this.drawObject(this.object_name);
		}
	}
	
	this.showSideView = function() {
		if ($('body').is(".view-2D")) {
			audioPlay("bop"); 
			$("body").removeClass("view-2D").addClass("view-3D"); 
			this.showSolarSystem(false);
		}
		else {
			this.showSolarSystem(true);
		}
	}
	
	this.showTopView = function() {
		if ($('body').is(".view-3D")) {
			audioPlay("bop"); 
			$("body").removeClass("view-3D").addClass("view-2D"); 
			this.showSolarSystem(false);
		}
		else {
			this.showSolarSystem(true);
		}
	}
	
	this.showCompare = function() {
		if ($('body').is(".zoom-large")) {
			audioPlay("doopdoop"); 
			$("body").removeClass("zoom-large").addClass("zoom-close");
			this.showSolarSystem(false);
		}
		else {
			this.showSolarSystem(true);
		}
	}
	
	this.showPlanet = function(iobject_name) {
		if (iobject_name != "") this.object_name = iobject_name;
		if ($('#universe').is(":visible") || (view != "front")) {
			view = "front";
			audioPlay("switch"); 
			$('#universe').hide();
			$('#controls').hide();
			controls.enabled = true;
			// SELECT 3DCssSolarSystem
			this.select3DCssSolarSystem(this.object_name);
			this.drawObject(this.object_name);
		}
	}
	
	this.hidePlanet = function() {
		$(".line").hide();
		$(".textcontainer").hide();
		scene.remove(sphere);
		if (this.object_name == "saturn") {
			scene.remove(ring);
		}
		else if (this.object_name == "asteroids") {
			this.hideAsteroids();
		}
	}
	
	this.showAsteroids = function() {
		asteroids.forEach(function(obj){
			scene.add(obj);
		})
	}
	
	this.hideAsteroids = function() {
		asteroids.forEach(function(obj){
			scene.remove(obj);
		})
	}
	
	this.showSolarSystem = function(allowSound) {
		if ($('#universe').is(":hidden")) {
			if (allowSound) {audioPlay("switch");}
			$("h1").html("The Solar System");
			$('#universe').show();
			$('#controls').show();
			controls.enabled = true;
			this.hidePlanet();
		}
	}
	
	this.showOrbit = function() {
		if ($('body').is(".zoom-close")) {
			audioPlay("doopdoop"); 
			$("body").removeClass("zoom-close").addClass("zoom-large");
			this.showSolarSystem(false);
		}
		else {
			this.showSolarSystem(true);
		}
	}
	
	function hide3DCssSolarSystem() {
		$('#universe').hide();
		$('#controls').hide();
	}
	
	function rotateObject(object,degreeX=0, degreeY=0, degreeZ=0){
		degreeX = (degreeX * Math.PI)/180;
		degreeY = (degreeY * Math.PI)/180;
		degreeZ = (degreeZ * Math.PI)/180;

		object.rotateX(degreeX);
		object.rotateY(degreeY);
		object.rotateZ(degreeZ);
	}

	function rotateCamera(object,degreeX=0, degreeY=0, degreeZ=0){
		degreeX = (degreeX * Math.PI)/180;
		degreeY = (degreeY * Math.PI)/180;
		degreeZ = (degreeZ * Math.PI)/180;

		object.eulerOrder = "YXZ";
		object.rotate.y += degreeY;
		object.rotate.x += degreeX;

		object.rotate.z += degreeZ;
	}

	// SET UP ON WINDOW RESIZE
	window.addEventListener( 'resize', onWindowResize, false );
	
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}
	
}
