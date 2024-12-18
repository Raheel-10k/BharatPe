function BalanceCard({ balance }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Total Balance</h3>
      <p className="text-2xl font-bold">₹{balance}</p>
    </div>
  );
}

export default BalanceCard;