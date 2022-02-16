const cross = d3.symbol().type(d3.symbolCross).size(1)


function relocateCentroids(){
   newCentroids = findCentroidCentres()
   d3.select(".chart")
        .selectAll("path")
        .data(newCentroids)
        .transition().duration(1000)
        .attr("transform", d => getTranslate(d))
};

function findCentroidCentres(){
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
      .sort(
        (a,b) => (a.cluster > b.cluster) ? 1 : ((b.cluster > a.cluster) ? -1 : 0)
      )
    return newData
}

function updateNumCentroids(num){
    diff = num - d3.selectAll("path").size()
    diff > 0 ? addCentroids(diff) : removeCentroids(diff)
};

function addCentroids(num){
    old_length = d3.selectAll("path").size()
    additional = getRandomCircles(num).map((c, i) => ({
            "x": c.x,
            "y": c.y,
            "cluster": old_length + i + 1
            })
    )
    newData = d3.selectAll("path").data().concat(additional)
    d3.select(".chart")
      .selectAll("path")
      .data(newData)
      .enter()
      .append("path")
      .attr("d", cross())
      .style("fill", d => accent(d.cluster))
      .attr("transform", d => getTranslate(d))
      .transition(d3.transition().duration(1000))
      .style("opacity", 1)
}

function removeCentroids(num){
    coords = d3.selectAll("path").data().slice(0, num)
    d3.select(".chart")
      .selectAll("path").data(coords)
      .exit()
      .transition(d3.transition().duration(1000))
      .style("opacity", 0)
      .remove()
}
