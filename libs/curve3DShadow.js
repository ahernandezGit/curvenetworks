var DirectionalVector=new THREE.Vector3(0,0,-1);
setup.scene.add( lighth );
setup.scene.add( light );
setup.scene.add( directionalLightUpper);
setup.scene.add( directionalLightDown);

//Orientation operator for three 2d points
 //sig( |	1  1  1 |
 //		 | a0	b0 c0|
 //     | a1 b1 c1| )
function Orientation(a,b,c) {
    var det=b.x*c.y-a.x*c.y-b.y*c.x+a.y*c.x+a.x*b.y-a.y*b.x;
    if (det>0.0001) {
        return 1;
    }
    else if (det>0) {
         return 0;
   }
   else {
    return -1;
   }	
 }

//get a neibor of a point in a polyline curve
//index is the index of point in the list of points from the curve
//n: is the size of the array of points from thge curve
function getNeibord(index,n){
    var low=Math.max(0,index-4);
    var high=Math.min(n-1,index+4);
    return [low,high];
}

//get critical point according to the definition from 
// An interface for sketching 3D curves, Jonathan M. Cohen , Lee Markosian , Robert C. Zeleznik , John F. Hughes , Ronen Barzel
// curve is a array of 2D screen positions
function getCriticalPoints2(curve){
    var n=curve.length;
    var result=[];
    for(var i=0;i<n;i++){
        var neibord_minmax=getNeibord(i,n);
        var otherExtreme=curve[i].clone().add(DirectionalVector2D);
        //test over each neiborhood
        var FirtTest=Orientation(curve[neibord_minmax[0]],curve[i],otherExtreme);
        for(var j=neibord_minmax[0]+1;j<=neibord_minmax[1];j++){
            if(j!=i){
              var test=Orientation(curve[j],curve[i],otherExtreme);
              if(test!=FirtTest)   break; 
            } 
        }
        if(test==FirtTest){
            result.push(i);
        }
    }
    //console.log(result);
    
    return result;
}
function getCriticalPoints(curve){
    var DirectionalVector2D=threeDToScreenSpace(DirectionalVector);
    var origin2D=threeDToScreenSpace(new THREE.Vector3(0,0,0));
    DirectionalVector2D.sub(origin2D);
    //drawLine(DirectionalVector,new THREE.Vector3(0,0,0));
    var n=curve.length;
    var result=[];
    if(n>0){
        result.push(0);
        for(var i=1;i<n-1;i++){
            var neibord_minmax=getNeibord(i,n);
            //console.log("neibor");
            //console.log(neibord_minmax);
            var otherExtreme=curve[i].clone().add(DirectionalVector2D);
            //constructing straigh passing by curve[i] and otherextreme
            var slope=(curve[i].y-otherExtreme.y)/(curve[i].x-otherExtreme.x);
            var b=(curve[i].x*otherExtreme.y-otherExtreme.x*curve[i].y)/(curve[i].x-otherExtreme.x);
            //test over each neiborhood
            var FirstTest=signo(curve[neibord_minmax[0]].y-slope*curve[neibord_minmax[0]].x-b);
            //console.log("firsttest");
            //console.log(FirstTest);
            //console.log("secondstest");
            for(var j=neibord_minmax[0]+1;j<=neibord_minmax[1];j++){
                if(j!=i){
                  var test=signo(curve[j].y-slope*curve[j].x-b);
                  //console.log(test);    
                  if(test!=FirstTest)  break; 
                } 
            }
            if(test==FirstTest){
                result.push(i);
            }

        }
        result.push(n-1);
    }
    //console.log(result);  
    return result;
}
//return -d if B is d image-space left of A 
// 0 if B is image-space aligned  with A and 
// d if  B is d image-space rigth of A 
//A and B are THREE.Vector2
//a is the 3D position of A.
function imageSpaceAligned(A,a,B){
    var otherextreme3D=a.clone().add(DirectionalVector);
    var DirectionalVector2D=threeDToScreenSpace(otherextreme3D);
    DirectionalVector2D.sub(A);
    var otherExtreme=A.clone().add(DirectionalVector2D);
    //drawLine(project2DVectorToFarPlane(A),project2DVectorToFarPlane(otherExtreme));
    // Get line passing by A and the Diretional Vector
    var slope=(A.y-otherExtreme.y)/(A.x-otherExtreme.x);
    var b=(A.x*otherExtreme.y-otherExtreme.x*A.y)/(A.x-otherExtreme.x);
    // avaliacao B
    var test=signo(B.y-slope*B.x-b);
    if(slope>0){
        var distance=Math.abs(B.y-slope*B.x-b)/Math.sqrt(1+Math.pow(slope,2));
        if(test==1) return distance*(-1);
        if(test==-1) return distance;
        else return 0;
    }   
    else{
        var distance=Math.abs(B.y-slope*B.x-b)/Math.sqrt(1+Math.pow(slope,2));
        if(test==1) return distance;
        if(test==-1) return distance*(-1);
        else return 0;
    }
}

