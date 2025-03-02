import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
} from "@mui/material";
import { Logout, Delete, Edit } from "@mui/icons-material";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
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
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleAddExpense = async () => {
    try {
      const newExpense = { userId, title, amount, category, date };
      const response = await axios.post("http://localhost:5000/api/expenses/add", newExpense);
      
      if (response.status === 201) {
        setExpenses([...expenses, response.data]);
        setTitle("");
        setAmount("");
        setCategory("");
        setDate("");
      } else {
        console.error("Failed to add expense:", response.data.message);
      }
    } catch (error) {
      console.error("Add Expense Error:", error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses(expenses.filter((expense) => expense._id !== id));
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
  };

  const handleUpdateExpense = async () => {
    try {
      await axios.put(`http://localhost:5000/api/expenses/${editingId}`, { title, amount, category, date });
      
      setExpenses(expenses.map((expense) => (expense._id === editingId ? { ...expense, title, amount, category, date } : expense)));
      setEditingId(null);
      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
    } catch (error) {
      console.error("Update Expense Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

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
        <Typography variant="h4" gutterBottom>
          Hello, {userName}
        </Typography>

        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6">{editingId ? "Edit Expense" : "Add Expense"}</Typography>
          <TextField label="Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mt: 2 }} />
          <TextField label="Amount" type="number" fullWidth value={amount} onChange={(e) => setAmount(e.target.value)} sx={{ mt: 2 }} />
          <TextField label="Category" fullWidth value={category} onChange={(e) => setCategory(e.target.value)} sx={{ mt: 2 }} />
          <TextField type="date" fullWidth value={date} onChange={(e) => setDate(e.target.value)} sx={{ mt: 2 }} />
          {editingId ? (
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleUpdateExpense}>
              Update Expense
            </Button>
          ) : (
            <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={handleAddExpense}>
              Add Expense
            </Button>
          )}
        </Paper>

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
              {expenses.map((expense) => (
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
      </Container>
    </>
  );
};

export default Dashboard;
