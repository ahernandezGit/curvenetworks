var ModeManage= ModeManage || {};
ModeManage={
    flagDrawPlane:true,
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
        normalDrawPlane: new THREE.Vector3(),
        EulerRotation:new THREE.Euler(0,0,0,'XYZ')
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
               this.drawCurve.value=false;
               this.drawShadow.value=false;
               this.drawGuidesLine.value=false;    
               this.selectObject.value=true;
               this.deformCurve.value=false;            
               this.joinCurves.value=false;          
               this.flagDrawPlane=false; 
               DrawPlane.visible=false;    
               break;    
            }
            case 4:{
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
            default: {
               this.drawCurve.value=false;
               this.drawShadow.value=false;
               this.drawGuidesLine.value=false;    
               this.selectObject.value=false;     
               this.deformCurve.value=false;                
               this.joinCurves.value=false;  
               this.flagDrawPlane=true;
               //DrawPlane.visible=false;
               DrawPlane.material.opacity=0.2;    
               setup.controls.enabled=true;
            }    
        }
    },
    clean:function(){
        this.drawCurve.value=false;
        this.drawCurve.isdrawing=false; 
        this.drawCurve.lastPoint=new THREE.Vector3();
        this.drawCurve.currentPoint= new THREE.Vector3();
        dispose3(this.drawCurve.LineStroke);
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
        else var id=this.number;
        var t=0;
        for(key in this.listCP){
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
    addCurve: function (points2D,idto){
        //var obj=new CatmullRomInterpolation(51,points2D,0.6);
        if(idto!=undefined) var id=idto.toString();
        else var id=this.number;
        var t=0;
        for(key in this.listCP){
            if(key==id){
                t++;
                break;
            }
        }
        if(t==0) this.number++;
        
        this.listObjects[id.toString()]={};
        this.listPoints2D[id.toString()]=points2D;
        if(points2D.length<3) this.listCP[id.toString()]=[];
        else this.listCP[id.toString()]=getCriticalPoints(points2D);
        
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
ListCurves3D={
    number:0,
    list:{},
    addCurve: function(points3D,symmetric,id){
        if(id!=undefined) var name="Curve"+id.toString();
        else var name="Curve"+this.number.toString();
        symmetric= symmetric || "";
        if(symmetric!="")  this.list[name]=new curve3D(name,points3D,"smooth",symmetric);
        else this.list[name]=new curve3D(name,points3D,"smooth","");
        this.number++;
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
    }
}


ListIntersectionObjects={};
function IntersectionObject(name,type){
    this.name=name;
    this.type=type;
}

//defining a abstract curve

function curve3D(name,points3D,type,symmetric){
    this.name=name;
    //this.controlpoints=points3D;
    this.catmullrom3={};
    this.tube={};
    this.type=type;
    this.iscurve=false;
    this.symmetric=symmetric;
    this.compute(points3D);
}
curve3D.prototype.compute=function(points3D){
    if(points3D.length>0){
        this.iscurve=true;
        this.catmullrom3=new THREE.CatmullRomCurve3(points3D);  
        this.tube=new THREE.TubeGeometry(this.catmullrom3, 100, 0.1, 8, false);
        this.controlpoints=this.tube.parameters.path.points;
    }
    else{
        this.controlpoints=[];
    }
}

//An plane to Draw over him

function planetoDraw(planeObject){
    this.object=planeObject;
    this.normal=this.getNormal();
    this.initialize();
    this.updateHandles();
    this.spriteSelected=-1;
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
    a.sub(center);
    b.sub(center);
    c.sub(center);
    d.sub(center);
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
}
planetoDraw.prototype.rotateOnSprite=function(index,angle){
    var n=(index==0 || index==3)?0:1;
    switch(n){
        case 0: {
            var axis=this.object.geometry.vertices[1].clone().sub(this.object.geometry.vertices[0]);
            axis.normalize();
            this.object.rotateOnAxis(axis,angle);
            this.normal=this.getNormal();
            break;
        }    
        case 1: {
            var axis=this.object.geometry.vertices[2].clone().sub(this.object.geometry.vertices[0]);
            axis.normalize();
            this.object.rotateOnAxis(axis,angle);
            this.normal=this.getNormal();
            break;
        }    
    }
    this.updateHandles();
}
planetoDraw.prototype.reset=function(){
    this.object.position.set( 0, 0, 0 );
    this.object.rotation.set( 0, 0, 0 );
    this.object.updateMatrix();
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