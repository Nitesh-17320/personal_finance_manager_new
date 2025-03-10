import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ExpenseCharts from "../components/ExpenseCharts";
import {
  Button,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Box,
  Collapse,
} from "@mui/material";
import { Logout, Delete, Edit, FilterList, AddCircle, BarChart } from "@mui/icons-material";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterAmount, setFilterAmount] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [totalMonthlyExpense, setTotalMonthlyExpense] = useState(0);


  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserName(storedUser.name);
      setUserId(storedUser._id);
      fetchExpenses(storedUser._id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchExpenses = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/expenses/${userId}`);
      setExpenses(res.data);
      setFilteredExpenses(res.data);
      calculateTotalMonthlyExpense(res.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleAddExpense = async () => {
    if (!title || !amount || !category || !date) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const newExpense = { userId, title, amount, category, date };
      const response = await axios.post("http://localhost:5000/api/expenses/add", newExpense);

      if (response.status === 201) {
        const updatedExpenses = [...expenses, response.data];
        setExpenses(updatedExpenses);
        setFilteredExpenses(updatedExpenses);
        setTitle("");
        setAmount("");
        setCategory("");
        setDate("");
        setShowAddExpense(false);
      } else {
        console.error("Failed to add expense:", response.data.message);
      }
    } catch (error) {
      console.error("Add Expense Error:", error);
    }
  };
  const calculateTotalMonthlyExpense = (expenses) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const total = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
    setTotalMonthlyExpense(total);
  };
  

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      const updatedExpenses = expenses.filter((expense) => expense._id !== id);
      setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);
    } catch (error) {
      console.error("Delete Expense Error:", error);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingId(expense._id);
    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category);
    setDate(expense.date.split("T")[0]);
    setShowAddExpense(true);
  };

  const handleUpdateExpense = async () => {
    try {
      await axios.put(`http://localhost:5000/api/expenses/${editingId}`, { title, amount, category, date });

      const updatedExpenses = expenses.map((expense) =>
        expense._id === editingId ? { ...expense, title, amount, category, date } : expense
      );

      setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);
      setEditingId(null);
      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
      setShowAddExpense(false);
    } catch (error) {
      console.error("Update Expense Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    let filtered = expenses;

    if (filterDate) {
      filtered = filtered.filter((expense) => expense.date.startsWith(filterDate));
    }

    if (filterAmount) {
      filtered = filtered.filter((expense) => Number(expense.amount) === Number(filterAmount));
    }

    setFilteredExpenses(filtered);
  }, [filterDate, filterAmount, expenses]);

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Personal Finance Manager</Typography>
          <Button variant="contained" color="secondary" startIcon={<Logout />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
             Total Expense: ₹{totalMonthlyExpense}
        </Typography>

        <Typography variant="h4" gutterBottom>
          Hello, {userName}
        </Typography>

        {/* Buttons for Add Expense, Filter, and Graph */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircle />}
            sx={{ flex: 1 }}
            onClick={() => setShowAddExpense(!showAddExpense)}
          >
            {showAddExpense ? "Close Form" : "Add Expense"}
          </Button>

          <Button variant="contained" color="primary" sx={{ flex: 1 }} startIcon={<FilterList />} onClick={() => setShowFilter(!showFilter)}>
            {showFilter ? "Close Filter" : "Filter"}
          </Button>

          {/* New Graph Button */}
          <Button
            variant="contained"
            color="success"
            startIcon={<BarChart />}
            sx={{ flex: 1 }}
            onClick={() => setShowGraph(!showGraph)}
          >
            {showGraph ? "Hide Graph" : "Show Graph"}
          </Button>
        </Box>
        <Collapse in={showFilter}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6">Filter Expenses</Typography>
            <TextField label="Filter by Date" type="date" fullWidth value={filterDate} onChange={(e) => setFilterDate(e.target.value)} sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} />
            <TextField label="Filter by Amount" type="number" fullWidth value={filterAmount} onChange={(e) => setFilterAmount(e.target.value)} sx={{ mt: 2 }} />
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => { setFilterDate(""); setFilterAmount(""); setFilteredExpenses(expenses); }}>
              Clear Filters
            </Button>
          </Paper>
        </Collapse>

        {/* Add Expense Form */}
        <Collapse in={showAddExpense}>
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6">{editingId ? "Edit Expense" : "Add Expense"}</Typography>
            <TextField label="Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mt: 2 }} />
            <TextField label="Amount" type="number" fullWidth value={amount} onChange={(e) => setAmount(e.target.value)} sx={{ mt: 2 }} />
            <TextField label="Category" fullWidth value={category} onChange={(e) => setCategory(e.target.value)} sx={{ mt: 2 }} />
            <TextField type="date" fullWidth value={date} onChange={(e) => setDate(e.target.value)} sx={{ mt: 2 }} />
            <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={editingId ? handleUpdateExpense : handleAddExpense}>
              {editingId ? "Update Expense" : "Save Expense"}
            </Button>
          </Paper>
        </Collapse>

        {/* Expense Table */}
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Amount (₹)</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditExpense(expense)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteExpense(expense._id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Graph Display */}
        {showGraph && <ExpenseCharts expenses={filteredExpenses} />}
      </Container>
    </>
  );
};

export default Dashboard;
