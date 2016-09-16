// Catmull-Rom algorithm  object 
//sample:  number of points to sample per segment
//points: array of point to interpolate
function CatmullRomInterpolation(sample,controlpoints,tension){
    var xm1=controlpoints[1].x-controlpoints[0].x;
    var ym1=controlpoints[1].y-controlpoints[0].y;
    var xn1=controlpoints[controlpoints.length-1].x-controlpoints[controlpoints.length-2].x;
    var yn1=controlpoints[controlpoints.length-1].y-controlpoints[controlpoints.length-2].y;
    var Pminus1={x:controlpoints[0].x-xm1,y:controlpoints[0].y-ym1};
    var Pn1={x:controlpoints[controlpoints.length-1].x+xn1,y:controlpoints[controlpoints.length-1].y+yn1};
    var finalcontrolpoints=[Pminus1];
    finalcontrolpoints=finalcontrolpoints.concat(controlpoints);
    this.controlpoints=finalcontrolpoints.concat(Pn1);
    this.tension=tension;
    this.sample=sample;
    
    //Stores length of each segment
    var segmentLengths=[];
    //stores table of arc lengths, spline segment index, and spline parameterized value in a vector in order of arclength
    var arcLengthTable=[]; 
    // Total length of path 
    var totalLength = 0.0;
    var currentLength = 0.0;
    var step = 1.0 / (sample - 1);
    for (var segIdx=0; segIdx < this.controlpoints.length - 3; segIdx++) {
        // calculate length of a segment
        var t = step;
        var segLen = 0.0;
        var lastPoint = this.evaluatePointOnSegment(0.0,segIdx);
        arcLengthTable.push([currentLength, segIdx, 0.0]);
        for (var i=1; i < sample; i++) {
            var p = this.evaluatePointOnSegment(t,segIdx);
            var stepDist = Math.sqrt(Math.pow(p.x-lastPoint.x,2)+Math.pow(p.y-lastPoint.y,2));
            segLen += stepDist;
            currentLength += stepDist;
            arcLengthTable.push([currentLength, segIdx, t]);
            lastPoint = p;
            t += step;
        }
        totalLength += segLen;
        segmentLengths.push(segLen);
    }
    this.segmentLengths=segmentLengths;
    this.arcLengthTable=arcLengthTable;
    this.totalLength=totalLength;

}
// u is the parameter between 0 and 1.
CatmullRomInterpolation.prototype.interpolatePoints=function (P0, P1, P2, P3, u){   
        var t=this.tension;
		var u3 = u * u * u;
		var u2 = u * u;
		var f1 = -t * u3 + 2*t*u2 - t * u;
		var f2 =  (2-t) * u3 + (t-3) * u2 + 1.0;
		var f3 = (t-2) * u3 + (3-2*t) * u2 + t * u;
		var f4 =  t * u3 - t * u2;
		var x = P0.x * f1 + P1.x * f2 + P2.x * f3 + P3.x * f4;
		var y = P0.y * f1 + P1.y * f2 + P2.y * f3 + P3.y * f4;
		return {x:x,y:y};
}

 /*
        Function is for evaluating a point on a spline segment
     *	u parameterized value along segment in range [0,1]
     *	segmentIdx index of segment to evaluate point on
     *	returns (x,y,z) vector of point
    */
CatmullRomInterpolation.prototype.evaluatePointOnSegment= function (u, segIdx){
        var P0=this.controlpoints[segIdx];
        var P1=this.controlpoints[segIdx+1];
        var P2=this.controlpoints[segIdx+2];
        var P3=this.controlpoints[segIdx+3];
        return this.interpolatePoints(P0,P1,P2,P3,u);
    }
 /*
        Function returns segment index of point at distance len
     *	len length since start of path that point end on
     *	returns segment index */
CatmullRomInterpolation.prototype.getSegmentIndexAtArcLength= function (len){
        var currentLength = 0.0;
        for (var i=0; i < this.segmentLengths.length; i++) {
            currentLength += this.segmentLengths[i];
            if (len <= currentLength) {
                return i;
            }
        }
        return i-1;
    }
/*
        Function returns point on path that is at length len
        len length since start the point ends on
     	returns (x,y,z) point at length len
*/
CatmullRomInterpolation.prototype.getPointAtArcLength=function (len){
          var segIdx = this.getSegmentIndexAtArcLength(len);
          var min = segIdx * this.sample;
          var max = min + this.sample - 1;
          for (var i=min; i < max; i++) {
            var data2 = this.arcLengthTable[i+1];
            if (len <= data2[0]) {
                var data1 = this.arcLengthTable[i];
                var minLen = data1[0];
                var maxLen = data2[0];
                var minT = data1[2];
                var maxT = data2[2];
                var ratio = (len - minLen) / (maxLen - minLen);
                var t = minT + ratio * (maxT - minT);
                return this.evaluatePointOnSegment(t, segIdx);
             }
          }

          // last control point
          var p = this.controlpoints[this.controlpoints.length-2];
          return {x:p.x, y:p.y};
    }

CatmullRomInterpolation.prototype.interpolateForT= function (t){ 
        if (t < 0.0) {
            t = 0.0;
        } else if ( t > 1.0) {
            t = 1.0;
        }
        return this.getPointAtArcLength(t * this.totalLength);
}   
CatmullRomInterpolation.prototype.draw=function(mode){
     
     var  n = (this.controlpoints.length - 3) * (this.sample-1);
     var  p1 = this.interpolateForT(0.0);	
     var  p2 = this.interpolateForT(1.0/n);	
     var geometryLine = new THREE.Geometry();
    
     if(mode=="curve2d"){
        geometryLine.vertices.push(project2DVectorToFarPlane(p1),project2DVectorToFarPlane(p2));
        var  material = ModeManage.drawCurve.materialCurve;
     }
     else if (mode=="shadow"){
        geometryLine.vertices.push(Position3D(p1),Position3D(p2));
        var  material = ModeManage.drawShadow.materialCurve;
     }
     for (var i=2; i <= n; i++) {
                p1.x=p2.x;
                p1.y=p2.y;
                var  t = i/n;
                p2 = this.interpolateForT(t);  
                if(mode=="curve2d"){
                    geometryLine.vertices.push(project2DVectorToFarPlane(p1),project2DVectorToFarPlane(p2));
                 }
                 else if (mode=="shadow"){
                    geometryLine.vertices.push(Position3D(p1),Position3D(p2));
                 }
     }
     var curve=new THREE.LineSegments(geometryLine,material);
     if(mode=="curve2d") curve.name="CurrentCurve";
     if(mode=="shadow") curve.name="CurrentCurveShadow";
     setup.scene.add(curve);
}
