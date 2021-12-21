// Selecting the svg element
let drawSpace = d3.select("#drawspace");

// Reading the dataset and the geoJSON file for India
d3.csv("data.csv").then(showData);

var mapInfo, reqData, drawSpaceW, drawSpaceH;
let myData;
const dataTypeMap = new Map();

function showData(my_data) {
  drawSpaceH = 700;
  drawSpaceW = 700;

  myData = [...my_data];

  console.log(myData);

  dataTypeMap.set("Monthly highest daily total", 0);
  dataTypeMap.set("Monthly no of rain days", 1);
  dataTypeMap.set("Monthly total", 2);
  dataTypeMap.set("Relative Humidity Absolute Monthly Extreme Minimum", 3);
  dataTypeMap.set("Relative humidity monthly mean", 4);
  dataTypeMap.set("Sunshine duration monthly mean daily duration", 5);

  //Making a list of the crops in the data
  // let sel = "";
  // // Creating the select option dynamically using all the crops in the dataset
  // dataTypeMap.forEach(
  //   (values, keys) => (sel += `<option value="${keys}">${keys}</option>`)
  // );
  // document.getElementById("data").innerHTML = sel;
  // // Making rice the default crop selected
  // document.getElementById("data").value = dataTypeMap.keys().next().value;

  // //Making a list of years in the data
  // let years = [...new Set(myData.map((d) => d.month.split("-")[0]))];
  // sel = "";
  // // Creating the select option dynamically using all the years in the dataset
  // years.forEach((y) => (sel += `<option value="${y}">${y}</option>`));
  // document.getElementById("year").innerHTML = sel;

  // let charts = ["Bar Chart", "Line Chart"];
  // sel = "";
  // charts.forEach((y) => (sel += `<option value="${y}">${y}</option>`));
  // document.getElementById("chart").innerHTML = sel;

  // Calling the change function which calculates the values and draws the svg
  change();

  // stopping the loader after svg has been created
  document.getElementById("loading-container").style.display = "none";
}

function change() {
  //Making a list of states in the data

  // let yearReq = document.getElementById("year").value; // Taking the input of the crop from user
  // let dataTypeReqText = document.getElementById("data").value;
  // let chartTypeReq = document.getElementById("chart").value;
  // let dataTypeReq = dataTypeMap.get(dataTypeMap.get(dataTypeReqText));
  // let data = [];

  // console.log(myData);

  // for (let d in myData) {
  //   let obj = { month: "", dataValue: 0 };
  //   if (d.month.split("-")[0] == yearReq) {
  //     obj["month"] = d.month;
  //     switch (dataTypeReq) {
  //       case 0:
  //         obj["dataValue"] = d.maximum_rainfall_in_a_day;
  //         break;
  //       case 0:
  //         obj["dataValue"] = d.no_of_rainy_days;
  //         break;
  //       case 0:
  //         obj["dataValue"] = d.total_rainfall;
  //         break;
  //       case 0:
  //         obj["dataValue"] = d.rh_extremes_minimum;
  //         break;
  //       case 0:
  //         obj["dataValue"] = d.mean_rh;
  //         break;
  //       case 0:
  //         obj["dataValue"] = d.mean_sunshine_hrs;
  //         break;
  //     }
  //     data.append(obj);
  //   }
  // }

  // console.log(data);
  // myData = myData.slice(0, 12);
  // console.log(myData);

  // if (chartTypeReq == "Bar Chart") {
  //   bar(myData, yearReq, dataTypeReqText);
  // } else if (chartTypeReq == "Line Chart") {
  //   line(myData, yearReq, dataTypeReqText);
  // }
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
    .scaleBand()
    .range([0, width])
    .domain(yearlyData.map((d) => d.year))
    .padding(0.2);

  // Y axis scale
  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(yearlyData, (d) => +d.rainfall)])
    .range([height, 0]);

  // append the svg object to the body of the page
  var svg = d3
    .select("#drawspace")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X Gridlines
  svg
    .append("g")
    .attr("class", "grid")
    .style("opacity", "0.3")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).ticks(5).tickSize(-height).tickFormat(""));

  // Y Gridlines
  svg
    .append("g")
    .attr("class", "grid")
    .style("opacity", "0.3")
    .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(""));

  //drawing x axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  //labelling x axis
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    .style("text-anchor", "middle")
    .text("Years");

  // drawing y axis
  var axisleft = d3.axisLeft(yScale);
  axisleft.ticks(15);
  svg.append("g").call(axisleft);

  //labelling y axis
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Total Rainfall");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px");
  // .text(
  //   `Production efficiency of ${cropReq} crop in ${stateReq} over the years`
  // );

  // Add the line
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
  // .attr("transform", "translate(46 ,0)");

  var totalLength = path.node().getTotalLength();
  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition() // Call Transition Method
    .duration(4000) // Set Duration timing (ms)
    .ease(d3.easeLinear) // Set Easing option
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
      monthWiseVisualization(monthWiseData);
    })
    .append("title") // shows a title tooltip to display region's information on hover
    .text(
      (d) => "Total rainfall in year " + d.year + " was " + d.rainfall + " mm."
    );
}

