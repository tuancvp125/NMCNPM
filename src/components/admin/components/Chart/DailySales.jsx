import React, { useEffect } from "react";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "./DailySales.css";
import { API_URL } from "../../../../constant";

import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    Tooltip,
    Filler,
    CategoryScale,
  } from "chart.js";
  
  // Đăng ký các thành phần cần thiết cho biểu đồ Line
  ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Filler, CategoryScale);
  const days =[];

  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date.toISOString().split("T")[0]); // YYYY-MM-DD
  }
    

const DailyChart = () => {
  const [orders, setOrders] = useState([]);
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get(
        `${API_URL}/admin/orders/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(res.data);

    } catch (error) {
      console.error("Error in dailysale:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  function calculateSales(orders, days) {
    const sales = days.map((day) => {
      const ordersForDay = orders.filter(
        (order) => order.orderDate === day
      );
      return ordersForDay.reduce((sum, order) => {
        return (
          sum +
          order.orderItems.reduce((itemSum, item) => itemSum + item.quantity, 0)
        );
      }, 0);
    });
    return sales;
  }

  const salesData = calculateSales(orders, days);
  console.log(salesData);
  const data = {
    labels: days,
    datasets: [
      {
        label: "Doanh số ",
        data: salesData, // Dữ liệu của bạn
        borderColor: "#fff",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        pointBackgroundColor: "#fff",
        pointBorderColor: "#fff",
        tension: 0.4, // Đường cong mượt
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Ẩn chú thích
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Ẩn đường lưới dọc
        },
        ticks: {
          color: "#fff", // Màu chữ trục x
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Đường lưới ngang
        },
        ticks: {
          color: "#fff", // Màu chữ trục y
          stepSize: 5, // Khoảng cách giữa các giá trị
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <div className="chart-title">Doanh số 7 ngày gần nhất</div>
      <div className="chart">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default DailyChart;
