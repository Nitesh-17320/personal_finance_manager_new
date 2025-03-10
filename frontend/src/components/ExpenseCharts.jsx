import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const ExpenseCharts = ({ expenses }) => {
  // Group expenses by category
  const categoryData = expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) acc[category] = 0;
    acc[category] += Number(expense.amount);
    return acc;
  }, {});

  const pieChartData = Object.keys(categoryData).map((category, index) => ({
    name: category,
    value: categoryData[category],
    color: COLORS[index % COLORS.length],
  }));

  // Group expenses by month
  const monthlyData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString("default", { month: "short" });
    if (!acc[month]) acc[month] = 0;
    acc[month] += Number(expense.amount);
    return acc;
  }, {});

  const barChartData = Object.keys(monthlyData).map((month) => ({
    name: month,
    amount: monthlyData[month],
  }));

  return (
    <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", marginTop: "30px" }}>
      {/* Pie Chart */}
      <div>
        <h3>Expense Breakdown by Category</h3>
        <PieChart width={300} height={300}>
          <Pie data={pieChartData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Bar Chart */}
      <div>
        <h3>Monthly Expenses</h3>
        <BarChart width={400} height={300} data={barChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#82ca9d" />
        </BarChart>
      </div>

      {/* Line Chart (Spending Trends) */}
      <div>
        <h3>Spending Trends Over Time</h3>
        <LineChart width={400} height={300} data={barChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#FF8042" />
        </LineChart>
      </div>
    </div>
  );
};

export default ExpenseCharts;