function monthWiseVisualization(monthWiseData) {
  maximum_rainfall_in_a_day(monthWiseData);
  no_of_rainy_days(monthWiseData);
  total_rainfall(monthWiseData);
  rh_extremes_minimum(monthWiseData);
  mean_rh(monthWiseData);
  mean_sunshine_hrs(monthWiseData);
}

function maximum_rainfall_in_a_day(monthWiseData) {
  var margin = { top: 40, right: 30, bottom: 150, left: 70 },
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  d3.select("#tooltip").text("Hover on the bars.");

  // removing the already created line chart(if any) before creating a new one
  d3.select("#canvas1").select("svg").remove();

  // append the svg object to the body of the page
  var svg = d3
    .select("#canvas1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X axis
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
    .text("Months of year ");

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
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
    .append("text")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px");
  // .text(
  //   `Production efficiency of various crops grown in ${stateReq} in ${yearReq}`
  // );

  // Bars
  svg
    .selectAll("mybar")
    .data(monthWiseData)
    .enter()
    .append("rect")
    .attr("class", "bar1")
    .attr("x", (d) => xScale(d.month))
    .attr("width", xScale.bandwidth())
    .attr("fill", "#6998AB")
    .on("mouseenter", function () {
      d3.selectAll(".bar1").attr("opacity", 0.5);
      d3.select(this).attr("fill", "#406882").attr("opacity", 1);
    })
    .on("mouseout", function () {
      d3.selectAll(".bar1").attr("opacity", 1).attr("fill", "#6998AB");
    })
    // no bar at the beginning thus:
    .attr("height", height - yScale(0)) // always equal to 0
    .attr("y", yScale(0))
    .append("title") // shows a title tooltip to display region's information on hover
    .text(
      (d) =>
        "Maximum rainfall in a day for the month " +
        d.month +
        " is " +
        d.maximum_rainfall_in_a_day
    );

  // Animation
  svg
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", (d) => yScale(d.maximum_rainfall_in_a_day))
    .attr("height", (d) => height - yScale(d.maximum_rainfall_in_a_day))
    .delay((d, i) => i * 100);
}

function no_of_rainy_days(monthWiseData) {
  var margin = { top: 40, right: 30, bottom: 150, left: 70 },
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  d3.select("#tooltip").text("Hover on the bars.");

  // removing the already created line chart(if any) before creating a new one
  d3.select("#canvas2").select("svg").remove();

  // append the svg object to the body of the page
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
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function (d) {
      return colorScale(d.month);
    });

  // Add one dot in the legend for each name.
  svg
    .append("g")
    .selectAll("mylabels")
    .data(monthWiseData)
    .enter()
    .append("text")
    .attr("x", 120)
    .attr("y", function (d, i) {
      return 50 + i * 25;
    }) // 100 is where the first dot appears. 25 is the distance between dots
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
    .append("title") // shows a title tooltip to display region's information on hover
    .text(
      (d) =>
        "Number of rainy days in the month " +
        d.data.month +
        " is " +
        d.data.no_of_rainy_days
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

function total_rainfall(monthWiseData) {
  var margin = { top: 40, right: 30, bottom: 150, left: 70 },
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  d3.select("#canvas3").select("svg").remove();

  var xScale = d3
    .scaleBand()
    .range([0, width])
    .domain(monthWiseData.map((d) => d.month))
    .padding(0.2);

  // Y axis scale
  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(monthWiseData, (d) => +d.total_rainfall)])
    .range([height, 0]);

  // append the svg object to the body of the page
  var svg = d3
    .select("#canvas3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X Gridlines
  svg
    .append("g")
    .attr("class", "grid")
    .style("opacity", "0.3")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).ticks(5).tickSize(-height).tickFormat(""));

  // Y Gridlines
  svg
    .append("g")
    .attr("class", "grid")
    .style("opacity", "0.3")
    .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(""));

  //drawing x axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  //labelling x axis
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    .style("text-anchor", "middle")
    .text("Months of year");

  // drawing y axis
  var axisleft = d3.axisLeft(yScale);
  axisleft.ticks(15);
  svg.append("g").call(axisleft);

  //labelling y axis
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Total Rainfall in the month");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px");
  // .text(
  //   `Production efficiency of ${cropReq} crop in ${stateReq} over the years`
  // );

  // Add the line
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
  // .attr("transform", "translate(46 ,0)");

  var totalLength = path.node().getTotalLength();
  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition() // Call Transition Method
    .duration(4000) // Set Duration timing (ms)
    .ease(d3.easeLinear) // Set Easing option
    .attr("stroke-dashoffset", 0);

  svg
    .selectAll("circle")
    .data(monthWiseData)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("r", 3.5)
    .attr("cx", (d) => xScale(d.month))
    .attr("cy", (d) => yScale(d.total_rainfall))
    .on("mouseenter", function () {
      d3.selectAll(".circle").attr("opacity", 0);
      d3.select(this).attr("opacity", 1).attr("r", 8);
    })
    .on("mouseout", function () {
      d3.selectAll(".circle").attr("opacity", 1).attr("r", 3.5);
    })
    .append("title") // shows a title tooltip to display region's information on hover
    .text(
      (d) =>
        "Total rainfall in month " +
        d.month +
        " was " +
        d.total_rainfall +
        " mm."
    );
}

