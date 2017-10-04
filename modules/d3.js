/* global d3, food */

const margin = {top: 30, right: 30, bottom: 30, left: 30},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

const svg = d3.select(".chart-box").append("svg")
  .attr("class", "chart-box-svg")
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

const table = d3.select(".foreign-obj").append("xhtml:table");
const thead = table.append("thead");
const tbody = table.append("tbody");

function updateChart(attr, filter) {
  let filtered = "";
  if (attr === undefined) {
    filtered = food;
  } else {
    filtered = food.filter(f => `${attr}` === filter);
  }

  console.log(filtered);

  // update.enter().append("img")
  //   .filter(f => { return f.category === filter; } );

  // update.transition()
  //   .duration(3);
  //
  // update.exit().remove();


  const tr = tbody.selectAll("tr")
    .data(filtered)
    .enter()
    .append("tr");

  tr.append("td").html(f => {return f.name; })
    .attr("class", "name");

  tr.append("td")
    .append("span")
    .append("img")
    .attr('src', f => {return f.img_url; })
    .attr("class", "food-img")
    .attr("width", 60)
    .attr("height", 50);

  tr.append("td")
    .append("span")
    .append("img")
    .attr('src', "https://res.cloudinary.com/adrienne/image/upload/v1507140911/sugarbrix/equal_sign.png")
    .attr("class", "equal")
    .attr("width", "50px");

  tr.append("td")
    .append("span")
    .append("img");

  const equalCol = d3.select(".foreign-obj")
    .append("xhtml:div")
    .attr("class", "equal-col");
}

updateChart();

d3.select(".category-dropdown")
  .on("change", () => {
    const filter = d3.select(".category-dropdown").property("value");
    console.log(filter);
    updateChart("f.category", filter);
  });
