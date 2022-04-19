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

// Listen for connection opn event
connection.onopen = function (event) {
  console.log("Connected");
  // listen for tades
  event.subscribe("trades", processTrade);
  // listen for indice
  event.subscribe("indice", processIndice);
};
// Open the connection
connection.open();

// var myChart = new DojiChart('my-dojichart', {
//     width: 400,
//     fieldMap: {
//       time: 't',
//       open: 'o',
//       high: 'h',
//       low: 'l',
//       close: 'c',
//     }
//   });

//   // Create a chart panel with a candlestick chart layer
//   var pricePanel = new DojiChart.panel.TimeValuePanel({
//     primaryLayer: new DojiChart.layer.CandleLayer(),
//     height: 200
//   });

//   // Render the panel in the region named 'price'
//   myChart.addComponent('price', pricePanel);

//   // Price data
//   var priceData = [
//     {'t':'2015-11-11T17:25:00.000000Z','o':4672.3,'h':4675.3,'l':4671,'c':4671.4,},
//     {'t':'2015-11-11T17:30:00.000000Z','o':4671.5,'h':4675.1,'l':4671.3,'c':4674.5,},
//     {'t':'2015-11-11T17:35:00.000000Z','o':4674.5,'h':4678.6,'l':4674.5,'c':4676.2,},
//     {'t':'2015-11-11T17:40:00.000000Z','o':4676,'h':4677.3,'l':4674.5,'c':4674.9,},
//     {'t':'2015-11-11T17:45:00.000000Z','o':4674.7,'h':4676.2,'l':4673.2,'c':4673.3,},
//     {'t':'2015-11-11T17:50:00.000000Z','o':4673.3,'h':4673.5,'l':4671,'c':4672,},
//     {'t':'2015-11-11T17:55:00.000000Z','o':4672,'h':4672.5,'l':4670,'c':4671.6,},
//     {'t':'2015-11-11T18:00:00.000000Z','o':4671.5,'h':4672.3,'l':4669,'c':4669.8,},
//     {'t':'2015-11-11T18:05:00.000000Z','o':4669.8,'h':4669.9,'l':4661.2,'c':4662.2,},
//     {'t':'2015-11-11T18:10:00.000000Z','o':4662,'h':4662.6,'l':4659.5,'c':4661.9,},
//     {'t':'2015-11-11T18:15:00.000000Z','o':4661.9,'h':4663.1,'l':4660,'c':4661.8,},
//     {'t':'2015-11-11T18:20:00.000000Z','o':4661.9,'h':4663.9,'l':4659.8,'c':4659.9,},
//     {'t':'2015-11-11T18:25:00.000000Z','o':4659.6,'h':4659.8,'l':4653,'c':4655,},
//     {'t':'2015-11-11T18:30:00.000000Z','o':4654.9,'h':4655.8,'l':4653.3,'c':4654.1,},
//     {'t':'2015-11-11T18:35:00.000000Z','o':4654.1,'h':4654.1,'l':4650.4,'c':4653.4,},
//     {'t':'2015-11-11T18:40:00.000000Z','o':4653.3,'h':4657.7,'l':4653.1,'c':4657.6,},
//     {'t':'2015-11-11T18:45:00.000000Z','o':4657.3,'h':4657.5,'l':4654.8,'c':4656.5,},
//     {'t':'2015-11-11T18:50:00.000000Z','o':4656.5,'h':4659.1,'l':4654.5,'c':4656.1,},
//     {'t':'2015-11-11T18:55:00.000000Z','o':4656.1,'h':4657.4,'l':4651.5,'c':4652.5,},
//     {'t':'2015-11-11T19:00:00.000000Z','o':4652.4,'h':4654,'l':4651.3,'c':4653,},
//     {'t':'2015-11-11T19:05:00.000000Z','o':4652.9,'h':4656.2,'l':4650.8,'c':4653.1,},
//     {'t':'2015-11-11T19:10:00.000000Z','o':4653.1,'h':4656.8,'l':4651.6,'c':4656,},
//     {'t':'2015-11-11T19:15:00.000000Z','o':4655.9,'h':4658.3,'l':4653.4,'c':4657.4,},
//     {'t':'2015-11-11T19:20:00.000000Z','o':4657.3,'h':4658.3,'l':4655.8,'c':4657.2,},
//     {'t':'2015-11-11T19:25:00.000000Z','o':4657,'h':4662.1,'l':4655.6,'c':4661.3,},
//     {'t':'2015-11-11T19:30:00.000000Z','o':4661.5,'h':4662.4,'l':4659.6,'c':4660.9,},
//     {'t':'2015-11-11T19:35:00.000000Z','o':4661,'h':4661.3,'l':4657.3,'c':4657.4,},
//     {'t':'2015-11-11T19:40:00.000000Z','o':4657,'h':4658.7,'l':4649.5,'c':4652.3,},
//     {'t':'2015-11-11T19:45:00.000000Z','o':4652.1,'h':4653.9,'l':4651,'c':4652,},
//     {'t':'2015-11-11T19:50:00.000000Z','o':4652.2,'h':4654.5,'l':4650.2,'c':4651,},
//     {'t':'2015-11-11T19:55:00.000000Z','o':4650.9,'h':4651.3,'l':4643.2,'c':4643.3,},
//     {'t':'2015-11-11T20:00:00.000000Z','o':4643.3,'h':4644,'l':4638.2,'c':4638.7,},
//     {'t':'2015-11-11T20:05:00.000000Z','o':4638.6,'h':4643.8,'l':4637.5,'c':4637.5,},
//     {'t':'2015-11-11T20:10:00.000000Z','o':4637.6,'h':4644.7,'l':4637.5,'c':4643.7,},
//     {'t':'2015-11-11T20:15:00.000000Z','o':4643.8,'h':4646,'l':4640.2,'c':4640.6,},
//     {'t':'2015-11-11T20:20:00.000000Z','o':4640.7,'h':4644.3,'l':4640.4,'c':4640.8,},
//     {'t':'2015-11-11T20:25:00.000000Z','o':4641,'h':4646,'l':4641,'c':4645.4,},
//     {'t':'2015-11-11T20:30:00.000000Z','o':4645.3,'h':4646.3,'l':4642,'c':4642.3,},
//     {'t':'2015-11-11T20:35:00.000000Z','o':4642.2,'h':4643.7,'l':4638.7,'c':4640.7,},
//     {'t':'2015-11-11T20:40:00.000000Z','o':4640.7,'h':4643.3,'l':4638.5,'c':4642.3,},
//     {'t':'2015-11-11T20:45:00.000000Z','o':4642.1,'h':4643,'l':4637.8,'c':4637.8,},
//     {'t':'2015-11-11T20:50:00.000000Z','o':4637.9,'h':4642.7,'l':4637.5,'c':4641.8,},
//     {'t':'2015-11-11T20:55:00.000000Z','o':4642,'h':4642.2,'l':4635.2,'c':4636.5,},
//     {'t':'2015-11-11T21:00:00.000000Z','o':4636.6,'h':4638.2,'l':4632.7,'c':4633.2,},
//     {'t':'2015-11-11T21:05:00.000000Z','o':4633.2,'h':4635.5,'l':4633.2,'c':4634.6,},
//     {'t':'2015-11-11T21:10:00.000000Z','o':4634.6,'h':4636.2,'l':4634,'c':4635.7,},
//     {'t':'2015-11-11T21:15:00.000000Z','o':4635.6,'h':4635.8,'l':4635,'c':4635.3,},
//     {'t':'2015-11-11T21:20:00.000000Z','o':4635.6,'h':4636,'l':4635.2,'c':4635.2,},
//     {'t':'2015-11-11T21:25:00.000000Z','o':4635.1,'h':4635.9,'l':4635,'c':4635.9,},
//     {'t':'2015-11-11T21:30:00.000000Z','o':4635.7,'h':4636.2,'l':4635.5,'c':4635.9,}
//   ];

