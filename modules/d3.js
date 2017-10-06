/* global d3, food, benchmark */

const margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 1300 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

const svg = d3.select(".chart-box")
     .append("div")
     .attr("class", "svg-container")
     .append("svg")
     .attr("preserveAspectRatio", "xMinYMin meet")
     .attr("viewBox", "0 0 " + width + " " + height)
     .attr("class", "chart-box-svg")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const divDim = d3.select(".svg-container").node().getBoundingClientRect();
svg.style.height = divDim.height;
console.log(divDim.height);

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

function servingText(foodItem) {
  return serving === "oneServing" ? foodItem.description : "100 g";
}

// get bench image depending on user input
function getBenchmark() {
  return benchmark.find( b => { return b.name === measure; } );
}

function calcBenchmarkDim() {
  const benchmarkName = getBenchmark();
  const benchmarkDim = [benchmarkName.img_width, benchmarkName.img_height];
  return benchmarkDim;
}

// calculate the sugar displayed based on 1 serving or 100 grams
let displayedSugar = undefined;
function calcDisplayedSugar(foodItem) {
  switch (serving) {
    case "oneServing":
      displayedSugar = Math.round(foodItem.sugar_per_unit_in_g);
      break;
    case "grams":
      displayedSugar =
        Math.round(100 / foodItem.unit_weight_in_g
             * foodItem.sugar_per_unit_in_g);
      break;
  }
  return displayedSugar;
}

function calcSugarPercent(foodItem) {
  return Math.round(
    foodItem.sugar_per_unit_in_g/foodItem.unit_weight_in_g * 100);
}

function calcRectWidth(foodItem) {
  const sugar = calcDisplayedSugar(foodItem);
  const benchmarkName = getBenchmark();
  const [benchmarkWidth, benchmarkHeight] = calcBenchmarkDim();

  const widthUnits = sugar/(benchmark.sugar_per_unit_in_g);
  return widthUnits * benchmarkWidth; // scale by size of benchmark
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

  // add repeating benchmark image as a pattern
  const [benchmarkWidth, benchmarkHeight] = calcBenchmarkDim();
  console.log(getBenchmark());
  console.log(benchmarkWidth)
  svg.append("defs")
    .append("pattern")
    .attr("id", "bg")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", benchmarkWidth)
    .attr("height", benchmarkHeight)
    .append("image")
    .attr("xlink:href", getBenchmark().img_url)
    .attr("width", benchmarkWidth)
    .attr("height", benchmarkHeight);

  switch (sort) {
    case "h-weight":
      filtered.sort( (a,b) => {
        return b.sugar_per_unit_in_g/b.unit_weight_in_g -
               a.sugar_per_unit_in_g/a.unit_weight_in_g;
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
        const aDisplaySugar = calcDisplayedSugar(a);
        const bDisplaySugar = calcDisplayedSugar(b);
        return bDisplaySugar - aDisplaySugar;
        });
      break;
    case "l-serving":
      filtered.sort( (a,b) => {
        const aDisplaySugar = calcDisplayedSugar(a);
        const bDisplaySugar = calcDisplayedSugar(b);
        return aDisplaySugar - bDisplaySugar;
        });
      break;
    default:
      filtered.sort( (a,b) => a.name.localeCompare(b.name));
  }

  console.log(filtered);

  const rows = tbody.selectAll("tr")
    .data(filtered);

  rows.exit().remove();

  rows.enter()
    .append("tr");

  const td = rows.selectAll("td")
    .data(filtered, f => { return f; })
    .text(filtered, f => { return f.name; });

  const cells = rows.selectAll("td")
    .data(f => { return f; });

  rows.append("td").html(f => {return f.name; })
        .attr("class", "name");

  rows.append("td")
    .append("img")
    .attr("class", "food-img")
    .attr('src', f => {return f.img_url; })
    .attr("width", "65")
    .attr("height", "55");

  rows.append("td")
    .attr("class", "td-equal")
    .html(f => { return servingText(f); })
    .append("img")
    .attr("class", "equal")
    .attr("src", "https://res.cloudinary.com/adrienne/image/upload/v1507140911/sugarbrix/equal_sign.png")
    .attr("width", "80")
    .attr("height", "25");

  rows.append("td")
    .attr("class", "sugar-grams")
    .html(f => {
      return calcDisplayedSugar(f) + "g (" +
        calcSugarPercent(f) + "%)";
    });

  rows.append("td").append("svg")
    .attr("class", "svgbm")
    .attr("height", "95px")
    .attr("width", f => calcRectWidth(f))
    .append("rect")
    .attr("class", "benchmark")
    .attr("height", "95")
    .attr("width", f => calcRectWidth(f))
    .attr("fill", "url(#bg)");

  cells.enter().append("td");

  cells.text(d => { return d.value; });
  cells.exit().remove();

  // Display unit grams of sugar for selected benchmark
  d3.selectAll("benchmark-note")
    .text(getBenchmarkNote());

  d3.selectAll("benchmark-note").exit().remove();
}

d3.select(".cat-dropdown")
  .on("change", () => { updateChart(); });

d3.select(".sort-dropdown")
  .on("change", () => { updateChart(); });

d3.select(".measure-dropdown")
  .on("change", () => { updateChart(); });

d3.select(".serving-toggle")
  .on("change", () => { updateChart(); });

function getBenchmarkNote(){
  const benchmarkName = getBenchmark();
  return ("*1 " + `${benchmarkName.name}` + " contains "
         + `${benchmarkName.sugar_per_unit_in_g}` + " grams of sugar");
}


d3.select("body")
    .append("div")
    .selectAll("text")
    .data(benchmark)
    .enter()
    .append("text")
    .attr("class", "benchmark-note")
    .text(getBenchmarkNote());

// d3.event = document.createEvent('clickEvent');
// d3.event.initMouseEvent("mousemove");
d3.select("radio#100g").dispatch("click");

updateChart();
