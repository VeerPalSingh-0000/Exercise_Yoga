import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiLogOut, FiSettings, FiChevronDown, FiHome, FiActivity } from 'react-icons/fi';
import { GiMuscleUp, GiLotus } from 'react-icons/gi';

const Navbar = ({ currentUser, onLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    if (!currentUser) return null;

    const UserAvatar = () => (
        <img 
            src={currentUser.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${currentUser.displayName || currentUser.email}`} 
            alt="User Avatar" 
            className="w-10 h-10 rounded-full border-2 border-gray-600 group-hover:border-emerald-400 transition-colors" 
        />
    );

    const baseLinkClass = "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors";
    const activeLinkClass = "bg-gray-800 text-emerald-400";
    const inactiveLinkClass = "text-gray-300 hover:bg-gray-800 hover:text-white";

    return (
        <header className="fixed top-0 left-0 right-0 bg-gray-950/80 backdrop-blur-lg border-b border-gray-700 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left Side: Logo and Title */}
                    <div className="flex items-center">
                        <GiMuscleUp className="h-8 w-8 text-emerald-400" />
                        <h1 className="text-xl font-bold text-gray-100 ml-2">FitPro</h1>
                    </div>

                    {/* Center: Navigation Links (visible on medium screens and up) */}
                    <nav className="hidden md:flex items-center space-x-4">
                        <Link 
                            to="/dashboard" 
                            className={`${baseLinkClass} ${location.pathname === '/dashboard' ? activeLinkClass : inactiveLinkClass}`}
                        >
                            <FiHome className="mr-2" /> Dashboard
                        </Link>
                        <Link 
                            to="/exercise" 
                            className={`${baseLinkClass} ${location.pathname === '/exercise' ? activeLinkClass : inactiveLinkClass}`}
                        >
                            <FiActivity className="mr-2" /> Exercise
                        </Link>
                        <Link 
                            to="/yoga" 
                            className={`${baseLinkClass} ${location.pathname === '/yoga' ? activeLinkClass : inactiveLinkClass}`}
                        >
                            <GiLotus className="mr-2" /> Yoga
                        </Link>
                    </nav>

                    {/* Right Side: User Menu */}
                    <div className="relative">
                        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="group flex items-center space-x-2 p-1 rounded-full hover:bg-gray-800 transition-colors">
                            <UserAvatar />
                            <span className="hidden sm:inline text-sm font-medium text-gray-200 group-hover:text-emerald-400">{currentUser.displayName || "User"}</span>
                            <FiChevronDown className={`transition-transform text-gray-400 ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1">
                                <div className="px-4 py-2 border-b border-gray-700 mb-1">
                                    <p className="text-sm font-semibold text-white truncate">{currentUser.displayName || "Fitness Enthusiast"}</p>
                                    <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                                </div>
                                <nav>
                                    {/* ✅ ADDED NAVIGATION LINKS */}
                                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"><FiHome className="mr-3" /> Dashboard</Link>
                                    <Link to="/exercise" onClick={() => setDropdownOpen(false)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"><FiActivity className="mr-3" /> Exercise</Link>
                                    <Link to="/yoga" onClick={() => setDropdownOpen(false)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"><GiLotus className="mr-3" /> Yoga</Link>
                                    
                                    {/* Separator */}
                                    <div className="border-t border-gray-700 my-1"></div>

                                    <button onClick={() => { /* Navigate to settings */ setDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"><FiSettings className="mr-3" /> Settings</button>
                                    <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 flex items-center"><FiLogOut className="mr-3" /> Logout</button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;