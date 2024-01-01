function fetchDataAndUpdateChart2() {
  fetch("/get-datachart2")
    .then((response) => response.json())
    .then((data) => {
      updateChart2(data);
    })
    .catch((error) => console.error("Error:", error));
}
function updateChart2(data_df) {
  console.log(data_df);
  try {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("Multilevel_Tree_Map");

    const myTheme = am5.Theme.new(root);

    myTheme
      .rule("RoundedRectangle", ["hierarchy", "node", "shape", "depth1"])
      .setAll({
        strokeWidth: 2,
      });

    myTheme
      .rule("RoundedRectangle", ["hierarchy", "node", "shape", "depth2"])
      .setAll({
        fillOpacity: 0,
        strokeWidth: 1,
        strokeOpacity: 0.2,
      });

    myTheme.rule("Label", ["node", "depth1"]).setAll({
      forceHidden: true,
    });

    myTheme.rule("Label", ["node", "depth2"]).setAll({
      fontSize: 10,
    });

    root.setThemes([am5themes_Animated.new(root), myTheme]);

    // Create wrapper container
    var container = root.container.children.push(
      am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout,
      })
    );

    // Create series
    // https://www.amcharts.com/docs/v5/charts/hierarchy/#Adding
    var series = container.children.push(
      am5hierarchy.Treemap.new(root, {
        sort: "descending",
        singleBranchOnly: false,
        downDepth: 1,
        upDepth: -1,
        initialDepth: 2,
        valueField: "value",
        categoryField: "name",
        childDataField: "children",
        nodePaddingOuter: 0,
        nodePaddingInner: 0,
      })
    );

    series.get("colors").set("step", 1);

    // Generate and set data
    // https://www.amcharts.com/docs/v5/charts/hierarchy/#Setting_data

    function processData(data_df) {
      var treeData = [];

      var smallBrands = { name: "Other", children: [] };

      am5.object.eachOrdered(
        data_df,
        (brand) => {
          var brandData = { name: brand, children: [] };
          var brandTotal = 0;
          for (var model in data_df[brand]) {
            brandTotal += data_df[brand][model];
          }

          for (var model in data_df[brand]) {
            // do not add very small
            if (data_df[brand][model] > 100) {
              brandData.children.push({
                name: model,
                value: data_df[brand][model],
              });
            }
          }

          // only bigger brands
          if (brandTotal > 200000) {
            treeData.push(brandData);
          }
        },
        (a, b) => {
          let aval = 0;
          let bval = 0;
          am5.object.each(data_df[a], (key, val) => (aval += val));
          am5.object.each(data_df[b], (key, val) => (bval += val));
          if (aval > bval) return -1;
          if (aval < bval) return 1;
          return 0;
        }
      );

      return [
        {
          name: "Root",
          children: treeData,
        },
      ];
    }

    series.data.setAll(processData(data_df));
    series.set("selectedDataItem", series.dataItems[0]);

    series.bullets.push(function (root, series, dataItem) {
      var depth = dataItem.get("depth");

      if (depth == 1) {
        var picture = am5.Picture.new(root, {
          src:
            "https://www.amcharts.com/wp-content/uploads/assets/logos/" +
            dataItem.dataContext.name.toLowerCase() +
            ".png",
          centerX: am5.p50,
          centerY: am5.p50,
          width: am5.percent(30),
          isMeasured: true,
        });

        picture.states.lookup("default").setAll({ opacity: 0.15 });

        return am5.Bullet.new(root, { sprite: picture });
      }
    });
  } catch (e) {
    console.log(e);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndUpdateChart2();
});
