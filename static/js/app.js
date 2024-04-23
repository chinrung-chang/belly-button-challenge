let samples = null;
let metadata= null;

// the drop down list
function createDropDownList(data){
    var dropDown = d3.select("#selDataset");
    var options = dropDown.selectAll("option").data(data).enter().append("option");
    options.text(function(d) {
        return d;
    }).attr("value", function(d) {
      return d;
    });
}

// display meta data
function displayMetaData(id_value){
    const element = metadata.filter(e=>e.id == id_value)[0];
    let div = d3.select("#metaData");
    let htmlContent = `id:${element.id} <br> ethnicity: ${element.ethnicity} <br> gender: ${element.gender} <br> age: ${element.age} <br> location: ${element.location} <br>bbtype: ${element.bbtype} <br>wfreq: ${element.wfreq} <br>`;
    div.html(htmlContent);
}

// option change event handling
// redraw charts and meta data
function optionChanged(value){    
    plotBarChart(value);
    displayMetaData(value);    
    plotBubbleChart(value);    
}

// bubble chart
function plotBubbleChart(id_value){
    let arrObject = [];
    const element = samples.filter(v=>v.id == id_value)[0];     
    for(let i=0; i<element.otu_ids.length;i++){
        arrObject.push({id: element.otu_ids[i], label: element.otu_labels[i], value: element.sample_values[i]})
    }    
    var trace1 = {
        x: arrObject.map(object => object.id),
        y: arrObject.map(object => object.value),        
        mode: 'markers',
        marker: {
          color: arrObject.map(object => object.id),
          opacity: [1, 0.8, 0.6, 0.4],
          size: arrObject.map(object => object.value)
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: '',
        showlegend: false,
        height: 600,
        width: 1200,
        xaxis: {
            title:'otu id'}};
      
       Plotly.newPlot('bubble', data, layout);      
      
}

// bar chart
function plotBarChart(id_value){
    let arrObject = [];
    const element = samples.filter(v=>v.id == id_value)[0];     
    for(let i=0; i<element.otu_ids.length;i++){
        arrObject.push({id: "OTU " + element.otu_ids[i], label: element.otu_labels[i], value: element.sample_values[i]})
    }

    let sortedByValue = arrObject.sort((a, b) => b.value - a.value);
    
    // Slice the first 10 objects for plotting
    let slicedData = sortedByValue.slice(0, 10);

    slicedData.reverse();
    
    let trace1 = {
        x: slicedData.map(object => object.value),
        y: slicedData.map(object => object.id),
        text: slicedData.map(object => object.label),
        name: "OTU",
        type: "bar",
        orientation: "h"
      };
      
      // Data array
      let data = [trace1];
      
      // Apply a title to the layout
      let layout = {
        title: "",
        margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 100
        }
      };
      
      // Render the plot to the div tag with id "bar"
      Plotly.newPlot("bar", data, layout);
}

let jsonFile = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

d3.json(jsonFile).then(function(data) {        

    samples = data.samples;
    metadata = data.metadata;        

    // default selection is first elment of samples array
    plotBarChart(samples[0].id);
    plotBubbleChart(samples[0].id);
    displayMetaData(samples[0].id);
    createDropDownList(data.names);
});
