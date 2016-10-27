function backFunction(){
    var nc=ListCurves2D.number;
    var ns=ListCurvesShadow.number;
    console.log("back initial");
    console.log("curves ", nc, " shadow ",ns);
    if(ns>0 || nc>0){
        if(nc>ns){
        console.log("mais curve");
        var stroke=setup.scene.getObjectByName("CurrentCurve");
        var sstroke=setup.scene.getObjectByName("shadowOfCurve");
        //console.log(stroke);
        setup.scene.remove(stroke);
        setup.scene.remove(sstroke);    
        dispose3(stroke);
        dispose3(sstroke);    
        ListCurves2D.popCurve();
        }
        else if(ns>nc){
            console.log("mais shadow");
            var stroke=setup.scene.getObjectByName("CurrentCurveShadow");
            if(stroke!=undefined) setup.scene.remove(stroke);
            dispose3(stroke);
            ListCurvesShadow.popCurve();
            //ListCurves2D.listObjects[nc-1].draw("curve2d");
        }
        else{
            removeCurveFromScene(ns-1);
        }
        console.log("back after");
        console.log("curves ", ListCurves2D.number, " shadow ",ListCurvesShadow.number);    
    }
}
function deformFunction(){
     ModeManage.focus(4);
     setup.controls.enabled=false;
     ModeManage.deformCurve.pointgeometry.vertices=[new THREE.Vector3()];
     var particlesC = new THREE.Points( ModeManage.deformCurve.pointgeometry, ModeManage.deformCurve.pointmaterial );
     particlesC.name="intersectPoints";
     setup.scene.add( particlesC );
}
function joinCurveFunction(){
     ModeManage.focus(5);
     setup.controls.enabled=false;
}
function clear(){
    ModeManage.clean();
    
    var n=ListCurves3D.number;
    for(var i=0;i<n;i++){
        //var name="Curve"+i.toString();
        //var reconstructed=setup.scene.getObjectByName(name);
        //if(reconstructed!= undefined){ 
            ListCurves3D.popCurve();
            //setup.scene.remove(reconstructed);
           // dispose3(reconstructed);
       // }
    }
    n=ListCurves2D.number;
    for(var i=0;i<n;i++) ListCurves2D.popCurve();
    n=ListCurvesShadow.number;
    for(var i=0;i<n;i++) ListCurvesShadow.popCurve();
   /* var stroke=setup.scene.getObjectByName("CurrentCurve");
    var sstroke=setup.scene.getObjectByName("shadowOfCurve");
    if(stroke!=undefined){
        setup.scene.remove(stroke);
        dispose3(stroke);
    }
    if(sstroke!=undefined){    
        setup.scene.remove(sstroke);    
        dispose3(sstroke);    
    }*/
    for (var i = setup.scene.children.length - 1; i >= 0 ; i -- ) {
        var obj = setup.scene.children[i];
        if ( obj.name !== "ReferencePlane" && obj.name !== "FloorPlane" && obj.type !== "HemisphereLight" 
           && obj.type !== "AmbientLight" && obj.type!== "DirectionalLight" && obj.name !=="DrawPlane") {
            setup.scene.remove(obj);
            dispose3(obj);
        }
    }
    DrawPlane.visible=false;
    ModeManage.focus();
}
function RenderTubes(){
    var tuberender=document.getElementById("checkRender");
    var n=ListCurves3D.number;
    if(tuberender.checked){
        if(n>0){
            for(key in ListCurves3D.list){
                var mesh=new THREE.Mesh(ListCurves3D.list[key].tube,materialTubeGeometry);
                mesh.name="Tube"+ListCurves3D.list[key].name;
                setup.scene.add(mesh);
            }   
        }
    }
    else{
        if(n>0){
            for(key in ListCurves3D.list){
                var mesh=setup.scene.getObjectByName("Tube"+key);
                if(mesh!=undefined){
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
            for(key in ListCurves3D.list){
                drawProjectingOnPlane(ListCurves3D.list[key].controlpoints,t);
                t++;
            }   
        }
    }
    else{
        if(n>0){
            for(key in ListCurves3D.list){
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
d3.select("#backButton").on("click",backFunction);
d3.select("#deformButton").on("click",deformFunction);
d3.select("#joinButton").on("click",joinCurveFunction);
d3.select("#clearButton").on("click",clear);
d3.select("#checkRender").on("click",RenderTubes);
d3.select("#checkShadow").on("click",RenderShadows);