import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { formatCurrency } from '../utils/currency';

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

export const CategoryPieChart = ({ data }) => {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value.percentage || 0,
    amount: value.amount || 0,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No data to display</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}%`} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const MonthlyBarChart = ({ transactions }) => {
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthName, amount: 0 };
    }
    acc[monthKey].amount += transaction.amount;
    return acc;
  }, {});

  const chartData = Object.values(monthlyData).slice(-6); // Last 6 months

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>No data to display</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
        <XAxis dataKey="month" stroke="#6b7280" className="dark:stroke-gray-400" />
        <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
        <Tooltip 
          formatter={(value) => formatCurrency(value)}
          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          className="dark:bg-gray-800 dark:border-gray-700"
        />
        <Legend />
        <Bar dataKey="amount" fill="#0ea5e9" name="Spending" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const CategoryBarChart = ({ data }) => {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    amount: value.amount || 0,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>No data to display</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
        <XAxis dataKey="name" stroke="#6b7280" className="dark:stroke-gray-400" />
        <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
        <Tooltip 
          formatter={(value) => formatCurrency(value)}
          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          className="dark:bg-gray-800 dark:border-gray-700"
        />
        <Legend />
        <Bar dataKey="amount" fill="#8b5cf6" name="Amount" />
      </BarChart>
    </ResponsiveContainer>
  );
};

