/* global d3, food */

const margin = {top: 30, right: 30, bottom: 30, left: 30},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

const svg = d3.select(".left-column").append("svg")
  .attr("class", "chart-box")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom).append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xScale = d3.scaleOrdinal()
  .range([0, width]);

const yScale = d3.scaleOrdinal()
  .range([height, 0]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisRight(yScale);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis);

svg.append("foreignObject")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("class", "foreign-obj");

const foodAxis = d3.select(".foreign-obj")
  .append("xhtml:div")
  .attr("class", "food-axis");

foodAxis.selectAll("img")
  .data(food)
  .enter()
  .append("img")
  .attr("class", "food-img")
  .attr("x", 100)
  .attr("y", (foodItem, index) => {
    return (height - (index * 50));
  })
  .attr("width", 60)
  .attr("height", 50)
  .attr("src", d => { return d.img_url; })
