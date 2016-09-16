//draw a point in the scene
function drawPoint(v){
    var pointmaterial = new THREE.PointsMaterial( {color: 0x27B327, size: 10.0, sizeAttenuation: false, alphaTest: 0.5 } );
    var pointGeometry = new THREE.Geometry();
    pointGeometry.vertices.push(v);
    var particle=setup.scene.getObjectByName("pointTest");
    if(particle!=undefined){
        setup.scene.remove(particle);
        particle = new THREE.Points( pointGeometry, pointmaterial );
    }
    else particle = new THREE.Points( pointGeometry, pointmaterial );
    particle.name="pointTest";
    setup.scene.add(particle);
}
function drawPoints(vs){
    var pointmaterial = new THREE.PointsMaterial( {color: 0x27B327, size: 10.0, sizeAttenuation: false, alphaTest: 0.5 } );
    var pointGeometry = new THREE.Geometry();
    var n=vs.length;
    for(var i=0;i<n;i++){
        pointGeometry.vertices.push(vs[i]);   
    }
    /*var particle=setup.scene.getObjectByName("pointsTest");
    if(particle!=undefined){
        setup.scene.remove(particle);
        particle = new THREE.Points( pointGeometry, pointmaterial );
    }
    else particle = new THREE.Points( pointGeometry, pointmaterial );
    particle.name="pointsTest";*/
    var particle = new THREE.Points( pointGeometry, pointmaterial );
    setup.scene.add(particle);
}
function drawLine(p,q){
    var material=new THREE.LineBasicMaterial({ color: 0x04B431, linewidth: 1});
    var geometry=new THREE.Geometry();
    geometry.vertices.push(p,q);
    /*var line=setup.scene.getObjectByName("lineTest");
    if(line!=undefined){
        setup.scene.remove(line);
        line = new THREE.LineSegments( geometry, material );
    }
    else line = new THREE.LineSegments( geometry, material );
    line.name="lineTest";*/
    var line = new THREE.LineSegments( geometry, material );
    setup.scene.add(line);
}
//return if a number x is positive, negative or zero assuming a tolerance
//tol: tolerance
function signo(x){
    var tol=0.0001;
    if(x>tol) return 1;
    else if(x<tol) return -1;
    else return 0;
}
function drawProjectingOnPlane(curve){
    var material=new THREE.LineBasicMaterial({ color: 0x7401DF, linewidth: 1});
    var geometry=new THREE.Geometry();
    for(var i=0;i<curve.length-1;i++){
        var p=new THREE.Vector3(curve[i].x,curve[i].y,0);
        var q=new THREE.Vector3(curve[i+1].x,curve[i+1].y,0);
        geometry.vertices.push(p,q);
    }
    /*var line=setup.scene.getObjectByName("lineTest");
    if(line!=undefined){
        setup.scene.remove(line);
        line = new THREE.LineSegments( geometry, material );
    }
    else line = new THREE.LineSegments( geometry, material );
    line.name="lineTest";*/
    var line = new THREE.LineSegments( geometry, material );
    line.name="shadowOfCurve";
    setup.scene.add(line);
}
// mirror indexes from IndexArray in a array of size n
function mirrorIndexArray(IndexArray,n){
    for(var i=1;i<IndexArray.length;i++){
        IndexArray[i]=n-IndexArray[i]-1;
    }
}
//apply laplacian smooth to a curve
//curve is a array of THREE.Vector*()
function laplacianSmooth(curve){
    var n=curve.length;
    var m=n-2;
    for(var i=1;i<=m;i++){
        var laplacian=curve[i-1].clone().add(curve[i+1]);
        laplacian.multiplyScalar(0.5);
        laplacian.sub(curve[i]);
        var displacement=laplacian.clone().multiplyScalar(0.5);
        curve[i].add(displacement);
    }
}