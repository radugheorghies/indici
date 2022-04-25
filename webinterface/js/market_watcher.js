// The WAMP server host
var wsHost = "127.0.0.1";

// Initiate a connection with the server
connection = new autobahn.Connection({
  url: "ws://" + wsHost + ":8087",
  realm: "dataGateway",
});

// Process trades
function processTrade(args) {
  if (args.length > 0) {
    trade = args[0];
    $("#" + trade.Symbol).html(trade.Price);
  }
}

// Process indice
function processIndice(args) {
  if (args.length > 0) {
    indicePrice = args[0];
    $("#indice").html(indicePrice);
  }
}

function processKLine(args) {
  if (args.length > 0) {
    pair = args[0].Pair;
    payload = args[0].Data;

    // console.log(args[0]);
    
    switch (pair) {
      case "BTCUSDT":
        dojichart1.loadData(payload, "BTCUSDT", "M5");
        break;
      case "ETHUSDT":
        dojichart2.loadData(payload, "ETHUSDT", "M5");
        break;
      case "SOLUSDT":
        dojichart3.loadData(payload, "SOLUSDT", "M5");
        break;
      case "DOGEUSDT":
        dojichart4.loadData(payload, "DOGEUSDT", "M5");
        break;
    }
  }
}

function processIndiceKLine(args) {
  if (args.length > 0) {
    pair = args[0].Pair;
    payload = args[0].Data;

    console.log(args[0]);
    dojichart0.loadData(payload, "INDICE", "M5");
  }
}

// Listen for connection opn event
connection.onopen = function (event) {
  console.log("Connected");
  // listen for tades
  event.subscribe("trades", processTrade);
  // listen for indice
  event.subscribe("indice", processIndice);
  // listen for klines
  event.subscribe("kline", processKLine);
  // listen for indice kline
  event.subscribe("indicekline", processIndiceKLine);
};
// Open the connection
connection.open();

var dojichart0 = new DojiChart.core.Chart(document.getElementById("mychart"), {
  fieldMap: { time: "T", open: "O", high: "H", low: "L", close: "C", volume: "V"},
});

var dojichart1 = new DojiChart.core.Chart(document.getElementById("mychart1"), {
  fieldMap: { time: "T", open: "O", high: "H", low: "L", close: "C", volume: "V"},
});

var dojichart2 = new DojiChart.core.Chart(document.getElementById("mychart2"), {
  fieldMap: { time: "T", open: "O", high: "H", low: "L", close: "C", volume: "V"},
});

var dojichart3 = new DojiChart.core.Chart(document.getElementById("mychart3"), {
  fieldMap: { time: "T", open: "O", high: "H", low: "L", close: "C", volume: "V"},
});

var dojichart4 = new DojiChart.core.Chart(document.getElementById("mychart4"), {
  fieldMap: { time: "T", open: "O", high: "H", low: "L", close: "C", volume: "V"},
});

// Create a chart panel with a candlestick chart layer
var price_chart_panel0 = new DojiChart.panel.TimeValuePanel({
  primaryLayer: new DojiChart.layer.CandleLayer(),
  height: 300,
});

// Volume
var volume_layer0 = new DojiChart.layer.indicator.VolumeLayer({
  barColor: "#3377FF",
  barWidth: 5,
});

var volume_chart_panel0 = new DojiChart.panel.TimeValuePanel({
  height: 100,
  primaryLayer: volume_layer0,
});

// Create a chart panel with a candlestick chart layer
var price_chart_panel1 = new DojiChart.panel.TimeValuePanel({
  primaryLayer: new DojiChart.layer.CandleLayer(),
  height: 150,
});

// Volume
var volume_layer1 = new DojiChart.layer.indicator.VolumeLayer({
  barColor: "#3377FF",
  barWidth: 5,
});

var volume_chart_panel1 = new DojiChart.panel.TimeValuePanel({
  height: 50,
  primaryLayer: volume_layer1,
});

// Create a chart panel with a candlestick chart layer
var price_chart_panel2 = new DojiChart.panel.TimeValuePanel({
  primaryLayer: new DojiChart.layer.CandleLayer(),
  height: 150,
});

// Volume
var volume_layer2 = new DojiChart.layer.indicator.VolumeLayer({
  barColor: "#3377FF",
  barWidth: 5,
});

var volume_chart_panel2 = new DojiChart.panel.TimeValuePanel({
  height: 50,
  primaryLayer: volume_layer2,
});

// Create a chart panel with a candlestick chart layer
var price_chart_panel3 = new DojiChart.panel.TimeValuePanel({
  primaryLayer: new DojiChart.layer.CandleLayer(),
  height: 150,
});

// Volume
var volume_layer3 = new DojiChart.layer.indicator.VolumeLayer({
  barColor: "#3377FF",
  barWidth: 5,
});

var volume_chart_panel3 = new DojiChart.panel.TimeValuePanel({
  height: 50,
  primaryLayer: volume_layer3,
});

// Create a chart panel with a candlestick chart layer
var price_chart_panel4 = new DojiChart.panel.TimeValuePanel({
  primaryLayer: new DojiChart.layer.CandleLayer(),
  height: 150,
});

// Volume
var volume_layer4 = new DojiChart.layer.indicator.VolumeLayer({
  barColor: "#3377FF",
  barWidth: 5,
});

var volume_chart_panel4 = new DojiChart.panel.TimeValuePanel({
  height: 50,
  primaryLayer: volume_layer4,
});

// Render the panel in the region named 'price'
dojichart0.addComponent("price", price_chart_panel0);
dojichart0.addComponent("volume", volume_chart_panel0);

dojichart1.addComponent("price", price_chart_panel1);
dojichart1.addComponent("volume", volume_chart_panel1);

dojichart2.addComponent("price", price_chart_panel2);
dojichart2.addComponent("volume", volume_chart_panel2);

dojichart3.addComponent("price", price_chart_panel3);
dojichart3.addComponent("volume", volume_chart_panel3);

dojichart4.addComponent("price", price_chart_panel4);
dojichart4.addComponent("volume", volume_chart_panel4);


// data_arr = [
//   {
//     C: 851.0384843296391,
//     H: 851.961551619072,
//     L: 851.0250736506504,
//     O: 851.624560563744,
//     T: "2022-04-24T21:26:11ZZ",
//     V: 72097197.21808928
//   }
// ]
// dojichart0.loadData(data_arr, "INDICE", "M5");