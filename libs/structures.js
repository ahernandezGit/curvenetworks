var ModeManage= ModeManage || {};
ModeManage={
    flagDrawPlane:true,
    drawFree:{
        getRanking2D:function(point){
           var corners2D=[];
           var distances=[];    
           var result1=[];
           var result2=[]; 
           var result3=[];    
           for(var i=0;i<4;i++){
               corners2D.push(threeDToScreenSpace(InitialPlane.geometry.vertices[i]));
               distances.push([point.distanceToSquared(corners2D[i]),i]);
           }
           distances.sort(function(a, b){return a[0]-b[0]});
           //console.log(distances);    
           for(var i=0;i<4;i++){
               result1.push(distances[i][0]);
               result2.push(InitialPlane.geometry.vertices[distances[i][1]]);
               result3.push(distances[i][1]);
           }
           return [result1,result2,result3];    
        },
        value: false, 
        isdrawing:false,
        lastPoint: new THREE.Vector3(),
        currentPoint: new THREE.Vector3(),
        LineStroke : new THREE.Object3D(),
        pointsStroke : [],
        pointsStroke2D : [],
        materialCurve : new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } )
    },
    drawCurve : { 
        value: false, 
        isdrawing:false, 
        lastPoint: new THREE.Vector3(),
        currentPoint: new THREE.Vector3(),
        LineStroke : new THREE.Object3D(),
        raycaster:new THREE.Raycaster(),
        selected:false,
        pointsStroke : [],
        pointsStroke2D : [],
        materialCurve : new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } ),
        normalDrawPlane: new THREE.Vector3()
    },
    drawShadow : {
        value: false, 
        isdrawing:false, 
        lastPoint: new THREE.Vector3(),
        currentPoint: new THREE.Vector3(),
        LineStroke : new THREE.Object3D(),
        pointsStroke : [],
        pointsStroke2D : [],
        materialCurve : new THREE.LineBasicMaterial( { color: 0x3A2F0B, linewidth: 2 }),  
        //materialCurve : new THREE.LineDashedMaterial( { color: 0x3A2F0B, linewidth: 1, dashSize:0.5, gapSize:0.5} ) 
        id:-1  //id of the curve to associate this shadow 
    },
    drawGuidesLine : {
        value: false,  
        geometry : new THREE.Geometry(),
        material : new THREE.LineDashedMaterial( { color: 0xff0000, linewidth: 1, dashSize:0.5, gapSize:0.5} )  
    },
    selectObject : {
        value: false,
        raycaster:new THREE.Raycaster(),
        listObjects:[],
        addObject: function (obj){
            
        },
        deleteObject: function (name){
            
        },
        freeAll: function (){
            
        }
    },
    deformCurve:{
        value:false,
        isdeforming:false,
        raycaster:new THREE.Raycaster(),
        intersected:false,
        vertices:[],
        copyVertices:[],
        curvename:"",
        handle:-1,
        path:{},
        pointgeometry : new THREE.Geometry(),
        pointmaterial : new THREE.PointsMaterial( {color: 0x27B327, size: 10.0, sizeAttenuation: false, alphaTest: 0.5 } )
    },
    joinCurves:{
        value:false,
        isdrawing:false, 
        lastPoint: new THREE.Vector3(),
        currentPoint: new THREE.Vector3(),
        LineStroke : new THREE.Object3D(),
        pointsStroke : [],
        pointsStroke2D : [],
        path:{},
        materialCurve : new THREE.LineBasicMaterial( { color: 0xFF0040, linewidth: 2 } )
    },
    focus:function(n) {
        switch(n){
            case 0:{
               this.drawFree.value=false;    
               this.drawCurve.value=true;
               this.drawShadow.value=false;
               this.drawGuidesLine.value=false;    
               this.selectObject.value=false;    
               this.deformCurve.value=false;  
               this.joinCurves.value=false;
               this.flagDrawPlane=true; 
               DrawPlane.visible=true;    
               //drawFarPlane();    
               break;    
            }
            case 1:{
               this.drawFree.value=false;    
               this.drawCurve.value=false;
               this.drawShadow.value=true;
               this.drawGuidesLine.value=false;    
               this.selectObject.value=false;    
               this.deformCurve.value=false;     
               this.joinCurves.value=false; 
               this.flagDrawPlane=false; 
               DrawPlane.visible=false;
               break;
            }
            case 2:{
               this.drawFree.value=false;    
               this.drawCurve.value=false;
               this.drawShadow.value=false;
               this.drawGuidesLine.value=true;    
               this.selectObject.value=false;    
               this.deformCurve.value=false;
               this.joinCurves.value=false;  
               this.flagDrawPlane=false;
               DrawPlane.visible=false;
               break;
            }
            case 3:{
               this.drawFree.value=false;    
               this.drawCurve.value=false;
               this.drawShadow.value=false;
               this.drawGuidesLine.value=false;    
               this.selectObject.value=true;
               this.deformCurve.value=false;            
               this.joinCurves.value=false;          
               this.flagDrawPlane=false; 
               DrawPlane.visible=false; 
               setup.controls.enabled=true;
               break;    
            }
            case 4:{
               this.drawFree.value=false;
               this.drawCurve.value=false;
               this.drawShadow.value=false;
               this.drawGuidesLine.value=false;    
               this.selectObject.value=false;
               this.deformCurve.value=true;
               this.joinCurves.value=false; 
               this.flagDrawPlane=false;
               DrawPlane.visible=false;
               break;    
            } 
            case 5:{
               this.drawFree.value=false; 
               this.drawCurve.value=false;
               this.drawShadow.value=false;
               this.drawGuidesLine.value=false;    
               this.selectObject.value=false;
               this.deformCurve.value=false;
               this.joinCurves.value=true;      
               this.flagDrawPlane=false; 
               DrawPlane.visible=false;    
               break;    
            }  
            case 6:{
               this.drawFree.value=true; 
               this.drawCurve.value=false;
               this.drawShadow.value=false;
               this.drawGuidesLine.value=false;    
               this.selectObject.value=false;
               this.deformCurve.value=false;
               this.joinCurves.value=false;      
               this.flagDrawPlane=false; 
               DrawPlane.visible=false;    
               break;
            }    
            default: {
               this.drawFree.value=false; 
               this.drawCurve.value=false;
               this.drawShadow.value=false;
               this.drawGuidesLine.value=false;    
               this.selectObject.value=false;     
               this.deformCurve.value=false;                
               this.joinCurves.value=false;  
               this.flagDrawPlane=true;
               //DrawPlane.visible=false;
               //DrawPlane.material.opacity=0.2;    
               setup.controls.enabled=true;
            }    
        }
    },
    clean:function(){
        this.drawCurve.value=false;
        this.drawCurve.isdrawing=false; 
        this.drawCurve.lastPoint=new THREE.Vector3();
        this.drawCurve.currentPoint= new THREE.Vector3();
        this.drawCurve.LineStroke= new THREE.Object3D();
        this.drawCurve.pointsStroke= [];
        this.drawCurve.pointsStroke2D=[];
        this.drawCurve.selected=false;
        this.drawCurve.raycaster=new THREE.Raycaster();
        
        
        this.drawShadow.value=false;
        this.drawShadow.isdrawing=false; 
        this.drawShadow.lastPoint=new THREE.Vector3();
        this.drawShadow.currentPoint= new THREE.Vector3();
        dispose3(this.drawShadow.LineStroke);
        this.drawShadow.LineStroke= new THREE.Object3D();
        this.drawShadow.pointsStroke= [];
        this.drawShadow.pointsStroke2D=[];
        this.drawShadow.id=-1;
        
        this.drawGuidesLine.value=false;
        this.drawGuidesLine.geometry= new THREE.Geometry();
        
        this.selectObject.value=false;
        this.selectObject.raycaster=new THREE.Raycaster();
        this.selectObject.listObjects=[];
        
        this.deformCurve.value=false;
        this.deformCurve.isdeforming=false;
        this.deformCurve.raycaster=new THREE.Raycaster();
        this.deformCurve.intersected=false;
        this.deformCurve.vertices=[];
        this.deformCurve.copyVertices=[];
        this.deformCurve.curvename="";
        this.deformCurve.handle=-1;
        this.deformCurve.path={};
        dispose3(this.deformCurve.pointgeometry);
        this.deformCurve.pointgeometry = new THREE.Geometry();
        
        this.joinCurves.value=false;
        this.joinCurves.isdrawing=false; 
        this.joinCurves.lastPoint= new THREE.Vector3();
        this.joinCurves.currentPoint= new THREE.Vector3();
        this.joinCurves.LineStroke = new THREE.Object3D();
        this.joinCurves.pointsStroke = [];
        this.joinCurves.pointsStroke2D = [];
        this.joinCurves.path={};
        
        this.drawFree.value=false;
        this.drawFree.isdrawing=false;
        this.drawFree.lastPoint= new THREE.Vector3();
        this.drawFree.currentPoint= new THREE.Vector3();
        this.drawFree.LineStroke = new THREE.Object3D();
        this.drawFree.pointsStroke = [];
        this.drawFree.pointsStroke2D = [];
    }
}
ListCurves2D={
    number:0,
    listCP:{},
    listObjects:{},
    listPoints2D:{},
    addCurve: function (points2D,idto){
        //var obj=new CatmullRomInterpolation(51,points2D,0.6);
        if(idto!=undefined) var id=idto.toString();
        else var id=this.number.toString();
        var t=0;
        for(var key in this.listCP){
            if(key==id){
                t++;
                break;
            }
        }
        if(t==0) this.number++;
        
        this.listObjects[id.toString()]={};
        this.listPoints2D[id.toString()]=points2D;
        this.listCP[id.toString()]=getCriticalPoints(points2D);
        
        return id;
    },
    popCurve: function(){
        var id=this.number-1;
        var ids=id.toString();
        delete this.listCP[ids];
        delete this.listObjects[ids];
        delete this.listPoints2D[ids];
        this.number--;
    },
    removeCurve: function (id){
        delete this.listCP[id.toString()];
        delete this.listObjects[id.toString()];
        delete this.listPoints2D[id.toString()];
        this.number--;
    }
}
ListCurvesShadow={
    number:0,
    listCP:{},
    listObjects:{},
    listPoints2D: {},
    listResidualShadows:{},
    addCurve: function (points2D,idto){
        //var obj=new CatmullRomInterpolation(51,points2D,0.6);
        if(idto!=undefined) var id=idto.toString();
        else var id=this.number.toString();
        var t=0;
        for(var key in this.listCP){
            if(key==id){
                t++;
                break;
            }
        }
        if(t==0){
            this.number++;
            this.listResidualShadows[id.toString()]=[];
        }
        this.listObjects[id.toString()]={};
        this.listPoints2D[id.toString()]=points2D;
        if(points2D.length<3) this.listCP[id.toString()]=[];
        else this.listCP[id.toString()]=getCriticalPoints(points2D);
        return id;
    },
    addResidualShadow: function (id,array){
        console.log(this.listResidualShadows[id.toString()]);
        this.listResidualShadows[id.toString()].push(array);
        console.log(this.listResidualShadows[id.toString()]);
    },
    popCurve: function(){
        var id=this.number-1;
        var ids=id.toString();
        delete this.listCP[ids];
        delete this.listObjects[ids];
        delete this.listPoints2D[ids];
        delete this.listResidualShadows[ids];
        this.number--;
    },
    removeCurve: function (id){
        delete this.listCP[id.toString()];
        delete this.listObjects[id.toString()];
        delete this.listPoints2D[id.toString()];
        delete this.listResidualShadows[id.toString()];
        this.number--;
    }
}
ListCurves3D={
    number:0,
    list:{},
    addCurve: function(points3D,symmetric,id){
        var t=0;
        for(var key in this.list){
            if(parseInt(key.substring(5,key.length))==id){
                t++;
                break;
            }
        }
        if(t==0) this.number++;
        if(id!=undefined) var name="Curve"+id.toString();
        else var name="Curve"+this.number.toString();
        symmetric= symmetric || "";
        if(symmetric!==""){
            this.list[name]=new curve3D(name,points3D,"smooth",symmetric);
            this.list[symmetric].symmetric=name;
        }
        else this.list[name]=new curve3D(name,points3D,"smooth","");
        return parseInt(name.substring(5,name.length));
    },
    popCurve: function(){
        var id=this.number-1;
        var name="Curve"+id.toString();
        delete this.list[name];
        this.number--;
    },
    removeCurve: function (name){
        delete this.list[name];
        this.number--;
    },
    getAvailableIndex: function (){
        var result="";
        for(var key in this.list){
            result=key;
        }
        if (result==="") return 0;
        else return parseInt(result.substring(5,result.length))+1; 
    }
}

