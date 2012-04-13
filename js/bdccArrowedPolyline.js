// Polyline with arrows
//
// (C) 2008 Bill Chadwick May
//
// Free for any use
//

// Original: http://wtp2.appspot.com/ArrowLine.htm
// (c) 2009 Andrew Porokhin

//
// How to use:
// var pts1 = new Array();
// pts1.push (new GLatLng(51.42, -0.97));
// pts1.push (new GLatLng(51.43, -0.97));
// var poly1 = new BDCCArrowedPolyline(pts1, "#FF0000", 4, 0.3, null, 30, 7, "#0000FF", 2, 0.5);
// map.addOverlay(poly1);

// TODO: rewrite code with CSS "line with arrow"
// TODO: rewrite as child of GPolyline

/**
 * Constructor. First 5 params exactly as GPolyline
 * then 5 params for Arrow.
 *
 * @param points Array with points.
 * @param color Color of the line.
 * @param weight Weight of the line.
 * @param opacity Opacity of the line.
 * @param opts Additional options for line.
 * @param gapPx Arrow spacing in pixles.
 * @param headLength Arrow head length in pixels.
 * @param headColor Arrow head colour.
 * @param headWeight Arrow head weight in pixels.
 * @param headOpacity Arrow head opacity.
 */
function BDCCArrowedPolyline(points, color, weight, opacity, opts, gapPx, headLength, headColor, headWeight, headOpacity) {
    this.gapPx = gapPx;
    this.points = points;
    this.color = color;
    this.weight = weight;
    this.opacity = opacity;
    this.headLength = headLength;
    this.headColor = headColor;
    this.headWeight = headWeight;
    this.headOpacity = headOpacity;
    this.opts = opts;
    this.heads = new Array();
    this.line = null;
}

/**
 * Prototype of the GOverlay
 */
BDCCArrowedPolyline.prototype = new GOverlay();

/**
 * Initialize.
 */
BDCCArrowedPolyline.prototype.initialize = function(map) {
    this.map = map;
    this.prj = this.map.getCurrentMapType().getProjection();
    
    var rdrw = GEvent.callback(this, this.recalc);
    this.zoomEventListener = GEvent.addListener(this.map, "zoomend", function(oldLevel, newLevel) {
        rdrw();
    });
    this.typeEventListener = GEvent.addListener(this.map, "maptypechanged", function() {
        rdrw();
    });
    
    // add main polyline
    this.line = new GPolyline(this.points, this.color, this.weight, this.opacity, this.opts);
    this.map.addOverlay(this.line);
    
    this.recalc();
};

BDCCArrowedPolyline.prototype.remove = function() {
    this.map.removeOverlay(this.line);
    this.removeHeadsOverlays();
    GEvent.removeListener(this.zoomEventListener);
    GEvent.removeListener(this.typeEventListener);
};

BDCCArrowedPolyline.prototype.removeHeadsOverlays = function() {
    try {
        for(var i=0; i<this.heads.length; i++) {
            this.map.removeOverlay(this.heads[i]);
        }
    } catch(ex) {
        // do nothing
    }
};

BDCCArrowedPolyline.prototype.copy = function() {
    return new BDCCArrowedPolyline(this.points,
        this.color, this.weight, this.opacity, 
        this.opts, this.gapPx, this.headLength,
        this.headColor, this.headWeight, this.headOpacity);
};

BDCCArrowedPolyline.prototype.redraw = function(force) {
    // do nothing, the GPolyline line and heads draw themselves
    return;
};

BDCCArrowedPolyline.prototype.recalc = function() {
    var zoom = this.map.getZoom();
    
    this.removeHeadsOverlays();
    
    // the arrow heads
    this.heads = new Array();

    var p1 = this.prj.fromLatLngToPixel(this.points[0],  zoom);//first point
    var p2;       //next point
    var dx;
    var dy;
    var sl;       //segment length
    var theta;    //segment angle
    var ta;       //distance along segment for placing arrows
      
    for (var i=1; i<this.points.length; i++) {
        p2 = this.prj.fromLatLngToPixel(this.points[i], zoom)
        dx = p2.x-p1.x;
        dy = p2.y-p1.y;
        sl = Math.sqrt((dx*dx)+(dy*dy)); 
        theta = Math.atan2(-dy,dx);
      
        j=1;
      
        if(this.gapPx == 0) {
            // just put one arrow at the end of the line
            this.addHead(p2.x,p2.y,theta,zoom);
        } else if(this.gapPx == 1) {
            // just put one arrow in the middle of the line
            var x = p1.x + ((sl/2) * Math.cos(theta));
            var y = p1.y - ((sl/2) * Math.sin(theta));
            this.addHead(x,y,theta,zoom);
        } else {
            // iterate along the line segment placing arrow markers
            // don't put an arrow within gapPx of the beginning or end of the segment 

            ta = this.gapPx;
            while(ta < sl) {
                var x = p1.x + (ta * Math.cos(theta)); 
                var y = p1.y - (ta * Math.sin(theta));
                this.addHead(x,y,theta,zoom);
                ta += this.gapPx;  
            }  
      
            // line too short, put one arrow in its middle
            if(ta == this.gapPx) {
                var x = p1.x + ((sl/2) * Math.cos(theta)); 
                var y = p1.y - ((sl/2) * Math.sin(theta));
                this.addHead(x,y,theta,zoom);        
            }
        }
        p1 = p2;
    }
};

BDCCArrowedPolyline.prototype.addHead = function(x, y, theta, zoom) {
    //add an arrow head at the specified point
    var t = theta + (Math.PI/4) ;
    if(t > Math.PI) {
        t -= 2*Math.PI;
    }
    var t2 = theta - (Math.PI/4) ;
    if(t2 <= (-Math.PI)) {
        t2 += 2*Math.PI;
    }
    var pts = new Array();
    var x1 = x-Math.cos(t)*this.headLength;
    var y1 = y+Math.sin(t)*this.headLength;
    var x2 = x-Math.cos(t2)*this.headLength;
    var y2 = y+Math.sin(t2)*this.headLength;
    
    pts.push(this.prj.fromPixelToLatLng(new GPoint(x1,y1), zoom));
    pts.push(this.prj.fromPixelToLatLng(new GPoint(x,y), zoom));    
    pts.push(this.prj.fromPixelToLatLng(new GPoint(x2,y2), zoom));
    
    this.heads.push(new GPolyline(pts,this.headColor,this.headWeight,this.headOpacity,this.opts));
    this.map.addOverlay(this.heads[this.heads.length-1]);
};
