import React from 'react';
import { GiMuscleUp } from 'react-icons/gi';
import { FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    // Social media links
    const socialLinks = [
        { icon: <FaGithub />, href: 'https://github.com/VeerPalSingh-0000', label: 'Github' },
        { icon: <FaTwitter />, href: '#', label: 'Twitter' },
        { icon: <FaInstagram />, href: '#', label: 'Instagram' },
    ];

    return (
        <footer className="bg-gradient-to-t from-black to-gray-900 text-gray-300 font-sans">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-center lg:text-left">
                    
                    {/* Brand & Socials Section */}
                    <div className="flex flex-col items-center lg:items-start space-y-6">
                        <div className="flex items-center">
                            <GiMuscleUp className="h-9 w-9 text-emerald-400" />
                            <span 
                                className="text-3xl font-bold ml-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 animate-gradient-x"
                            >
                                FitPro
                            </span>
                        </div>
                        <p className="text-gray-400 max-w-xs">
                            Your ultimate companion in the journey to a healthier, stronger you.
                        </p>
                        <div className="flex space-x-6">
                            {socialLinks.map((social) => (
                                <a 
                                    key={social.label} 
                                    href={social.href} 
                                    className="text-gray-400 hover:text-white transition-transform duration-300 transform hover:-translate-y-1" 
                                    aria-label={social.label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="text-2xl">{social.icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className="flex flex-col items-center lg:items-start col-span-1 lg:col-span-2">
                        <h3 className="text-xl font-semibold text-white tracking-wider">Join Our Newsletter</h3>
                        <p className="mt-2 text-gray-400">Get the latest workout tips, news, and updates.</p>
                        <form className="mt-6 flex flex-col sm:flex-row items-center w-full max-w-md">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 transition duration-300 text-white placeholder-gray-500"
                                required
                            />
                            <button 
                                type="submit" 
                                className="mt-4 sm:mt-0 sm:ml-4 flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-md hover:from-emerald-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-400 transition-all duration-300 transform hover:scale-105"
                            >
                                Subscribe <FiSend className="ml-2" />
                            </button>
                        </form>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-center">
                    <p className="text-sm text-gray-500">
                        &copy; {currentYear} FitPro. All Rights Reserved.
                    </p>
                    <p className="text-sm text-gray-500 mt-4 sm:mt-0">
                        Crafted with ❤️ by <a href="https://github.com/VeerPalSingh-0000" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Veer Pal Singh</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;