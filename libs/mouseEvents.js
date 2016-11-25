function onMouseClick(){
    if(ModeManage.selectObject.value ){
        var intersects = ModeManage.selectObject.raycaster.intersectObjects(setup.scene.children);
        //console.log(intersects);
        if(intersects.length>0){
            var intersected=intersects[0];
            var condition=[
               intersected.object.type=="Mesh" && intersected.object.name=="ReferencePlane",
               intersected.object.type=="Mesh" && intersected.object.name.startsWith("TubeCurve"),
               intersected.object.type=="LineSegments" && intersected.object.name.startsWith("Curve"),
               intersected.object.type=="LineSegments" && intersected.object.name.startsWith("shadow")       
            ]
            if(condition[0]){
                if(ListIntersectionObjects.search("ReferencePlane")){
                    intersected.object.material.transparent=true;
                    intersected.object.material.opacity=0.5;    
                    ListIntersectionObjects.remove("ReferencePlane");
                }
                else{
                    intersected.object.material.transparent=false;
                    intersected.object.material.opacity=1;   
                    symmetrize();
                    ListIntersectionObjects.add("ReferencePlane","Mesh"); 
                }
            }
            else if(condition[1] || condition[2]){
                var name=intersected.object.name;
                var tuberender=document.getElementById("checkRender");
                if(intersected.object.type==="Mesh"){
                    if(ListIntersectionObjects.search(name)){
                        intersected.object.material=materialTubeGeometry;
                        ListIntersectionObjects.remove(name);
                        var perfilshadow=setup.scene.getObjectByName("PerfilCurve");
                        if(perfilshadow!=undefined){
                            setup.scene.remove(perfilshadow);
                            dispose3(perfilshadow);
                        }
                    }
                    else{
                        intersected.object.material=materialTubeGeometrySelected;
                        ListIntersectionObjects.add(name,"Mesh");
                        var perfilshadow=setup.scene.getObjectByName("PerfilCurve");
                        if(perfilshadow!=undefined){
                            setup.scene.remove(perfilshadow);
                            dispose3(perfilshadow);
                        }
                    }
                }
                else if(!tuberender.checked){
                    if(ListIntersectionObjects.search(name)){
                        intersected.object.material.linewidth=3;
                        intersected.object.material.opacity=1;    
                        ListIntersectionObjects.remove(name);
                    }
                    else{
                        intersected.object.material.linewidth=6;
                        intersected.object.material.opacity=0.5;    
                        ListIntersectionObjects.add(name,"LineSegments");   
                    }
                }
            }
            else if(condition[3]){
                var name=intersected.object.name;
                if(ListIntersectionObjects.search(name)){
                    intersected.object.material.linewidth=1;
                    //else intersected.object.material.linewidth=3;
                    intersected.object.material.opacity=1;    
                    ListIntersectionObjects.remove(name);
                }
                else{
                    intersected.object.material.linewidth=6;
                    intersected.object.material.opacity=0.5;    
                    ListIntersectionObjects.add(name,"LineSegments");   
                }
            }
        }
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
        short.pointsStroke2D.push(mouseOnScreen2D(event)); 
        if(short.selected ){
            if(planeToDraw.spriteSelected!=-1){
                console.log("selected mouse down");
                var normal=planeToDraw.spritesRotation[parseInt(planeToDraw.spriteSelected)].position;
                normal.sub(planeToDraw.origin);
                normal.cross(planeToDraw.normal);
                short.normalDrawPlane=normal;
                var vbegin=project2DToPlane(short.pointsStroke2D[0],planeToDraw.origin,normal,false);
                drawVector(planeToDraw.origin,vbegin,"vbegin");
                short.LastPoint=projectToPlane(event,planeToDraw.origin,normal,false);
                short.pointsStroke.push(short.LastPoint); 
            }
            else{
                setup.scene.remove(short.LineStroke);
            }
        }
        else{
            //console.log("dont selected");
            short.normalDrawPlane=planeToDraw.getNormal();
            short.LastPoint=projectToPlane(event,DrawPlane.geometry.vertices[0].clone(),short.normalDrawPlane,false);
            short.pointsStroke.push(short.LastPoint);  
                
        }
    }
    if(ModeManage.drawFree.value){
        var short=ModeManage.drawFree;
        short.isdrawing = true;
        short.LineStroke = new THREE.Object3D();
        short.LineStroke.name="CurrentCurve";
        setup.scene.add(short.LineStroke);
        short.pointsStroke2D.push(mouseOnScreen2D(event)); 
        short.LastPoint=projectToFarPlane(event);
        short.pointsStroke.push(short.LastPoint);  
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
            var curveVertices=LineSegmentToLineGeometry(short.vertices);
            for(var i=0;i<curveVertices.length;i++){
                short.copyVertices.push(curveVertices[i].clone());
            }
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
        if(!short.isdrawing){
            var mouse=mouseNDCXY(event);
            short.raycaster.setFromCamera(mouse,setup.camera);	
            var intersect = short.raycaster.intersectObject(DrawPlane,true);
            if(intersect.length>0){
                var intersected=intersect[0];
                if(intersected.object.type==="Sprite"){
                    intersected.object.material.transparent=false;
                    intersected.object.material.opacity=1;
                    short.selected=true;
                    planeToDraw.spriteSelected=parseInt(intersected.object.name);
                }
                else if(intersected.object.type==="Line"){
                    intersected.object.material.color.set(0x0101DF);
                    short.selected=true;
                    planeToDraw.spriteSelected=-1;
                }
                else{
                    planeToDraw.spritesTransparent();
                    short.selected=false;
                    planeToDraw.spriteSelected=-2;
                }
            }
            else{ 
                planeToDraw.spritesTransparent();
                short.selected=false;
                planeToDraw.spriteSelected=-2;
            }
        }
        else{
            short.currentPoint=projectToPlane(event,planeToDraw.origin,short.normalDrawPlane,false);
            short.pointsStroke.push(short.currentPoint);
            short.pointsStroke2D.push(mouseOnScreen2D(event));
            var geometryLine = new THREE.Geometry();
            geometryLine.vertices.push(short.LastPoint,short.currentPoint);
            short.LastPoint=short.currentPoint;
            var line = new THREE.Line( geometryLine, short.materialCurve );
            short.LineStroke.add(line);      
            if(short.selected){
                if(planeToDraw.spriteSelected!==-1){
                    var vend=short.currentPoint.clone();
                    var vbegin=project2DToPlane(short.pointsStroke2D[0],planeToDraw.origin,short.normalDrawPlane,false);
                    vend.sub(planeToDraw.origin);
                    vbegin.sub(planeToDraw.origin);
                    var angle=vend.angleTo(vbegin);
                    angle=angle*180/Math.PI;
                    var roundangle=Math.round(angle * 10) / 10;
                    updateLabelRotate(roundangle);
                    vend.normalize().multiplyScalar(vbegin.length());
                    var vendVector=setup.scene.getObjectByName("vend");
                    if(vendVector!==undefined) setup.scene.remove(vendVector);
                    drawVector(planeToDraw.origin,vend,"vend");  
                }
                else{
                    var n=short.pointsStroke2D.length;
                    var distance=(short.pointsStroke2D[n-1].x-short.pointsStroke2D[n-2].x)/10;
                    planeToDraw.object.translateOnAxis(planeToDraw.normal,distance);
                    planeToDraw.updateObject();
                }
            }
        }
    }
    if(ModeManage.drawFree.value){
        var short=ModeManage.drawFree;
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
        ModeManage.selectObject.raycaster.linePrecision=0.2;    
        var intersects = ModeManage.selectObject.raycaster.intersectObjects(setup.scene.children);
        if(intersects.length>0){
            setup.controls.enabled=false;
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
                setup.controls.enabled=true;
                var perfilshadow=setup.scene.getObjectByName("PerfilCurve");
                if(perfilshadow!=undefined){
                    setup.scene.remove(perfilshadow);
                    dispose3(perfilshadow);
                }
            }
        }
        else{
                setup.controls.enabled=true;
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
        if(short.selected){
            short.selected=false;
            if(planeToDraw.spriteSelected!=-1){
              
                var vend=project2DToPlane(short.pointsStroke2D[short.pointsStroke2D.length-1],planeToDraw.origin,short.normalDrawPlane,false);
                var vbegin=project2DToPlane(short.pointsStroke2D[0],planeToDraw.origin,short.normalDrawPlane,false);
                vend.sub(planeToDraw.origin);
                vbegin.sub(planeToDraw.origin);
                var angle=vend.angleTo(vbegin);
                //planeToDraw.reset();
                var direction=short.pointsStroke2D[short.pointsStroke2D.length-1].clone().sub(short.pointsStroke2D[0]);
                if(direction.x<0) planeToDraw.rotateOnSprite(planeToDraw.spriteSelected,-angle);
                else planeToDraw.rotateOnSprite(planeToDraw.spriteSelected,angle);
                //if(delta.x<0) planeToDraw.rotateOnSprite(planeToDraw.spriteSelected,angle);
                //else planeToDraw.rotateOnSprite(planeToDraw.spriteSelected,angle);
                var spriteRot=setup.scene.getObjectByName("wa");
                if(spriteRot!="undefined"){
                    setup.scene.remove(spriteRot);
                }
                var vendVector=setup.scene.getObjectByName("vend");
                var vbeginVector=setup.scene.getObjectByName("vbegin");
                if(vendVector!==undefined) setup.scene.remove(vendVector);
                if(vbeginVector!==undefined) setup.scene.remove(vbeginVector);
                //drawLine(planeToDraw.origin,short.normalDrawPlane.clone().multiplyScalar(2*vbegin.length()));
                console.log(short.normalDrawPlane);
            }
            else{
                planeToDraw.updateHandles();
            }
        }
        else{
           //converting points to parametricCurve
            var idto=ListCurves3D.getAvailableIndex();
            var idcurve=ListCurves2D.addCurve(short.pointsStroke2D,idto);
            console.log("index curve ", idcurve,idto);
            var shadow2D=getShadow2DFrom3D(short.pointsStroke);
            ListCurvesShadow.addCurve(shadow2D,idto);
            CommandManager.execute({
              execute: function(){
                 addCurve3D(short.pointsStroke,"reconstructed","",idto);
                 console.log("Add curve "+idto.toString());
              },
              unexecute: function(){
                 removeCurveFromScene(idto);
                 console.log("Remove curve "+idto.toString());  
              }
            });
           
            //ListCurves2D.listObjects[idcurve].draw("curve2d");
            //setup.scene.remove(short.LineStroke);
            //dispose3(short.LineStroke);
            //drawProjectingOnPlane(short.pointsStroke);
            
            //var cp=getCriticalPoints(short.pointsStroke2D);
            //var cp=ListCurves2D.listCP[idcurve];
            /*var arraycp=[];
            for(var j=0;j<cp.length;j++){
                arraycp.push(project2DVectorToFarPlane(short.pointsStroke2D[cp[j]]));
            }
            drawPoints(arraycp);
            console.log(arraycp);*/
            
            
            //console.log("mouseup");    
        }
        short.pointsStroke=[];
        setup.scene.remove( short.LineStroke );
        dispose3(short.LineStroke);
        short.pointsStroke2D=[];
    }
    if(ModeManage.drawFree.value){
        var short=ModeManage.drawFree;
        if(!short.isdrawing) return;
        short.isdrawing = false;
        var n=short.pointsStroke2D.length;
        var ranking40=short.getRanking2D(short.pointsStroke2D[0]);
        var ranking41=short.getRanking2D(short.pointsStroke2D[n-1]);
        var weights0=ranking40[0];
        var weights1=ranking41[0];
        var weights00=weights0.slice(0,2);
        var weights11=weights1.slice(0,2);
        weights00.reverse();
        weights11.reverse();
        var p0=average3(weights00,ranking40[1].slice(0,2));
        var p1=average3(weights11,ranking41[1].slice(0,2));
        //console.log(p0);
        //console.log(p1);
        //drawPoints([p0,p1]);
        //drawPoint(p0);
        //drawProjectingOnPlane(short.pointsStroke,0);
        var s1=shadow2DarrayToPlane(short.pointsStroke2D,new THREE.Vector3(0,0,-2.5),new THREE.Vector3(0,0,1));
        var s2=shadow2DarrayToPlane(short.pointsStroke2D,new THREE.Vector3(0,0,0),new THREE.Vector3(0,1,0));
        drawProjectingOnPlane(s2,100);
        var cfloor=project2DarrayToPlane(short.pointsStroke2D,new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,1));
        drawProjectingOnPlane(cfloor,101);
        var indexes=getIndexOutPlane(cfloor);
        console.log(indexes);
        var s3=averageShadowsIndexes(indexes,s1,s2);
        //var s3=averageShadows(s1,s2);
        var s1shadow=worldTo2D(s3);
        var idto=getAvailableIndex3DCurves();
        var idcurve=ListCurves2D.addCurve(short.pointsStroke2D,idto);
        var idcurvec=ListCurvesShadow.addCurve(s1shadow,idto);
        console.log(idcurve,idcurvec);
        var match=matchCriticalPoints(idcurve,ListCurves2D,ListCurvesShadow);
        if(match){
            var geopxyz=reconstruct3DCurve(idcurve,ListCurves2D,ListCurvesShadow);
            var stroke=setup.scene.getObjectByName("CurrentCurve");
             if(stroke!= undefined) {
                setup.scene.remove(stroke);
                dispose3(stroke);
            }
            CommandManager.execute({
              execute: function(){
                 addCurve3D(geopxyz,"reconstructed","",idcurve);
                 console.log("Add curve "+idcurve.toString());
              },
              unexecute: function(){
                 removeCurveFromScene(idcurve);
                 console.log("Remove curve "+idcurve.toString());  
              }
            });
            ModeManage.focus(3);
        }
        else{
            ListCurvesShadow.removeCurve(idcurve);
        }        
        short.pointsStroke=[];
        //setup.scene.remove( short.LineStroke );
        dispose3(short.LineStroke);
        short.pointsStroke2D=[];
    }
    if(ModeManage.drawShadow.value){
        var short=ModeManage.drawShadow;
        ModeManage.drawGuidesLine.value=false;
        if(!short.isdrawing) return;
        short.isdrawing = false;
        if(short.id!=-1){
            var Shadow2D=ListCurvesShadow.listPoints2D[short.id.toString()];
            var idcurve=ListCurvesShadow.addCurve(short.pointsStroke2D,short.id);
            short.pointsStroke=[];
            var match=matchCriticalPoints(idcurve,ListCurves2D,ListCurvesShadow);
            if(match){
                //console.log(ListCurvesShadow.listResidualShadows[idcurve.toString()]);
                ListCurvesShadow.addResidualShadow(short.id,Shadow2D);
                //console.log(ListCurvesShadow.listResidualShadows[idcurve.toString()]);
                if(short.pointsStroke2D.length<3){
                    var geopxyz=reconstructProjectOnNormalDirection(short.pointsStroke2D[0],ListCurves2D.listPoints2D[idcurve]);
                }
                else var geopxyz=reconstruct3DCurve(idcurve,ListCurves2D,ListCurvesShadow);
                var stroke=setup.scene.getObjectByName("CurrentCurve");
                var strokeS=setup.scene.getObjectByName("CurrentCurveShadow");
                 if(stroke!= undefined) {
                    setup.scene.remove(stroke);
                    dispose3(stroke);
                }
                setup.scene.remove(strokeS);
                dispose3(strokeS);
                var symmetric=ListCurves3D.list["Curve"+idcurve.toString()].symmetric;
                removeCurve3DFromScene(idcurve);
                CommandManager.execute({
                  execute: function(){
                     addCurve3D(geopxyz,"reconstructed",symmetric,idcurve);
                     console.log("Modificate shadow curve "+idcurve.toString());
                  },
                  unexecute: function(){
                     var residual=ListCurvesShadow.listResidualShadows[idcurve.toString()].pop();
                     var idnew=ListCurvesShadow.addCurve(residual,idcurve);
                     // To get Shadow CatmullRom that just it generate with mathCriticalPoint()
                     getListShadowObject(idcurve,ListCurves2D.listPoints2D[0]);
                     if(residual.length<3){
                        var geopxyz=reconstructProjectOnNormalDirection(residual[0],ListCurves2D.listPoints2D[idcurve]);
                      }
                     else{ 
                         var geopxyz=reconstruct3DCurve(idcurve,ListCurves2D,ListCurvesShadow);  
                         removeCurve3DFromScene(idcurve);
                         addCurve3D(geopxyz,"reconstructed",symmetric,idcurve);
                         console.log("Back shadow curve "+idcurve.toString());  
                     }
                    }
                  });
                short.id=-1;
                ModeManage.focus(3);
            }
            else{
                //ListCurvesShadow.removeCurve(idcurve);
                var idcurve=ListCurvesShadow.addCurve(Shadow2D,short.id);
                //draw2DCurveOnFarPlane(Curve2D,idcurve);
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
        CommandManager.execute({
          execute: function(){
             console.log("Deforming done");  
             ListCurves3D.list[short.curvename].updateCurve();  
             ListCurves3D.list[short.curvename].history.push(short.copyVertices);  
          },
          unexecute: function(){
              var editedcurve=setup.scene.getObjectByName(short.curvename); 
              var toLine=LineSegmentToLineGeometry(editedcurve.geometry.vertices);
              var backup=ListCurves3D.list[short.curvename].history.pop();
              console.log(toLine.length);
              for(var i=0;i<toLine.length;i++){
                  toLine[i].copy(backup[i]);
              }
              editedcurve.geometry.verticesNeedUpdate=true;
              ListCurves3D.list[short.curvename].updateCurve();
              //setup.scene.add(ListCurves3D.list[short.curvename].tube);
          }
        });
        short.copyVertices=[];
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
        for(var key in ListCurves3D.list){
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
        if(listid.length>1){
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
            CommandManager.execute({
              execute: function(){
                 console.log("Joint many curves");  
                 for(var i=0;i<listid.length;i++){
                    var name="Curve"+listid[i].toString();
                    //console.log(name);
                    var curve=setup.scene.getObjectByName(name); 
                    ListCurves3D.list[name].history.push(cloneCurveVertices(curve)); 
                    curve.geometry.vertices[listindex[i]].copy(media);
                    listoject[i].updateVertices3();
                    curve.geometry.verticesNeedUpdate=true;
                    ListCurves3D.list[name].updateCurve();
                    var tuberender=document.getElementById("checkRender");
                    var shadowrender=document.getElementById("checkShadow");
                    if(tuberender.checked){
                        var meshtodelete=setup.scene.getObjectByName("Tube"+name);
                        if (meshtodelete!=undefined){
                            setup.scene.remove(meshtodelete);
                            dispose3(meshtodelete);
                        }
                        setup.scene.add(ListCurves3D.list[name].tube);
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
              },
              unexecute: function(){
                  for(var i=0;i<listid.length;i++){
                      var name="Curve"+listid[i].toString();
                      var curve=setup.scene.getObjectByName(name); 
                      var toLine=LineSegmentToLineGeometry(curve.geometry.vertices);
                      var backup=ListCurves3D.list[name].history.pop();
                      for(var j=0;j<toLine.length;j++){
                          toLine[j].copy(backup[j]);
                      }
                      curve.geometry.verticesNeedUpdate=true;
                      ListCurves3D.list[name].updateCurve();
                      var tuberender=document.getElementById("checkRender");
                      var shadowrender=document.getElementById("checkShadow");
                      if(tuberender.checked){
                        var meshtodelete=setup.scene.getObjectByName("Tube"+name);
                        if (meshtodelete!=undefined){
                            setup.scene.remove(meshtodelete);
                            dispose3(meshtodelete);
                        }
                        setup.scene.add(ListCurves3D.list[name].tube);
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
            });
            
        }
        short.pointsStroke2D=[];
    }
}

function onKeyDown(){
    var event=d3.event;
    //letter d
    if(event.keyCode == 68 && event.shiftKey){
        console.log("ctrl d");
        ModeManage.focus(6);
        setup.controls.enabled=false;
    }
    else if(event.keyCode == 68){
        if(ModeManage.drawCurve.value){
            planeToDraw.defaultPositions();
        }
        else{
            ModeManage.focus(0);
            setup.controls.enabled=false;
            removeGuides();   
        }
    }
    //letter esc
    if(event.keyCode == 27){
        ModeManage.focus(3);
        removeGuides();
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
        for(key in ListIntersectionObjects.list){
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
}