function rh_extremes_minimum(monthWiseData) {
  var margin = { top: 40, right: 30, bottom: 150, left: 70 },
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // removing the already created line chart(if any) before creating a new one
  d3.select("#canvas4").select("svg").remove();

  // append the svg object to the body of the page
  var svg = d3
    .select("#canvas4")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X axis
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
    .text("Months of year");

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
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
    .append("text")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px");
  // .text(
  //   `Production efficiency of various crops grown in ${stateReq} in ${yearReq}`
  // );

  // Bars
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
    // no bar at the beginning thus:
    .attr("height", height - yScale(0)) // always equal to 0
    .attr("y", yScale(0))
    .append("title") // shows a title tooltip to display region's information on hover
    .text(
      (d) =>
        "Minimum extreme of Relative Humidity for the month " +
        d.month +
        " is " +
        d.rh_extremes_minimum
    );

  // Animation
  svg
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", (d) => yScale(d.rh_extremes_minimum))
    .attr("height", (d) => height - yScale(d.rh_extremes_minimum))
    .delay((d, i) => i * 100);
}

function mean_rh(monthWiseData) {
  var margin = { top: 40, right: 30, bottom: 150, left: 70 },
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  d3.select("#tooltip").text("Hover on the bars.");

  // removing the already created line chart(if any) before creating a new one
  d3.select("#canvas5").select("svg").remove();

  // append the svg object to the body of the page
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
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function (d) {
      return colorScale(d.month);
    });

  // Add one dot in the legend for each name.
  svg
    .append("g")
    .selectAll("mylabels")
    .data(monthWiseData)
    .enter()
    .append("text")
    .attr("x", 120)
    .attr("y", function (d, i) {
      return 50 + i * 25;
    }) // 100 is where the first dot appears. 25 is the distance between dots
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
    .append("title") // shows a title tooltip to display region's information on hover
    .text(
      (d) =>
        "Mean Relative Humidity in the month " +
        d.data.month +
        " is " +
        d.data.mean_rh
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

function mean_sunshine_hrs(monthWiseData) {
  var margin = { top: 40, right: 30, bottom: 150, left: 70 },
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  d3.select("#canvas6").select("svg").remove();

  var xScale = d3
    .scaleBand()
    .range([0, width])
    .domain(monthWiseData.map((d) => d.month))
    .padding(0.2);

  // Y axis scale
  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(monthWiseData, (d) => +d.mean_sunshine_hrs)])
    .range([height, 0]);

  // append the svg object to the body of the page
  var svg = d3
    .select("#canvas6")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X Gridlines
  svg
    .append("g")
    .attr("class", "grid")
    .style("opacity", "0.3")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).ticks(5).tickSize(-height).tickFormat(""));

  // Y Gridlines
  svg
    .append("g")
    .attr("class", "grid")
    .style("opacity", "0.3")
    .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(""));

  //drawing x axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  //labelling x axis
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    .style("text-anchor", "middle")
    .text("Months of year");

  // drawing y axis
  var axisleft = d3.axisLeft(yScale);
  axisleft.ticks(15);
  svg.append("g").call(axisleft);

  //labelling y axis
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Mean sunshine hours in the month");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px");
  // .text(
  //   `Production efficiency of ${cropReq} crop in ${stateReq} over the years`
  // );

  // Add the line
  var path = svg
    .append("path")
    .datum(monthWiseData)
    .attr("fill", "none")
    .style("opacity", "1")
    .attr("stroke", "#F4EEA9")
    .attr("stroke-width", 4)
    .attr(
      "d",
      d3
        .line()
        .x((d) => xScale(d.month))
        .y((d) => yScale(d.mean_sunshine_hrs))
    );
  // .attr("transform", "translate(46 ,0)");

  var totalLength = path.node().getTotalLength();
  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition() // Call Transition Method
    .duration(4000) // Set Duration timing (ms)
    .ease(d3.easeLinear) // Set Easing option
    .attr("stroke-dashoffset", 0);

  svg
    .selectAll("circle")
    .data(monthWiseData)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("r", 3.5)
    .attr("cx", (d) => xScale(d.month))
    .attr("cy", (d) => yScale(d.mean_sunshine_hrs))
    .on("mouseenter", function () {
      d3.selectAll(".circle").attr("opacity", 0);
      d3.select(this).attr("opacity", 1).attr("r", 8);
    })
    .on("mouseout", function () {
      d3.selectAll(".circle").attr("opacity", 1).attr("r", 3.5);
    })
    .append("title") // shows a title tooltip to display region's information on hover
    .text(
      (d) =>
        "Mean sunshine hours in the month " +
        d.month +
        " was " +
        d.mean_sunshine_hrs +
        " hours"
    );
}

