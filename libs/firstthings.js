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
var materialDrawPlane = new THREE.MeshLambertMaterial({ 
    color : 'black', 
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
});

var PlaneGeometryH=new THREE.Geometry();
var ReferencePlaneGeometry=new THREE.Geometry();
var DrawPlaneGeometry=new THREE.Geometry();
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

DrawPlaneGeometry.vertices.push(
    new THREE.Vector3( -10,  0, 10 ),
	new THREE.Vector3( 10, 0, 10 ),
	new THREE.Vector3( -10, 0, -10 ),
    new THREE.Vector3( 10, 0, -10 )
);
//console.log(PlaneGeometryH.faces);
DrawPlaneGeometry.faces.push( new THREE.Face3(0, 1, 2));
DrawPlaneGeometry.faces.push( new THREE.Face3(1, 3, 2));


var InitialPlane = new THREE.Mesh(PlaneGeometryH, materialPlane);
var ReferencePlane = new THREE.Mesh(ReferencePlaneGeometry, materialReferencePlane);
var DrawPlane = new THREE.Mesh(DrawPlaneGeometry, materialDrawPlane);
ReferencePlane.name="ReferencePlane";
InitialPlane.name="FloorPlane";
DrawPlane.name="DrawPlane";
DrawPlane.visible=false;

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


function makeTextSprite( message, parameters ){
    if ( parameters === undefined ) parameters = {};
    var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
    var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
    var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
    var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var size = 64;
    canvas.height = size;
    canvas.width = size;
    context.font = "Bold " + fontsize + "px " + fontface;
    var metrics = context.measureText( message );
    var textWidth = metrics.width;

    context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;
    roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

    context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
    context.fillText( message, borderThickness, fontsize + borderThickness);

    var texture = new THREE.Texture(canvas) 
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial( { map: texture} );
    var sprite = new THREE.Sprite( spriteMaterial );
    //sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
    sprite.scale.set(2,2,2);
    return sprite;  
}
// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();   
}

/*var spriteRot = makeTextSprite( "←",{ fontsize: 20, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:0.5},backgroundColor: {r:238, g:238, b:238, a:1} });
spriteRot.position.set(-10,0,10);
DrawPlane.add( spriteRot );*/


