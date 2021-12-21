let drawSpace = d3.select("#drawspace");

d3.csv("data.csv").then(showData);

var mapInfo, reqData, drawSpaceW, drawSpaceH;
let myData;

function showData(my_data) {
  drawSpaceH = 700;
  drawSpaceW = 700;

  myData = [...my_data];

  change();

  document.getElementById("loading-container").style.display = "none";
}

function change() {
  let yearlyData = [];
  let yearRainfallMap = new Map();

  myData.forEach((d) => {
    let year = d.month.split("-")[0];
    if (yearRainfallMap.has(year)) {
      yearRainfallMap.set(year, yearRainfallMap.get(year) + +d.total_rainfall);
    } else {
      yearRainfallMap.set(year, +d.total_rainfall);
    }
  });

  yearRainfallMap.forEach((values, keys) => {
    yearlyData.push({ year: keys, rainfall: values });
  });

  console.log(yearlyData);

  var margin = { top: 40, right: 30, bottom: 150, left: 60 },
    width = 1500 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  d3.select("#drawspace").select("svg").remove();

  var xScale = d3
    .scalePoint()
    .range([0, width])
    .domain(yearlyData.map((d) => d.year));

  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(yearlyData, (d) => +d.rainfall)])
    .range([height, 0]);

  var svg = d3
    .select("#drawspace")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .append("g")
    .attr("class", "grid")
    .style("opacity", "0.3")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).ticks(5).tickSize(-height).tickFormat(""));

  svg
    .append("g")
    .attr("class", "grid")
    .style("opacity", "0.3")
    .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(""));

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    .style("text-anchor", "middle")
    .text("Years");

  var axisleft = d3.axisLeft(yScale);
  axisleft.ticks(15);
  svg.append("g").call(axisleft);

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Total Rainfall");

  var path = svg
    .append("path")
    .datum(yearlyData)
    .attr("fill", "#6998AB")
    .style("opacity", "0.6")
    .attr("stroke", "#1A374D")
    .attr("stroke-width", 4)
    .attr(
      "d",
      d3
        .area()
        .x((d) => xScale(d.year))
        .y0(yScale(0))
        .y1((d) => yScale(d.rainfall))
        .defined((d) => !!d.rainfall)
    );

  var totalLength = path.node().getTotalLength();
  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(4000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);

  svg
    .selectAll("circle")
    .data(yearlyData)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("r", 3.5)
    .attr("cx", (d) => xScale(d.year))
    .attr("cy", (d) => yScale(d.rainfall))
    .on("mouseenter", function () {
      d3.selectAll(".circle").attr("opacity", 0);
      d3.select(this).attr("opacity", 1).attr("r", 8);
    })
    .on("mouseout", function () {
      d3.selectAll(".circle").attr("opacity", 1).attr("r", 3.5);
    })
    .on("click", (event, d) => {
      let monthWiseData = myData.filter((D) => D.month.split("-")[0] == d.year);
      monthWiseVisualization(monthWiseData, d.year);
    })
    .append("title")
    .text(
      (d) => "Total rainfall in year " + d.year + " was " + d.rainfall + " mm."
    );
}

function monthWiseVisualization(monthWiseData, year) {
  maximum_rainfall_in_a_day(monthWiseData, year);
  no_of_rainy_days(monthWiseData, year);
  total_rainfall(monthWiseData, year);
  rh_extremes_minimum(monthWiseData, year);
  mean_rh(monthWiseData, year);
  mean_sunshine_hrs(monthWiseData, year);
}

