
import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    if (token) {
      fetchBookings();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const isJson = res.headers.get('content-type')?.includes('application/json');
      if (!isJson) {
        const text = await res.text();
        console.error('Login Error: Expected JSON, got HTML/text:', res.url, text.substring(0, 200));
        throw new Error('Server returned HTML or non-JSON format. Is the backend deployed and accessible?');
      }

      if (!res.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await res.json();
      setToken(data.token);
      localStorage.setItem('adminToken', data.token);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const isJson = res.headers.get('content-type')?.includes('application/json');
      if (!isJson) {
        const text = await res.text();
        console.error('Fetch Bookings Error: Expected JSON, got HTML/text:', res.url, text.substring(0, 200));
        throw new Error('Invalid server response format. Received HTML instead of JSON.');
      }
      
      if (!res.ok) throw new Error('Failed to fetch bookings');

      const data = await res.json();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to loaded bookings');
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      const isJson = res.headers.get('content-type')?.includes('application/json');
      if (!isJson) {
        const text = await res.text();
        console.error('Update Status Error: Expected JSON, got HTML/text:', res.url, text.substring(0, 200));
        throw new Error('Invalid server response format. Received HTML instead of JSON.');
      }
      
      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status: status as any } : b));
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err: any) {
      console.error('Failed to update status:', err);
      alert(err.message || 'Failed to update status');
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const isJson = res.headers.get('content-type')?.includes('application/json');
      if (!isJson) {
        const text = await res.text();
        console.error('Delete Booking Error: Expected JSON, got HTML/text:', res.url, text.substring(0, 200));
        throw new Error('Invalid server response format. Received HTML instead of JSON.');
      }
      
      if (res.ok) {
        setBookings(prev => prev.filter(b => b._id !== id));
      } else {
        throw new Error('Failed to delete booking');
      }
    } catch (err: any) {
      console.error('Failed to delete booking:', err);
      alert(err.message || 'Failed to delete booking');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={handleLogin} className="p-8 bg-white shadow-md rounded">
          <h2 className="text-2xl mb-4">Admin Login</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <input
            className="w-full mb-4 p-2 border"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            className="w-full mb-4 p-2 border"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  const filteredBookings = bookings.filter((b: any) => {
    const matchesSearch = b.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = filterDate ? b.date?.startsWith(filterDate) : true;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full max-w-sm"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Guests</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b: any) => (
              <tr key={b._id} className="text-center">
                <td className="border p-2">{b.name}</td>
                <td className="border p-2">{b.email}</td>
                <td className="border p-2">{b.date}</td>
                <td className="border p-2">{b.time}</td>
                <td className="border p-2">{b.guests}</td>
                <td className="border p-2 flex gap-2 justify-center items-center">
                  <select 
                    value={b.status} 
                    onChange={(e) => updateStatus(b._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="border p-2">
                  <button 
                    onClick={() => deleteBooking(b._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan={7} className="border p-4 text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
