// Plane of symetry
var materialPlane = new THREE.MeshLambertMaterial({ 
    color : 'red', 
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.1
});
var materialReferencePlane = new THREE.MeshLambertMaterial({ 
    color : 'black', 
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
});

var PlaneGeometryH=new THREE.Geometry();
var ReferencePlaneGeometry=new THREE.Geometry();
PlaneGeometryH.vertices.push(
    new THREE.Vector3( -10,  15, 0 ),
	new THREE.Vector3( 10, 15, 0 ),
	new THREE.Vector3( -10, -15, 0 ),
    new THREE.Vector3( 10, -15, 0 )
);
//console.log(PlaneGeometryH.faces);
PlaneGeometryH.faces.push( new THREE.Face3(0, 1, 2));
PlaneGeometryH.faces.push( new THREE.Face3(1, 3, 2));

ReferencePlaneGeometry.vertices.push(
    new THREE.Vector3( 0,  1.25, -2.5 ),
	new THREE.Vector3( 0, -1.25, -2.5 ),
	new THREE.Vector3( 0, -1.25, 0 ),
    new THREE.Vector3( 0, 1.25, 0 )
);
ReferencePlaneGeometry.faces.push( new THREE.Face3(0, 1, 2));
ReferencePlaneGeometry.faces.push( new THREE.Face3(0, 2, 3));

var InitialPlane = new THREE.Mesh(PlaneGeometryH, materialPlane);
var ReferencePlane = new THREE.Mesh(ReferencePlaneGeometry, materialReferencePlane);
ReferencePlane.name="ReferencePlane";
InitialPlane.name="FloorPlane";
//ReferencePlane.position.set(0,3.7,0);
//ReferencePlane.rotateX(-Math.PI/4);
//ReferencePlane.rotateY(Math.PI/4);
//ReferencePlane.geometry.computeFaceNormals();
//ReferencePlane.geometry.verticesNeedUpdate=true;
//InitialPlane.rotateX(Math.PI/4);
//InitialPlane.rotateZ(Math.PI/4);

var materialTubeGeometry=new THREE.MeshPhongMaterial( { 
    color: 0x996633, 
    specular: 0xe8b53b,
    shininess: 100
} );
var materialTubeGeometrySelected=new THREE.MeshPhongMaterial( { 
    color: 0x4a3232, 
    emissive: 0x8e040b,
    specular: 0x0f0d0d,
    shininess: 100,
    shading:THREE.FlatShading
} );
var directionalLightUpper = new THREE.DirectionalLight( 0xffffff, 1 );
var directionalLightDown = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLightUpper.position.set( 0, 0, -100 );
directionalLightDown.position.set( 0, 0, 100 );
//This light's color gets applied to all the objects in the scene globally.
var light = new THREE.AmbientLight( 0x404040,0.5 ); // soft white light

//A light source positioned directly above the scene.
var lighth = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
