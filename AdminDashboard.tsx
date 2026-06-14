import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, Trash2, XCircle, LogOut } from 'lucide-react';

interface Booking {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  guests: number;
  date: string;
  time: string;
  message?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  paymentStatus?: 'Pending' | 'Paid' | 'Failed';
  paymentId?: string;
  orderId?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchBookings();
      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        fetchBookings();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setToken(data.token);
      localStorage.setItem('adminToken', data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
      if ((err as Error).message.includes('token') || (err as Error).message.includes('Unauthorized')) {
         handleLogout();
      }
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status: status as any } : b));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setBookings(prev => prev.filter(b => b._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900 font-serif">Admin Login</h2>
            <p className="mt-2 text-center text-sm text-gray-600">Sign in to manage reservations</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard View
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const todayCount = bookings.filter(b => new Date(b.date).toDateString() === new Date().toDateString()).length;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm) ||
      (b.email && b.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDate = filterDate ? b.date === filterDate : true;
    
    return matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex px-2 py-4">
              <span className="text-xl font-serif font-bold text-gray-900">Two Hearts Cafe Admin</span>
            </div>
            <div className="flex items-center">
              <button onClick={handleLogout} className="flex items-center text-gray-500 hover:text-gray-700">
                <LogOut className="w-5 h-5 mr-2"/> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                    <dd className="text-3xl font-semibold text-gray-900">{bookings.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Requests</dt>
                    <dd className="text-3xl font-semibold text-gray-900">{pendingCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Today's Reservations</dt>
                    <dd className="text-3xl font-semibold text-gray-900">{todayCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Reservations</h3>
              <div className="flex gap-4 items-center w-full sm:w-auto">
                <input 
                  type="text" 
                  placeholder="Search by name, phone or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm w-full sm:w-64"
                />
                <input 
                  type="date" 
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                />
                <button onClick={fetchBookings} className="text-sm font-medium text-brand-primary hover:text-brand-secondary bg-gray-50 px-3 py-2 border border-gray-200 rounded-md">Refresh</button>
              </div>
            </div>
            <ul className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <li key={booking._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-brand-primary uppercase tracking-wider">
                          {new Date(booking.date).toLocaleDateString()} at {booking.time}
                        </p>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-medium text-gray-900">{booking.name}</p>
                          <p className="text-sm text-gray-500">{booking.phone} • {booking.email}</p>
                          <p className="text-sm text-gray-500 mt-1">{booking.guests} Guests</p>
                          {booking.paymentStatus && (
                            <div className="mt-1">
                              <span className={`px-2 inline-flex text-[10px] uppercase font-bold tracking-wider rounded-md
                                ${booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                Payment: {booking.paymentStatus}
                              </span>
                              {booking.paymentId && <span className="text-xs text-gray-400 ml-2">ID: {booking.paymentId}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                      {booking.message && (
                        <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded italic">
                          "{booking.message}"
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">Requested on: {new Date(booking.createdAt).toLocaleString()}</p>
                    </div>
                    
                    <div className="flex sm:flex-col gap-2 justify-end">
                      {booking.status !== 'Confirmed' && (
                        <button onClick={() => updateStatus(booking._id, 'Confirmed')} className="flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 transition-colors">
                          <CheckCircle className="w-4 h-4 mr-1" /> Confirm
                        </button>
                      )}
                      {booking.status !== 'Cancelled' && (
                        <button onClick={() => updateStatus(booking._id, 'Cancelled')} className="flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 transition-colors">
                          <XCircle className="w-4 h-4 mr-1" /> Cancel
                        </button>
                      )}
                      <button onClick={() => deleteBooking(booking._id)} className="flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors">
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
              {filteredBookings.length === 0 && (
                <li className="p-8 text-center text-gray-500">No reservations found.</li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