function maximum_rainfall_in_a_day(monthWiseData, year) {
  var margin = { top: 40, right: 30, bottom: 150, left: 70 },
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  d3.select("#canvas1").select("svg").remove();

  var svg = d3
    .select("#canvas1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xScale = d3
    .scaleBand()
    .range([0, width])
    .domain(monthWiseData.map((d) => d.month))
    .padding(0.2);

  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    .style("text-anchor", "middle")
    .text("Months of year " + year);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(monthWiseData, (d) => +d.maximum_rainfall_in_a_day)])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(yScale).ticks(15));

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Maximum rainfall in a day");

  svg
    .selectAll("mybar")
    .data(monthWiseData)
    .enter()
    .append("rect")
    .attr("class", "bar1")
    .attr("x", (d) => xScale(d.month))
    .attr("width", xScale.bandwidth())
    .attr("fill", "#7267CB")
    .on("mouseenter", function () {
      d3.selectAll(".bar1").attr("opacity", 0.5);
      d3.select(this).attr("fill", "#6E3CBC").attr("opacity", 1);
    })
    .on("mouseout", function () {
      d3.selectAll(".bar1").attr("opacity", 1).attr("fill", "#7267CB");
    })
    .attr("height", height - yScale(0))
    .attr("y", yScale(0))
    .append("title")
    .text(
      (d) =>
        "Maximum rainfall in a day for the month " +
        d.month +
        " was " +
        d.maximum_rainfall_in_a_day +
        " mm."
    );

  svg
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", (d) => yScale(d.maximum_rainfall_in_a_day))
    .attr("height", (d) => height - yScale(d.maximum_rainfall_in_a_day))
    .delay((d, i) => i * 100);
}

function no_of_rainy_days(monthWiseData, year) {
  var margin = { top: 40, right: 30, bottom: 150, left: 70 },
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  d3.select("#canvas2").select("svg").remove();

  var svg = d3
    .select("#canvas2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  let colorScale = d3.scaleOrdinal(d3.schemePaired);
  let radius = Math.min(width, height) / 2;

  let pie = d3.pie().value((d) => d.no_of_rainy_days);
  let arc = d3
    .arc()
    .outerRadius(radius)
    .innerRadius(radius * 0.2)
    .padAngle(0.05)
    .cornerRadius(5);

  svg
    .append("g")
    .selectAll("mydots")
    .data(monthWiseData)
    .enter()
    .append("circle")
    .attr("cx", 100)
    .attr("cy", function (d, i) {
      return 50 + i * 25;
    })
    .attr("r", 7)
    .style("fill", function (d) {
      return colorScale(d.month);
    });

  svg
    .append("g")
    .selectAll("mylabels")
    .data(monthWiseData)
    .enter()
    .append("text")
    .attr("x", 120)
    .attr("y", function (d, i) {
      return 50 + i * 25;
    })
    .text((d) => d.month)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");

  svg
    .append("g")
    .attr(
      "transform",
      "translate(" + (width / 2 + 100) + "," + (height / 2 + 100) + ")"
    )
    .selectAll("arc")
    .data(pie(monthWiseData))
    .enter()
    .append("g")
    .append("path")
    .attr("class", "arc1")
    .attr("d", arc)
    .attr("fill", (d) => colorScale(d.data.month))
    .on("mouseenter", function () {
      d3.selectAll(".arc1").attr("opacity", 0.2);
      d3.select(this).attr("opacity", 1);
    })
    .on("mouseout", function () {
      d3.selectAll(".arc1").attr("opacity", 1);
    })
    .append("title")
    .text(
      (d) =>
        "Number of rainy days in the month " +
        d.data.month +
        " was " +
        d.data.no_of_rainy_days +
        " days."
    );

  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + (width / 2 + 100) + " ," + (height + margin.top + 80) + ")"
    )
    .style("text-anchor", "middle")
    .text("Number of rainy days in a month");
}