//   // Load data
//   myChart.loadData(priceData, 'NASDAQ', 'M5');

// var dojichart = new DojiChart.core.Chart(document.getElementById("my-dojichart"), {
//     fieldMap: {
//       time: "time",
//       open: "openBid",
//       high: "highBid",
//       low: "lowBid",
//       close: "closeBid",
//       volume: "volume"
//     },
//     crosshair: true
//   });

//   // Candlestick layer
//   var candle_layer = new DojiChart.layer.CandleLayer({});

//   // Price chart panel
//   var price_chart_panel = new DojiChart.panel.TimeValuePanel({
//     primaryLayer: candle_layer,
//     height: 250,
//     grid: true
//   });

//   dojichart.addComponent("price", price_chart_panel);

//   // Moving average
//   var sma_layer = new DojiChart.layer.indicator.SimpleMovingAverageLayer({
//     period: 50
//   });
//   price_chart_panel.addLayer(sma_layer);

//   // Time labels (at top of chart)
//   var time_labels_panel = new DojiChart.panel.TimeLabelsPanel();
//   dojichart.addComponent("timelabels", time_labels_panel);

//   // Volume
//   var volume_layer = new DojiChart.layer.indicator.VolumeLayer({
//     barColor: "#3377FF",
//     barWidth: 5
//   });

