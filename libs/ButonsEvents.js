function backFunction(){
    var nc=ListCurves2D.number;
    var ns=ListCurvesShadow.number;
    console.log("back initial");
    console.log("curves ", nc, " shadow ",nc);
    if(ns>0 || nc>0){
        if(nc>ns){
        console.log("mais curve");
        var stroke=setup.scene.getObjectByName("CurrentCurve");
        //console.log(stroke);
        setup.scene.remove(stroke);
        dispose3(stroke);
        ListCurves2D.popCurve();
        }
        else{
            console.log("mais shadow");
            //var stroke=setup.scene.getObjectByName("CurrentCurveShadow");
            var name="reconstructedCurve"+(ns-1).toString();
            console.log(name);
            var reconstructed=setup.scene.getObjectByName(name);
            //setup.scene.remove(stroke);
            if(reconstructed!= undefined) setup.scene.remove(reconstructed);
            //dispose3(stroke);
            dispose3(reconstructed);
            ListCurvesShadow.popCurve();
            ListCurves2D.listObjects[nc-1].draw("curve2d");
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
d3.select("#backButton").on("click",backFunction);
d3.select("#deformButton").on("click",deformFunction);
d3.select("#joinButton").on("click",joinCurveFunction);