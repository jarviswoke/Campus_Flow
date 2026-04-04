import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const [currState, setCurrState] = useState("Sign Up")
  const [collegeId, setCollegeId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerAs, setRegisterAs] = useState("");

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  const handleAuth = async () => {
    setLoading(true);
    const url = currState === "Sign Up"
      ? `${BACKEND_URL}/api/auth/register`
      : `${BACKEND_URL}/api/auth/login`;
    const body = currState === "Sign Up"
      ? {
          college_id: collegeId,
          email,
          password,
          full_name: name,
          user_type: registerAs || 'student',
        }
      : {
          college_id: collegeId,
          password,
        };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || data.message || "Auth failed");
        return;
      }

      if (currState === "Sign Up") {
        alert(data.message || "Registration successful");
        setCurrState("Login");
        return;
      }

      if (data.access_token) localStorage.setItem('token', data.access_token);
      if (data.user) localStorage.setItem('userData', JSON.stringify(data.user));

      const role = (data.user?.user_type || registerAs || 'student').toLowerCase();
      localStorage.setItem('role', role);

      if (role === 'faculty') {
        navigate('/faculty');
      } else if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    handleAuth();
  }

  return (
    <div className="min-h-screen flex flex-col gap-8 items-center justify-center bg-slate-50">

      <form onSubmit={onSubmitHandler}
        className="bg-white rounded-lg shadow-md px-8 py-8 flex flex-col gap-6 hover:shadow-lg transition w-full max-w-md">
        <div className="text-center mb-2">
          <p className="text-gray-700 text-lg font-bold">Campus Flow</p>
        </div>
        <h1 className="font-md font-bold text-xl text-gray-700">{currState}</h1>
        <input
          onChange={(e) => setCollegeId(e.target.value)}
          type="text"
          placeholder='College ID'
          value={collegeId}
          className="w-full px-3 py-2 border border-gray-200 rounded-md transition"
        />

        {currState === 'Sign Up' && (
          <>
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder='Full Name'
              value={name}
              className="w-full px-3 py-2 border border-gray-200 rounded-md transition"
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder='Email'
              value={email}
              className="w-full px-3 py-2 border border-gray-200 rounded-md transition"
            />
          </>
        )}

        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder='Password'
          value={password}
          className="w-full px-3 py-2 border border-gray-200 rounded-md transition"
        />

        {/* Role selector */}
        <select
          value={registerAs}
          onChange={(e) => setRegisterAs(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-md transition text-gray-700"
        >
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" className="mt-4 rounded-md bg-violet-600 text-white px-8 py-3 hover:bg-violet-500 cursor-pointer transition">
          {loading ? "Processing..." : currState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <div className="flex flex-col gap-2">
          {
            currState === "Sign Up" ? (
              <p className="text-sm text-gray-700">Already have an account? <span
                onClick={() => { setCurrState("Login") }}
                className="font-medium text-violet-500 cursor-pointer">Login Here</span></p>
            ) : (
              <p className="text-sm text-gray-700">Create an account. <span
                onClick={() => setCurrState("Sign Up")}
                className="font-medium text-violet-500 cursor-pointer">Click Here</span></p>
            )
          }
        </div>
      </form>
    </div>
  )
}

export default LoginPage