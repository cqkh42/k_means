var scat
var x_scaler
var y_scaler
var min_x
var max_x
var min_y
var max_y
var accent = d3.scaleOrdinal(d3.schemeAccent)

d3.json("g2-2-100.json").then(function(data) {
    scat = data
        
    min_x = d3.min(scat, function(d) {return d.x}) 
    max_x = d3.max(scat, function(d) {return d.x}) 
    min_y = d3.min(scat, function(d) {return d.y}) 
    max_y = d3.max(scat, function(d) {return d.y}) 
   
    h = d3.select(".chart").node().width.baseVal.value
    
    x_scaler = d3.scaleLinear()
        .domain([min_x - 10, max_x + 10])
        .range([0, h]);
        
    y_scaler = d3.scaleLinear()
        .domain([min_y - 10, max_y + 10])
        .range([0, h]);

    drawpoints(scat)    
    selectRandom(2)  
    initial_centeroids = d3.selectAll(".selected").nodes().map(function(d){return d.__data__})    
    drawCenteroids(initial_centeroids)
    
        
    d3.selectAll("input[name='start']")
      .on("change", function(){
          if(this.value == "random"){selectRandom(2)}
          if(this.value == "k++"){alert("Not yet implemented")}
          if(this.value == "manual"){alert("Not yet implemented")}
          drawCenteroids()
      });
      
    d3.selectAll("#startbutton")
      .on("click", function(){
          drawBisector()
          assignClusters()
      })
      
    d3.selectAll("#nextbutton")
      .on("click", function(){
          var new_coords = calcNewCenteroids()
          drawCenteroids(new_coords)
          drawBisector()
          assignClusters()
      })
}
        );
                
function assignClusters(){
    var centeroids = d3.selectAll(".centeroid")
      .nodes()
      .map(function(d){return d.__data__})
        
    d3.selectAll(".circ")
      .each(function(d, i) {
          distances = centeroids.map(function(e) 
            {return (e.x - d.x)**2 + (e.y - d.y)**2}
          )
          
          for (var i=0; i < centeroids.length; i++){
              d3.select(this).classed("cluster_" + i, false)
              if (distances[i] == d3.min(distances)){
              d3.select(this)
              .classed("cluster_" + i, true)
              .attr("fill", accent[i])
              .attr("stroke", accent[i])
              .style("fill", accent[i])
              .style("stroke", accent[i])
              continue;
              
          }}
      })
}
        
function drawCenteroids(coords) {
    d3.selectAll(".centeroid").remove();
    cross = d3.symbol().type(d3.symbolCross).size(100)
    d3.select(".chart")
      .selectAll(".centeroid")
      .data(coords)
      .enter()
      .append("path")
      .attr("d", cross())
      .attr("transform", function(d) {
          return 'translate(' + x_scaler(d.x) + ' ' + y_scaler(d.y) + ')'})
      .classed("centeroid", true)
      }
      
function calcNewCenteroids() {
    num_clusters = d3.selectAll(".centeroid").size()
    var coords = []
    for (var i=0; i < num_clusters; i++){
        str = function(d){return ".cluster_" + i}
        nodes = d3.selectAll(".circ")
          .filter(str())
          .nodes()
        x = d3.mean(nodes
            .map(function(d){return d.__data__.x}))
        y = d3.mean(nodes
            .map(function(d){return d.__data__.y}))
        var coords = coords.concat([{"x":x, "y": y}])
    }
    return coords
}

function getYBoundary(x, m, c){
    y = (x * m) + c
    return [x_scaler(x), y_scaler(y)]    
}

function getXBoundary(y, m, c){
    x = (y - c)/ m
    return [x_scaler(x), y_scaler(y)]
}

function drawBisector() {
    d3.selectAll(".bisector").remove()
    var centeroids = d3.selectAll(".centeroid")
      .nodes()
      .map(function(d){return d.__data__})       
      
    centre_x = (centeroids[0].x + centeroids[1].x) / 2
    centre_y = (centeroids[0].y + centeroids[1].y) / 2    
    
    m = (centeroids[1].y - centeroids[0].y) / (centeroids[1].x - centeroids[0].x)
    
    if(m == 0){alert("m is 0")}
    else if(m == Infinity){alert("m is inf")}
    else {
        use_m = -1/m
        c = centre_y - (use_m * centre_x)

        l = getYBoundary(min_x - 10, use_m, c)
        r = getYBoundary(max_x + 10, use_m, c)
        t = getXBoundary(min_y - 10, use_m, c)
        b = getXBoundary(min_y + 10, use_m, c)
        
        var a = [l, r, t, b].filter(
          d => 0 <=d[0] <= 600 & 0 <= d[1] <= 600)
    }          
      
    d3.select(".chart").selectAll(".bisector")
      .data([1])
      .enter()
      .append("path")
      .attr("d", d3.line()(a))
      .classed("bisector", true) 
}

function selectRandom(size) {
    d3.selectAll(".circ").classed("selected", false);
    var nodes = d3.selectAll(".circ").nodes()
    for(var i = 0; i < size; i++){
        var index_in_circles = Math.floor(Math.random()*nodes.length);
        selected_point = d3.select(nodes[index_in_circles]).classed("selected", true);
    }
};

function drawpoints(data) {
    d3.select(".chart")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function(d){return x_scaler(d.x)})
      .attr("cy", function(d){return y_scaler(d.y)})
      .classed("circ", true)
}

