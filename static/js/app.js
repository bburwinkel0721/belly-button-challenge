// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metaDataField = data.metadata

    // Filter the metadata for the object with the desired sample number
    let desiredSample = metaDataField.filter(object => object.id == sample)
    
    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select('#sample-metadata')

    // Add some color the panel
    let panelLayout = d3.select('.card-header')
    panelLayout.style('background-color', 'rgb(0, 120, 200)')

    // Use `.html("") to clear any existing metadata
    panel.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    desiredSample.forEach(item => {
      Object.entries(item).forEach(([key, value]) => {
          panel.append("p")
              .text(`${key.toUpperCase()}: ${value}`);
      });
    });
  });
}

// function to build both charts
function buildCharts(sample) {
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
    let bubbleData = [trace]
    let layout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {
        title: 'OTU ID'
      },
      yaxis: {
        title: 'Number of Bacteria'
      }
    };
    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let mappedIds = otuIds.map(item => `OTU ${item} `)

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace2 = {
      x: sampleValues.slice(0,10).reverse(),
      y: mappedIds.slice(0,10).reverse(),
      type: 'bar',
      orientation: "h",
      text: otuLabels.slice(0,10).reverse()
    }
    let barData = [trace2]
    let layout2 = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {
        title: 'Number of Bacteria'
      }
    }
    // Render the Bar Chart
    Plotly.newPlot('bar', barData, layout2)
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

    // Build charts and metadata panel with the first sample
    buildMetadata(firstName)
    buildCharts(firstName)
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample)
  buildCharts(newSample)
}

// Initialize the dashboard
init();
