function fetchDataAndUpdateChart() {
  fetch("/get-datachart")
    .then((response) => response.json())
    .then((data) => {
      updateChart(data);
    })
    .catch((error) => console.error("Error:", error));
}
function updateChart(data_df) {
  console.log(data_df);
  // Create root element
  var root = am5.Root.new("Stock_Chart_With_Volume");

  // Set themes
  root.setThemes([am5themes_Animated.new(root)]);

  // Create a stock chart
  var stockChart = root.container.children.push(
    am5stock.StockChart.new(root, {
      paddingLeft: 22,
    })
  );

  // Set global number format
  root.numberFormatter.set("numberFormat", "#,###.00");

  //
  //  Main (value) panel
  //

  // Create a main stock panel (chart)
  var mainPanel = stockChart.panels.push(
    am5stock.StockPanel.new(root, {
      wheelY: "zoomX",
      panX: true,
      panY: true,
      height: am5.percent(70),
    })
  );

  // Create axes
  var valueAxis = mainPanel.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        pan: "zoom",
      }),
      tooltip: am5.Tooltip.new(root, {
        animationDuration: 200,
      }),
      numberFormat: "#,###.00",
      extraTooltipPrecision: 2,
    })
  );

  var dateAxis = mainPanel.xAxes.push(
    am5xy.GaplessDateAxis.new(root, {
      baseInterval: {
        timeUnit: "day",
        count: 1,
      },
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {
        animationDuration: 200,
      }),
    })
  );

  // Add series
  var valueSeries = mainPanel.series.push(
    am5xy.LineSeries.new(root, {
      name: "STCK",
      valueXField: "Date",
      valueYField: "Close",
      xAxis: dateAxis,
      yAxis: valueAxis,
      legendValueText: "{valueY}",
    })
  );

  valueSeries.data.setAll(data_df);

  // Set main value series
  stockChart.set("stockSeries", valueSeries);

  // Add a stock legend
  var valueLegend = mainPanel.topPlotContainer.children.push(
    am5stock.StockLegend.new(root, {
      stockChart: stockChart,
    })
  );
  valueLegend.data.setAll([valueSeries]);

  /**
   * Secondary (volume) panel
   */

  // Create a main stock panel (chart)
  var volumePanel = stockChart.panels.push(
    am5stock.StockPanel.new(root, {
      wheelY: "zoomX",
      panX: true,
      panY: true,
      height: am5.percent(30),
    })
  );

  // Create axes
  var volumeValueAxis = volumePanel.yAxes.push(
    am5xy.ValueAxis.new(root, {
      numberFormat: "#.#a",
      renderer: am5xy.AxisRendererY.new(root, {
        pan: "zoom",
      }),
    })
  );

  var volumeAxisRenderer = am5xy.AxisRendererX.new(root, {});
  var volumeDateAxis = volumePanel.xAxes.push(
    am5xy.GaplessDateAxis.new(root, {
      baseInterval: {
        timeUnit: "day",
        count: 1,
      },
      renderer: volumeAxisRenderer,
      tooltip: am5.Tooltip.new(root, {
        forceHidden: true,
        animationDuration: 200,
      }),
    })
  );

  // hide labels
  // volumeAxisRenderer.labels.template.set("forceHidden", true);

  // Add series
  var volumeSeries = volumePanel.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "STCK",
      valueXField: "Date",
      valueYField: "Volume",
      xAxis: volumeDateAxis,
      yAxis: volumeValueAxis,
      legendValueText: "{valueY.formatNumber('#,###')}",
    })
  );

  volumeSeries.data.setAll(data_df);

  // Set main value series
  stockChart.set("volumeSeries", volumeSeries);

  // Add a stock legend
  var volumeLegend = volumePanel.topPlotContainer.children.push(
    am5stock.StockLegend.new(root, {
      stockChart: stockChart,
    })
  );
  volumeLegend.data.setAll([volumeSeries]);

  // Add cursor(s)
  mainPanel.set(
    "cursor",
    am5xy.XYCursor.new(root, {
      yAxis: valueAxis,
      xAxis: dateAxis,
      snapToSeries: [valueSeries],
      snapToSeriesBy: "y!",
    })
  );

  var volumeCursor = volumePanel.set(
    "cursor",
    am5xy.XYCursor.new(root, {
      yAxis: volumeValueAxis,
      xAxis: volumeDateAxis,
      snapToSeries: [volumeSeries],
      snapToSeriesBy: "y!",
    })
  );

  // hide y line on volume panel
  volumeCursor.lineY.set("forceHidden", true);

  // Add scrollbar
  var scrollbar = mainPanel.set(
    "scrollbarX",
    am5xy.XYChartScrollbar.new(root, {
      orientation: "horizontal",
      height: 50,
    })
  );
  stockChart.toolsContainer.children.push(scrollbar);

  var sbDateAxis = scrollbar.chart.xAxes.push(
    am5xy.GaplessDateAxis.new(root, {
      baseInterval: {
        timeUnit: "day",
        count: 1,
      },
      renderer: am5xy.AxisRendererX.new(root, {}),
    })
  );

  var sbValueAxis = scrollbar.chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
    })
  );

  var sbSeries = scrollbar.chart.series.push(
    am5xy.LineSeries.new(root, {
      valueYField: "Close",
      valueXField: "Date",
      xAxis: sbDateAxis,
      yAxis: sbValueAxis,
    })
  );

  sbSeries.fills.template.setAll({
    visible: true,
    fillOpacity: 0.3,
  });

  sbSeries.data.setAll(data_df);
}
document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndUpdateChart();
});
