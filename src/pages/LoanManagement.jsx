import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Container,
  Alert,
  Snackbar
} from '@mui/material';

const LoanManagement = () => {
  const [loans, setLoans] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    interestRate: '',
    duration: ''
  });
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await axios.get('/api/loans');
      setLoans(response.data);
    } catch (error) {
      showAlert('Error fetching loans', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showAlert = (message, severity = 'success') => {
    setAlert({
      open: true,
      message,
      severity
    });
  };

  const handleCreateLoan = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/loans/admin/create', {
        Amount: parseFloat(formData.amount),
        interestRate: parseFloat(formData.interestRate),
        Duration: parseInt(formData.duration)
      });
      
      showAlert('Loan created successfully');
      fetchLoans();
      // Reset form
      setFormData({
        amount: '',
        interestRate: '',
        duration: ''
      });
    } catch (error) {
      showAlert(error.response?.data?.message || 'Error creating loan', 'error');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Loan Management
        </Typography>

        {/* Create Loan Form */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Create Pre-approved Loan
          </Typography>
          <form onSubmit={handleCreateLoan}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                label="Interest Rate (%)"
                type="number"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                label="Duration (months)"
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <Button 
                variant="contained" 
                type="submit"
                sx={{ minWidth: '150px' }}
              >
                Create Loan
              </Button>
            </Box>
          </form>
        </Paper>

        {/* Loans Table */}
        <Paper sx={{ overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Loan ID</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Interest Rate</TableCell>
                <TableCell align="right">Duration</TableCell>
                <TableCell align="right">EMI per Month</TableCell>
                <TableCell align="right">Total Payback</TableCell>
                <TableCell align="right">Remaining</TableCell>
                <TableCell>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.LoanId}>
                  <TableCell>{loan.LoanId}</TableCell>
                  <TableCell align="right">₹{loan.Amount.toLocaleString()}</TableCell>
                  <TableCell align="right">{loan.interestRate}%</TableCell>
                  <TableCell align="right">{loan.Duration}</TableCell>
                  <TableCell align="right">₹{loan.EMIperMonth.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</TableCell>
                  <TableCell align="right">₹{loan.PayBack.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</TableCell>
                  <TableCell align="right">₹{loan.RemainingAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</TableCell>
                  <TableCell>{loan.LoanType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setAlert(prev => ({ ...prev, open: false }))} 
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoanManagement;
