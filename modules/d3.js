/* global d3, food, benchmark */

const margin = {top: 30, right: 30, bottom: 30, left: 30},
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

function updateChart() {

  const categoryFilter = d3.select(".cat-dropdown").property("value");
  const sort = d3.select(".sort-dropdown").property("value");
  const measure = d3.select(".measure-dropdown").property("value");
  const serving = d3.select('input[name="serving"]:checked')
                          .property("value");
  console.log(categoryFilter);
  console.log(sort);
  console.log(measure);
  console.log(serving);

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
    //   break;
    // case "h-serving":
    //   filtered.sort( (a,b) => {
    //     return b.sugar_per_unit_in_g/a.unit_weight_in_g -
    //            a.sugar_per_unit_in_g/b.unit_weight_in_g;
    //     });
    //   break;
    // case "l-serving":
    //   filtered.sort( (a,b) => {
    //     return b.sugar_per_unit_in_g/a.unit_weight_in_g -
    //            a.sugar_per_unit_in_g/b.unit_weight_in_g;
    //     });
    //   break;
    default:
      filtered.sort( (a,b) => a.category.localeCompare(b.category));
  }

  let benchmarkUrl = "https://res.cloudinary.com/adrienne/image/upload/v1507056029/sugarbrix/teaspoon_sugar.jpg";
  const measureName = benchmark.find( b => b.name === measure);
  benchmarkUrl = measureName.img_url;


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
    .data(food)
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

  svg.append("defs")
    .append("pattern")
    .attr("id", "bg")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", "50")
    .attr("height", "50")
    .append("image")
    .attr("xlink:href", benchmarkUrl)
    .attr("width", "60")
    .attr("height", "80");

  const bmWidth = undefined;
  

  tr.append("td").append("svg")
    .attr("class", "svgbm")
    .attr("height", "80px")
    .attr("width", "100px")
    .append("rect")
    .attr("class", "benchmark")
    .attr("height", "80")
    .attr("width", "100")
    .attr("fill", "url(#bg)");

  let displayedSugar = undefined;
  tr.append("td")
    .attr("class", "sugar-grams")
    .html(f => {
      switch (serving) {
        case "oneServing":
          displayedSugar = f.sugar_per_unit_in_g;
          break;
        case "grams":
          displayedSugar = 100 / f.unit_weight_in_g * f.sugar_per_unit_in_g;
          break;
      }
      return displayedSugar + 'g';
    });
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