function matchCriticalPoints(id,ListCurve,ListShadow){
    //match begin of the curve and shadow
    var shadow=ListShadow.listPoints2D[id];
    var curve=ListCurve.listPoints2D[id];
    var ic=ListCurve.listCP[id];
    var is=ListShadow.listCP[id];
    var dist=imageSpaceAligned(shadow[is[0]],Position3D(shadow[is[0]]),curve[ic[0]]);
    var dist1=imageSpaceAligned(shadow[is[is.length-1]],Position3D(shadow[is[is.length-1]]),curve[ic[0]]);
    var match=true;
    var couple=[[0,0]];
    /*if(dist<dist1){
        console.log("orientacao boa");
        ListCurve.listObjects[id]=new CatmullRomInterpolation(51,curve,0.6);
        ListShadow.listObjects[id]=new CatmullRomInterpolation(51,shadow,0.6);
        for(var j=0;j<11;j++){
            var p=ListCurve.listObjects[id].interpolateForT(j/10);
            var q=ListShadow.listObjects[id].interpolateForT(j/10);
            p=project2DVectorToFarPlane({x:p.x,y:p.y});
            q=Position3D({x:q.x,y:q.y});
            //drawLine(p,q);
        } 
    }
    else{
        mirrorIndexArray(is,shadow.length);
        shadow.reverse();
        ListCurve.listObjects[id]=new CatmullRomInterpolation(51,curve,0.6);
        ListShadow.listObjects[id]=new CatmullRomInterpolation(51,shadow,0.6);
        for(var j=0;j<11;j++){
            var p=ListCurve.listObjects[id].interpolateForT(j/10);
            var q=ListShadow.listObjects[id].interpolateForT(j/10);
            p=project2DVectorToFarPlane({x:p.x,y:p.y});
            q=Position3D({x:q.x,y:q.y});
            //drawLine(p,q);
        }
    }*/
    
    if(Math.abs(dist)<25){
        //drawLine(Position3D(shadow[is[0]]),project2DVectorToFarPlane(curve[ic[0]]));  
        console.log("orientacao boa");
        ListCurve.listObjects[id]=new CatmullRomInterpolation(51,curve,0.6);
        ListShadow.listObjects[id]=new CatmullRomInterpolation(51,shadow,0.6);
        for(var j=0;j<11;j++){
            var p=ListCurve.listObjects[id].interpolateForT(j/10);
            var q=ListShadow.listObjects[id].interpolateForT(j/10);
            p=project2DVectorToFarPlane({x:p.x,y:p.y});
            q=Position3D({x:q.x,y:q.y});
            //drawLine(p,q);
        } 
    }
    else{
        console.log("trocando de orientacao");
        console.log(dist);
        dist=imageSpaceAligned(shadow[is[is.length-1]],Position3D(shadow[is[is.length-1]]),curve[ic[0]]);
        if(Math.abs(dist)<25){
            mirrorIndexArray(is,shadow.length);
            shadow.reverse();
            ListCurve.listObjects[id]=new CatmullRomInterpolation(51,curve,0.6);
            ListShadow.listObjects[id]=new CatmullRomInterpolation(51,shadow,0.6);
            for(var j=0;j<11;j++){
                var p=ListCurve.listObjects[id].interpolateForT(j/10);
                var q=ListShadow.listObjects[id].interpolateForT(j/10);
                p=project2DVectorToFarPlane({x:p.x,y:p.y});
                q=Position3D({x:q.x,y:q.y});
                //drawLine(p,q);
            } 
            //drawLine(Position3D(shadow[is[0]]),project2DVectorToFarPlane(curve[ic[0]]));
        }
        else{
          var line=setup.scene.getObjectByName("lineTest");
          if(line!=undefined){
                setup.scene.remove(line);
          }    
          console.log("no match");  
          couple.pop();    
          match=false;    
        } 
        console.log(dist);
    }
    if(match){
        console.log("begin mached");
        //we iterate through the critical points of the shadow
        var valid=true;
        var i=1;
        var j0=1;
        var t=0; // for prevent infinity loop
        while(valid && i<is.length && t<500){
            console.log("valid ",valid);
            console.log("i",i);
            console.log("j0",j0);
            for(var j=j0;j<ic.length;j++){
                if(Math.abs(imageSpaceAligned(shadow[is[i]],Position3D(shadow[is[i]]),curve[ic[j]]))<25){
                    couple.push([i,j]);
                    i++;
                    j0=j+1;
                    break;
                }
                else if(imageSpaceAligned(shadow[is[i-1]],Position3D(shadow[is[i-1]]),curve[ic[j]])<0 || imageSpaceAligned(shadow[is[i]],Position3D(shadow[is[i]]),curve[ic[j]])>0){
                    valid=false;
                    break;
                }
                else valid=false;
            }
            t++;
        }
        if(couple[couple.length-1][1]!=ic.length-1){
            console.log("finish no match");
            //match=false;
        }
        else{
          console.log("finish match");    
        } 
        console.log(couple);
    }
    else{
      console.log("begin no match");
      //match=true;    
    }
    return match;
}
function reconstruct3DCurve(id,ListCurve,ListShadow){
    //likely original method of the paper
    var m=101;
    var dirplane=new THREE.Vector3(0,0,1);
    var vx=zeros(m);
    var vy=zeros(m);
    var vz=zeros(m);
    var p3=setup.camera.position.clone();
    var stroke2D=[];
    var shadow3D=[];
    for(var j=0;j<m;j++){
        var p=ListCurve.listObjects[id].interpolateForT(j/(m-1));
        var q=ListShadow.listObjects[id].interpolateForT(j/(m-1));
        stroke2D.push({x:p.x,y:p.y});
        //get line in world space passing by p  
        var pv=new THREE.Vector2();
        pv.x = ( p.x / window.innerWidth ) * 2 - 1;
        pv.y = - ( p.y / window.innerHeight ) * 2 + 1;		
        var vector = new THREE.Vector3();
        vector.set( pv.x ,pv.y , 0.5 );
       // console.log("vector antes ", vector);
        vector.unproject( setup.camera);
        vector.sub(setup.camera.position);
        var dir = new THREE.Vector3();
        dir.copy(vector);
        
        var q3=Position3D({x:q.x,y:q.y});
        shadow3D.push(q3.clone());
        // solve system in lest square sense
        var A=zeros(3,2);
        var b=zeros(3);
        A.val[0]=dir.x;
        A.val[1]=-dirplane.x;
        A.val[2]=dir.y;
        A.val[3]=-dirplane.y;
        A.val[4]=dir.z;
        A.val[5]=-dirplane.z;
        b[0]=q3.x-p3.x;
        b[1]=q3.y-p3.y;
        b[2]=q3.z-p3.z;
        //console.log(A);
        //console.log(b);
        var ts=cgnr(A,b);
        var final=p3.clone().add(dir.multiplyScalar(ts[0]));
        vx[j]=final.x;
        vy[j]=final.y;
        vz[j]=final.z;
    } 
    //console.log(vx);
    var vxyz=[];
    var material=new THREE.LineBasicMaterial({ color: 0x564002, linewidth: 3});
    var geometry=new THREE.Geometry();
    for(var i=0;i<vx.length;i++){
        vxyz.push(new THREE.Vector3(vx[i],vy[i],vz[i]));
    }
   
    
    //version like problem of least square
    //minimize error from projection in screen space and projection on plane XY
    //compute approx center of mass
    /*var cmass=new THREE.Vector3(0,0,0);
    for(var i=0;i<vxyz.length;i++){
        cmass.add(vxyz[i]);
    }
    cmass.divideScalar(vxyz.length); 
    var f=setup.camera.getFocalLength();
    f=f/cmass.z;
    var u=-cmass.x/cmass.z;
    var v=-cmass.y/cmass.z;
    for(var j=0;j<m;j++){
        var A=zeros(4,3);
        var b=zeros(4,1);
        A.val[0]=f;
        A.val[2]=f*u;
        A.val[4]=f;
        A.val[5]=f*v;
        A.val[0]=f;
        A.val[6]=1;
        A.val[10]=1;
        b[0]=stroke2D[j].x-f*cmass.x;
        b[1]=stroke2D[j].y-f*cmass.y;
        b[2]=shadow3D[j].x;
        b[3]=shadow3D[j].y;
        var sol=cgnr(A,b);
        vxyz[j].set(sol[0],sol[1],sol[2]);
    }
    */
     
    for(var i=0;i<9;i++){
        laplacianSmooth(vxyz);    
    }
    for(var i=0;i<vx.length-1;i++){
        var p=vxyz[i];
        var q=vxyz[i+1];
        geometry.vertices.push(p,q);
    }
    
    return [geometry,vxyz];
}