//   var volume_chart_panel = new DojiChart.panel.TimeValuePanel({
//     height: 100,
//     primaryLayer: volume_layer
//   });
//   dojichart.addComponent("volume", volume_chart_panel);

//   function load_data() {
//     var symbol = $("select").val();
//     var gran = $("button.btn-gran.active").data("value");

//     var dat = data[symbol][gran];
//     dojichart.loadData(dat.candles, symbol, gran);
//     print_api_call("dojichart.loadData(data, '" + symbol + "', '" + gran + "')");
//   }

//   function print_api_call(str) {
//     $("#api-print").text(str);
//   }

//   load_data();

var dojichart = new DojiChart.core.Chart(document.getElementById("mychart"), {
  fieldMap: {
    time: "t",
    open: "o",
    high: "h",
    low: "l",
    close: "c",
    volume: "v",
  },
});

// Create a chart panel with a candlestick chart layer
var price_chart_panel = new DojiChart.panel.TimeValuePanel({
  primaryLayer: new DojiChart.layer.CandleLayer(),
  height: 200,
});

// Render the panel in the region named 'price'
dojichart.addComponent("price", price_chart_panel);

// Volume
var volume_layer = new DojiChart.layer.indicator.VolumeLayer({
  barColor: "#3377FF",
  barWidth: 5,
});

// Volume
var volume_layer = new DojiChart.layer.indicator.VolumeLayer({
  barColor: "#3377FF",
  barWidth: 5,
});

var volume_chart_panel = new DojiChart.panel.TimeValuePanel({
  height: 100,
  primaryLayer: volume_layer,
});
dojichart.addComponent("volume", volume_chart_panel);

