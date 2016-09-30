var ModeManage= ModeManage || {};
ModeManage={
    drawCurve : { 
        value: false, 
        isdrawing:false, 
        lastPoint: new THREE.Vector3(),
        currentPoint: new THREE.Vector3(),
        LineStroke : new THREE.Object3D(),
        pointsStroke : [],
        pointsStroke2D : [],
        materialCurve : new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } )
    },
    drawShadow : {
        value: false, 
        isdrawing:false, 
        lastPoint: new THREE.Vector3(),
        currentPoint: new THREE.Vector3(),
        LineStroke : new THREE.Object3D(),
        pointsStroke : [],
        pointsStroke2D : [],
        materialCurve : new THREE.LineBasicMaterial( { color: 0x3A2F0B, linewidth: 2 })  
        //materialCurve : new THREE.LineDashedMaterial( { color: 0x3A2F0B, linewidth: 1, dashSize:0.5, gapSize:0.5} ) 
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
               break;    
            }
            case 1:{
               this.drawCurve.value=false;
               this.drawShadow.value=true;
               this.drawGuidesLine.value=false;    
               this.selectObject.value=false;    
               this.deformCurve.value=false;     
               this.joinCurves.value=false;      
               break;
            }
            case 2:{
               this.drawCurve.value=false;
               this.drawShadow.value=false;
               this.drawGuidesLine.value=true;    
               this.selectObject.value=false;    
               this.deformCurve.value=false;
               this.joinCurves.value=false;      
               break;
            }
            case 3:{
               this.drawCurve.value=false;
               this.drawShadow.value=false;
               this.drawGuidesLine.value=false;    
               this.selectObject.value=true;
               this.deformCurve.value=false;            
               this.joinCurves.value=false;          
               break;    
            }
            case 4:{
               this.drawCurve.value=false;
               this.drawShadow.value=false;
               this.drawGuidesLine.value=false;    
               this.selectObject.value=false;
               this.deformCurve.value=true;
               this.joinCurves.value=false;      
               break;    
            } 
            case 5:{
               this.drawCurve.value=false;
               this.drawShadow.value=false;
               this.drawGuidesLine.value=false;    
               this.selectObject.value=false;
               this.deformCurve.value=false;
               this.joinCurves.value=true;      
               break;    
            }    
            default: {
               this.drawCurve.value=false;
               this.drawShadow.value=false;
               this.drawGuidesLine.value=false;    
               this.selectObject.value=false;     
               this.deformCurve.value=false;                
               this.joinCurves.value=false;      
            }    
        }
    }
    
}
ListCurves2D={
    number:0,
    listCP:[],
    listObjects:[],
    listPoints2D: [],
    addCurve: function (points2D){
        //var obj=new CatmullRomInterpolation(51,points2D,0.6);
        this.listObjects.push({});
        this.listPoints2D.push(points2D);
        this.listCP.push(getCriticalPoints(points2D));
        this.number++;
        return this.number-1;
    },
    popCurve: function(){
        this.listCP.pop();
        this.listObjects.pop();
        this.listPoints2D.pop();
        this.number--;
    }
}
ListCurvesShadow={
    number:0,
    listCP:[],
    listObjects:[],
    listPoints2D: [],
    addCurve: function (points2D){
        //var obj=new CatmullRomInterpolation(51,points2D,0.6);
        this.listObjects.push({});
        this.listPoints2D.push(points2D);
        this.listCP.push(getCriticalPoints(points2D));
        this.number++;
        return this.number-1;
    },
    popCurve: function(){
        this.listCP.pop();
        this.listObjects.pop();
        this.listPoints2D.pop();
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
        return this.number-1;
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