// 3D curve deformation like Laplacian mesh editting Olga Sorkine ...


function deformed3(array,handle,curveVertex,curveObject,normal){
    this.indexvertices=array;
    this.handle=handle;
    this.tableHash=[];
    this.n=array.length;
    if(this.n>=1) this.extremes=[array[0],array[this.n-1]];
    else this.extremes=[];
    this.olaplacian=[];
    this.freeVertex=[];
    this.pxy=[];
    this.weight=100;
    this.lowweight=1;
    //this.lastarray=[];
    this.curveVertex=curveVertex;
    this.curveObject=curveObject;
    this.normal=normal;
    if(this.n>0) this.initialize();
}
deformed3.prototype.initialize=function (){
    var positions=[];
    for(var i=0;i<this.n;i++){
        positions.push(this.curveVertex[this.indexvertices[i]]);
        this.tableHash[this.indexvertices[i].toString()]=i;
    }
   /* for(var i=0;i<hemesh.positions.length;i++){
        this.lastarray.push(hemesh.positions[i].clone());
    }*/
    this.positions=positions;
    this.computeLaplacian();
}
deformed3.prototype.computeOriginalValues=function (){
    var pxyz=[];
    for(var i=0;i<this.n;i++){
        pxyz.push(this.positions[i].x);
        pxyz.push(this.positions[i].y);
        pxyz.push(this.positions[i].z);
    }
    this.pxyz=pxyz;
    this.olaplacian=mulspMatrixVector(this.laplacian,pxyz);
}
deformed3.prototype.computeLaplacian=function(){
   var n=this.n-2;
   if(n>2){
        //computing triplets of vertex for computing uniform laplacian 
        var VertexTriplets=[];
        for(var i=0;i<n;i++){
            VertexTriplets.push([i,i+1,i+2]);
        }
        var L=zeros(3*n,3*n+6);
        for(var i = 0; i < n; i++){
            var v0 = VertexTriplets[i][0];
            var v1 = VertexTriplets[i][1];
            var v2 = VertexTriplets[i][2];
            L.val[3*i*L.n + 3*v1]=1;
            L.val[(3*i+1)*L.n + 3*v1+1]=1;
            L.val[(3*i+2)*L.n + 3*v1+2]=1;
            L.val[3*i*L.n + 3*v0]=-0.5;
            L.val[(3*i+1)*L.n + 3*v0+1]=-0.5;
            L.val[(3*i+2)*L.n + 3*v0+2]=-0.5;
            L.val[3*i*L.n + 3*v2]=-0.5;
            L.val[(3*i+1)*L.n + 3*v2+1]=-0.5;
            L.val[(3*i+2)*L.n + 3*v2+2]=-0.5;
        }
        this.laplacian=sparse(L);
        this.triplets=VertexTriplets;
        this.computeOriginalValues();
   }
   else{
       this.laplacian=[];
       this.triplets=[];
   }
}
deformed3.prototype.updateHandle=function(pos){
    var vector = new THREE.Vector3();
    vector.set( mouse.x ,mouse.y , 0.5 );
    vector.unproject( setup.camera);
    var cameraposition=setup.camera.position.clone();
    var dir = vector.sub(cameraposition).normalize();
    var point=this.positions[this.tableHash[this.handle.toString()]].clone();
    var t=point.sub(cameraposition).dot(this.normal)/dir.dot(this.normal);
    var point=cameraposition.add(dir.multiplyScalar(t));
    this.positions[this.tableHash[this.handle.toString()]].set(point.x,point.y,point.z);
    //this.curveVertex[this.tableHash[this.handle.toString()]].set(point.x,point.y,point.z);
    this.updateVertices3();
}
deformed3.prototype.updateVertices3=function(){
    //compute Ti
    //  |s  -h3  h2 tx|
    //  |h3  s  -h1 ty|
    //  |-h2 h1  s  tz|
    //  |0   0   0   1|
    
    //var newlapla=this.olaplacian.slice();
    var s=this.triplets.length;
    for(var j=0;j<s;j++){
        var pa=this.triplets[j][0];
        var p=this.triplets[j][1];
        var pb=this.triplets[j][2];
        var neibor=[pa,p,pb];
        var C=zeros(3*neibor.length,7);
        var bt=zeros(3*neibor.length);
        for(var i=0;i<neibor.length;i++){    
            C.val[3*i*C.n]=this.positions[neibor[i]].x;
            C.val[(3*i+1)*C.n]=this.positions[neibor[i]].y;
            C.val[(3*i+2)*C.n]=this.positions[neibor[i]].z;
            C.val[3*i*C.n+1]=0;
            C.val[(3*i+1)*C.n+1]=-this.positions[neibor[i]].z;
            C.val[(3*i+2)*C.n+1]=this.positions[neibor[i]].y;
            C.val[3*i*C.n+2]=this.positions[neibor[i]].z;
            C.val[(3*i+1)*C.n+2]=0;
            C.val[(3*i+2)*C.n+2]=-this.positions[neibor[i]].x;
            C.val[3*i*C.n+3]=-this.positions[neibor[i]].y;
            C.val[(3*i+1)*C.n+3]=this.positions[neibor[i]].x;
            C.val[(3*i+2)*C.n+3]=0;
            C.val[3*i*C.n+4]=1;
            C.val[(3*i+1)*C.n+5]=1;
            C.val[(3*i+2)*C.n+6]=1;
            bt[3*i]=this.positions[neibor[i]].x;
            bt[3*i+1]=this.positions[neibor[i]].y;
            bt[3*i+2]=this.positions[neibor[i]].z;
        }
        var tt=cgnr(C,bt);
        //compute transformed laplacian by Ti      
          
            var lx=this.olaplacian[3*j];
            var ly=this.olaplacian[3*j+1];
            var lz=this.olaplacian[3*j+2];
            this.olaplacian[3*j]=tt[0]*lx-tt[3]*ly+tt[2]*lz;
            this.olaplacian[3*j+1]=tt[3]*lx+tt[0]*ly-tt[1]*lz;
            this.olaplacian[3*j+2]=-tt[2]*lx+tt[1]*ly+tt[0]*lz;
    }
    
    if(this.laplacian.length!=0) var ml=this.laplacian.m/3;    
    else var ml=0;
    
    // creating final matrix for fitting
    var constrain=[0,this.n-1];
    /*
    for(var i=0;i<this.left;i++){   
       constrain.push(i);
    }
    for(var i=this.right+1;i<this.n;i++){   
       constrain.push(i);
    }*/
    constrain.push(this.tableHash[this.handle.toString()]);
    //console.log(constrain);
    var A=zeros(3*ml+ 3*this.freeVertex.length + 3*constrain.length,3*this.n);
    var b=zeros(3*ml+ 3*this.freeVertex.length + 3*constrain.length);
    //var A=zeros(2*ml+2*constrain.length ,2*this.n);
    //var b=zeros(2*ml+2*constrain.length );
    var ri = 0;
    for(var i=0;i<this.laplacian.n;i++){
        var s = this.laplacian.rows[i];
        var e = this.laplacian.rows[i+1];
        for ( var k=s; k < e; k++) {
            A.val[ri + this.laplacian.cols[k] ] = this.laplacian.val[k];
        }
        ri += this.laplacian.n; 
        if(i<this.laplacian.m){
            b[i]=this.olaplacian[i];    
        }    
    }
    for(var i=0;i<this.freeVertex.length;i++){
        var v=this.freeVertex[i];
        if(i<this.freeVertex.length/3 || i>2*this.freeVertex.length/3){
            A.val[(2*ml + 2*i)*A.n + 2*v]=50;
            A.val[(2*ml + 2*i+1)*A.n + 2*v+1]=50;
            b[2*ml+ 2*i]=50*this.positions[v].x;
            b[2*ml+ 2*i+1]=50*this.positions[v].y;    
        }
        else{
            A.val[(2*ml + 2*i)*A.n + 2*v]=this.lowweight;
            A.val[(2*ml + 2*i+1)*A.n + 2*v+1]=this.lowweight;
            b[2*ml+ 2*i]=this.lowweight*this.positions[v].x;
            b[2*ml+ 2*i+1]=this.lowweight*this.positions[v].y;
        }
        
    }
    for(var i=0;i<constrain.length;i++){
        var v=constrain[i];
        A.val[(3*ml+3*this.freeVertex.length +3*i)*A.n + 3*v]=this.weight;
        A.val[(3*ml+3*this.freeVertex.length +3*i+1)*A.n + 3*v+1]=this.weight;
        A.val[(3*ml+3*this.freeVertex.length +3*i+2)*A.n + 3*v+2]=this.weight;
        b[3*ml + 3*this.freeVertex.length +3*i]=this.weight*this.positions[v].x;
        b[3*ml + 3*this.freeVertex.length +3*i+1]=this.weight*this.positions[v].y;
        b[3*ml + 3*this.freeVertex.length +3*i+2]=this.weight*this.positions[v].z;
    }
    var spA=sparse(A);
    var vxyz=spcgnr(spA,b);
    this.pxyz=vxyz;
    
    for(i=0;i<this.n;i++){
        this.positions[i].setX(vxyz[3*i]);
        this.positions[i].setY(vxyz[3*i+1]);
        this.positions[i].setZ(vxyz[3*i+2]);
    }
    this.curveObject.geometry.verticesNeedUpdate = true;
    /*var mesh = setup.scene.getObjectByName("mesh"); 
    if(mesh!=undefined) mesh.geometry.verticesNeedUpdate = true;   
    var wireframe=setup.scene.getObjectByName("wireframeMesh");
    setup.scene.remove(wireframe);
    wireframeLines = hemesh.toWireframeGeometry();
    var wireframe = new THREE.LineSegments(wireframeLines, new THREE.LineBasicMaterial({
        color: 0xff2222,
        opacity: 0.2,
        transparent: true,
    }));
    wireframe.name="wireframeMesh";
    setup.scene.add(wireframe);*/
    
    //FirstMatrixtoProcessCurvatureEdgeLength();
}


