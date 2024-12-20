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
} from '@mui/material';

const LoanManagement = () => {
  const [loans, setLoans] = useState([]);
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await axios.get('/api/loans');
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const handleCreateLoan = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/loans/admin/create', {
        amount: parseFloat(amount),
        interest_rate: parseFloat(interestRate),
        duration: parseInt(duration),
      });
      fetchLoans();
      // Reset form
      setAmount('');
      setInterestRate('');
      setDuration('');
    } catch (error) {
      console.error('Error creating loan:', error);
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
            Create New Loan
          </Typography>
          <form onSubmit={handleCreateLoan}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <TextField
                label="Interest Rate (%)"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                required
              />
              <TextField
                label="Duration (months)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
              <Button variant="contained" type="submit">
                Create Loan
              </Button>
            </Box>
          </form>
        </Paper>

        {/* Loans Table */}
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Loan ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Interest Rate</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>EMI per Month</TableCell>
                <TableCell>Total Payback</TableCell>
                <TableCell>Remaining Amount</TableCell>
                <TableCell>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.LoanId}>
                  <TableCell>{loan.LoanId}</TableCell>
                  <TableCell>{loan.Amount}</TableCell>
                  <TableCell>{loan.interestRate}%</TableCell>
                  <TableCell>{loan.Duration}</TableCell>
                  <TableCell>{loan.EMIperMonth.toFixed(2)}</TableCell>
                  <TableCell>{loan.PayBack.toFixed(2)}</TableCell>
                  <TableCell>{loan.RemainingAmount.toFixed(2)}</TableCell>
                  <TableCell>{loan.LoanType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoanManagement;
