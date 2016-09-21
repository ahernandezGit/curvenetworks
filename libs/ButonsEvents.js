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
            var name="reconstructedCurve"+(ns-1).toString();
            console.log(name);
            var reconstructed=setup.scene.getObjectByName(name);
            //setup.scene.remove(stroke);
            if(reconstructed!= undefined){ 
                ListCurves3D.popCurve();
                setup.scene.remove(reconstructed);
                dispose3(reconstructed);
            }
            ListCurves2D.popCurve();
            ListCurvesShadow.popCurve();
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
    ModeManage.focus();
    var n=ListCurves3D.number;
    for(var i=0;i<n;i++){
        var name="reconstructedCurve"+i.toString();
        var reconstructed=setup.scene.getObjectByName(name);
        if(reconstructed!= undefined){ 
            ListCurves3D.popCurve();
            setup.scene.remove(reconstructed);
            dispose3(reconstructed);
        }
    }
    n=ListCurves2D.number;
    for(var i=0;i<n;i++) ListCurves2D.popCurve();
    n=ListCurvesShadow.number;
    for(var i=0;i<n;i++) ListCurvesShadow.popCurve();
    var stroke=setup.scene.getObjectByName("CurrentCurve");
    var sstroke=setup.scene.getObjectByName("shadowOfCurve");
    if(stroke!=undefined){
        setup.scene.remove(stroke);
        dispose3(stroke);
    }
    if(sstroke!=undefined){    
        setup.scene.remove(sstroke);    
        dispose3(sstroke);    
    }
    
}
d3.select("#backButton").on("click",backFunction);
d3.select("#deformButton").on("click",deformFunction);
d3.select("#joinButton").on("click",joinCurveFunction);
d3.select("#clearButton").on("click",clear);