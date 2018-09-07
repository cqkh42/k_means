var accent = d3.scaleOrdinal(d3.schemeAccent)

d3.json("g2-json/g2-2-30.json").then(function(data) {
    createSVG()
    drawCircs(data)    

    d3.select("#addcluster")
      .on("click", function(){            
        circles = d3.selectAll("circle").data()
        centroids = d3.selectAll("path").data()
        
        additional = getRandomSelection(circles, 1).map(c => ({
                "x": c.x, 
                "y": c.y, 
                "cluster": centroids.length + 1
                })
            )
        
        newData = centroids.concat(additional)
        drawCentroids(newData)   
      })
      
    d3.select("#removecluster")
      .on("click", function(){
          newData = d3.selectAll("path")
            .data()
            .slice(0, -1)
          drawCentroids(newData)
      });
      
    d3.selectAll("#startbutton")
      .on("click", function(){
          newData = d3.selectAll("circle")
            .data()
            .map(i => findClosestCentroid(i))
          drawCircs(newData)
          newCentroids = assignCentroids()
          drawCentroids(newCentroids)
          d3.select(this)
             .text("Next")
      })
});

function createSVG(){
    d3.select(".svg-container")
      .append("svg")
      .classed("chart", true)
      .attr("viewBox", "0 0 1000 1000")
      .attr("preserveAspectRatio", "xMinYMid meet")
      .attr("display", "inline-block")
      .attr("position", "absolute")
      .attr("top", 0)
      .attr("left", 0)
}

function getTranslate(d){
    p = 'translate(' + d.x + ' ' + d.y + ')'
    return p
}  

function assignCentroids(){
    circs = d3.selectAll("circle").data()
    newData = d3.nest()
      .key(d => d.cluster)
      .rollup(d => ({
              "x": d3.mean(d, i => i.x), 
              "y": d3.mean(d, i => i.y),
              "cluster": d3.max(d, i => i.cluster)
            })
        )
      .entries(circs)
      .map(d => d.value)
    return newData
}   

function getDistance(a, b){
    d_1 = (a.x - b.x)**2
    d_2 = (a.y - b.y)**2
    d_3 = d_1 + d_2

    return d_3 ** 0.5
}
    
function findClosestCentroid(point){   
    distances = d3.selectAll("path")
      .data()
      .map(centroid => ({
          "cluster": centroid.cluster, 
          "dist": getDistance(centroid, point)
          })
      )
    min_dist = d3.min(distances, d => d.dist)
    ni = distances.filter(d => d.dist == min_dist)[0]
    datum = {"x": point.x, "y": point.y, "cluster": ni.cluster}
    return datum
}

function drawCircs(data) {
    circs = d3.select(".chart")
      .selectAll("circle")
      .data(data)
    
    circs.exit().remove()
      
    circs
      .enter()
      .append("circle")
      .style("r", 5)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("fill", accent(0))
      .style("fill-opacity", 0.5)
      
      
    d3.selectAll("circle")
      .transition().duration(1000)
      .style("stroke", d => accent(d.cluster))
      .style("fill", d => accent(d.cluster))
      .style("stroke-width", 1)
}
        
function drawCentroids(coords) {
    coords = coords.sort((d,b) => d.cluster > b.cluster)
    
    centroids = d3.select(".chart")
      .selectAll("path").data(coords)
      
    centroids.exit().remove()
      
    cross = d3.symbol().type(d3.symbolCross).size(100)
    centroids
      .enter()
      .append("path")
      .attr("d", cross())
      .style("fill", d => accent(d.cluster))
      .style("stroke", "black")
      .style("stroke-width", 1)
      
    d3.selectAll("path").transition().duration(1000)
      .attr("transform", d => getTranslate(d))  
}

function getRandomSelection(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}


