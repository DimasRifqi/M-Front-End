import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { useState, useEffect } from 'react';
import { addUser, getUserByName } from './utils/indexedDB';
import UserTable from './components/UserTable'; 

function App() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedStatus = localStorage.getItem('isLoggedIn');
    if (storedStatus === 'true') {
      setIsLoggedIn(true);
      navigate('/users');
    }
  }, [navigate]);

  const handleLogin = async () => {
  const user = await getUserByName(name);

  if (user && user.password === password) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', name); 
    navigate('/users'); 
    setIsLoggedIn(true);
    setError('');
  } else {
    setError('Invalid credentials');
  }
};

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setName('');
    setPassword('');
    navigate('/'); 
  };

  const handleRegister = async () => {
    const user = await getUserByName(name);
    if (user) {
      setError('User already exists');
    } else {
      await addUser(name, password);
      setError('User registered successfully');
    }
  };

  return (
    <div className="max-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">{isLoggedIn ? 'Welcome!' : 'Login'}</h1>
            </div>
            {!isLoggedIn ? (
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  {error && <p className="text-red-500">{error}</p>}
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Name"
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Name
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Password"
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative space-y-2">
                    <button
                      onClick={handleLogin}
                      className="bg-cyan-500 text-white rounded-md px-2 py-1"
                    >
                      Submit
                    </button>
                    <button
                      onClick={handleRegister}
                      className="bg-green-500 text-white rounded-md px-2 py-1"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-4">You are logged in!</p>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white rounded-md px-2 py-1"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/users" element={<UserTable />} />
      </Routes>
    </Router>
  );
}
