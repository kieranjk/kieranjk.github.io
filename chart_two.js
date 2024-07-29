// Set up chart dimensions
const barheight = 20;
const margin = {top: 60, right: 0, bottom: 60, left: 90}
const width = 650
const height = 650;

// Create SVG container for the chart
const svg = d3.select("#Salary-Bar-Chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load & Process the Offensive Line Data
d3.csv("OL_Team_Salaries.csv").then(data => {
    data.forEach(d => {
        d.Average_Salary = (+d.Average_Salary/1000000);
    });

    data.sort(function(a, b){
        return d3.ascending(a.Average_Salary, b.Average_Salary);
    })

    // Set x & y scales
    const x = d3.scaleLinear()
        .range([0, width])
        .domain([0,d3.max(data, function(d) {return d.Average_Salary; })])
    const y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1)
        .domain(data.map(function (d) { return d.Team;}))

    // Set x & y axes
    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y)

    // Add the axes to the chart
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .call(g => g.append("text")
            .attr("x", width-90)
            .attr("y", -4)
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .text("Total OL Salary in 2023 ($M)"));
    svg.append("g")
        .call(yAxis)
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("y", 2)
            .attr("dy", "-7em")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .text("Team"));
    
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .on("mouseover", onMouseOver)
        .on("mouseout", onMouseOut)
        .attr("y", function (d) {return y(d.Team); })
        .attr("height", y.bandwidth())
        .transition()
        .ease(d3.easeLinear)
        .duration(300)
        .delay(function(d,i){return i *50})
        .attr("x", 0)
        .attr("width", function (d) {return x(d.Average_Salary); })
    
    //Mouseover event handler
    function onMouseOver(d,i){
        var xPos = parseFloat(d3.select(this).attr("x")) + 80
        var yPos = parseFloat(d3.select(this).attr("y")) + y.bandwidth() + 100

        d3.select("#BCToolTip")
            .style("left", xPos + "px")
            .style("top", yPos + "px")
            .select("#value").text(i.Average_Salary)
        

        d3.select("#BCToolTip").classed("hidden", false)

    }

    function onMouseOut(d,i){
        d3.select("#BCToolTip").classed("hidden", true)
    }

})