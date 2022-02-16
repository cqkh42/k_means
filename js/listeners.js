d3.json("data/scaled/g2-2-40.json").then(
  data => initialPoints(data)).then(_ =>
  updateNumCentroids(2)
);


d3.select("#numclusters")
  .on("input", function() {
      d3.select("#numclusterstext")
        .text(this.value + " centroids")
  }
);

d3.select("#numclusters")
  .on("change",function(){
      updateNumCentroids(this.value)
    }
);

d3.select("#dataset")
  .on("change",function(){
      a = "scaled_data/g2-2-" + this.value + ".json"
      console.log(a)
      d3.json(a).then(data => console.log(data))
    }
);