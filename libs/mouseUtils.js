// Calculate mouse position in normalized device coordinates
// (-1 to +1) for both components
function mouseNDCXY(event){
      var mouse=new THREE.Vector2();
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;		
      return mouse;
}
function mouseOnScreen2D(event){
      var mouse=new THREE.Vector2();
      mouse.x =  event.clientX ;
      mouse.y =  event.clientY;		
      return mouse;
}
//Project mouse position to the plane XY
//flag is a flag to modifies existing mouse variable
function mousePosition3D(event,flag){
    flag= flag || false;
    if(!flag) var mouse=mouseNDCXY(event);
    else mouse=mouseNDCXY(event);
    var vector = new THREE.Vector3();
    vector.set( mouse.x ,mouse.y , 0.5 );
    vector.unproject( setup.camera);
    var dir = vector.sub( setup.camera.position ).normalize();
    var distance = -setup.camera.position.z / dir.z;
    var pos = setup.camera.position.clone().add(dir.multiplyScalar( distance ));
    return pos;
}
// Do the same that mousePosition3D() just that receive especific 2d screen position
function Position3D(position){
    var mouse=new THREE.Vector2();
    mouse.x = ( position.x / window.innerWidth ) * 2 - 1;
    mouse.y = - ( position.y / window.innerHeight ) * 2 + 1;		
    var vector = new THREE.Vector3();
    vector.set( mouse.x ,mouse.y , 0.5 );
    vector.unproject( setup.camera);
    var dir = vector.sub( setup.camera.position ).normalize();
    var distance = -setup.camera.position.z / dir.z;
    var pos = setup.camera.position.clone().add(dir.multiplyScalar( distance ));
    return pos;
}
function projectToFarPlane(event,flag){
    flag= flag || false;
    if(!flag) var mouse=mouseNDCXY(event);
    else mouse=mouseNDCXY(event);
    var vector = new THREE.Vector3();
    vector.set( mouse.x ,mouse.y , 0.9 );
   // console.log("vector antes ", vector);
    vector.unproject( setup.camera);
    vector.sub(setup.camera.position);
    vector.copy(setup.camera.position.clone().add(vector));
    return vector;
}

// Do the same that projectToFarPlane() just that receive especific 2d screen position
function project2DVectorToFarPlane(position){
    var mouse=new THREE.Vector2();
    mouse.x = ( position.x / window.innerWidth ) * 2 - 1;
    mouse.y = - ( position.y / window.innerHeight ) * 2 + 1;		
    var vector = new THREE.Vector3();
    vector.set( mouse.x ,mouse.y , 0.9 );
   // console.log("vector antes ", vector);
    vector.unproject( setup.camera);
    vector.sub(setup.camera.position);
    vector.copy(setup.camera.position.clone().add(vector));
    return vector;
}
// project mouse screen position to a world plane that pass through point and of normal normal.
// flag is a flag to modifies existing mouse variable
// point and normal  are a THREE.Vector3
function projectToPlane(event,point,normal,flag){
    flag= flag || false;
    if(!flag) var mouse=mouseNDCXY(event);
    else mouse=mouseNDCXY(event);
    var vector = new THREE.Vector3();
    vector.set( mouse.x ,mouse.y , 0.5 );
    vector.unproject( setup.camera);
    var cameraposition=setup.camera.position.clone();
    var dir = vector.sub(cameraposition).normalize();
    var t=point.clone().sub(cameraposition).dot(normal)/dir.dot(normal);
    return cameraposition.add(dir.multiplyScalar(t));
}
function project2DToPlane(position,point,normal,flag){
    flag= flag || false;
    if(!flag) var mouse=new THREE.Vector2();
    mouse.x = ( position.x / window.innerWidth ) * 2 - 1;
    mouse.y = - ( position.y / window.innerHeight ) * 2 + 1;		
    var vector = new THREE.Vector3();
    vector.set( mouse.x ,mouse.y , 0.5 );
    vector.unproject( setup.camera);
    var cameraposition=setup.camera.position.clone();
    var dir = vector.sub(cameraposition).normalize();
    var t=point.clone().sub(cameraposition).dot(normal)/dir.dot(normal);
    return cameraposition.add(dir.multiplyScalar(t));
}
function threeDToScreenSpace(v){
    var vector=v.clone().project(setup.camera);
   //var matrix = new THREE.Matrix4();
   // matrix.multiplyMatrices(setup.camera.projectionMatrix, matrix.getInverse( setup.camera.matrixWorld ));
   // console.log(vector);
   // console.log(v.clone().applyProjection(matrix));
    vector.x = Math.round((vector.x + 1) / 2 * window.innerWidth);
    vector.y = Math.round(-(vector.y - 1) / 2 * window.innerHeight);
    return new THREE.Vector2(vector.x,vector.y);    
}
