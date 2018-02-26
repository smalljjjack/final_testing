  var activeCountry = "all";
  var timeStart = 1950;
  var timeEnd = 2017;

  function worldMap() {

    var height = $(".worldmap").height();
    var width = $(".worldmap").width();

    var svg = d3.select(".worldmap").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "worldmap");

    var color = d3.scaleThreshold()
      .domain([0, 20, 50, 100, 130, 150, 180, 220, 270, 300, 400])
      .range([
        "rgb(197, 203, 214)",
        "rgb(242, 203, 203)",
        "rgb(239, 174, 174)",
        "rgb(239, 136, 136)",
        "rgb(242, 118, 118)",
        "rgb(244, 102, 102)",
        "rgb(249, 77, 77)",
        "rgb(239, 59, 59)",
        "rgb(247, 44, 44)",
        "rgb(242, 21, 21)",
        "rgb(107, 2, 2)"
      ]);

    var path = d3.geoPath();

    var projection = d3.geoMercator()
      .scale(180)
      .translate([width / 2.0, height / 1.5]);

    var path = d3.geoPath().projection(projection);

    queue()
      .defer(d3.json, "world_countries.json")
      .defer(d3.csv, "data/results.csv")
      .await(ready);

    function ready(error, data, results) {
      var campaignNumByCountry = {};
      var result = results;
      var data = data;
      countCountriesCampaignNum(error, data, results);

      svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "countriesPath")
        .classed("normalPath", true)
        .style("fill", function(d) {
          if (d.campaignNum >= 0) return color(d.campaignNum);
          else return color(-1);
        })
        //tooltips
        .on("mouseover", function(d) {
          d3.select(this)
            .classed("normalPath", false)
            .classed("highLight", true);
          activeCountry = d["properties"]["name"];
        })
        .on("mouseout", function(d) {
          d3.select(this)
            .classed("normalPath", true)
            .classed("highLight", false);
          activeCountry = "all";
        })
        .append('title')
        .attr("class", "countriesTitle")
        .data(data.features)
        .text(function(d) {
          return "Countries :" + d.name + '\n' +
            "GameNumber :" + d.campaignNum + '\n';
        });

      //svg.selectAll(".countries")


      svg.append("path")
        .datum(topojson.mesh(data.features, function(a, b) {
          return a.id !== b.id;
        }))
        // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
        .attr("class", "names")
        .attr("d", path);

      var timeConfirm = d3.select("#timeConfirmBTN")
        .on("click", function() {
          //console.log("updateMap")
          var currTimeStart = $("#timeStart").val();
          var currTimeEnd = $("#timeEnd").val();
          if (currTimeStart < 1950 || currTimeEnd > 2017 || currTimeStart > currTimeEnd) {
            alert("Sorry, your input time is invalid,Valid input should be a number between 1950 to 2017,Please check your input and click confirm button");
            return;
          }
          timeStart = currTimeStart;
          timeEnd = currTimeEnd;
          countCountriesCampaignNum(error, data, results, timeStart, timeEnd)
          d3.selectAll(".countriesPath")
            .data(data.features)
            .style("fill", function(d) {
              if (d.campaignNum >= 0) return color(d.campaignNum);
              else return color(-1);
            });

          d3.selectAll(".countriesTitle")
            .data(data.features)
            .text(function(d) {
              return "Countries :" + d.name + '\n' +
                "GameNumber :" + d.campaignNum + '\n';
              //timeStart = 1950;
              //timeEnd = 2017;
            })
          $("#countyDetail").text("Select Country : "+activeCountry);
          $("#timeConfirmBTN2").click();
        })

      function countCountriesCampaignNum(error, data, results, timeStart = 1950, timeEnd = 2017) {
        campaignNumByCountry = {}

        results.forEach(function(d) {
          //console.log(d.home_team);
          var dyear = parseInt(d.date.substring(0, 4));
          //console.log(dyear);
          if (dyear >= timeStart && dyear <= timeEnd) {
            var curr = String(d.home_team);
            if (campaignNumByCountry[curr] == null) campaignNumByCountry[curr] = 1;
            else campaignNumByCountry[curr] += 1;
            //console.log(campaignNumByCountry[curr]);
          }
        })
        //console.log(campaignNumByCountry);
        //console.log(data);
        data.features.forEach(function(d) {
          d.name = d["properties"]["name"];
          d.campaignNum = +campaignNumByCountry[d["properties"]["name"]];
          //console.log(d.campaignNum);
        });
        //console.log(campaignNumByCountry);
      }
    }
  }

  function barchar() {
    //var format = d3.time.format("%Y-%m-%d");

    var margin = {
      top: 40,
      right: 50,
      bottom: 40,
      left: 50
    };

    var height = $(".part1").height()*0.88 / 3 - margin.top - margin.bottom,
      width = $(".p1bar2").width() - margin.left - margin.right;

    var color = d3.scaleThreshold()
      .domain([0, 1, 2, 3, 4, 5, 6, 7, 9])
      .range(["rgb(247,251,255)",
        "rgb(222,235,247)",
        "rgb(198,219,239)",
        "rgb(158,202,225)",
        "rgb(107,174,214)",
        "rgb(66,146,198)",
        "rgb(33,113,181)",
        "rgb(8,81,156)",
        "rgb(8,48,107)"
      ]);

    var colorP = 9;

    var svg1 = d3.select(".p1bar1").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var svg2 = d3.select(".p1bar2").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var svg3 = d3.select(".p1bar3").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("data/results.csv", function(error, data) {

      var tournament = {};
      var away_team = {};
      var year = {};

      var tX = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
      var tY = d3.scaleLinear()
        .range([height, 0]);

      var aX = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

      var aY = d3.scaleLinear()
        .range([height, 0]);

      var yX = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

      var yY = d3.scaleLinear()
        .range([height, 0]);
      // Get every column value

      //console.log(tournament);
      //console.log(away_team);
      //console.log(year);
      barDataProcess();

      drawbar1();
      drawbar2();
      drawbar3();

      function barDataProcess(timeStart = 1950, timeEnd = 2017, activeCountry = "all") {
        tournament = {};
        away_team = {};
        year = {};

        if (activeCountry == "all") {
          data.forEach(function(d) {
            //console.log(d.date);
            var dyear = parseInt(d.date.substring(0, 4));

            if (dyear >= timeStart && dyear <= timeEnd) {
              if (tournament[d.tournament] == null) tournament[d.tournament] = 1;
              else tournament[d.tournament] += 1;
              if (away_team[d.away_team] == null) away_team[d.away_team] = 1;
              else away_team[d.away_team] += 1;
              if (year[d.date.substring(0, 4)] == null) year[d.date.substring(0, 4)] = 1;
              else year[d.date.substring(0, 4)] += 1
            }
          });
        } else {
          //console.log("select One country");
          data.forEach(function(d) {
            //console.log(d.date);
            var dyear = parseInt(d.date.substring(0, 4));
            var dCountry = String(d.country);
            if (dyear >= timeStart && dyear <= timeEnd && dCountry == activeCountry) {
              if (tournament[d.tournament] == null) tournament[d.tournament] = 1;
              else tournament[d.tournament] += 1;
              if (away_team[d.away_team] == null) away_team[d.away_team] = 1;
              else away_team[d.away_team] += 1;
              if (year[d.date.substring(0, 4)] == null) year[d.date.substring(0, 4)] = 1;
              else year[d.date.substring(0, 4)] += 1
            }
          });
        }
        tournament = sortedOb(tournament);
        away_team = sortedOb(away_team);
        year = sortedOb(year);

        tX.domain(tournament.map(function(d) {
          return d.name;
        }));
        tY.domain([0, d3.max(tournament, function(d) {
          return d.value;
        })]);

        aX.domain(away_team.map(function(d) {
          return d.name;
        }));
        aY.domain([0, d3.max(away_team, function(d) {
          return d.value;
        })]);

        yX.domain(year.map(function(d) {
          return d.name;
        }));
        yY.domain([0, d3.max(year, function(d) {
          return d.value;
        })]);
      }

      function drawbar1() {
        colorP = 9;
        svg1.selectAll(".bar")
          .data(tournament)
          .enter().append("rect")
          .attr("class", "svg1bar")
          .attr("x", function(d) {
            return tX(d.name);
          })
          .attr("width", tX.bandwidth())
          .attr("y", function(d) {
            return tY(d.value);
          })
          .attr("height", function(d) {
            return height - tY(d.value);
          })
          .attr("fill", function(d) {
            return color(colorP--)
          })
          .append("title")
          .attr("class", "bartitle")
          .text(function(d) {
            return "Tournament : " + d.name + "\n" +
              "Game Number : " + d.value;
          });

        svg1.append("g")
          .attr("transform", "translate(0," + height + ")")
          .attr("class", "svg1x")
          .call(d3.axisBottom(tX))
          .selectAll("text")
          .attr("display", "none");

        svg1.append("g")
          .attr("class", "svg1y")
          .call(d3.axisLeft(tY));

      }

      function drawbar2() {
        colorP = 9;
        svg2.selectAll(".bar")
          .data(away_team)
          .enter().append("rect")
          .attr("class", "svg2bar")
          .attr("x", function(d) {
            return aX(d.name);
          })
          .attr("width", aX.bandwidth())
          .attr("y", function(d) {
            return aY(d.value);
          })
          .attr("height", function(d) {
            return height - aY(d.value);
          })
          .attr("fill", function(d) {
            return color(colorP--)
          })
          .append("title")
          .attr("class", "bartitle")
          .text(function(d) {
            return "Away_team : " + d.name + "\n" +
              "Game Number : " + d.value;
          });;

        svg2.append("g")
          .attr("transform", "translate(0," + height + ")")
          .attr("class", "svg2x")
          .call(d3.axisBottom(aX))
          .selectAll("text")
          .attr("display", "none");

        svg2.append("g")
          .attr("class", "svg2y")
          .call(d3.axisLeft(aY));
      }

      function drawbar3() {
        colorP = 9;

        svg3.selectAll(".bar")
          .data(year)
          .enter().append("rect")
          .attr("class", "svg3bar")
          .attr("x", function(d) {
            return yX(d.name);
          })
          .attr("width", yX.bandwidth())
          .attr("y", function(d) {
            return yY(d.value);
          })
          .attr("height", function(d) {
            return height - yY(d.value);
          })
          .attr("fill", function(d) {
            return color(colorP--)
          })
          .append("title")
          .attr("class", "bartitle")
          .text(function(d) {
            return "Year :" + d.name + "\n" +
              "Games in this year :" + d.value;
          });;

        svg3.append("g")
          .attr("transform", "translate(0," + height + ")")
          .attr("class", "svg3x")
          .call(d3.axisBottom(yX))
          .selectAll("text")
          .attr("display", "none");

        svg3.append("g")
          .attr("class", "svg3y")
          .call(d3.axisLeft(yY));
      }

      var timeConfirm2 = d3.select("#timeConfirmBTN2").
      on("click", function() {
        //console.log("btn2 click")

        barDataProcess(timeStart, timeEnd, activeCountry);
        //console.log(tournament);
        //console.log(away_team);
        //console.log(year);
        svgUpdata(svg1, ".svg1", tX, tY, tournament);
        svgUpdata(svg2, ".svg2", aX, aY, away_team);
        svgUpdata(svg3, ".svg3", yX, yY, year);
        $("#yearDetail").text("Select year : "+" " + timeStart+" - "+timeEnd);
      })

      var countryConfim = d3.select(".countries")
        .on("click", function() {
          barDataProcess(timeStart, timeEnd, activeCountry)
          //console.log(away_team);
          svgUpdata(svg1, ".svg1", tX, tY, tournament);
          svgUpdata(svg2, ".svg2", aX, aY, away_team);
          svgUpdata(svg3, ".svg3", yX, yY, year);
          $("#countyDetail").text("Select Country : "+activeCountry);
        })

      /*var condition = d3.selectAll(".countries")
          .on("click", function(){
            //console.log("click on country");
            console.log(timeStart);
            console.log(timeEnd);
            console.log(activeCountry);

            barDataProcess(timeStart, timeEnd, activeCountry);
            console.log(tournament);
            colorP = 9;
            svg1.selectAll(".svg1bar")
                .data(tournament)
                .attr("x", function(d) { return tX(d.name); })
                .attr("width", tX.bandwidth())
                .attr("y", function(d) { return tY(d.value); })
                .attr("height", function(d) { return height - tY(d.value); })
                .attr("fill", function(d){return color(colorP--)});

            svg1.call(d3.axisBottom(tX));
            svg1.call(d3.axisLeft(tY));
          })*/
      function svgUpdata(svg, barclass, x, y, currData) {
        colorP = 9;
        svg.selectAll(barclass + "bar")
          .attr("display", "none")
        svg.selectAll(barclass + "bar")
          .data(currData)
          .attr("display", "inline")
          .attr("x", function(d) {
            return x(d.name);
          })
          .attr("width", x.bandwidth())
          .attr("y", function(d) {
            return y(d.value);
          })
          .attr("height", function(d) {
            return height - y(d.value);
          })
          .attr("fill", function(d) {
            return color(colorP--)
          })
          .select(".bartitle")
          .text(function(d) {
            if (barclass == "svg1") {
              return "Tournament : " + d.name + "\n" +
                "Game Number : " + d.value;
            }
            if (barclass == "svg2") {
              return "Away_team :" + d.name + "\n" +
                "Game Number : " + d.value;
            } else {
              return "Year :" + d.name + "\n" +
                "Games in this year : " + d.value;
            }
          });

        svg.select(barclass + "x").call(d3.axisBottom(x))
          .selectAll("text")
          .attr("display", "none");

        svg.select(barclass + "y").call(d3.axisLeft(y));

        /*svg.select(".bar1title")
           .data(currData)
           .text(function(d){
             return "Tournament :"+d.name +"\n"+
                   "Game Number :" +d.value;
           });*/
      }

      d3.selectAll(".svg1bar")
        .on("mouseover", function() {
          d3.select(this).classed("barHighLight", true);
        })
        .on("mouseout", function() {
          d3.select(this).classed("barHighLight", false);
        })

      d3.selectAll(".svg2bar")
        .on("mouseover", function() {
          d3.select(this).classed("barHighLight", true);
        })
        .on("mouseout", function() {
          d3.select(this).classed("barHighLight", false);
        })
      d3.selectAll(".svg3bar")
        .on("mouseover", function() {
          d3.select(this).classed("barHighLight", true);
        })
        .on("mouseout", function() {
          d3.select(this).classed("barHighLight", false);
        })
    });
  }

  function sortedOb(obj) {
    let keys = Object.keys(obj);
    let newobj = [];
    // Then sort by using the keys to lookup the values in the original object:
    keys.sort(function(a, b) {
      return obj[b] - obj[a]
    });
    if (keys.length > 10) keys = keys.slice(0, 10);
    //console.log(keys)
    for (let i in keys) {
      newobj.push({
        "name": keys[i],
        value: obj[keys[i]]
      });
      //newobj[keys[i]] = obj[keys[i]];
    }
    return newobj;

  }