function total_rainfall(monthWiseData, year) {
  var margin = { top: 40, right: 30, bottom: 150, left: 70 },
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  d3.select("#canvas3").select("svg").remove();

  var xScale = d3
    .scalePoint()
    .range([0, width])
    .domain(monthWiseData.map((d) => d.month));

  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(monthWiseData, (d) => +d.total_rainfall)])
    .range([height, 0]);

  var svg = d3
    .select("#canvas3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .append("g")
    .attr("class", "grid")
    .style("opacity", "0.3")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).ticks(5).tickSize(-height).tickFormat(""));

  svg
    .append("g")
    .attr("class", "grid")
    .style("opacity", "0.3")
    .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(""));

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    .style("text-anchor", "middle")
    .text("Months of year " + year);

  var axisleft = d3.axisLeft(yScale);
  axisleft.ticks(15);
  svg.append("g").call(axisleft);

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Total Rainfall in the month");

  var path = svg
    .append("path")
    .datum(monthWiseData)
    .attr("fill", "none")
    .style("opacity", "1")
    .attr("stroke", "#B1D0E0")
    .attr("stroke-width", 4)
    .attr(
      "d",
      d3
        .line()
        .x((d) => xScale(d.month))
        .y((d) => yScale(d.total_rainfall))
    );

  var totalLength = path.node().getTotalLength();
  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(4000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);

  svg
    .selectAll("circle")
    .data(monthWiseData)
    .enter()
    .append("circle")
    .attr("class", "circle1")
    .attr("r", 3.5)
    .attr("cx", (d) => xScale(d.month))
    .attr("cy", (d) => yScale(d.total_rainfall))
    .on("mouseenter", function () {
      d3.selectAll(".circle1").attr("opacity", 0);
      d3.select(this).attr("opacity", 1).attr("r", 8);
    })
    .on("mouseout", function () {
      d3.selectAll(".circle1").attr("opacity", 1).attr("r", 3.5);
    })
    .append("title")
    .text(
      (d) =>
        "Total rainfall in month " +
        d.month +
        " was " +
        d.total_rainfall +
        " mm."
    );
}

function rh_extremes_minimum(monthWiseData, year) {
  var margin = { top: 40, right: 30, bottom: 150, left: 70 },
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  d3.select("#canvas4").select("svg").remove();

  var svg = d3
    .select("#canvas4")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xScale = d3
    .scaleBand()
    .range([0, width])
    .domain(monthWiseData.map((d) => d.month))
    .padding(0.2);

  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    .style("text-anchor", "middle")
    .text("Months of year " + year);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(monthWiseData, (d) => +d.rh_extremes_minimum)])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(yScale).ticks(15));

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Minimum extreme of Relative Humidity");

  svg
    .selectAll("mybar")
    .data(monthWiseData)
    .enter()
    .append("rect")
    .attr("class", "bar3")
    .attr("x", (d) => xScale(d.month))
    .attr("width", xScale.bandwidth())
    .attr("fill", "#B958A5")
    .on("mouseenter", function () {
      d3.selectAll(".bar3").attr("opacity", 0.5);
      d3.select(this).attr("fill", "#4C3F91").attr("opacity", 1);
    })
    .on("mouseout", function () {
      d3.selectAll(".bar3").attr("opacity", 1).attr("fill", "#B958A5");
    })
    .attr("height", height - yScale(0))
    .attr("y", yScale(0))
    .append("title")
    .text(
      (d) =>
        "Minimum extreme of Relative Humidity for the month " +
        d.month +
        " was " +
        d.rh_extremes_minimum +
        "%."
    );

  svg
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", (d) => yScale(d.rh_extremes_minimum))
    .attr("height", (d) => height - yScale(d.rh_extremes_minimum))
    .delay((d, i) => i * 100);
}

