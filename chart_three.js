const margin3 = { top: 20, right: 30, bottom: 45, left: 50 };
const screenWidth3 = 0.9 * (window.innerWidth || document.documentElement.clientWidth);
const screenHeight3 = 0.55 * (window.innerHeight || document.documentElement.clientHeight);
const width3 = screenWidth3 - margin3.left - margin3.right;
const height3 = screenHeight3 - margin3.top - margin3.bottom;


const svg3 = d3
  .select("#Interactive-BC")
  .append("svg")
  .attr("width", width3 + margin3.left + margin3.right)
  .attr("height", height3 + margin3.top + margin3.bottom)
  .append("g")
  .attr("transform", `translate(${margin3.left + margin3.left},${margin3.top * 2})`);

const dropdown = d3
  .select("#dropdown")
  .append("select")
  .on("change", updateChart3);

let data;

function updateWinLoss(selectedTeam){
    const selectedData = data.find((d) => d.Team === selectedTeam)
    const team = selectedData.Team

    var record = "";
    switch(team){
        case "ARI": record = "4-13"; break;
        case "ATL": record = "7-10"; break;   
        case "BAL": record = "13-4"; break;   
        case "BUF": record = "11-6"; break;
        case "CAR": record = "2-15"; break;
        case "CHI": record = "7-10"; break;
        case "CIN": record = "9-8"; break;
        case "CLE": record = "11-6"; break;
        case "DAL": record = "12-5"; break;  
        case "DEN": record = "8-9"; break; 
        case "DET": record = "12-5"; break;  
        case "GB": record = "9-8"; break; 
        case "HOU": record = "10-7"; break;  
        case "IND": record = "9-8"; break; 
        case "JAX": record = "9-8"; break;  
        case "KC": record = "11-6"; break; 
        case "LV": record = "8-9"; break;  
        case "LAC": record = "5-12"; break; 
        case "LAR": record = "10-7"; break;  
        case "MIA": record = "11-6"; break; 
        case "MIN": record = "7-10"; break;  
        case "NE": record = "4-13"; break; 
        case "NO": record = "9-8"; break;  
        case "NYG": record = "6-11"; break; 
        case "NYJ": record = "7-10"; break;  
        case "PHI": record = "11-6"; break; 
        case "PIT": record = "10-7"; break;  
        case "SF": record = "12-5"; break; 
        case "SEA": record = "9-8"; break;  
        case "TB": record = "9-8"; break; 
        case "TEN": record = "6-11"; break;  
        case "WAS": record = "4-13"; break; 
    }

    record = "Record: " + record;
    
    d3.select("#Win-Loss").text(record)
        .style("color","red")
}

function updateChart3() {
    const selectedTeam = dropdown.property("value");
    
    const filteredData = data.filter((d) => d.Team=== selectedTeam && (d.Category == "Rush_Yds" || d.Category == "Pass_Yds"));
    //const filteredData = data.filter((d) => d.Team=== selectedTeam);
    const categories = filteredData.map((d) => d.Category);
  
    svg3.selectAll("*").remove();
  
    // Add X axis
    const x = d3.scaleBand()
        .domain(categories)
        .range([0, width3])
        .padding(0.1);
  
    svg3
      .append("g")
      .attr("transform", `translate(0, ${height3})`)
      .call(d3.axisBottom(x));
  
    // Add Y axis
    const y = d3.scaleLinear().domain([0, d3.max(filteredData, (d) => d.Value)]).range([height3, 0]);
    svg3.append("g").call(d3.axisLeft(y));
  
    svg3
      .selectAll(".bar2")
      .data(filteredData)
      .enter()
      .append("rect")
      .attr("class", "bar2")
      .attr("x", (d) => x(d.Category))
      .attr("y", (d) => y(d.Value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height3 - y(d.Value))
      .attr("fill", (d, i) => d3.schemeCategory10[i]) // Use d3.schemeCategory10 to get different colors for each bar
    
    updateWinLoss(selectedTeam);
  }
  
  // Parse the Data and populate the dropdown
  d3.csv("Team Stats.csv").then(function (csvData) {
    data = csvData.map((d) => ({
      ...d,
      Value: parseInt(d.Value),
    }));
  
    const teams = Array.from(new Set(data.map((d) => d.Team)));
  
    dropdown
      .selectAll("option")
      .data(teams)
      .enter()
      .append("option")
      .text((d) => d);
  
    // Initial chart rendering
    updateChart3();
  });