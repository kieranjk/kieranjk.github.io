// Set up chart dimensions
const margin = {top: 40, right: 40, bottom: 40, left: 40}
const width = 500 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

// Create SVG container for the chart
const svg = d3.select("#Win-Rate-ScatterPlot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load & Process the Offensive Line Data
d3.csv("Offensive Team Stats.csv").then(data => {
    data.forEach(d => {
        d.Yds = +d.Yds;
        d.PBWR = +d.PBWR;
        d.RBWR = +d.RBWR;
    });

    // Set x & y scales
    const x = d3.scaleLinear()
        .range([0, width])
        .domain([40, 80])
    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([65,80])

    // Set x & y axes
    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y)

    // Add the axes to the chart
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .call(g => g.append("text")
            .attr("x", width)
            .attr("y", -4)
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .text("Pass Block Win Rate %"));
    svg.append("g")
        .call(yAxis)
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 4)
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("Run Block Win Rate %"));

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class","dot")
        .on("mouseover", onMouseOver)
        .on("mouseout", onMouseOut)
        .attr("transform", d => `translate(${x(d["PBWR"])},${y(d["RBWR"])})`)
        .attr("r", 5)
    // Add the data to the chart
    // const dot = svg.append("g")
    //   .attr("class", "dot")
    //     // .attr("fill", "none")
    //     // .attr("stroke", "steelblue")
    //     // .attr("stroke-width", 1.5)
    //   .selectAll("circle")
    //   .data(data)
    //   .join("circle")
    //   .attr("transform", d => `translate(${x(d["PBWR"])},${y(d["RBWR"])})`)
    //   .attr("r", 5)

    const SPTooltip = d3.select("#SPToolTip")
        .append("div")
        .style("opacity", 0)
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")

    function onMouseOver(d, i){
        var xPos = parseFloat(d3.select(this).attr("x"))
        var yPos = parseFloat(d3.select(this).attr("y"))

        SPTooltip
            .style("opacity", 1)
            .html("Team: " + i.Tm + "<br>PBWR: " + i.PBWR + "%" + "<br>RBWR: " + i.RBWR + "%")
    }
    function onMouseOut(d, i){
        SPTooltip
            .transition()
            .duration(50)
            .style("opacity", 0)
    }

    // dot.on("mouseover", function (event, d){ 
    //     SPTooltip
    //         .style("opacity", 1)
    // })
    // dot.on("mouseleave", function() {
    //     SPTooltip
    //         .transition()
    //         .duration(200)
    //         .style("opacity", 0)
    // })
    
})
// Create Tooltips for the data
