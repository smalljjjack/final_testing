  function worldMap() {
    var TimeStart;
    var TimeEnd;
    var height = $(".worldmap").height();
    var width = $(".worldmap").width();
    var svg = d3.select(".worldmap").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "worldmap");

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var path = d3.geoPath();

    var projection = d3.geoMercator()
      .scale(130)
      .translate([width / 2, height / 1.5]);

    var path = d3.geoPath().projection(projection);

    queue()
      .defer(d3.json, "world.topojson")
      .defer(d3.csv, "data/results.csv")
      .await(ready);

    function ready(error, data, results) {

      var campaignNumByCountry = {};
      console.log(data);
      console.log(results);
      //population.forEach(function(d) { console.log(d); campaignNumByCountry[d[home_team]] += 1; });
      //data.features.forEach(function(d) { d.population = campaignNumByCountry[d[home_team]] });

      /*svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) {
          return color(populationById[d.home_team]);
        })
        .style('stroke', 'white')
        .style('stroke-width', 1.5)
        .style("opacity", 0.8)
        // tooltips
        .style("stroke", "white")
        .style('stroke-width', 0.3);

        d3.select(this)
          .style("opacity", 0.8)
          .style("stroke", "white")
          .style("stroke-width", 0.3);

      svg.append("path")
        .datum(topojson.mesh(data.features, function(a, b) {
          return a.id !== b.id;
        }))
        // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
        .attr("class", "names")
        .attr("d", path);*/
    }
  }


  function brush() {

  }

  function barchar1() {

  }

  function barchart2() {

  }

  function barchart3() {

  }
