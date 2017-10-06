/* global d3, food, benchmark */

const margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

const svg = d3.select(".chart-box").append("svg")
  .attr("class", "chart-box-svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom).append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// const xScale = d3.scaleOrdinal()
//   .range([0, width]);
//
// const yScale = d3.scaleOrdinal()
//   .range([height, 0]);
//
// const xAxis = d3.axisBottom(xScale);
// const yAxis = d3.axisRight(yScale);
//
// svg.append("g")
//   .attr("class", "y axis")
//   .call(yAxis);

svg.append("foreignObject")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("class", "foreign-obj");

const table = d3.select(".foreign-obj").append("xhtml:table");
const thead = table.append("thead");
const tbody = table.append("tbody");

let categoryFilter = undefined;
let sort = undefined;
let measure = undefined;
let serving = undefined;

function getUserInput() {
  categoryFilter = d3.select(".cat-dropdown").property("value");
  sort = d3.select(".sort-dropdown").property("value");
  measure = d3.select(".measure-dropdown").property("value");
  serving = d3.select('input[name="serving"]:checked')
                          .property("value");

  console.log(categoryFilter);
  console.log(sort);
  console.log(measure);
  console.log(serving);
}
getUserInput();

// get bench image depending on user input
let benchmarkUrl = "https://res.cloudinary.com/adrienne/image/upload/v1507056029/sugarbrix/teaspoon_sugar.jpg";
const benchmarkName = benchmark.find( b => b.name === measure);
benchmarkUrl = benchmarkName.img_url;

const benchmarkWidth = benchmarkName.img_width;
const benchmarkHeight = benchmarkName.img_height;

// add repeating benchmark image as a pattern
svg.append("defs")
  .append("pattern")
  .attr("id", "bg")
  .attr("patternUnits", "userSpaceOnUse")
  .attr("width", 20)
  .attr("height", 20)
  .append("image")
  .attr("xlink:href", benchmarkUrl)
  .attr("width", 20)
  .attr("height", 20);

// calculate the sugar displayed based on 1 serving or 100 grams
let displayedSugar = undefined;
function calcDisplayedSugar(foodItem) {
  switch (serving) {
    case "oneServing":
      displayedSugar = foodItem.sugar_per_unit_in_g;
      break;
    case "grams":
      displayedSugar =
        100 / foodItem.unit_weight_in_g * foodItem.sugar_per_unit_in_g;
      break;
  }
  return displayedSugar;
}

function calcRectWidth(foodItem) {
  const sugar = calcDisplayedSugar(foodItem);
  const bmWidth = sugar/(benchmarkName.sugar_per_unit_in_g);
  return bmWidth * 20;
}

function updateChart() {
  getUserInput();

  let filtered = "";
  switch (categoryFilter) {
    case "all":
      filtered = food;
      break;
    default:
      filtered = food.filter(f => f.category === categoryFilter);
  }

  switch (sort) {
    case "h-weight":
      filtered.sort( (a,b) => {
        return b.sugar_per_unit_in_g/a.unit_weight_in_g -
               a.sugar_per_unit_in_g/b.unit_weight_in_g;
        });
      break;
    case "l-weight":
      filtered.sort( (a,b) => {
        return a.sugar_per_unit_in_g/a.unit_weight_in_g -
               b.sugar_per_unit_in_g/b.unit_weight_in_g;
        });
      break;
    case "h-serving":
      filtered.sort( (a,b) => {
        return b.sugar_per_unit_in_g/a.unit_weight_in_g -
               a.sugar_per_unit_in_g/b.unit_weight_in_g;
        });
      break;
    case "l-serving":
      filtered.sort( (a,b) => {
        return b.sugar_per_unit_in_g/a.unit_weight_in_g -
               a.sugar_per_unit_in_g/b.unit_weight_in_g;
        });
      break;
    default:
      filtered.sort( (a,b) => a.category.localeCompare(b.category));
  }

  console.log(filtered);

  // update.enter().append("img")
  //   .filter(f => { return f.category === filter; } );

  // update.transition()
  //   .duration(3);
  //
  // update.exit().remove();
  // if (attr === "benchmark") {
  //   const unit = benchmark.filter( b => b.category === filter );
  //   benchmarkUrl = unit.img_url;
  // }


  const tr = tbody.selectAll("tr")
    .data(filtered)
    .enter()
    .append("tr");

  tr.exit()
    .remove();

  tr.append("td").html(f => {return f.name; })
    .attr("class", "name");

  tr.append("td")
    .append("img")
    .attr("class", "food-img")
    .attr('src', f => {return f.img_url; })
    .attr("width", "65")
    .attr("height", "55");

  tr.append("td")
    .append("img")
    .attr("class", "equal")
    .attr("src", "https://res.cloudinary.com/adrienne/image/upload/v1507140911/sugarbrix/equal_sign.png")
    .attr("width", "45")
    .attr("height", "25");

  tr.append("td")
    .attr("class", "sugar-grams")
    .html(f => {
      return calcDisplayedSugar(f) + "g";
    });

  tr.append("td").append("svg")
    .attr("class", "svgbm")
    .attr("height", "95px")
    .attr("width", f => calcRectWidth(f))
    .append("rect")
    .attr("class", "benchmark")
    .attr("height", "95")
    .attr("width", f => calcRectWidth(f))
    .attr("fill", "url(#bg)");
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

// Display unit grams of sugar for selected benchmark
d3.select("body").append("div")
    .attr("class", "benchmark-note")
    .html("*1 " + `${benchmarkName}` + "has " + "grams of sugar");
