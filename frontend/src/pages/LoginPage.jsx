import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const [currState, setCurrState] = useState("Sign Up")
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerAs, setRegisterAs] = useState("");

  const handleAuth = async () => {
    setLoading(true);
    const url = currState === "Sign Up" ? "http://localhost:5000/api/user/signup" : "http://localhost:5000/api/user/login";
    const body = currState === "Sign Up" ? { name, email, password, registerAs } : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        // Store user data and token
        if (data.token) localStorage.setItem('token', data.token);
        if (data.userData) localStorage.setItem('userData', JSON.stringify(data.userData));

        // Determine role and store it
        const role = (registerAs || data.userData?.role || 'student').toLowerCase();
        localStorage.setItem('role', role);

        // Role-based redirect
        if (role === 'faculty') {
          navigate('/faculty');
        } else if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert(data.message);
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
        {
          currState === 'Sign Up' && (
            <input onChange={(e) => setName(e.target.value)} type="text" placeholder='Full Name' value={name} className="w-full px-3 py-2 border border-gray-200 rounded-md transition" />
          )
        }

        <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Email' value={email} className="w-full px-3 py-2 border border-gray-200 rounded-md transition" />
        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' value={password} className="w-full px-3 py-2 border border-gray-200 rounded-md transition" />

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