//For Creating the line chart
// Line Chart is for the state wise production of the selected crop over the years
function line(myData, reqYear, reqDataType) {
  // set the dimensions and margins of the graph
  var margin = { top: 40, right: 30, bottom: 150, left: 70 },
    width = 700 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  d3.select("#tooltip").text("Hover on the data points.");

  // removing the already created line chart(if any) before creating a new one
  d3.select("#drawspace").select("svg").remove();

  // x axis scale
  var xScale = d3
    .scaleBand()
    .range([0, width])
    .domain(myData.map((d) => d.month))
    .padding(0.2);

  // Y axis scale
  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(myData, (d) => +d.no_of_rainy_days)])
    .range([height, 0]);

  // append the svg object to the body of the page
  var svg = d3
    .select("#drawspace")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X Gridlines
  svg
    .append("g")
    .attr("class", "grid")
    .style("opacity", "0.3")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).ticks(5).tickSize(-height).tickFormat(""));

  // Y Gridlines
  svg
    .append("g")
    .attr("class", "grid")
    .style("opacity", "0.3")
    .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(""));

  //drawing x axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  //labelling x axis
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    .style("text-anchor", "middle")
    .text("Months of year " + reqYear);

  // drawing y axis
  var axisleft = d3.axisLeft(yScale);
  axisleft.ticks(15);
  svg.append("g").call(axisleft);

  //labelling y axis
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(reqDataType);

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px");
  // .text(
  //   `Production efficiency of ${cropReq} crop in ${stateReq} over the years`
  // );

  // Add the line
  var path = svg
    .append("path")
    .datum(myData)
    .attr("fill", "#6998AB")
    .style("opacity", "0.6")
    .attr("stroke", "#1A374D")
    .attr("stroke-width", 4)
    .attr(
      "d",
      d3
        .area()
        .x((d) => xScale(d.month))
        .y0(yScale(0))
        .y1((d) => yScale(d.no_of_rainy_days))
        .defined((d) => !!d.no_of_rainy_days)
    );

  var totalLength = path.node().getTotalLength();
  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition() // Call Transition Method
    .duration(2000) // Set Duration timing (ms)
    .ease(d3.easeLinear) // Set Easing option
    .attr("stroke-dashoffset", 0);

  svg
    .selectAll("circle")
    .data(myData)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("r", 3.5)
    .attr("cx", (d) => xScale(d.month))
    .attr("cy", (d) => yScale(d.no_of_rainy_days))
    .on("mouseenter", function () {
      d3.selectAll(".circle").attr("opacity", 0);
      d3.select(this).attr("opacity", 1).attr("r", 5);
    })
    .on("mouseout", function () {
      d3.selectAll(".circle").attr("opacity", 1).attr("r", 3.5);
    })
    .append("title") // shows a title tooltip to display region's information on hover
    .text(
      (d) =>
        reqDataType + " for the month " + d.month + " is " + d.no_of_rainy_days
    );
}

