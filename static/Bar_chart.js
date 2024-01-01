function fetchDataAndUpdateChart3() {
  fetch("/get-datachart3")
    .then((response) => response.json())
    .then((data) => {
      updateChart3(data);
    })
    .catch((error) => console.error("Error:", error));
}
function updateChart3(data_df) {
  console.log(data_df);
  try {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("Bar_chart");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout,
      })
    );

    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    var legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "model",
        renderer: am5xy.AxisRendererX.new(root, {
          cellStartLocation: 0.1,
          cellEndLocation: 0.9,
        }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    xAxis.data.setAll(data_df);

    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        autoZoom: false,
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Models",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "Sum of price",
        categoryXField: "model",
        stacked: true,
      })
    );

    series.data.setAll(data_df);
    series.appear();
    legend.data.push(series);

    chart.set(
      "scrollbarX",
      am5.Scrollbar.new(root, {
        orientation: "horizontal",
      })
    );

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);
  } catch (e) {
    console.log(e);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndUpdateChart3();
});
