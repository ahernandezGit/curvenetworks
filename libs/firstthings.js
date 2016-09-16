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

//ReferencePlane.position.set(0,3.7,0);
//ReferencePlane.rotateX(-Math.PI/4);
//ReferencePlane.rotateY(Math.PI/4);
//ReferencePlane.geometry.computeFaceNormals();
//ReferencePlane.geometry.verticesNeedUpdate=true;
//InitialPlane.rotateX(Math.PI/4);
//InitialPlane.rotateZ(Math.PI/4);

