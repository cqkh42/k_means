var accent = d3.scaleOrdinal(d3.schemeCategory10)
var noise = "100"

d3.json("g2-json/g2-2-" + noise + ".json").then(data => doEverything(data));


function doEverything(data){
     data = scaleData(data)
    // createSVG()
    drawCircs(data)    

    // d3.selectAll("#startbutton")
      // .on("click", function(){
          // progress()
          // d3.select(this)
             // .text("Next")
      // })
};





function scaleData(data){
    minX = d3.min(data, d => d.x)
    maxX = d3.max(data, d => d.x)
    xScaler = d3.scaleLinear()
      .domain([minX - 5, maxX + 5])
      .range([0, 1000])
    minY = d3.min(data, d => d.y)
    maxY = d3.max(data, d => d.y)
    yScaler = d3.scaleLinear()
      .domain([minY - 5, maxY + 5])
      .range([0, 1000])
    data = data.map(i => ({"x": xScaler(i.x), "y": yScaler(i.y), "cluster": 0}))
    return data
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

function getDistance(p1, p2){
    d_1 = (p1.x - p2.x)**2
    d_2 = (p1.y - p2.y)**2
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
      .style("stroke", "#f2f2f2")
      .style("fill", d => accent(d.cluster))
      .style("stroke-width", 1)
}
        
function drawCentroids(coords) {      
    coords = coords.sort((d,b) => d.cluster > b.cluster)
    
    centroids = d3.select(".chart")
      .selectAll("path").data(coords)
    
    cross = d3.symbol().type(d3.symbolCross).size(100)    
    
    centroids.exit()
      .transition().duration(1000)
      .attr("transform", "translate(0,0)")
      .style("opacity", 0)
      .remove()
    
    centroids
      .transition().duration(1000)
      .attr("transform", d => getTranslate(d))
   
    centroids.enter()
      .append("path")
      .attr("d", cross())
      .style("fill", d => accent(d.cluster))
      .style("stroke-width", 1)
      .style("stroke", "black")
      .style("opacity", 0)
      .transition().duration(1000)
      .attr("transform", d => getTranslate(d))
      .style("opacity", 1)
      


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


