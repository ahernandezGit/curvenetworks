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
function drawLine(p,q,name){
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
    if(name!==undefined) line.name=name;
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
function drawProjectingOnPlane(curve,id){
    var material=new THREE.LineBasicMaterial({ color: 0x201E24, linewidth: 1, opacity:0.5});
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
    line.name="shadowOfCurve"+id.toString();
    setup.scene.add(line);
}
function draw2DCurveOnFarPlane(curve,id){
    var material=ModeManage.drawCurve.materialCurve;
    var geometry=new THREE.Geometry();
    var curve3D=[];
    
    for(var i=0;i<curve.length;i++){
        var p=project2DVectorToFarPlane(curve[i]);
        curve3D.push(p);
    }
    for(var i=0;i<curve.length-1;i++){
        geometry.vertices.push(curve3D[i],curve3D[i+1]);
    }
    var line = new THREE.LineSegments( geometry, material );
    var other=setup.scene.getObjectByName("CurrentCurve");
    if(other!== undefined) setup.scene.remove(other);
    line.name="CurrentCurve";
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
function searchIntersectedObject(name){
    for(key in ListIntersectionObjects){
        if(key==name){
            return true;
        }
    }
    return false;
}
//convert a geometry.vertices of a curve type LineSegments to a geometry.vertices like in THREE.Line  
//note that LineSegments repeat point
function LineSegmentToLineGeometry(geovert){
    var n=geovert.length;
    var result=[];
    var m=n/2;
    // n is always even 
    // if m is odd then there is even number of points (m+1)
    // if m is even then there is odd number of points (m+1)
    for(var i=0;i<m;i++){
        result.push(geovert[2*i]);
    }
    result.push(geovert[n-1]);    
    return result;
}
//convert a geometry.vertices of a curve type  THREE.Line to a geometry.vertices like in  THREE.LineSegments  
//note that LineSegments repeat point
function LineGeometryToLineSegment(geovert){
    var n=geovert.length-1;
    var result=[];
    var m=2*n;
    for(var i=0;i<n;i++){
        result.push(geovert[i]);
        if(i!=(n-1)){
            result.push(geovert[i+1]);
        }
    }
    return result;
}

function removeGuides(){
    var guides=setup.scene.getObjectByName("GuideLines"); 
    if(guides!= undefined ) {
        dispose3(guides);
        setup.scene.remove(guides);
    }
    var particlesC=setup.scene.getObjectByName("intersectPoints"); 
    if(particlesC!=undefined){
        setup.scene.remove( particlesC );
        dispose3(particlesC);
    }
}
// convert um array os THREE.VEctor3 points to screen space
function toScreenSpace(array){
    var n=array.length;
    var result=[];
    for(var i=0;i<n;i++){
        result.push(threeDToScreenSpace(array[i]));
    }
    return result;
}
function getCircle(array){
    var n=array.length;
    for(var i=0;i<n;i++){
        CIRCLEFIT.addPoint(array[i].x, array[i].y);
    }
    var result = CIRCLEFIT.compute();
    if (result.success) {
        CIRCLEFIT.resetPoints();
        return [result.center.x,result.center.y,result.radius];    
    }
    else{
        CIRCLEFIT.resetPoints();
        return [];
    } 
}
//
function mirrorOnPlaneYZ(curve){
    
    var curveg=LineSegmentToLineGeometry(curve.vertices);
    var curvevertices=[];
    for(var j=0;j<curveg.length;j++){
        var p=curveg[j].clone();
        p.setX(-p.x);
        curvevertices.push(p);
    }
    var geometry=new THREE.Geometry();
    for(var i=0;i<curvevertices.length-1;i++){
        var p=curvevertices[i];
        var q=curvevertices[i+1];
         geometry.vertices.push(p,q);
    }
    return [geometry,curvevertices];
}
//array[0] is a geometry type linesegments
//array[1] is an array of simple vertices 
//symmetric is the name of the symmetric curve
// id is the id to insert the curve in ListCruves3D. If not provided the curve is inserted at final 
function addCurve3D(array,origin,symmetric,idto){
    symmetric= symmetric || ""; 
    var geometry=array[0];
    var vertices=array[1];
    var material=new THREE.LineBasicMaterial({ color: 0x564002, linewidth: 3});
    var line = new THREE.LineSegments( geometry, material );
    if(idto!==undefined){
        var id=idto;
        if(symmetric=="")ListCurves3D.addCurve(vertices,"",idto);
        else ListCurves3D.addCurve(vertices,symmetric,idto);
        if(origin!="reconstructed"){
            ListCurves2D.addCurve([],idto);
            ListCurvesShadow.addCurve([],idto);
        }
    }
    else{
        var id=ListCurves3D.number;
        if(symmetric=="")ListCurves3D.addCurve(vertices);
        else ListCurves3D.addCurve(vertices,symmetric);    
        if(origin!="reconstructed"){
            ListCurves2D.addCurve([]);
            ListCurvesShadow.addCurve([]);
        }
    }
    line.name="Curve"+id.toString();
    setup.scene.add(line);
    var tuberender=document.getElementById("checkRender");
    var shadowrender=document.getElementById("checkShadow");
    if(tuberender.checked){
        var mesh=new THREE.Mesh(ListCurves3D.list[line.name].tube,materialTubeGeometry);
        mesh.name="Tube"+line.name;
        setup.scene.add(mesh);
    }
    if(shadowrender.checked){
        drawProjectingOnPlane(vertices,id);
    }
    console.log(ListCurves2D.number);
    console.log(ListCurvesShadow.number);
    console.log(ListCurves3D.number);
}
function isXequalsign(vertices){
   var n=0;
   var initial=vertices[0].x;    
   for(var i=1;i<vertices.length;i++){
      if(vertices[i].x*initial>=0) n++;       
   }
   if(n==vertices.length-1) return true;
   else return false;
}
//get index of points between a range [a,b]
//input is a array of points
function getPointsInRange(input,a,b){
    var result=[];
    for(var i=0;i<input.length;i++){
        if(input[i].x>=a && input[i].x<=b)  result.push(i);
    }
    return result;
}
function removeCurveFromScene(id){
    var name="Curve"+id.toString();
    var reconstructed=setup.scene.getObjectByName(name);
    var TubeReconstructed=setup.scene.getObjectByName("Tube"+name);
    var ShadowReconstructed=setup.scene.getObjectByName("shadowOfCurve"+id.toString());
    if(reconstructed!= undefined){ 
        ListCurves3D.removeCurve(name);
        ListCurves2D.removeCurve(id);
        ListCurvesShadow.removeCurve(id);
        setup.scene.remove(reconstructed);
        dispose3(reconstructed);
    }
    if(TubeReconstructed!=undefined){
        setup.scene.remove(TubeReconstructed);
        dispose3(TubeReconstructed);
    }
    if(ShadowReconstructed!=undefined){
        setup.scene.remove(ShadowReconstructed);
        dispose3(ShadowReconstructed);
    }
}
function symmetrize(){
    var n=0;
    var index=[];
    for(key in ListIntersectionObjects){
        if(ListIntersectionObjects[key].type=="LineSegments"){
            n++;
            index.push(ListIntersectionObjects[key].name);
        }
        if(ListIntersectionObjects[key].type=="Mesh" && ListIntersectionObjects[key].name.startsWith("TubeCurve")){
            n++;
            index.push(ListIntersectionObjects[key].name);
        }
    }
    if(n==1){
        if(index[0].startsWith("Tube")){
           var tubecurve=setup.scene.getObjectByName(index[0]); 
           delete ListIntersectionObjects[index[0]];
           tubecurve.material=materialTubeGeometry;    
           index[0]=index[0].substring(4,index[0].length);
        } 
        var curve=setup.scene.getObjectByName(index[0]); 
        if(isXequalsign(curve.geometry.vertices)){
            var geo=mirrorOnPlaneYZ(curve.geometry);
            var id=getAvailableIndex3DCurves();
            addCurve3D(geo,"",index[0],id);
            curve.material.linewidth=3;
            curve.material.opacity=1;    
            delete ListIntersectionObjects[index[0]];
        } 
        else{
            var array=mirrorOnPlaneYZ(curve.geometry);
            var geomirror=array[0].clone();
            var geocopy=LineSegmentToLineGeometry(curve.geometry.vertices);
            var mirrorvertices=array[1];
            var m=geocopy.length;
            var min=0;
            var max=0;
            var t=m-1;
            var geometry=new THREE.Geometry();
            if(Math.abs(geocopy[0].x)>Math.abs(geocopy[m-1].x)){
              min=m-1;
              max=0;
            } 
            else{
              min=0;
              max=m-1;    
            }
            if(max==0){
                console.log("max is 0");
                var i=0;
                while(t>=0){
                    if(i<m){
                        /*if(Math.abs(geocopy[i].x)>Math.abs(mirrorvertices[m-1].x)){
                            geometry.vertices.push(geocopy[i].clone());   
                        }    
                        else{*/
                            var a=geocopy[i].clone();
                            a.add(mirrorvertices[t]);
                            a.divideScalar(2);
                            geometry.vertices.push(a);
                            t--;
                        
                        i++;
                    }
                    else{
                        geometry.vertices.push(mirrorvertices[t].clone());
                        t--;
                    }
                }
            }
            else{
                console.log("min is 0");
                var i=0;
                while(t>=0){
                    if(i<m){
                        /*if(Math.abs(mirrorvertices[i].x)>Math.abs(geocopy[m-1].x)){
                            geometry.vertices.push(mirrorvertices[i].clone());   
                        }    
                        else{*/
                            var a=mirrorvertices[i].clone();
                            a.add(geocopy[t]);
                            a.divideScalar(2);
                            geometry.vertices.push(a);
                            t--;
                    
                        i++;
                    }
                    else{
                        geometry.vertices.push(geocopy[t].clone());
                        t--;
                    }
                }
            }
            var linegeometry=new THREE.Geometry();
            for(var j=0;j<geometry.vertices.length-1;j++){
                linegeometry.vertices.push(geometry.vertices[j],geometry.vertices[j+1]);
            }
            removeCurveFromScene(parseInt(index[0].substring(5,index[0].length)));
            addCurve3D([linegeometry,geometry.vertices],"","",parseInt(index[0].substring(5,index[0].length)));
            
        }
        delete ListIntersectionObjects[index[0]];
        ReferencePlane.material.transparent=true;
        ReferencePlane.material.opacity=0.5;    
        delete ListIntersectionObjects["ReferencePlane"];
    }
    if(n==2){
        
    }
}
function drawFarPlane(){
    function project(pos){
        var vector = new THREE.Vector3();
        vector.set( pos.x ,pos.y , 0.9 );
       // console.log("vector antes ", vector);
        vector.unproject( setup.camera);
        vector.sub(setup.camera.position);
        vector.copy(setup.camera.position.clone().add(vector));
        return vector;
    }
    var drawplane=setup.scene.getObjectByName("DrawPlane"); 
    if(ModeManage.flagDrawPlane){
        
        var leftTop=project({x:-0.8,y:0.8});
        var rightTop=project({x:0.8,y:0.8});
        var leftBot=project({x:-0.8,y:-0.8});
        var rightBot=project({x:0.8,y:-0.8});
        drawplane.geometry.vertices[0].copy(leftTop);
        drawplane.geometry.vertices[1].copy(rightTop);
        drawplane.geometry.vertices[2].copy(leftBot);
        drawplane.geometry.vertices[3].copy(rightBot);
        drawplane.geometry.verticesNeedUpdate=true;   
        if(!drawplane.visible) drawplane.visible=true;
    }
    else{
        drawplane.visible=false;
    }
}
function getAvailableIndex3DCurves(){
    var result="";
    for(key in ListCurves3D.list){
        result=key;
    }
    if (result==="") return 0;
    else return parseInt(result.substring(5,result.length))+1;
}

/*var spritey = makeTextSprite( " prova1 ", { fontsize: 24, borderColor: {r:255, g:0, b:0, a:1.0}, backgroundColor: {r:255, g:100, b:100, a:0.8} } );
spritey.position.set(0,0,0);
setup.scene.add( spritey );
*/

function getNormalDrawPlane(plane){
    var v1 = new THREE.Vector3();
    var v2 = new THREE.Vector3();
    var a=plane.geometry.vertices[0].clone();
    var b=plane.geometry.vertices[1].clone();
    var c=plane.geometry.vertices[2].clone();
    var normal = v1.subVectors( c, b ).cross( v2.subVectors( a, b ) ).normalize();
    return normal;
}
function updateLabelRotate(angle){
    var spriteRot=setup.scene.getObjectByName("wa");
    if(spriteRot!="undefined"){
        setup.scene.remove(spriteRot);
    }
    spriteRot = makeTextSprite(angle.toString() ,{ fontsize: 20, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:0.2},backgroundColor: {r:238, g:238, b:238, a:0.2} });
    spriteRot.name="wa";
    spriteRot.position.set(0,0,-11);
    setup.scene.add(spriteRot);
}
function drawVector(origin,end,name){
    var dir = end.clone().sub(origin);
    var length =dir.length();
    dir.normalize();
    var hex = 0x088A29;
    var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
    if(name!==undefined) arrowHelper.name=name;
    setup.scene.add( arrowHelper );
}
