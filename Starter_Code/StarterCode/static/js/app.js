
const dataUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


function buildCharts(sampleId) {
  d3.json(dataUrl).then((data) => {
    
    const sampleData = data.samples.find((sample) => sample.id === sampleId);

    const top10Samples = sampleData.sample_values.slice(0, 10).reverse();
    const top10OTUIds = sampleData.otu_ids.slice(0, 10).map((otuId) => `OTU ${otuId}`).reverse();
    const top10OTULabels = sampleData.otu_labels.slice(0, 10).reverse();

    const trace1 = {
      x: top10Samples,
      y: top10OTUIds,
      text: top10OTULabels,
      type: "bar",
      orientation: "h"
    };

    const layout = {
      title: "Top 10 OTUs Found in Individual",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };

    const dataBar = [trace1];

    Plotly.newPlot("bar", dataBar, layout);
  });
}

function buildBubbleChart(sampleId) {
  d3.json(dataUrl).then((data) => {
   
    const sampleData = data.samples.find((sample) => sample.id === sampleId);

    const trace2 = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: 'markers',
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids,
        colorscale: 'Earth'
      }
    };

    const layout = {
      title: 'Bubble Chart for Each Sample',
      xaxis: { title: 'OTU IDs' },
      yaxis: { title: 'Sample Values' },
      showlegend: false
    };

    const dataBubble = [trace2];

    Plotly.newPlot('bubble', dataBubble, layout);
  });
}


function buildMetadata(sampleId) {
  d3.json(dataUrl).then((data) => {

    const metadata = data.metadata.find((meta) => meta.id === parseInt(sampleId));


    const metadataPanel = d3.select("#sample-metadata");


    metadataPanel.html("");


    Object.entries(metadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  });
}


function init() {

  d3.json(dataUrl).then((data) => {
    const dropdown = d3.select('#selDataset');

    data.names.forEach((sampleId) => {
      dropdown.append('option').text(sampleId).property('value', sampleId);
    });

    const initialSampleId = data.names[0];
    buildCharts(initialSampleId);
    buildBubbleChart(initialSampleId);
    buildMetadata(initialSampleId);
  });
}


function optionChanged(newSampleId) {
  buildCharts(newSampleId);
  buildBubbleChart(newSampleId);
  buildMetadata(newSampleId);
}

init();
