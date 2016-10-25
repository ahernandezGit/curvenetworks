function onMouseClick(){
    if(ModeManage.selectObject.value){
        var intersects = ModeManage.selectObject.raycaster.intersectObjects(setup.scene.children);
        //console.log(intersects);
        if(intersects.length>0){
            var intersected=intersects[0];
            console.log(intersects);
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
                    symmetrize();
                }
            }
            else if(intersected.object.type=="Mesh" && intersected.object.name.startsWith("TubeCurve")){
                var name=intersected.object.name;
                if(searchIntersectedObject(name)){
                    /*intersected.object.material.color.set(0x996633);
                    intersected.object.material.emissive.set(0x000000);
                    intersected.object.material.especular=0xe8b53b;
                    intersected.object.material.shading=THREE.SmoothShading;*/
                    intersected.object.material=materialTubeGeometry;
                    delete ListIntersectionObjects[name];
                    var perfilshadow=setup.scene.getObjectByName("PerfilCurve");
                    if(perfilshadow!=undefined){
                        setup.scene.remove(perfilshadow);
                        dispose3(perfilshadow);
                    }
                }
                else{
                    /*intersected.object.material.color.set(0x4a3232);
                    intersected.object.material.emissive.set(0x8e040b);
                    intersected.object.material.especular=0x0f0d0d;
                    intersected.object.material.shading=THREE.FlatShading;*/
                    intersected.object.material=materialTubeGeometrySelected;
                    ListIntersectionObjects[name]=new IntersectionObject(name,"Mesh");
                    var perfilshadow=setup.scene.getObjectByName("PerfilCurve");
                    if(perfilshadow!=undefined){
                        setup.scene.remove(perfilshadow);
                        dispose3(perfilshadow);
                    }
                }
            }
            else if(intersected.object.type=="LineSegments"){
                var name=intersected.object.name;
                if(searchIntersectedObject(name)){
                    if(name.startWith("shadow")) intersected.object.material.linewidth=1;
                    else intersected.object.material.linewidth=3;
                    intersected.object.material.opacity=1;    
                    delete ListIntersectionObjects[name];
                }
                else{
                    intersected.object.material.linewidth=6;
                    intersected.object.material.opacity=0.5;    
                    ListIntersectionObjects[name]=new IntersectionObject(name,"LineSegments");   
                }
            }
        }
    }
    /*if(ModeManage.drawCurve.value){
        var intersects = ModeManage.drawCurve.raycaster.intersectObjects([DrawPlane,InitialPlane,ReferencePlane]);
        var intersected=intersects[0];
        if(intersected!=undefined && intersected.object.name==="DrawPlane"){
            if(searchIntersectedObject("DrawPlane")){
                 DrawPlane.material.opacity=0.2;
                 ModeManage.drawCurve.selected=false;
                 setup.controls.enabled=false; 
                 delete ListIntersectionObjects["DrawPlane"];
            }
            else{
                 DrawPlane.material.opacity=0.7;
                 ModeManage.drawCurve.selected=true;
                 setup.controls.enabled=true; 
                 ListIntersectionObjects["DrawPlane"]=new IntersectionObject("DrawPlane","Mesh"); 
            }    
        }
        else{
            console.log("no intersect draw plane");
       }
    }*/ 
}
function onMouseDown(){
    var event=d3.event;
    if(ModeManage.drawCurve.value){
        var short=ModeManage.drawCurve;
        /*if(short.selected){
            console.log("selected mouse down");
        }
        else{*/
            console.log("dont selected");
            short.isdrawing = true;
            short.LineStroke = new THREE.Object3D();
            short.LineStroke.name="CurrentCurve";
            short.normalDrawPlane=getNormalDrawPlane(DrawPlane);
            setup.scene.add(short.LineStroke);
            short.LastPoint=projectToPlane(event,DrawPlane.geometry.vertices[0].clone(),short.normalDrawPlane,false);
            short.pointsStroke.push(short.LastPoint);  
            short.pointsStroke2D.push(mouseOnScreen2D(event));      
        //}
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
        if(short.intersected){
            short.isdeforming=true;
            // convert THREE.LineSegment geometry to THREE.Line for work 
            var curveVertices=LineSegmentToLineGeometry(short.vertices);
            var all=[];
            var eps=Math.round(curveVertices.length/3);
            var extremes=[Math.max(0,short.handle-eps),Math.min(curveVertices.length-1,short.handle+eps)];
            //var extremes=[0,curveVertices.length-1];
            for(var i=extremes[0];i<=extremes[1];i++){
                all.push(i);
            }
            short.path=new deformed3(all,short.handle,curveVertices,setup.camera.getWorldDirection());
        }
        
    }
    if(ModeManage.joinCurves.value){
        var short=ModeManage.joinCurves;
        short.isdrawing = true;
        short.LineStroke = new THREE.Object3D();
        short.LineStroke.name="CircleCurve";
        setup.scene.add(short.LineStroke);
        short.LastPoint=projectToFarPlane(event);
        short.pointsStroke.push(short.LastPoint);  
        short.pointsStroke2D.push(mouseOnScreen2D(event));
    }
}

