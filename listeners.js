function addCentroid(){
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
    
    if (newData.length >= 2){
        d3.select("#startbutton")
        .classed("unclickable", false)
        .classed("clickable", true)
    }
};

function removeCentroid(){
    newData = d3.selectAll("path")
            .data()
            .slice(0, -1)
          drawCentroids(newData)
          
    if (newData.length < 2){
        d3.select("#startbutton")
        .classed("unclickable", true)
        .classed("clickable", false)
    }
};

function start(){
    numClusters = d3.selectAll("path").size()
    if (numClusters >= 2){
        progress()
    }
}

function progress(){
     newData = d3.selectAll("circle")
            .data()
            .map(i => findClosestCentroid(i))
          drawCircs(newData)
          newCentroids = assignCentroids()
          drawCentroids(newCentroids)
};

