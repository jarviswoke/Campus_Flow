import React, { useState } from 'react'
import { useContext } from 'react';
import {useNavigate} from 'react-router-dom';
const LoginPage = () => {
  const Navigate=useNavigate();
//const {loginUser}=useContext(AuthContext);

const[currState, setcurrState]=useState("Sign Up")
  const[name, setName]=useState("");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[loading, setLoading]=useState(false);
const[registerAs,setRegisterAs]=useState("");


const handleAuth = async () => {
    setLoading(true);
    const url = currState === "Sign Up" ? "http://localhost:5000/api/user/signup" : "http://localhost:5000/api/user/login";
    const body = currState === "Sign Up" ? { name, email, password } : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        loginUser(data.userData, data.token);
        //Navigate("/upload"); // redirect after login/signup
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

  const onSubmitHandler=(event)=>{
  event.preventDefault();
  handleAuth();


  } 
  return (
    <div className="min-h-screen flex flex-col gap-8 items-center bg-slate-50">
<div className="flex justify-between my-0 items-center bg-white sticky top-0 z-50 max-w-7xl px-6 py-3 min-w-screen " >
        <div className="flex gap-2 items-center">
            <p className="text-gray-700 text-lg  font-bold">Campus_FLow</p>
        </div>

        <div className="flex gap-6 items-center ">
     <button onClick={()=>Navigate("/")}
            className="bg-violet-600 text-white-500 rounded-md px-4 py-2 hover:bg-violet-500 cursor-pointer transition border-rounded">Home</button>

        </div>
    </div>

      <form onSubmit={onSubmitHandler}
       className="bg-white rounded-lg shadow-md px-8 py-8 flex flex-col gap-6 hover:shadow-lg cursor-pointer transition">
        <h1 className=" font-md font-bold text-xl text-gray-700">{currState}</h1>
        {
          currState === 'Sign Up' && (
            
            <input onChange={(e)=>setName(e.target.value)} type="text" placeholder='Full Name' value={name}  className="w-full mb-4 px-3 py-2 border border-gray-200 ronded-md hover:cursor-pointer transition"/>

            
          )
        }
        
      
        
        <input onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='Email' value={email}  className="w-full mb-4 px-3 py-2 border border-gray-200 ronded-md hover:cursor-pointer transition"/>
        <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='Password' value={password}  className="w-full mb-4 px-3 py-2 border border-gray-200 ronded-md hover:cursor-pointer transition"/>
        <input onChange={(e)=>setRegisterAs(e.target.value)} type="text" placeholder='Register As' value={registerAs}  className="w-full mb-4 px-3 py-2 border border-gray-200 ronded-md hover: transition"/>

      
<button type="submit" className="mt-8 rounded-md  bg-violet-600 text-white px-8 py-3 hover:bg-violet-500 cursor-pointer transition">
  { loading ? "processing.." : currState==="Sign Up" ? "Create Account" : "Login"}
</button>
<div className="flex flex-col gap-2">
  {
    currState === "Sign Up" ? (
      <p className="text-sm text-gray-700">Already Have an Account? <span
      onClick={()=>{setcurrState("Login")}}
      className="font-medium text-violet-500 cursor-pointer">Login Here</span></p>
    ) : (
      <p className="text-sm text-gray-700">Create an account.<span
      onClick={()=>setcurrState("Sign Up")}
      className="font-medium text-violet-500 cursor-pointer">Click Here</span></p>
    )
  } 
</div>
  

      </form>

      
    </div>
  )
}

export default LoginPage