// List of selected object 
function ListObjects(){
    this.list={};
    this.type={};
    this.name={};
    this.n=0;
}
ListObjects.prototype.add=function(name,type){
    this.list[name]=this.n;
    this.type[name]=type;
    this.name[this.n.toString()]=name;
    this.n++;
}
ListObjects.prototype.remove=function(name){
    var key=this.list[name].toString();
    delete this.list[name];
    delete this.type[name];
    delete this.name[key];
    this.n--;
}
ListObjects.prototype.search=function(name){
    var key;
    for(key in this.list){
        if(key===name){
            return true;
        }
    }
    return false;
}
ListObjects.prototype.reset=function(){
    this.list={};
    this.type={};
    this.name={};
    this.n=0;
}

ListIntersectionObjects=new ListObjects();

function IntersectionObject(name,type){
    this.name=name;
    this.type=type;
}

//defining a abstract curve

function curve3D(name,points3D,type,symmetric){
    this.name=name;
    this.history=[];
    this.controlpoints=points3D;
    this.catmullrom3={};
    this.tube={};
    this.line={};
    this.type=type;
    this.iscurve=false;
    this.symmetric=symmetric;
    this.compute(points3D);
}
curve3D.prototype.compute=function(points3D){
    if(this.controlpoints.length>1){
        this.iscurve=true;
        this.catmullrom3=new THREE.CatmullRomCurve3(points3D);  
        this.tube=new THREE.Mesh(new THREE.TubeGeometry(this.catmullrom3, 100, 0.1, 8, false),materialTubeGeometry);
        this.tube.name="Tube"+this.name;
        
        var geometryLine=new THREE.Geometry();
        for(var i=0;i<this.controlpoints.length-1;i++){
            var p=this.controlpoints[i];
            var q=this.controlpoints[i+1];
            geometryLine.vertices.push(p,q);
        }
        var material=new THREE.LineBasicMaterial({ color: 0x564002, linewidth: 3});
        this.line = new THREE.LineSegments( geometryLine, material );
        this.line.name=this.name;
    }
}
curve3D.prototype.updateCurve=function (){
    if(this.iscurve){
        var cp=LineSegmentToLineGeometry(this.line.geometry.vertices);
        this.controlpoints=cp;
        this.catmullrom3.points=cp;
        this.catmullrom3.needsUpdate=true;
        dispose3(this.tube);
        this.tube=new THREE.Mesh(new THREE.TubeGeometry(this.catmullrom3, 100, 0.1, 8, false),materialTubeGeometry);
        this.tube.name="Tube"+this.name;
    }
}
//An plane to Draw over him

