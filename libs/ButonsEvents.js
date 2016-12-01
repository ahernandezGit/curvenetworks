function backFunction(){
    CommandManager.undo();
}
function deformFunction(){
     ModeManage.focus(4);
     setup.controls.enabled=false;
     ModeManage.deformCurve.pointgeometry.vertices=[new THREE.Vector3()];
     var particlesC=setup.scene.getObjectByName("intersectPoints"); 
     if(particlesC!==undefined) setup.scene.remove(particlesC);
     particlesC = new THREE.Points( ModeManage.deformCurve.pointgeometry, ModeManage.deformCurve.pointmaterial );
     particlesC.name="intersectPoints";
     particlesC.visible=false;
     setup.scene.add( particlesC );
}
function joinCurveFunction(){
     ModeManage.focus(5);
     setup.controls.enabled=false;
}
function clear(){
    ModeManage.clean();
    var n=ListCurves3D.number;
    for(var i=0;i<n;i++) ListCurves3D.popCurve();
    n=ListCurves2D.number;
    for(var i=0;i<n;i++) ListCurves2D.popCurve();
    n=ListCurvesShadow.number;
    for(var i=0;i<n;i++) ListCurvesShadow.popCurve();
    
    for (var i = setup.scene.children.length - 1; i >= 0 ; i -- ) {
        var obj = setup.scene.children[i];
        if ( obj.name !== "ReferencePlane" && obj.name !== "FloorPlane" && obj.type !== "HemisphereLight" 
           && obj.type !== "AmbientLight" && obj.type!== "DirectionalLight" && obj.name !=="DrawPlane") {
            setup.scene.remove(obj);
            dispose3(obj);
        }
    }
    ListIntersectionObjects.reset();
    DrawPlane.visible=false;
    planeToDraw.reset();
    ModeManage.focus(3);
}
function RenderTubes(){
    var tuberender=document.getElementById("checkRender");
    var n=ListCurves3D.number;
    if(tuberender.checked){
        if(n>0){
            for(var key in ListCurves3D.list){
                setup.scene.add(ListCurves3D.list[key].tube);
            }   
        }
    }
    else{
        if(n>0){
            for(key in ListCurves3D.list){
                var mesh=setup.scene.getObjectByName("Tube"+key);
                if(mesh!==undefined){
                  setup.scene.remove(mesh);
                  dispose3(mesh);  
                } 
            }
        }
    }
}
function RenderShadows(){
    var tuberender=document.getElementById("checkShadow");
    var n=ListCurves3D.number;
    if(tuberender.checked){
        if(n>0){
            var t=0;
            for(var key in ListCurves3D.list){
                drawProjectingOnPlane(ListCurves3D.list[key].controlpoints,t);
                t++;
            }   
        }
    }
    else{
        if(n>0){
            for(var key in ListCurves3D.list){
                var meshshadow=setup.scene.getObjectByName("shadowOf"+key);
                if(meshshadow!=undefined){
                  setup.scene.remove(meshshadow);
                  dispose3(meshshadow);  
                } 
            }
        }
    }
}
function FlexibleMode(){
    var reconstructionMode=document.getElementById("checkMode");
    if(reconstructionMode.checked) flexibleMode=false;
    else FlexibleMode=true;
}
var planeToDraw=new planetoDraw(DrawPlane);
function ShowDrawPlane(){
    var dpobj=document.getElementById("checkDP");
    if(dpobj.checked) DrawPlane.visible=true;
    else DrawPlane.visible=false;
}
function deleteObject(){
    var number=0; 
    CommandManager.execute({
          execute: function(){
             if(ListIntersectionObjects.n>0){
                for (var key in ListIntersectionObjects.list) {
                    var name=key;
                    ListIntersectionObjects.remove(name);
                    if(name.startsWith("TubeCurve")) var id=name.substring(9,name.length);
                    else if(name.startsWith("Curve")) var id=name.substring(5,name.length);
                    ListCurves3D.listRemoved.push(ListCurves3D.list["Curve"+id]);
                    ListCurves2D.listRemoved.push(ListCurves2D.listPoints2D[id]);
                  ListCurvesShadow.listRemoved.push([ListCurvesShadow.listPoints2D[id],ListCurvesShadow.listResidualShadows[id]]);
                    removeCurveFromScene(parseInt(id));
                    console.log("Curve "+id+" deleted");
                    number++;
                }
             }
          },
          unexecute: function(){
            for(var i=0;i<number;i++){
                 var curvedeleted3D=ListCurves3D.listRemoved.pop();
                 var curvedeleted2D=ListCurves2D.listRemoved.pop();
                 var curvedeletedShadow=ListCurvesShadow.listRemoved.pop();
                 var name=curvedeleted3D.name;
                 var id=name.substring(5,name.length);
                 ListCurves2D.addCurve(curvedeleted2D,parseInt(id));
                 ListCurvesShadow.addCurve(curvedeletedShadow[0]);
                 ListCurvesShadow.listResidualShadows[id]=curvedeletedShadow[1];
                 addCurve3D(curvedeleted3D.controlpoints,"reconstructed",curvedeleted3D.symmetric,id);
                 ListCurves3D.list[name].history=curvedeleted3D.history;
                 console.log("Back in scene deleted curve "+id);           
            }
          }
    });
}
d3.select("#backButton").on("click",backFunction);
d3.select("#deformButton").on("click",deformFunction);
d3.select("#joinButton").on("click",joinCurveFunction);
d3.select("#delButton").on("click",deleteObject);
d3.select("#clearButton").on("click",clear);
d3.select("#checkRender").on("click",RenderTubes);
d3.select("#checkShadow").on("click",RenderShadows);
d3.select("#checkDP").on("click",ShowDrawPlane);