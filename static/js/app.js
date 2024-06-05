// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metaDataField = data.metadata

    // Filter the metadata for the object with the desired sample number
    let desiredSample = metaDataField.filter(object => object.id == sample)
    
    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select('#sample-metadata')

    // Use `.html("") to clear any existing metadata
    panel.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    desiredSample.forEach(item => {
      Object.entries(item).forEach(([key, value]) => {
          panel.append("p")
              .text(`${key.toUpperCase()}: ${value}`)
              .style('opacity', 0)
              .transition()
              .duration(500)
              .style('opacity', 1);
      });
    });
  });
}

// function to build both charts
function buildCharts(sample, randomColor) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const sampleFields = data.samples

    // Filter the samples for the object with the desired sample number
    let desiredSample = sampleFields.filter(object => object.id == sample)
  
    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = desiredSample[0]['otu_ids']
    let otuLabels = desiredSample[0]['otu_labels']
    let sampleValues = desiredSample[0]['sample_values']

    // Build a Bubble Chart
    let trace = {
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      text: otuLabels,
      marker: {
        size: sampleValues,
        color: otuIds,
      }
    }

    // Perpare bubble data for plotting
    let bubbleData = [trace]

    // Perpare layout for plotting
    let layout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {
        title: 'OTU ID'
      },
      yaxis: {
        title: 'Number of Bacteria'
      },
      transition:{
        duration: 500,
        easing:'cubic-in-out'
      }
    };

    // Render the Bubble Chart
    Plotly.react('bubble', bubbleData, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let mappedIds = otuIds.map(item => `OTU ${item} `)

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace2 = {
      x: sampleValues.slice(0,10).reverse(),
      y: mappedIds.slice(0,10).reverse(),
      type: 'bar',
      orientation: "h",
      text: otuLabels.slice(0,10).reverse(),
      marker: {
        color: randomColor
      }
    }

    // Perpare bar data for plotting
    let barData = [trace2]

    // Perpare layout for plotting
    let layout2 = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {
        title: 'Number of Bacteria'
      },
      transition:{
        duration: 500,
        easing:'cubic-in-out'
      }
    }

    // Render the Bar Chart
    Plotly.react('bar', barData, layout2)
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const namesField = data.names

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset")

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    dropdownMenu.selectAll("option")
        .data(namesField)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);

    // Get the first sample from the list
    const firstName = namesField[0]

    // Generate random color for styling
    let randomColor = getRandomColor();

    // Build styling for the dashboard
    dashboardStyling(randomColor);

    // Build charts and metadata panel with the first sample
    buildMetadata(firstName)
    buildCharts(firstName, randomColor)
  });
}

// Function to generate a random RGB color
function getRandomColor() {
  // List of approved colors for dashboard
  const colorList = [
    'rgb(169, 232, 128)',
    'rgb(7, 115, 64)',
    'rgb(152, 41, 124)',
    'rgb(226, 212, 110)',
    'rgb(153, 128, 218)',
    'rgb(45, 140, 12)',
    'rgb(215, 123, 178)',
    'rgb(27, 191, 20)',
    'rgb(166, 145, 244)',
    'rgb(245, 50, 101)',
    'rgb(199, 62, 22)',
    'rgb(83, 169, 14)',
    'rgb(133, 248, 21)',
    'rgb(188, 79, 100)',
    'rgb(193, 202, 39)',
    'rgb(219, 238, 191)',
    'rgb(174, 122, 130)',
    'rgb(251, 158, 103)',
    'rgb(88, 234, 233)',
    'rgb(9, 102, 203)'
  ]

  // // Generates completly random colors for the dashboard
  // const r = Math.floor(Math.random() * 256);
  // const g = Math.floor(Math.random() * 256);
  // const b = Math.floor(Math.random() * 256);
  // console.log(`rgb(${r}, ${g}, ${b})`);
  // return `rgb(${r}, ${g}, ${b})`;

  // Chooses a random color from the approved list of colors
  return colorList[Math.floor(Math.random() * 19)];
}

// Function for event listener
function optionChanged(newSample) {
  // Generate random color for dashboard objects
  let randomColor = getRandomColor();

  // Build dashboard styling for new sample
  dashboardStyling(randomColor);

  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample, randomColor);
}

// Function to do the styling of my dashboard
function dashboardStyling(randomColor){
    // Styling for the top title block
    let titleBlock = d3.select('.col-md-12')
    titleBlock.transition().duration(500)
      .style('background-color', randomColor)
      .style("box-shadow", "10px 10px 5px grey")
      .style("border", "1px solid black")
      .style("border-radius", "15px");

    // Styling for the top ID number block
    let idPanel = d3.select('.card')
    idPanel.transition().duration(500)
      .style('background-color', randomColor)
      .style("box-shadow", "10px 10px 5px grey")
      .style("border", "1px solid black")

    // Styling for the demographic info header
    let panelHeader = d3.select('.card-header')
    panelHeader.transition().duration(500)
      .style('background-color', randomColor)
      .style("border-radius", "15px");

    // Styling for the demographic info metadata block
    let metaBlock = d3.select('.card-primary')
    metaBlock.transition().duration(500)
      .style("box-shadow", "10px 10px 5px grey")
      .style("border", "1px solid black")
      .style("border-radius", "15px");
    
    // Styling for the bubble plot
    let bubbleChart = d3.select('#bubble')
    bubbleChart
      .style("position", "relative").style("top", "10px")
      
}

// Initialize the dashboard
init();
