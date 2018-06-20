var x_scaler
var y_scaler
var min_x
var max_x
var min_y
var max_y
var accent = d3.scaleOrdinal(d3.schemeAccent)
var num_clusters = 2

d3.json("g2-2-100.json").then(function(data) {
        
    min_x = d3.min(data, function(d) {return d.x}) 
    max_x = d3.max(data, function(d) {return d.x}) 
    min_y = d3.min(data, function(d) {return d.y}) 
    max_y = d3.max(data, function(d) {return d.y}) 
   
    h = d3.select(".chart").node().width.baseVal.value
    
    x_scaler = d3.scaleLinear()
        .domain([min_x - 10, max_x + 10])
        .range([0, h]);
        
    y_scaler = d3.scaleLinear()
        .domain([min_y - 10, max_y + 10])
        .range([0, h]);

    drawpoints(data)    
    selectRandom(num_clusters)  
    initial_centroids = d3.selectAll(".selected").data()
    drawCentroids(initial_centroids)
    
        
    d3.selectAll("input[name='start']")
      .on("change", function(){
          if(this.value == "random"){selectRandom(num_clusters)}
          if(this.value == "k++"){alert("Not yet implemented")}
          if(this.value == "manual"){alert("Not yet implemented")}
          drawCentroids()
      });
      
    d3.selectAll("#startbutton")
      .on("click", function(){
          drawBisector()
          assignClusters()
      })
      
    d3.selectAll("#nextbutton")
      .on("click", function(){
          var new_coords = calcNewCentroids()
          drawCentroids(new_coords)
          drawBisector()
          assignClusters()
      })
}
        );
                
function assignClusters(){
    var centroids = d3.selectAll(".centroid")
      .data()
        
    d3.selectAll(".circ")
      .each(function(d, i) {
          distances = centroids.map(function(e) 
            {return (e.x - d.x)**2 + (e.y - d.y)**2}
          )
          
          for (var i=0; i < num_clusters; i++){
              d3.select(this).classed("cluster_" + i, false)
              if (distances[i] == d3.min(distances)){
              d3.select(this)
              .classed("cluster_" + i, true)
              .style("fill", accent(i+1))
              .style("stroke", accent(i+1))
              
          }}
      })
}
        
function drawCentroids(coords) {
    d3.selectAll(".centroid").remove();
    cross = d3.symbol().type(d3.symbolCross).size(100)
    d3.select(".chart")
      .selectAll(".centroid")
      .data(coords)
      .enter()
      .append("path")
      .attr("d", cross())
      .attr("transform", function(d) {
          return 'translate(' + x_scaler(d.x) + ' ' + y_scaler(d.y) + ')'})
      .classed("centroid", true)
      .style("fill", function(d,i){return accent(i+1)})
      .style("stroke", "black")
      }
      
function calcNewCentroids() {
    var coords = []
    for (var i=0; i < num_clusters; i++){
        data = d3.selectAll(".circ")
          .filter(".cluster_" + i)
          .data()
        x = d3.mean(data
            .map(function(d){return d.x}))
        y = d3.mean(data
            .map(function(d){return d.y}))
        var coords = coords.concat([{"x": x, "y": y}])
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
    var centroids = d3.selectAll(".centroid")
      .data()
      
    centre_x = d3.mean(centroids, function(d){return d.x})
    centre_y = d3.mean(centroids, function(d){return d.y})
    
    m = (centroids[1].y - centroids[0].y) / (centroids[1].x - centroids[0].x)
    
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
      .style("stroke", "red")
      .style("stroke-width", 1)
    
}

function selectRandom(size) {
    circs = d3.selectAll(".circ")
    indices = []
    for(var i = 0; i < size; i++){
        index_in_circles = Math.floor(Math.random()*circs.size());
        indices = indices.concat([index_in_circles])
    }
    circs.classed("selected", function(d,i){return indices.includes(i)})
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
      .style("stroke", accent(0))
      .style("r", 5)
      .style("stroke-width", 1)
      .style("fill", accent(0))
      .style("fill-opacity", 0.5)
}