function onMouseMove() {
    var event=d3.event;
    if(ModeManage.drawCurve.value){
        var short=ModeManage.drawCurve;
        /*var mouse=mouseNDCXY(event);
        short.raycaster.setFromCamera(mouse,setup.camera);	
        if(short.selected){
            console.log("selected move");
        }
        else{*/
            console.log("dont selected");
            /*var intersect = short.raycaster.intersectObjects([DrawPlane,InitialPlane,ReferencePlane]);
            if(intersect.length>0){
                var intersected=intersect[0];
                if(intersected.object.name==="DrawPlane"){
                    //intersected.object.material.transparent=false;
                    intersected.object.material.opacity=0.7;
                }
                else{
                    DrawPlane.material.opacity=0.2;
                }
            }
            else DrawPlane.material.opacity=0.2;
            */
            if(!short.isdrawing) return;
            short.currentPoint=projectToPlane(event,DrawPlane.geometry.vertices[0].clone(),short.normalDrawPlane,false);
            short.pointsStroke.push(short.currentPoint);
            short.pointsStroke2D.push(mouseOnScreen2D(event));  
            var geometryLine = new THREE.Geometry();
            geometryLine.vertices.push(short.LastPoint,short.currentPoint);
            short.LastPoint=short.currentPoint;
            var line = new THREE.Line( geometryLine, short.materialCurve );
            short.LineStroke.add(line);   
       //}
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
        var intersects = ModeManage.selectObject.raycaster.intersectObjects(setup.scene.children);
        if(intersects.length>0){
            var intersected=intersects[0];
            if(intersected.object.type=="Mesh" && intersected.object.name.startsWith("TubeCurve")){
                var pathLineGeometry=new THREE.Geometry();
                var name=intersected.object.name.substring(4,intersected.object.name.length);
                var meshshadow=setup.scene.getObjectByName("shadowOf"+name.toString());
                var mesh=setup.scene.getObjectByName(name);
                if(meshshadow!=undefined){
                  var shadowvertices=meshshadow.geometry.vertices;
                  for(var i=0;i<shadowvertices.length;i++){
                      pathLineGeometry.vertices.push(mesh.geometry.vertices[i],shadowvertices[i]);
                  }
                  var materialpath=new THREE.LineBasicMaterial({color: 0xDF0101});
                  var line = new THREE.LineSegments( pathLineGeometry, materialpath );
                  line.name="PerfilCurve";    
                  setup.scene.add( line );    
                }
            }
            else{
                var perfilshadow=setup.scene.getObjectByName("PerfilCurve");
                if(perfilshadow!=undefined){
                    setup.scene.remove(perfilshadow);
                    dispose3(perfilshadow);
                }
            }
        }
        else{
                var perfilshadow=setup.scene.getObjectByName("PerfilCurve");
                if(perfilshadow!=undefined){
                    setup.scene.remove(perfilshadow);
                    dispose3(perfilshadow);
                }
        }
    } 
    if(ModeManage.deformCurve.value){
        var short=ModeManage.deformCurve;
        var mouse=mouseNDCXY(event);
        if(!short.isdeforming){
            short.raycaster.setFromCamera(mouse,setup.camera);	
            short.raycaster.linePrecision=0.1;    
            //console.log(short.raycaster);
            var intersects = short.raycaster.intersectObjects(setup.scene.children);
            //console.log(intersects);
            if(intersects.length>0){
                var intersected=intersects[0];
                //console.log(intersected);
                if(intersected.object.type=="LineSegments"){
                   short.intersected=true;
                   short.curvename=intersected.object.name;
                   short.vertices=intersected.object.geometry.vertices;    
                   if(!short.isdeforming){
                        short.pointgeometry.vertices[0].copy(intersected.object.geometry.vertices[intersected.index]);
                        var particlesC=setup.scene.getObjectByName("intersectPoints"); 
                        if(particlesC!=undefined) particlesC.geometry.verticesNeedUpdate=true;
                        if(intersected.index%2==0) short.handle=intersected.index/2;
                        else short.handle=(intersected.index+1)/2;
                   } 
                }
                else short.intersected=false;
            }
            else short.intersected=false;
        }
        else{
           //console.log(short.path);    
           short.path.updateHandle(mouse); 
           var editedcurve=setup.scene.getObjectByName(short.curvename); 
           if(editedcurve!=undefined) editedcurve.geometry.verticesNeedUpdate=true;          
        }
    }
    if(ModeManage.joinCurves.value){
        var short=ModeManage.joinCurves;
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
    //drawFarPlane();
}
function onMouseUp() {
    var event=d3.event;
     //drawFarPlane();
    if(ModeManage.drawCurve.value){
        var short=ModeManage.drawCurve;
        if(!ModeManage.drawCurve.isdrawing) return;
        short.isdrawing = false;
        //converting points to parametricCurve
        var idto=getAvailableIndex3DCurves();
        var idcurve=ListCurves2D.addCurve(short.pointsStroke2D,idto);
        console.log("index curve ", idcurve,idto);
        ListCurvesShadow.addCurve([],idto);
        var geometryReconstructed=new THREE.Geometry();
        for(var i=0;i<short.pointsStroke.length-1;i++){
            geometryReconstructed.vertices.push(short.pointsStroke[i],short.pointsStroke[i+1]);
        }
        addCurve3D([geometryReconstructed,short.pointsStroke],"reconstructed","",idto);
        //ListCurves2D.listObjects[idcurve].draw("curve2d");
        //setup.scene.remove(short.LineStroke);
        //dispose3(short.LineStroke);
        //drawProjectingOnPlane(short.pointsStroke);
        short.pointsStroke=[];
        //var cp=getCriticalPoints(short.pointsStroke2D);
        //var cp=ListCurves2D.listCP[idcurve];
        /*var arraycp=[];
        for(var j=0;j<cp.length;j++){
            arraycp.push(project2DVectorToFarPlane(short.pointsStroke2D[cp[j]]));
        }
        drawPoints(arraycp);
        console.log(arraycp);*/
        short.pointsStroke2D=[];
        setup.scene.remove( short.LineStroke );
        dispose3(short.LineStroke);
        //console.log("mouseup");
    }
    if(ModeManage.drawShadow.value){
        var short=ModeManage.drawShadow;
        ModeManage.drawGuidesLine.value=false;
        if(!short.isdrawing) return;
        short.isdrawing = false;
        if(short.id!=-1){
            var Curve2D=ListCurves2D.listPoints2D[short.id.toString()];
            removeCurveFromScene(short.id);
            var idcurve=ListCurvesShadow.addCurve(short.pointsStroke2D,short.id);
            var idcurvec=ListCurves2D.addCurve(Curve2D,short.id);
            console.log("indexes ",idcurve,short.id,idcurvec);
            //ListCurvesShadow.listObjects[idcurve].draw("shadow");
            //setup.scene.remove(short.LineStroke);
            //dispose3(short.LineStroke);
            short.pointsStroke=[];
            //console.log(cp);
            /*var arraycp=[];
            for(var j=0;j<cp.length;j++){
                arraycp.push(Position3D(short.pointsStroke2D[cp[j]]));
            }
            drawPoints(arraycp);
            console.log(arraycp);*/
            var match=matchCriticalPoints(idcurve,ListCurves2D,ListCurvesShadow);
            if(match){
                if(short.pointsStroke2D.length<3){
                    var geopxyz=reconstructProjectOnNormalDirection(short.pointsStroke2D[0],ListCurves2D.listPoints2D[idcurve]);
                }
                else var geopxyz=reconstruct3DCurve(idcurve,ListCurves2D,ListCurvesShadow);
                console.log(geopxyz[0].length,geopxyz[1].length);
                var stroke=setup.scene.getObjectByName("CurrentCurve");
                var strokeS=setup.scene.getObjectByName("CurrentCurveShadow");
                 if(stroke!= undefined) {
                    setup.scene.remove(stroke);
                    dispose3(stroke);
                }
                setup.scene.remove(strokeS);
                dispose3(strokeS);
                //ListCurves3D.addCurve(pxyz);
                
                addCurve3D(geopxyz,"reconstructed","",idcurve);
                short.id=-1;
                ModeManage.focus();
            }
            else{
                ListCurvesShadow.removeCurve(idcurve);
                draw2DCurveOnFarPlane(Curve2D,idcurve);
                var strokeS=setup.scene.getObjectByName("CurrentCurveShadow");
                setup.scene.remove(strokeS);
                dispose3(strokeS);
            }        
        }
        else{
            var strokes=setup.scene.getObjectByName("CurrentCurveShadow");
            var stroke=setup.scene.getObjectByName("CurrentCurve");
            setup.scene.remove(strokes);
            if(stroke!= undefined) {
                setup.scene.remove(stroke);
                dispose3(stroke);
            }
            dispose3(strokes);    
        }
        
        short.pointsStroke2D=[];
    }
    if(ModeManage.deformCurve.value){
        var short=ModeManage.deformCurve;
        if(!short.isdeforming) return;
        short.isdeforming=false;
        
    }
    if(ModeManage.joinCurves.value){
        var short=ModeManage.joinCurves;
        if(!short.isdrawing) return;
        short.isdrawing = false;
        setup.scene.remove(short.LineStroke);
        dispose3(short.LineStroke);
        var circle=getCircle(short.pointsStroke2D);
        console.log(circle);
        var center=new THREE.Vector2(circle[0],circle[1]);
        var r=circle[2];
        //store list of id curve to join
        var listid=[];
        //0 if begin and 1 if final for each curve
        var listindex=[];
        var listindexc=[];
        var listoject=[];
        for(key in ListCurves3D.list){
            /*var start=threeDToScreenSpace(ListCurves3D.listObjects[i].getPoint(0));
            var end=threeDToScreenSpace(ListCurves3D.listObjects[i].getPoint(1));*/
            var name=key;
            console.log(name);
            var curve=setup.scene.getObjectByName(name); 
            var start=threeDToScreenSpace(curve.geometry.vertices[0]);
            var end=threeDToScreenSpace(curve.geometry.vertices[curve.geometry.vertices.length-1]);
            if(start.distanceTo(center)<r){
                listid.push(parseInt(name.substring(5,name.length)));
                listindex.push(0);
                listindexc.push(0);
                console.log(start.distanceTo(center));
                continue;
            }
            if(end.distanceTo(center)<r){
                listid.push(parseInt(name.substring(5,name.length)));
                console.log(end.distanceTo(center));
                listindex.push(curve.geometry.vertices.length-1);
                listindexc.push(curve.geometry.vertices.length/2);
            }
        }
        console.log(listid);
        //console.log(listindexc);
        if(listid.length>0){
            var media=new THREE.Vector3(0,0,0);
            for(var i=0;i<listid.length;i++){
                var name="Curve"+listid[i].toString();
                var curve=setup.scene.getObjectByName(name); 
                media.add(curve.geometry.vertices[listindex[i]]);
                var curveVertices=LineSegmentToLineGeometry(curve.geometry.vertices);
                var all=[];
                //console.log(listindexc[i]);
                var eps=Math.round(curveVertices.length/2);
                var extremes=[Math.max(0,listindexc[i]-eps),Math.min(curveVertices.length-1,listindexc[i]+eps)];
                //var extremes=[0,curveVertices.length-1];
                for(var j=extremes[0];j<=extremes[1];j++){
                    all.push(j);
                }
                //console.log(extremes);
                //console.log(listindexc[i]);
                listoject.push(new deformed3(all,listindexc[i],curveVertices,setup.camera.getWorldDirection()));
            }
            media.divideScalar(listid.length);   
            
            for(var i=0;i<listid.length;i++){
                var name="Curve"+listid[i].toString();
                //console.log(name);
                var curve=setup.scene.getObjectByName(name); 
                curve.geometry.vertices[listindex[i]].copy(media);
                listoject[i].updateVertices3();
                curve.geometry.verticesNeedUpdate=true;
                
                //if we can update tubegeoemtry would be better
                /*ListCurves3D.list[name].tube.lineDistancesNeedUpdate=true;
                ListCurves3D.list[name].tube.normalsNeedUpdate=true;
                ListCurves3D.list[name].tube.verticesNeedUpdate=true;
                */
                ListCurves3D.list[name].compute(listoject[i].curveVertex);
                var tuberender=document.getElementById("checkRender");
                var shadowrender=document.getElementById("checkShadow");
                if(tuberender.checked){
                    var meshtodelete=setup.scene.getObjectByName("Tube"+name);
                    if (meshtodelete!=undefined){
                        setup.scene.remove(meshtodelete);
                        dispose3(meshtodelete);
                    }
                    var mesh=new THREE.Mesh(ListCurves3D.list[name].tube,materialTubeGeometry);
                    mesh.name="Tube"+name;
                    setup.scene.add(mesh);
                }
                 if(shadowrender.checked){
                    var meshshadow=setup.scene.getObjectByName("shadowOfCurve"+listid[i].toString());
                    if(meshshadow!=undefined){
                      setup.scene.remove(meshshadow);
                      dispose3(meshshadow);  
                    }
                    drawProjectingOnPlane(ListCurves3D.list[name].controlpoints,listid[i]); 
                }
            }
        }
        short.pointsStroke2D=[];
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
        var existsSelectedObject=false;
        for (var key in ListIntersectionObjects) {
            if (ListIntersectionObjects.hasOwnProperty(key)){
              existsSelectedObject=true;
              break;
            } 
        }
        if(existsSelectedObject){
            for (var key in ListIntersectionObjects) {
                var name=ListIntersectionObjects[key].name;
                delete ListIntersectionObjects[name];
                if(name.startsWith("TubeCurve")) var id=name.substring(9,name.length);
                else if(name.startsWith("Curve")) var id=name.substring(5,name.length);
                removeCurveFromScene(parseInt(id));
            }
        }
        else{
            ModeManage.focus();
            removeGuides();
        }
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
        // select first shadowcurve
        for(key in ListIntersectionObjects){
            if(key.startsWith("shadow")) {
                ModeManage.drawShadow.id=parseInt(key.substring(13,key.length));
                break;
            }
        }
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

