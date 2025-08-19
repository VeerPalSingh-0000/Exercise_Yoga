import React from 'react';
import { GiMuscleUp } from 'react-icons/gi';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 pt-10">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-400">
                <div className="flex justify-center items-center mb-4">
                    <GiMuscleUp className="h-7 w-7 text-emerald-400" />
                    <span className="text-lg font-bold text-gray-200 ml-2">FitPro</span>
                </div>
                <p className="text-sm">
                    Your ultimate companion in the journey to a healthier you.
                </p>
                <p className="mt-4 text-xs">
                    &copy; {currentYear} FitPro. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;