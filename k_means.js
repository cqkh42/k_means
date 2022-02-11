var accent = d3.scaleOrdinal(d3.schemeCategory10)
const trans = d3.transition().duration(1000)



function getTranslate(d){
    p = 'translate(' + d.x + ' ' + d.y + ')'
    return p
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

function initialPoints(data){
    circs = d3.selectAll(".chart")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("fill", accent(0))
}

function recolorPoints(data) {
    d3.selectAll("circle").data(data)
      .transition().duration(1000)
      .style("fill", d => accent(d.cluster))
}

function getRandomCircles(n) {
    arr = d3.selectAll("circle").data()
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

function assignCircles(){
  let data = d3.selectAll("circle").data().map(i => findClosestCentroid(i))
  recolorPoints(data)
};
