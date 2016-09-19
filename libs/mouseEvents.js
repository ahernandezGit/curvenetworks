function onMouseClick(){
    if(ModeManage.selectObject.value){
        console.log("select mode");
        var intersects = ModeManage.selectObject.raycaster.intersectObjects(setup.scene.children);
        //console.log(intersects);
        if(intersects.length>0){
            var intersected=intersects[0];
            console.log(intersected);
            if(intersected.object.type=="Mesh" && intersected.object.name=="ReferencePlane"){
                if(searchIntersectedObject("ReferencePlane")){
                    intersected.object.material.transparent=true;
                    intersected.object.material.opacity=0.5;    
                    delete ListIntersectionObjects["ReferencePlane"];
                }
                else{
                    intersected.object.material.transparent=false;
                    intersected.object.material.opacity=1;    
                    ListIntersectionObjects["ReferencePlane"]=new IntersectionObject("ReferencePlane","Mesh");   
                }
            }
            else if(intersected.object.type=="LineSegments"){
                var name=intersected.object.name;
                if(searchIntersectedObject(name)){
                    intersected.object.material.linewidth=3;
                    intersected.object.material.opacity=1;    
                    delete ListIntersectionObjects[name];
                }
                else{
                    intersected.object.material.linewidth=6;
                    intersected.object.material.opacity=0.5;    
                    ListIntersectionObjects[name]=new IntersectionObject(name,"LineSegments");   
                }
            }
            //intersected.object.material.color.set(0xDF7401);
            /*intersected.object.material.color.set(0xDF7401);
            //intersected.material.color.setHex( INTERSECTED.currentHex );
            intersected.object.material.transparent = false;
            intersected.object.material.depthWrite  = true;
            intersected.object.material.depthTest = true;*/
        }
    }
    else{
        console.log("no select mode");
    }
}
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
    if(ModeManage.deformCurve.value){
        var short=ModeManage.deformCurve;
        //short.isdeforming=true;
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
    if(ModeManage.selectObject.value){
        var mouse=mouseNDCXY(event);
        ModeManage.selectObject.raycaster.setFromCamera(mouse,setup.camera);	
        ModeManage.selectObject.raycaster.linePrecision=0.1;    
        
    } 
    if(ModeManage.deformCurve.value){
        var short=ModeManage.deformCurve;
        var mouse=mouseNDCXY(event);
        short.raycaster.setFromCamera(mouse,setup.camera);	
        short.raycaster.linePrecision=0.1;    
        //console.log(short.raycaster);
        var intersects = short.raycaster.intersectObjects(setup.scene.children);
        //console.log(intersects);
        if(intersects.length>0){
            var intersected=intersects[0];
            //console.log(intersected);
            if(intersected.object.type=="LineSegments"){
               //if(!short.isdeforming){
                    short.intersected=true;
                    short.pointgeometry.vertices[0].copy(intersected.object.geometry.vertices[intersected.index]);
                    var particlesC=setup.scene.getObjectByName("intersectPoints"); 
                    if(particlesC!=undefined) particlesC.geometry.verticesNeedUpdate=true;
                    
               //}   
            }
            else short.intersected=false;
        }

        //short.isdeforming=true;
    }
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
    if(ModeManage.deformCurve.value){
        var short=ModeManage.deformCurve;
        if(!short.isdeforming) return;
        short.isdeforming=false;
        
    }
}

function onKeyDown(){
    var event=d3.event;
    //letter d
    if(event.keyCode == 68){
        ModeManage.focus(0);
        setup.controls.enabled=false;
        removeGuides();
    }
    //letter esc
    if(event.keyCode == 27){
        ModeManage.focus();
        removeGuides();
        setup.controls.enabled=true;
    }
    //letter s
    if(event.keyCode == 83){
        ModeManage.focus(1);
        setup.controls.enabled=false;
        ModeManage.drawGuidesLine.geometry.vertices=[];
        ModeManage.drawGuidesLine.geometry.vertices.push(new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0));
        ModeManage.drawGuidesLine.geometry.vertices.push(new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0));
        ModeManage.drawGuidesLine.geometry.computeLineDistances();
        var cross=new THREE.LineSegments(ModeManage.drawGuidesLine.geometry,ModeManage.drawGuidesLine.material);
        cross.name="GuideLines";
        setup.scene.add(cross);
    }
    //ctrl+z
    //letter z is 90
    if(event.keyCode == 90 && event.ctrlKey){
        backFunction();
    }
    //letter p
    if(event.keyCode == 80){
        ModeManage.focus(3);
        setup.controls.enabled=false; 
        removeGuides();
    }
}

