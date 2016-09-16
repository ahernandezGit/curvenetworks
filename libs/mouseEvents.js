function onMouseDown(){
    var event=d3.event;
    if(ModeManage.drawCurve.value){
        var short=ModeManage.drawCurve;
        short.isdrawing = true;
        short.LineStroke = new THREE.Object3D();
        short.LineStroke.name="CurrentCurve";
        setup.scene.add(short.LineStroke);
        short.LastPoint=projectToFarPlane(event);
        short.pointsStroke.push(short.LastPoint);  
        short.pointsStroke2D.push(mouseOnScreen2D(event));  
        //console.log("mousedown");
    }
    if(ModeManage.drawShadow.value){
        var short=ModeManage.drawShadow;
        ModeManage.drawGuidesLine.value=true;
        short.isdrawing = true;
        short.LineStroke = new THREE.Object3D();
        short.LineStroke.name="CurrentCurveShadow";
        setup.scene.add(short.LineStroke);
        short.LastPoint=mousePosition3D(event);
        short.pointsStroke.push(short.LastPoint); 
        short.pointsStroke2D.push(mouseOnScreen2D(event)); 
        var shadowOfCurve=setup.scene.getObjectByName("shadowOfCurve"); 
        if(shadowOfCurve!= undefined ) {
            setup.scene.remove(shadowOfCurve);
            dispose3(shadowOfCurve);
        }
    }
}
function onMouseMove() {
    var event=d3.event;
    if(ModeManage.drawCurve.value){
        var short=ModeManage.drawCurve;
        
        if(!short.isdrawing) return;
        short.currentPoint=projectToFarPlane(event);
        short.pointsStroke.push(short.currentPoint);
        short.pointsStroke2D.push(mouseOnScreen2D(event));  
        var geometryLine = new THREE.Geometry();
        geometryLine.vertices.push(short.LastPoint,short.currentPoint);
        short.LastPoint=short.currentPoint;
        var line = new THREE.Line( geometryLine, short.materialCurve );
        short.LineStroke.add(line);
    }
    if(ModeManage.drawShadow.value){
        var short=ModeManage.drawShadow;
        var guides=setup.scene.getObjectByName("GuideLines"); 
        if(short.isdrawing){
            short.currentPoint=mousePosition3D(event);
            short.pointsStroke.push(short.currentPoint);
            short.pointsStroke2D.push(mouseOnScreen2D(event));  
            var geometryLine = new THREE.Geometry();
            geometryLine.vertices.push(short.LastPoint,short.currentPoint);
            short.LastPoint=short.currentPoint;
            var line = new THREE.Line( geometryLine, short.materialCurve );
            short.LineStroke.add(line);
        }
        else{
            var onXYplane=mousePosition3D(event);
            if(guides!=undefined){
                guides.geometry.vertices[0].set(Math.min(-10,onXYplane.x),onXYplane.y,0);
                guides.geometry.vertices[1].set(Math.max(10,onXYplane.x),onXYplane.y,0);
                guides.geometry.vertices[2].set(onXYplane.x,Math.min(-15,onXYplane.y),0);
                guides.geometry.vertices[3].set(onXYplane.x,Math.max(15,onXYplane.y),0);
                guides.geometry.verticesNeedUpdate = true;
                guides.geometry.computeLineDistances();
                guides.geometry.lineDistancesNeedUpdate=true;
            }
        }
    }
    else ModeManage.drawGuidesLine.value=false;

}
function onMouseUp() {
    var event=d3.event;
    if(ModeManage.drawCurve.value){
        var short=ModeManage.drawCurve;
        if(!ModeManage.drawCurve.isdrawing) return;
        short.isdrawing = false;
        //converting points to parametricCurve
        var idcurve=ListCurves2D.addCurve(short.pointsStroke2D);
        //ListCurves2D.listObjects[idcurve].draw("curve2d");
        //setup.scene.remove(short.LineStroke);
        //dispose3(short.LineStroke);
        drawProjectingOnPlane(short.pointsStroke);
        short.pointsStroke=[];
        //var cp=getCriticalPoints(short.pointsStroke2D);
        var cp=ListCurves2D.listCP[idcurve];
        /*var arraycp=[];
        for(var j=0;j<cp.length;j++){
            arraycp.push(project2DVectorToFarPlane(short.pointsStroke2D[cp[j]]));
        }
        drawPoints(arraycp);
        console.log(arraycp);*/
        short.pointsStroke2D=[];
        //setup.scene.remove( short.LineStroke );
        //console.log("mouseup");
    }
    if(ModeManage.drawShadow.value){
        var short=ModeManage.drawShadow;
        ModeManage.drawGuidesLine.value=false;
        if(!short.isdrawing) return;
        short.isdrawing = false;
        //converting points to parametricCurve
        var idcurve=ListCurvesShadow.addCurve(short.pointsStroke2D);
        //ListCurvesShadow.listObjects[idcurve].draw("shadow");
        //setup.scene.remove(short.LineStroke);
        //dispose3(short.LineStroke);
        short.pointsStroke=[];
        var cp=ListCurvesShadow.listCP[idcurve];
        //console.log(cp);
        /*var arraycp=[];
        for(var j=0;j<cp.length;j++){
            arraycp.push(Position3D(short.pointsStroke2D[cp[j]]));
        }
        drawPoints(arraycp);
        console.log(arraycp);*/
        var match=matchCriticalPoints(idcurve,ListCurves2D,ListCurvesShadow);
        if(match){
            var pxyz=reconstruct3DCurve(idcurve,ListCurves2D,ListCurvesShadow);
            var stroke=setup.scene.getObjectByName("CurrentCurve");
            var strokeS=setup.scene.getObjectByName("CurrentCurveShadow");
            setup.scene.remove(stroke);
            setup.scene.remove(strokeS);
            dispose3(stroke);
            dispose3(strokeS);
            ListCurves3D.addCurve(pxyz);
        }
        else{
            ListCurvesShadow.popCurve();
            var stroke=setup.scene.getObjectByName("CurrentCurveShadow");
            setup.scene.remove(stroke);
            dispose3(stroke);
        }
        short.pointsStroke2D=[];
    }
}