//   Dummy data
var data_arr = [
  {
    t: "2015-11-11T17:25:00.000000Z",
    o: 4672.3,
    h: 4675.3,
    l: 4671.0,
    c: 4671.4,
    v: 3200,
  },
  {
    t: "2015-11-11T17:30:00.000000Z",
    o: 4671.5,
    h: 4675.1,
    l: 4671.3,
    c: 4674.5,
    v: 3200,
  },
  {
    t: "2015-11-11T17:35:00.000000Z",
    o: 4674.5,
    h: 4678.6,
    l: 4674.5,
    c: 4676.2,
    v: 3200,
  },
  {
    t: "2015-11-11T17:40:00.000000Z",
    o: 4676.0,
    h: 4677.3,
    l: 4674.5,
    c: 4674.9,
    v: 3200,
  },
  {
    t: "2015-11-11T17:45:00.000000Z",
    o: 4674.7,
    h: 4676.2,
    l: 4673.2,
    c: 4673.3,
    v: 3200,
  },
  {
    t: "2015-11-11T17:25:00.000000Z",
    o: 4672.3,
    h: 4675.3,
    l: 4671,
    c: 4671.4,
    v: 3200,
  },
  {
    t: "2015-11-11T17:30:00.000000Z",
    o: 4671.5,
    h: 4675.1,
    l: 4671.3,
    c: 4674.5,
    v: 3200,
  },
  {
    t: "2015-11-11T17:35:00.000000Z",
    o: 4674.5,
    h: 4678.6,
    l: 4674.5,
    c: 4676.2,
    v: 3200,
  },
  {
    t: "2015-11-11T17:40:00.000000Z",
    o: 4676,
    h: 4677.3,
    l: 4674.5,
    c: 4674.9,
    v: 3200,
  },
  {
    t: "2015-11-11T17:45:00.000000Z",
    o: 4674.7,
    h: 4676.2,
    l: 4673.2,
    c: 4673.3,
    v: 3200,
  },

  {
    t: "2015-11-11T17:50:00.000000Z",
    o: 4673.3,
    h: 4673.5,
    l: 4671,
    c: 4672,
    v: 3200,
  },
  {
    t: "2015-11-11T17:55:00.000000Z",
    o: 4672,
    h: 4672.5,
    l: 4670,
    c: 4671.6,
    v: 3200,
  },
  {
    t: "2015-11-11T18:00:00.000000Z",
    o: 4671.5,
    h: 4672.3,
    l: 4669,
    c: 4669.8,
    v: 3200,
  },
  {
    t: "2015-11-11T18:05:00.000000Z",
    o: 4669.8,
    h: 4669.9,
    l: 4661.2,
    c: 4662.2,
    v: 3200,
  },
  {
    t: "2015-11-11T18:10:00.000000Z",
    o: 4662,
    h: 4662.6,
    l: 4659.5,
    c: 4661.9,
    v: 3200,
  },
  {
    t: "2015-11-11T18:15:00.000000Z",
    o: 4661.9,
    h: 4663.1,
    l: 4660,
    c: 4661.8,
    v: 3200,
  },
  {
    t: "2015-11-11T18:20:00.000000Z",
    o: 4661.9,
    h: 4663.9,
    l: 4659.8,
    c: 4659.9,
    v: 3200,
  },

  {
    t: "2015-11-11T18:25:00.000000Z",
    o: 4659.6,
    h: 4659.8,
    l: 4653,
    c: 4655,
    v: 3200,
  },
  {
    t: "2015-11-11T18:30:00.000000Z",
    o: 4654.9,
    h: 4655.8,
    l: 4653.3,
    c: 4654.1,
    v: 3200,
  },
  {
    t: "2015-11-11T18:35:00.000000Z",
    o: 4654.1,
    h: 4654.1,
    l: 4650.4,
    c: 4653.4,
    v: 3200,
  },
  {
    t: "2015-11-11T18:40:00.000000Z",
    o: 4653.3,
    h: 4657.7,
    l: 4653.1,
    c: 4657.6,
    v: 3200,
  },
  {
    t: "2015-11-11T18:45:00.000000Z",
    o: 4657.3,
    h: 4657.5,
    l: 4654.8,
    c: 4656.5,
    v: 80000,
  },
  {
    t: "2015-11-11T18:50:00.000000Z",
    o: 4656.5,
    h: 4659.1,
    l: 4654.5,
    c: 4656.1,
    v: 3200,
  },
  {
    t: "2015-11-11T18:55:00.000000Z",
    o: 4656.1,
    h: 4657.4,
    l: 4651.5,
    c: 4652.5,
    v: 3200,
  },

  {
    t: "2015-11-11T19:00:00.000000Z",
    o: 4652.4,
    h: 4654,
    l: 4651.3,
    c: 4653,
    v: 3200,
  },
  {
    t: "2015-11-11T19:05:00.000000Z",
    o: 4652.9,
    h: 4656.2,
    l: 4650.8,
    c: 4653.1,
    v: 3200,
  },
  {
    t: "2015-11-11T19:10:00.000000Z",
    o: 4653.1,
    h: 4656.8,
    l: 4651.6,
    c: 4656,
    v: 3200,
  },
  {
    t: "2015-11-11T19:15:00.000000Z",
    o: 4655.9,
    h: 4658.3,
    l: 4653.4,
    c: 4657.4,
    v: 3200,
  },
  {
    t: "2015-11-11T19:20:00.000000Z",
    o: 4657.3,
    h: 4658.3,
    l: 4655.8,
    c: 4657.2,
    v: 3200,
  },
  {
    t: "2015-11-11T19:25:00.000000Z",
    o: 4657,
    h: 4662.1,
    l: 4655.6,
    c: 4661.3,
    v: 3200,
  },
  {
    t: "2015-11-11T19:30:00.000000Z",
    o: 4661.5,
    h: 4662.4,
    l: 4659.6,
    c: 4660.9,
    v: 3200,
  },
  {
    t: "2015-11-11T19:35:00.000000Z",
    o: 4661,
    h: 4661.3,
    l: 4657.3,
    c: 4657.4,
    v: 3200,
  },
  {
    t: "2015-11-11T19:40:00.000000Z",
    o: 4657,
    h: 4658.7,
    l: 4649.5,
    c: 4652.3,
    v: 3200,
  },

  {
    t: "2015-11-11T19:45:00.000000Z",
    o: 4652.1,
    h: 4653.9,
    l: 4651,
    c: 4652,
    v: 3200,
  },
  {
    t: "2015-11-11T19:50:00.000000Z",
    o: 4652.2,
    h: 4654.5,
    l: 4650.2,
    c: 4651,
    v: 3200,
  },
  {
    t: "2015-11-11T19:55:00.000000Z",
    o: 4650.9,
    h: 4651.3,
    l: 4643.2,
    c: 4643.3,
    v: 3200,
  },
  {
    t: "2015-11-11T20:00:00.000000Z",
    o: 4643.3,
    h: 4644,
    l: 4638.2,
    c: 4638.7,
    v: 3200,
  },
  {
    t: "2015-11-11T20:05:00.000000Z",
    o: 4638.6,
    h: 4643.8,
    l: 4637.5,
    c: 4637.5,
    v: 41000,
  },
  {
    t: "2015-11-11T20:10:00.000000Z",
    o: 4637.6,
    h: 4644.7,
    l: 4637.5,
    c: 4643.7,
    v: 3200,
  },
  {
    t: "2015-11-11T20:15:00.000000Z",
    o: 4643.8,
    h: 4646,
    l: 4640.2,
    c: 4640.6,
    v: 3200,
  },
  {
    t: "2015-11-11T20:20:00.000000Z",
    o: 4640.7,
    h: 4644.3,
    l: 4640.4,
    c: 4640.8,
    v: 3200,
  },

  {
    t: "2015-11-11T20:25:00.000000Z",
    o: 4641,
    h: 4646,
    l: 4641,
    c: 4645.4,
    v: 17600,
  },
  {
    t: "2015-11-11T20:30:00.000000Z",
    o: 4645.3,
    h: 4646.3,
    l: 4642,
    c: 4642.3,
    v: 25000,
  },
  {
    t: "2015-11-11T20:35:00.000000Z",
    o: 4642.2,
    h: 4643.7,
    l: 4638.7,
    c: 4640.7,
    v: 3200,
  },
  {
    t: "2015-11-11T20:40:00.000000Z",
    o: 4640.7,
    h: 4643.3,
    l: 4638.5,
    c: 4642.3,
    v: 3200,
  },
  {
    t: "2015-11-11T20:45:00.000000Z",
    o: 4642.1,
    h: 4643,
    l: 4637.8,
    c: 4637.8,
    v: 3200,
  },
  {
    t: "2015-11-11T20:50:00.000000Z",
    o: 4637.9,
    h: 4642.7,
    l: 4637.5,
    c: 4641.8,
    v: 50,
  },
  {
    t: "2015-11-11T20:55:00.000000Z",
    o: 4642,
    h: 4642.2,
    l: 4635.2,
    c: 4636.5,
    v: 3200,
  },
  {
    t: "2015-11-11T21:00:00.000000Z",
    o: 4636.6,
    h: 4638.2,
    l: 4632.7,
    c: 4633.2,
    v: 3200,
  },
  {
    t: "2015-11-11T21:05:00.000000Z",
    o: 4633.2,
    h: 4635.5,
    l: 4633.2,
    c: 4634.6,
    v: 3200,
  },
  {
    t: "2015-11-11T21:10:00.000000Z",
    o: 4634.6,
    h: 4636.2,
    l: 4634,
    c: 4635.7,
    v: 200,
  },
  {
    t: "2015-11-11T21:15:00.000000Z",
    o: 4635.6,
    h: 4635.8,
    l: 4635,
    c: 4635.3,
    v: 3200,
  },
  {
    t: "2015-11-11T21:20:00.000000Z",
    o: 4635.6,
    h: 4636,
    l: 4635.2,
    c: 4635.2,
    v: 3200,
  },
  {
    t: "2015-11-11T21:25:00.000000Z",
    o: 4635.1,
    h: 4635.9,
    l: 4635,
    c: 4635.9,
    v: 48000,
  },
  {
    t: "2015-11-11T21:30:00.000000Z",
    o: 4635.7,
    h: 4636.2,
    l: 4635.5,
    c: 4635.9,
    v: 3200,
  },
];

// Load data
dojichart.loadData(data_arr, "EURUSD", "M5");
