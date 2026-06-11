import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Authentication() {
  const [tab, setTab] = useState('login');
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState('');
  const [regRole, setRegRole] = useState('student');
  const fullText = "Academic Excellence & Career Pathways.";

  React.useEffect(() => {
    let index = 0;
    setDisplayText('');
    const interval = setInterval(() => {
      setDisplayText((prev) => prev + fullText.charAt(index));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const handleAccessPortal = async (e) => {
    e.preventDefault();
    try {
      const emailInput = document.getElementById('login-email').value;
      const passwordInput = document.getElementById('login-password').value;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput,
      });

      if (error) {
        alert(error.message);
        return;
      }

      // Fetch user profile to get their role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        const userRole = data.user.user_metadata?.role || 'student';
        localStorage.setItem('role', userRole);
        if (userRole === 'company') {
          navigate('/company/dashboard');
        } else if (userRole === 'supervisor') {
          navigate('/supervisor/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        localStorage.setItem('role', profile.role);
        if (profile.role === 'company') {
          navigate('/company/dashboard');
        } else if (profile.role === 'supervisor') {
          navigate('/supervisor/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login Error: ' + (err.message || 'Connection failed. Please ensure VITE_SUPABASE_URL is correct and your Supabase service is active.'));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const firstName = document.getElementById('reg-fname').value;
    const lastName = document.getElementById('reg-lname').value;
    const matricNumber = regRole === 'student' ? document.getElementById('reg-id').value : '';
    const department = regRole === 'supervisor' ? document.getElementById('reg-dept').value : '';
    const companyName = regRole === 'company' ? document.getElementById('reg-company').value : '';

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: regRole,
          matric_number: matricNumber,
          department: department,
          company_name: companyName
        }
      }
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert('Registration successful! You can now log in.');
    setTab('login');
  };

  return (
    <div className="bg-surface-dim text-on-surface font-body-md antialiased min-h-screen flex flex-col md:flex-row w-full">
      {/* Left Branding Panel (Hidden on mobile) */}
      <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative bg-surface-variant flex-col justify-between overflow-hidden min-h-screen">
        <div className="absolute inset-0 z-0">
          <img 
            alt="University Campus Background" 
            className="w-full h-full object-cover opacity-35 grayscale mix-blend-multiply transition-transform duration-10000 hover:scale-105" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9T0ueNty00KYovGVm0njX3pErIGPSYRPA4xBYNNKueQWPvyImk5jdyxVb3Emb86PKjJ3NbtRFi2p-zedUZRLTm12si9xglaY6OHeXLgmOhcAnfM8Z1s7pqoRFYC7eR5sL9VHuSTq3fhGpZgE4CpyQCRjxTdkQ2HT43qPDOQPbz6MgISOKhhPMuG62z2iU-IWSZEV6WR46wLoArf-nhpSiuBts0FzOqcraOvxPnqURP6BTdjP6M8lHX2dfUd6Mk90R95BtMhpjxg" 
          />
        </div>
        <div className="absolute inset-0 bg-primary opacity-85 z-10 mix-blend-multiply"></div>
        <div className="relative z-20 p-12 lg:p-16 flex flex-col h-full justify-center items-center text-center min-h-[600px] w-full">
          <div className="max-w-xl flex flex-col items-center justify-center">
            <h2 className="font-h1 text-h1 lg:text-5xl text-white leading-tight serif font-bold tracking-wide min-h-[120px] md:min-h-[160px] lg:min-h-[200px]">
              {displayText}
              <span className="animate-pulse border-r-2 border-white ml-1"></span>
            </h2>
            <p className="font-body-lg text-body-lg lg:text-xl text-surface-variant/90 mt-8 leading-relaxed max-w-md">
              Access the Virtual Internship Portal to connect with premier industry partners and track your professional journey.
            </p>
          </div>
        </div>
      </div>

      {/* Right Authentication Panel */}
      <div className="w-full md:w-7/12 lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-16 min-h-screen bg-surface-dim relative z-10">
        <div className="w-full max-w-lg bg-surface-container-lowest p-8 md:p-12 lg:p-14 border border-outline-variant/60 rounded-DEFAULT shadow-lg relative overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="flex mb-6 justify-center">
            <img 
              alt="UTM Logo" 
              className="h-14 w-auto object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHf0LQLgkC3OE7wczigkr4yk6zLl0Mez56az_4D7JFeqFIgMKZMM1e79fkJM_AA-WM07hZtG0BTSMUjBCod7TvjN6R3LGGRUgud-sPiJdR3V866BKUDVkCrWUTOS1nJNjbsS9nl1kF9aCqiwM-Rnw1jQKjPDmNyQdqnkOJRJc76Jgvrid26ZbvLAfHGa-5toEnwsAweklk8GzhE-zAxr_nb__bY0uErL4v1lXXr9Cqig8mGBDlfps7OusRxgxJImJNJePCmm4k-A" 
            />
          </div>
          {/* Warm Amber vertical accent */}
          <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-secondary-container"></div>
          <div className="text-center mb-10">
            <h2 className="font-h2 text-3xl md:text-[34px] text-primary mb-3 font-bold serif tracking-normal leading-normal">UTM VIP Portal</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant/80">Manage your career development seamlessly.</p>
          </div>

          {/* Tab Toggles */}
          <div className="flex border-b border-outline-variant mb-10 relative">
            <button 
              className={`flex-1 pb-4 text-center font-label-md text-label-md transition-all duration-200 ${tab === 'login' ? 'text-primary border-b-[3px] border-primary font-bold' : 'text-on-surface-variant border-b-[3px] border-transparent hover:text-primary'}`} 
              onClick={() => setTab('login')}
            >
              Log In
            </button>
            <button 
              className={`flex-1 pb-4 text-center font-label-md text-label-md transition-all duration-200 ${tab === 'register' ? 'text-primary border-b-[3px] border-primary font-bold' : 'text-on-surface-variant border-b-[3px] border-transparent hover:text-primary'}`} 
              onClick={() => setTab('register')}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {tab === 'login' ? (
            <form className="space-y-6 block" onSubmit={handleAccessPortal}>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2.5" htmlFor="login-email">Email</label>
                <input 
                  className="w-full border border-outline-variant rounded-DEFAULT bg-surface px-4 py-3.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow placeholder-on-surface-variant/50" 
                  id="login-email" 
                  placeholder="Enter your email" 
                  type="email"
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2.5" htmlFor="login-password">Password</label>
                <input 
                  className="w-full border border-outline-variant rounded-DEFAULT bg-surface px-4 py-3.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow" 
                  id="login-password" 
                  placeholder="••••••••" 
                  type="password"
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input className="rounded-DEFAULT border-outline-variant text-primary focus:ring-primary h-4.5 w-4.5" type="checkbox" defaultChecked />
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Remember me</span>
                </label>
                <a className="font-label-sm text-label-sm text-primary hover:underline" href="#">Forgot password?</a>
              </div>
              <button 
                className="w-full bg-primary-container hover:bg-primary-container/95 text-[#ffffff] font-label-md text-label-md py-3.5 rounded-DEFAULT shadow-md hover:shadow-lg transition-all duration-200 mt-8 flex items-center justify-center gap-2 cursor-pointer" 
                type="submit"
              >
                Access Portal
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form className="space-y-5 block" onSubmit={handleRegister}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="reg-fname">First Name</label>
                  <input className="w-full border border-outline-variant rounded-DEFAULT bg-surface px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow" id="reg-fname" type="text" placeholder="First Name" required />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="reg-lname">Last Name</label>
                  <input className="w-full border border-outline-variant rounded-DEFAULT bg-surface px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow" id="reg-lname" type="text" placeholder="Last Name" required />
                </div>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="reg-role">I am a</label>
                <select 
                  className="w-full border border-outline-variant rounded-DEFAULT bg-surface px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                  id="reg-role" 
                  value={regRole} 
                  onChange={(e) => setRegRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="company">Company Partner</option>
                  <option value="supervisor">UTM Supervisor</option>
                </select>
              </div>
              {regRole === 'student' && (
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="reg-id">Matriculation Number</label>
                  <input className="w-full border border-outline-variant rounded-DEFAULT bg-surface px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow" id="reg-id" placeholder="e.g. A25MJ0184" type="text" required />
                </div>
              )}
              {regRole === 'company' && (
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="reg-company">Company / Organization Name</label>
                  <input className="w-full border border-outline-variant rounded-DEFAULT bg-surface px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow" id="reg-company" placeholder="e.g. Petronas Berhad" type="text" required />
                </div>
              )}
              {regRole === 'supervisor' && (
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="reg-dept">Department / Faculty</label>
                  <input className="w-full border border-outline-variant rounded-DEFAULT bg-surface px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow" id="reg-dept" placeholder="e.g. Faculty of Computing" type="text" required />
                </div>
              )}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="reg-email">Email Address</label>
                <input className="w-full border border-outline-variant rounded-DEFAULT bg-surface px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow" id="reg-email" placeholder="email@domain.com" type="email" required />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="reg-password">Create Password</label>
                <input className="w-full border border-outline-variant rounded-DEFAULT bg-surface px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow" id="reg-password" type="password" required />
              </div>
              <button 
                className="w-full bg-primary-container hover:bg-primary-container/95 text-[#ffffff] font-label-md text-label-md py-3.5 rounded-DEFAULT shadow-md hover:shadow-lg transition-all duration-200 mt-6 cursor-pointer" 
                type="submit"
              >
                Register Account
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-outline-variant text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant/80">
              By continuing, you agree to the <span onClick={() => navigate('/terms')} className="text-primary hover:underline cursor-pointer">Terms of Service</span> and <span onClick={() => navigate('/privacy')} className="text-primary hover:underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