function onKeyDown(){
    var event=d3.event;
    if(event.keyCode == 68){
        ModeManage.drawCurve.value=true;
        ModeManage.drawShadow.value=false;
        ModeManage.drawGuidesLine.value=false;
        setup.controls.enabled=false;
        var guides=setup.scene.getObjectByName("GuideLines"); 
        if(guides!= undefined ) {
            dispose3(guides);
            setup.scene.remove(guides);
        }
        
    }
    if(event.keyCode == 27){
        ModeManage.drawCurve.value=false;
        ModeManage.drawShadow.value=false;
        ModeManage.drawGuidesLine.value=false;
        var guides=setup.scene.getObjectByName("GuideLines"); 
        if(guides!= undefined ) {
            setup.scene.remove(guides);
            dispose3(guides);
        }
        setup.controls.enabled=true;
    }
    if(event.keyCode == 83){
        ModeManage.drawShadow.value=true;
        ModeManage.drawCurve.value=false;
        setup.controls.enabled=false;
        ModeManage.drawGuidesLine.geometry.vertices=[];
        ModeManage.drawGuidesLine.geometry.vertices.push(new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0));
        ModeManage.drawGuidesLine.geometry.vertices.push(new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0));
        ModeManage.drawGuidesLine.geometry.computeLineDistances();
        var cross=new THREE.LineSegments(ModeManage.drawGuidesLine.geometry,ModeManage.drawGuidesLine.material);
        cross.name="GuideLines";
        setup.scene.add(cross);
    }
    if(event.keyCode == 90 && event.ctrlKey){
        backFunction();
    }
}

