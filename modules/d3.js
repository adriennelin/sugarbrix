/* global d3, food, benchmark */

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

function updateChart() {

  const catFilter = d3.select(".cat-dropdown").property("value");
  const sortFilter = d3.select(".sort-dropdown").property("value");
  const measureFilter = d3.select(".measure-dropdown").property("value");
  const servingFilter = d3.select('input[name="serving"]:checked')
                          .property("value");
  console.log(catFilter);
  console.log(sortFilter);
  console.log(measureFilter);
  console.log(servingFilter);

  const filtered = food;
  //
  // let filtered = "";
  // switch (attr) {
  //   case "all":
  //     filtered = food;
  //     break;
  //   case "category":
  //     filtered = food.filter(f => f.category === filter);
  //     if (filter === "all") {
  //       filtered = food;
  //     }
  //     break;
  //   default:
  //     filtered = food;
  // }

  // console.log(filtered);

  // update.enter().append("img")
  //   .filter(f => { return f.category === filter; } );

  // update.transition()
  //   .duration(3);
  //
  // update.exit().remove();
  let benchmarkUrl = "https://res.cloudinary.com/adrienne/image/upload/v1507056029/sugarbrix/teaspoon_sugar.jpg";
  // if (attr === "benchmark") {
  //   const unit = benchmark.filter( b => b.category === filter );
  //   benchmarkUrl = unit.img_url;
  // }

  const tr = tbody.selectAll("tr")
    .data(filtered)
    .enter()
    .append("tr");

  tr.append("td").html(f => {return f.name; })
    .attr("class", "name");

  tr.append("td")
    .append("img")
    .attr("class", "food-img")
    .attr('src', f => {return f.img_url; })
    .attr("width", "65px")
    .attr("height", "55px");

  tr.append("td")
    .append("img")
    .attr("class", "equal")
    .attr("src", "https://res.cloudinary.com/adrienne/image/upload/v1507140911/sugarbrix/equal_sign.png")
    .attr("width", "45px")
    .attr("height", "25px");

  tr.append("defs")
    .append("pattern")
    .attr("id", "bg")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", "50px")
    .attr("height", "50px")
    .append("image")
    .attr("xlink:href", benchmarkUrl)
    .attr("width", "50px")
    .attr("height", "50px");

  tr.append("td")
    .append("rect")
    .attr("class", "benchmark")
    .attr("height", "50px")
    .attr("width", "100px")
    .attr("fill", "url(#bg)");

  tr.append("td")
    .attr("class", "sugar-grams")
    .html(f => {return f.sugar_per_unit_in_g + 'g'; });
}

updateChart();

d3.select(".cat-dropdown")
  .on("change", () => { updateChart(); });

d3.select(".sort-dropdown")
  .on("change", () => { updateChart(); });

d3.select(".measure-dropdown")
  .on("change", () => { updateChart(); });

d3.select(".serving-toggle")
  .on("change", () => { updateChart(); });