function bar(myData, reqYear, reqDataType) {
  // set the dimensions and margins of the graph
  var margin = { top: 40, right: 30, bottom: 150, left: 70 },
    width = 700 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  d3.select("#tooltip").text("Hover on the bars.");

  // removing the already created line chart(if any) before creating a new one
  d3.select("#drawspace").select("svg").remove();

  // append the svg object to the body of the page
  var svg = d3
    .select("#drawspace")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X axis
  var xScale = d3
    .scaleBand()
    .range([0, width])
    .domain(myData.map((d) => d.month))
    .padding(0.2);

  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 80) + ")"
    )
    .style("text-anchor", "middle")
    .text("Months of year " + reqYear);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(myData, (d) => +d.no_of_rainy_days)])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(yScale).ticks(15));

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(reqDataType);

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px");
  // .text(
  //   `Production efficiency of various crops grown in ${stateReq} in ${yearReq}`
  // );

  // Bars
  svg
    .selectAll("mybar")
    .data(myData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.month))
    .attr("width", xScale.bandwidth())
    .attr("fill", "#6998AB")
    .on("mouseenter", function () {
      d3.selectAll(".bar").attr("opacity", 0.8);
      d3.select(this).attr("fill", "#406882");
    })
    .on("mouseout", function () {
      d3.selectAll(".bar").attr("opacity", 1).attr("fill", "#6998AB");
    })
    // no bar at the beginning thus:
    .attr("height", height - yScale(0)) // always equal to 0
    .attr("y", yScale(0))
    .append("title") // shows a title tooltip to display region's information on hover
    .text(
      (d) =>
        reqDataType + " for the month " + d.month + " is " + d.no_of_rainy_days
    );

  // Animation
  svg
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", (d) => yScale(d.no_of_rainy_days))
    .attr("height", (d) => height - yScale(d.no_of_rainy_days))
    .delay((d, i) => i * 100);
}