function planetoDraw(planeObject){
    this.object=planeObject;
    this.normal=this.getNormal();
    this.initialize();
    this.updateHandles();
    this.spriteSelected=-2;
}
planetoDraw.prototype.getNormal=function(){
    var v1 = new THREE.Vector3();
    var v2 = new THREE.Vector3();
    var a=this.object.geometry.vertices[0].clone();
    var b=this.object.geometry.vertices[1].clone();
    var c=this.object.geometry.vertices[2].clone();
    var normal = v1.subVectors( c, b ).cross( v2.subVectors( a, b ) ).normalize();
    return normal;
}
planetoDraw.prototype.updateHandles=function (){
    //compute center of edges of the plane
    var a=this.object.geometry.vertices[0].clone();
    var b=this.object.geometry.vertices[1].clone();
    var c=this.object.geometry.vertices[2].clone();
    var d=this.object.geometry.vertices[3].clone();
    var center=a.clone().add(b).add(c).add(d);
    center.divideScalar(4);
    this.origin=center;
    /*a.sub(center);
    b.sub(center);
    c.sub(center);
    d.sub(center);*/
    var up=a.clone().add(b).divideScalar(2).add(center).divideScalar(2);
    var down=c.clone().add(d).divideScalar(2).add(center).divideScalar(2);
    var ca=[];
    ca.push(a.clone().add(b).divideScalar(2));
    ca.push(a.clone().add(c).divideScalar(2));
    ca.push(b.clone().add(d).divideScalar(2));
    ca.push(c.clone().add(d).divideScalar(2));
    for(var i=0;i<this.spritesRotation.length;i++){
        this.spritesRotation[i].position.copy(ca[i]);
    }
    this.arrowTranslate[0].position.copy(up);
    this.arrowTranslate[1].position.copy(down);
    this.arrowTranslate[0].setDirection(this.normal);
    this.arrowTranslate[1].setDirection(this.normal);
}
planetoDraw.prototype.initialize=function (){
    this.spritesRotation=[];
    this.arrowTranslate=[];
    var a=this.object.geometry.vertices[0].clone();
    var b=this.object.geometry.vertices[1].clone();
    var c=this.object.geometry.vertices[2].clone();
    var d=this.object.geometry.vertices[3].clone();
    var center=a.clone().add(b).add(c).add(d).divideScalar(4);
    var up=a.clone().add(b).add(center).divideScalar(2);
    var down=c.clone().add(d).add(center).divideScalar(2);
    var hex = 0x27B327;
    for(var i=0;i<4;i++){
        //var spriteRot = makeTextSprite( "R",{ fontsize: 20, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:0.2},backgroundColor: {r:238, g:238, b:238, a:0.2} });
        //var map = new THREE.TextureLoader().load( "images/rotate64.png" );
        var map =new THREE.Texture(rotate64PNG);
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.needsUpdate = true;
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, transparent: true, opacity: 0.3 } );
        var spriteRot=new THREE.Sprite( material );
        spriteRot.name=i.toString();
        this.spritesRotation.push(spriteRot);
        this.object.add(spriteRot);
    }
    for(var i=0;i<2;i++){
        var dir = this.normal;
        var origin = up;
        var length = 1;
        var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
        arrowHelper.scale.set(3,3,3);
        this.arrowTranslate.push(arrowHelper);
        this.object.add(arrowHelper);
    }
    this.origin=center;
}
planetoDraw.prototype.spritesTransparent=function (){
    for(var i=0;i<4;i++){
        this.spritesRotation[i].material.transparent=true;
        this.spritesRotation[i].material.opacity=0.3;
    }
    this.arrowTranslate[0].children[0].material.color.set(0x27B327);
    this.arrowTranslate[1].children[0].material.color.set(0x27B327);
}
planetoDraw.prototype.rotateOnSprite=function(index,angle){
    var n=(index==0 || index==3)?0:1;
    switch(n){
        case 0: {
            var axis=this.object.geometry.vertices[1].clone().sub(this.object.geometry.vertices[0]);
            axis.normalize();
            this.object.rotateOnAxis(axis,angle);
            this.updateObject();
            this.normal=this.getNormal();
            this.updateHandles();
            break;
        }    
        case 1: {
            var axis=this.object.geometry.vertices[2].clone().sub(this.object.geometry.vertices[0]);
            axis.normalize();
            this.object.rotateOnAxis(axis,angle);
            this.updateObject();
            this.normal=this.getNormal();
            this.updateHandles();
            break;
        }    
    }
    this.updateHandles();
}
planetoDraw.prototype.reset=function(){
    /*this.object.position.set( 0, 0, 0 );
    this.object.rotation.set( 0, 0, 0 );
    this.object.updateMatrix();*/
    this.object.geometry.vertices[0].set(-10,  0, 10 );
    this.object.geometry.vertices[1].set(10,  0, 10 );
    this.object.geometry.vertices[2].set(-10,  0, -10 );
    this.object.geometry.vertices[3].set(10,  0, -10 );
    this.object.geometry.verticesNeedUpdate = true;
    this.normal=this.getNormal();
    this.updateHandles();
}
planetoDraw.prototype.updateObject=function(){
    this.object.updateMatrix(); 
    this.object.geometry.applyMatrix( this.object.matrix );
    this.object.matrix.identity();
    this.object.geometry.verticesNeedUpdate = true;
    this.object.position.set( 0, 0, 0 );
    this.object.rotation.set( 0, 0, 0 );
    this.object.scale.set( 1, 1, 1 );
}
planetoDraw.prototype.defaultPositions=function(){
    var a=this.object.geometry.vertices[0];
    if(a.x==-10 && a.y==0 && a.z==10){
        this.object.geometry.vertices[0].set(0,-10, 10 );
        this.object.geometry.vertices[1].set(0,10, 10 );
        this.object.geometry.vertices[2].set(0,-10, -10 );
        this.object.geometry.vertices[3].set(0,10, -10 );
    }
    else if(a.x==0 && a.y==-10 && a.z==10){
        this.object.geometry.vertices[0].set(-10, 10,-5 );
        this.object.geometry.vertices[1].set(10, 10,-5 );
        this.object.geometry.vertices[2].set(-10, -10,-5 );
        this.object.geometry.vertices[3].set(10, -10,-5 );
    }
    else{
        this.reset();
    }
    this.object.geometry.verticesNeedUpdate = true;
    //this.updateObject();
    this.normal=this.getNormal();
    this.updateHandles();
}