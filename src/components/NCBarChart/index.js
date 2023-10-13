import React, { useState } from "react";
import { View, Text, Platform } from "react-native";
import { LinearGradient, Stop, Defs } from "react-native-svg";

const isWeb = Platform.OS === "web";

let Victory;

if (isWeb) {
  Victory = require("victory");
} else {
  Victory = require("victory-native");
}

const {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLabel,
  VictoryContainer,
} = Victory;

const NCBarChart = (props) => {
  const {
    isManual,
    numberBars,
    labelBar1,
    valueBar1,
    labelBar2,
    valueBar2,
    labelBar3,
    valueBar3,
    labelBar4,
    valueBar4,
    labelBar5,
    valueBar5,
    labelBar6,
    valueBar6,
    labelBar7,
    valueBar7,
    labelBar8,
    valueBar8,
    listItems,
    styleOptions,
    _width,
    _height,
    editor,
    _screenWidth,
    bar_Width,
  } = props;

  const {
    isAnimated,
    speed,
    title,
    subtitle,
    xText,
    yText,
    colorTop,
    colorBottom,
    styles,
    isGrid,
    gridColor,
    labelColor,
    valueColor,
    labelAngle = 50,
    fixLabelOverlap,
  } = styleOptions;

  const manualValues = {
    0: [labelBar1, valueBar1],
    1: [labelBar2, valueBar2],
    2: [labelBar3, valueBar3],
    3: [labelBar4, valueBar4],
    4: [labelBar5, valueBar5],
    5: [labelBar6, valueBar6],
    6: [labelBar7, valueBar7],
    7: [labelBar8, valueBar8],
  };

  const [headerHeight, setHeaderHeight] = React.useState(null);
  const [showDiv, setshowDiv] = useState(false);

  const data = React.useMemo(() => {
    const _data = [];

    if (isManual) {
      const limit = numberBars > 8 ? 8 : numberBars;

      Array(limit)
        .fill(0)
        .forEach((_, idx) => {
          const [label, value] = manualValues[idx];

          if (editor) {
            _data.push({ label, value: value || 1500 });
          } else {
            _data.push({ label, value });
          }
        });
    } else {
      listItems?.forEach((item, index) => {
        const { label, value } = item;

        if (editor) {
          _data.push({ label: `Label ${index + 1}`, value: value || 1500 });
        } else {
          _data.push({ label, value });
        }
      });
    }

    return _data;
  }, [manualValues, listItems, isManual]);

  const onHeaderLayout = (e) => {
    setHeaderHeight(e.nativeEvent.layout.height);
  };

  if (!data || data?.length === 0) {
    return null;
  }

  const gridStyles = isGrid
    ? { stroke: gridColor, strokeWidth: 1 }
    : { stroke: "transparent", strokeWidth: 0 };

  const Gradient = () =>
    isWeb ? (
      <svg>
        <defs key="gradient">
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colorTop} />
            <stop offset="100%" stopColor={colorBottom} />
          </linearGradient>
        </defs>
      </svg>
    ) : (
      <Defs key={"gradient"}>
        <LinearGradient
          id={"gradient"}
          x1={"0%"}
          y={"0%"}
          x2={"0%"}
          y2={"100%"}
        >
          <Stop offset={"0%"} stopColor={colorTop} />
          <Stop offset={"100%"} stopColor={colorBottom} />
        </LinearGradient>
      </Defs>
    );

  let labelPadding;

  if (labelAngle == 0) {
    labelPadding = 35;
  } else if (labelAngle == 30) {
    labelPadding = 50;
  } else if (labelAngle == 50 || labelAngle == 60) {
    labelPadding = 60;
  } else {
    labelPadding = 70;
  }

  const valueOfPercentage = Math.min(bar_Width, 100) / data.length;

  return (
    <View>
      {showDiv && (
        <View
          style={{
            position: "absolute",
            bottom: "90%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onLayout={onHeaderLayout}
        >
          {!!title && (
            <Text style={[styles.title, { marginBottom: 5 }]}>{title}</Text>
          )}

          {!!subtitle && (
            <Text style={[styles.subtitle, { marginBottom: 5 }]}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
      <View
        onLayout={() => {
          setTimeout(() => {
            setshowDiv(true);
          }, 500);
        }}
        style={{ paddingTop: "10%" }}
      >
        <VictoryChart
          width={editor ? _width : Math.min(_screenWidth, _width)}
          containerComponent={<VictoryContainer responsive={false} />}
          theme={VictoryTheme.material}
          onLoad={{ duration: 500 }}
          // height={_height - headerHeight}
          animate={
            isAnimated
              ? {
                  duration: speed,
                  onLoad: { duration: speed },
                }
              : false
          }
          padding={{
            top: 10,
            bottom: labelPadding + 14,
            left: 70,
            right: 70,
          }}
          domainPadding={{ x: [20, 15], y: 0 }} // Add domain y to increase value
        >
          <Gradient />

          <VictoryAxis
            style={{
              axis: { stroke: "#00000000" },
              axisLabel: {
                ...styles.yText,
                fill: styles.yText.color,
                padding: 50,
              },
              ticks: { stroke: "#00000000" },
              tickLabels: {
                fill: valueColor,
              },
              grid: gridStyles,
            }}
            label={yText}
            dependentAxis
          />

          <VictoryAxis
            fixLabelOverlap={fixLabelOverlap}
            tickLabelComponent={
              <VictoryLabel
                angle={labelAngle}
                textAnchor={labelAngle === 0 ? "middle" : "start"}
                verticalAnchor="middle"
              />
            }
            style={{
              axis: { stroke: "#000" },
              axisLabel: {
                ...styles.xText,
                fill: styles.xText.color,
                padding: labelPadding,
              },
              ticks: { stroke: "#000" },
              tickLabels: {
                fill: labelColor,
                padding: 10,
              },
              grid: gridStyles,
            }}
            label={xText}
          />

          <VictoryBar
            data={data}
            barWidth={valueOfPercentage}
            x="label"
            y="value"
            animate={{
              onLoad: {
                duration: 500,
                before: () => ({
                  _y: 0,
                }),
              },
            }}
            style={{
              data: { fill: "url(#gradient)" },
              labels: {
                opacity: 0,
              },
            }}
          />
        </VictoryChart>
      </View>
    </View>
  );
};

export default NCBarChart;