function mean_rh(monthWiseData, year) {
  var margin = { top: 40, right: 30, bottom: 150, left: 70 },
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  d3.select("#canvas5").select("svg").remove();

  var svg = d3
    .select("#canvas5")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  let colorScale = d3.scaleOrdinal(d3.schemeSet3);
  let radius = Math.min(width, height) / 2;

  let pie = d3.pie().value((d) => d.mean_rh);
  let arc = d3
    .arc()
    .outerRadius(radius)
    .innerRadius(radius * 0.2)
    .padAngle(0.05)
    .cornerRadius(5);

  svg
    .append("g")
    .selectAll("mydots")
    .data(monthWiseData)
    .enter()
    .append("circle")
    .attr("cx", 100)
    .attr("cy", function (d, i) {
      return 50 + i * 25;
    })
    .attr("r", 7)
    .style("fill", function (d) {
      return colorScale(d.month);
    });

  svg
    .append("g")
    .selectAll("mylabels")
    .data(monthWiseData)
    .enter()
    .append("text")
    .attr("x", 120)
    .attr("y", function (d, i) {
      return 50 + i * 25;
    })
    .text((d) => d.month)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");

  svg
    .append("g")
    .attr(
      "transform",
      "translate(" + (width / 2 + 100) + "," + (height / 2 + 100) + ")"
    )
    .selectAll("arc")
    .data(pie(monthWiseData))
    .enter()
    .append("g")
    .append("path")
    .attr("class", "arc2")
    .attr("d", arc)
    .attr("fill", (d) => colorScale(d.data.month))
    .on("mouseenter", function () {
      d3.selectAll(".arc2").attr("opacity", 0.2);
      d3.select(this).attr("opacity", 1);
    })
    .on("mouseout", function () {
      d3.selectAll(".arc2").attr("opacity", 1);
    })
    .append("title")
    .text(
      (d) =>
        "Mean Relative Humidity in the month " +
        d.data.month +
        " was " +
        d.data.mean_rh +
        "%."
    );

  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + (width / 2 + 100) + " ," + (height + margin.top + 80) + ")"
    )
    .style("text-anchor", "middle")
    .text("Mean Relative Humidity in a month");
}

function mean_sunshine_hrs(monthWiseData, year) {
  var margin = { top: 40, right: 30, bottom: 150, left: 70 },
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  d3.select("#canvas6").select("svg").remove();

  var xScale = d3
    .scalePoint()
    .range([0, width])
    .domain(monthWiseData.map((d) => d.month));

  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(monthWiseData, (d) => +d.mean_sunshine_hrs)])
    .range([height, 0]);

  var svg = d3
    .select("#canvas6")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .append("g")
    .attr("class", "grid")
    .style("opacity", "0.3")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).ticks(5).tickSize(-height).tickFormat(""));

  svg
    .append("g")
    .attr("class", "grid")
    .style("opacity", "0.3")
    .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(""));

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    .style("text-anchor", "middle")
    .text("Months of year " + year);

  var axisleft = d3.axisLeft(yScale);
  axisleft.ticks(15);
  svg.append("g").call(axisleft);

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Mean sunshine hours in the month");

  var path = svg
    .append("path")
    .datum(monthWiseData)
    .attr("fill", "none")
    .style("opacity", "1")
    .attr("stroke", "#F3950D")
    .attr("stroke-width", 4)
    .attr(
      "d",
      d3
        .line()
        .x((d) => xScale(d.month))
        .y((d) => yScale(d.mean_sunshine_hrs))
    );

  var totalLength = path.node().getTotalLength();
  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(4000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);

  svg
    .selectAll("circle")
    .data(monthWiseData)
    .enter()
    .append("circle")
    .attr("class", "circle2")
    .attr("r", 3.5)
    .attr("cx", (d) => xScale(d.month))
    .attr("cy", (d) => yScale(d.mean_sunshine_hrs))
    .on("mouseenter", function () {
      d3.selectAll(".circle2").attr("opacity", 0);
      d3.select(this).attr("opacity", 1).attr("r", 8);
    })
    .on("mouseout", function () {
      d3.selectAll(".circle2").attr("opacity", 1).attr("r", 3.5);
    })
    .append("title")
    .text(
      (d) =>
        "Mean sunshine hours in the month " +
        d.month +
        " was " +
        d.mean_sunshine_hrs +
        " hours."
    );
}
