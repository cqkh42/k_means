d3.select("#numclusters")
  .on("input", function() {
      d3.select("#numclusterstext")
        .text(this.value + " centroids")
    });
d3.select("#numclusters")
  .on("change",function(){
      updateClusters(this.value)
    });

function updateClusters(num){
    current = d3.selectAll("path").size()
    if (num > current){
        
        addCentroids(num - current)
    }
    else if (num < current){
        removeCentroids(current - num)
    }
};

function addCentroids(n){
    circles = d3.selectAll("circle").data()
    centroids = d3.selectAll("path").data()
        
    additional = getRandomSelection(circles, n).map((c, i) => ({
            "x": c.x, 
            "y": c.y, 
            "cluster": centroids.length + i + 1
            })
        )
        
    newData = centroids.concat(additional)
    drawCentroids(newData)   
};

function removeCentroids(n){
    newData = d3.selectAll("path")
            .data()
            .slice(0, -n)
    drawCentroids(newData)
};

// function updateCentroids(){
    // d3.select("#numclusterstext
// }

function start(){
    makeUnclickable("#addcluster")
    makeUnclickable("#removecluster")
    progress()
    
};

function progress(){
     newData = d3.selectAll("circle")
            .data()
            .map(i => findClosestCentroid(i))
          drawCircs(newData)
          newCentroids = assignCentroids()
          drawCentroids(newCentroids)
};

function makeClickable(id){
    d3.select(id)
      .classed("unclickable", false)
      .classed("clickable", true)
    
}

function makeUnclickable(id){
    d3.select(id)
      .classed("unclickable", true)
      .classed("clickable", false)
}
