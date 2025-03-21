import React ,{useState,useEffect,useRef}from "react";
import ReactECharts from "echarts-for-react";

type DataPoint = {
  status: number;  // 1 = On, 0 = Off
  setTemp?: number; // Temperature value (undefined if status is 0)
};

type TemperatureChartProps = {
  dataPoints:[]; // Data passed from the parent
  title: string; // Title for the chart
};

const TemperatureChart: React.FC<TemperatureChartProps> = ({ dataPoints, title }) => {
  // Generate X-axis time intervals (from 00:00 to 23:45)

  const chartRef = useRef<ReactECharts>(null); // Create a ref to store the ECharts instance

  useEffect(() => {
    // Resize the chart when the window resizes or when the component mounts
    if (chartRef.current) {
      const chartInstance = chartRef.current.getEchartsInstance(); // Get the ECharts instance
      if (chartInstance) {
        chartInstance.resize(); // Call the resize method on the instance
      }
    }
  }, [dataPoints]);

  const timesIn24HrFormat:any = dataPoints;
 

  // Process data for series
  const setTempData:any = timesIn24HrFormat.map((item:any) => {
    const point = parseInt(item.status)
    return point === 1 ? parseFloat(item.setTemp) : null;
  });

  const redDotData:any = timesIn24HrFormat.map((item:any) => {
    const point = parseInt(item.status);
    return point === 0 ? 20 : null; // Fixed Y value for red dots when status is 0
  });
  // Chart options with dark theme

 const option = {
  title: {
    text: title,
    left: "center",
    textStyle: {
      color: "black",
    },
  },
  tooltip: {
    trigger: "axis",
    formatter: (params: any) => {
      const dataIndex = params[0].dataIndex;
      const point = timesIn24HrFormat[dataIndex];
      if (parseInt(point.status) === 0) {
        return `Time: ${timesIn24HrFormat[dataIndex].time}<br>Status: OFF`;
      }
      else if (parseInt(point.status) === 1) {
        return `Time: ${timesIn24HrFormat[dataIndex].time}<br>Status: ON <br> Temperature: ${point.setTemp}°C`;
      }
      return "No Data";
    },
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data:timesIn24HrFormat.map(({time}:any)=>{return time}) ,
    name: "Time",
    axisLine: { lineStyle: { color: "black" } },
    axisLabel: { color: "black" },
  },
  yAxis: {
    type: "value",
    min: 15,
    max: 30,
    name: "Temperature (°C)",
    axisLine: { lineStyle: { color: "black" } },
    axisLabel: { color: "black" },
  },

  series: [
    {
      name: "Temperature",
      type: "line",
      data: setTempData,
      smooth: true,
      itemStyle: {
        color: "#008675",
      },
    },
    {
      name: "Status: OFF",
      type: "scatter",
      data: redDotData,
      symbol: "circle",
      symbolSize: 10,
      itemStyle: {
        color: "red",
      },
    },
  ],
 };

  return <ReactECharts option={option} ref={chartRef}  style={{ width: "100%", height: "400px" }}/>;
};

export default TemperatureChart;
