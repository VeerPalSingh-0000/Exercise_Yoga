import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
// NEW: Import Google Auth provider and signInWithPopup
import { 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup 
} from 'firebase/auth';
=======
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
>>>>>>> adf7b333b19adacd3463ffad555704561dad05d4
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
<<<<<<< HEAD
    // ======================== STATE MANAGEMENT ========================
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSocialLoading, setIsSocialLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState({ type: '', message: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    
    const navigate = useNavigate();

    // ======================== INLINE SVG ICONS (No changes here) ========================
    const EyeIcon = () => ( <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> );
    const EyeSlashIcon = () => ( <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg> );
    const EnvelopeIcon = () => ( <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> );
    const LockClosedIcon = () => ( <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> );
    const ExclamationTriangleIcon = () => ( <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg> );
    const CheckCircleIcon = () => ( <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );
    const LoadingSpinner = () => ( <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> );
    const LightningIcon = () => ( <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> );

    // ======================== FORM VALIDATION (No changes here) ========================
    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) { newErrors.email = 'Email is required'; } else if (!/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = 'Please enter a valid email address'; }
        if (!formData.password) { newErrors.password = 'Password is required'; } else if (formData.password.length < 6) { newErrors.password = 'Password must be at least 6 characters'; }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ======================== HANDLERS ========================
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) { setErrors(prev => ({ ...prev, [name]: '' })); }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => { setNotification({ type: '', message: '' }); }, 5000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('userEmail', formData.email);
            } else {
                localStorage.removeItem('rememberMe');
                localStorage.removeItem('userEmail');
            }
            showNotification('success', 'Login successful! Redirecting...');
            setTimeout(() => { navigate('/dashboard'); }, 1000);
        } catch (error) {
            let errorMessage = 'Login failed. Please try again.';
            switch (error.code) {
                case 'auth/user-not-found': errorMessage = 'No account found with this email address.'; break;
                case 'auth/wrong-password': errorMessage = 'Incorrect password. Please try again.'; break;
                case 'auth/invalid-credential': errorMessage = 'Invalid email or password provided.'; break;
                case 'auth/invalid-email': errorMessage = 'Please enter a valid email address.'; break;
                case 'auth/user-disabled': errorMessage = 'This account has been disabled.'; break;
                case 'auth/too-many-requests': errorMessage = 'Too many failed attempts. Please try again later.'; break;
                default: errorMessage = error.message;
            }
            showNotification('error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        setIsSocialLoading(true);
        try {
            await signInWithPopup(auth, provider);
            showNotification('success', 'Signed in successfully! Redirecting...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (error) {
            showNotification('error', 'Google sign-in failed. Please try again.');
            console.error('Google sign-in error:', error);
        } finally {
            setIsSocialLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!resetEmail) { showNotification('error', 'Please enter your email address'); return; }
        if (!/\S+@\S+\.\S+/.test(resetEmail)) { showNotification('error', 'Please enter a valid email address'); return; }
        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            showNotification('success', 'Password reset email sent! Check your inbox.');
            setShowForgotPassword(false);
            setResetEmail('');
        } catch (error) {
            let errorMessage = 'Failed to send reset email. Please try again.';
            if (error.code === 'auth/user-not-found') { errorMessage = 'No account found with this email address.'; }
            showNotification('error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // ======================== EFFECTS (No changes here) ========================
    useEffect(() => {
        const remembered = localStorage.getItem('rememberMe');
        const savedEmail = localStorage.getItem('userEmail');
        if (remembered && savedEmail) {
            setFormData(prev => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    // ======================== ANIMATION VARIANTS (No changes here) ========================
    const containerVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
    const inputVariants = { focus: { scale: 1.02, transition: { duration: 0.2 } }, blur: { scale: 1, transition: { duration: 0.2 } } };

    // ======================== RENDER COMPONENTS (No changes here) ========================
    const renderNotification = () => { if (!notification.message) return null; return ( <AnimatePresence><motion.div initial={{ opacity: 0, y: -50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -50, scale: 0.9 }} className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg max-w-md w-full mx-4 ${ notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white' }`}><div className="flex items-center space-x-3">{notification.type === 'success' ? <CheckCircleIcon /> : <ExclamationTriangleIcon />}<p className="font-medium">{notification.message}</p></div></motion.div></AnimatePresence> ); };
    const renderForgotPasswordModal = () => { if (!showForgotPassword) return null; return ( <AnimatePresence><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForgotPassword(false)}><motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20" onClick={(e) => e.stopPropagation()}><h3 className="text-2xl font-bold text-white mb-2">Reset Password</h3><p className="text-blue-200 mb-6">Enter your email address and we'll send you a link to reset your password.</p><form onSubmit={handleForgotPassword} className="space-y-4"><div className="relative"><div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><EnvelopeIcon /></div><input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="Enter your email" className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200" required /></div><div className="flex space-x-3"><button type="button" onClick={() => setShowForgotPassword(false)} className="flex-1 px-4 py-3 text-white bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 font-medium border border-white/20">Cancel</button><button type="submit" disabled={isLoading} className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">{isLoading ? ( <><LoadingSpinner /><span className="ml-2">Sending...</span></> ) : ( 'Send Reset Email' )}</button></div></form></motion.div></motion.div></AnimatePresence> ); };

    // ======================== MAIN RENDER ========================
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>
            {renderNotification()}
            {renderForgotPasswordModal()}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 w-full max-w-md">
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                        <LightningIcon />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-blue-200">Sign in to continue your fitness journey</p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <motion.div variants={itemVariants}><label className="block text-sm font-medium text-white mb-2">Email Address</label><motion.div variants={inputVariants} whileFocus="focus" className="relative"><div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><EnvelopeIcon /></div><input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" className={`w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 ${ errors.email ? 'border-red-500' : 'border-white/20' }`} required /></motion.div>{errors.email && ( <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-sm text-red-400 flex items-center"><span className="mr-1"><ExclamationTriangleIcon /></span>{errors.email}</motion.p> )}</motion.div>
                        <motion.div variants={itemVariants}><label className="block text-sm font-medium text-white mb-2">Password</label><motion.div variants={inputVariants} whileFocus="focus" className="relative"><div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><LockClosedIcon /></div><input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} placeholder="Enter your password" className={`w-full pl-10 pr-12 py-3 bg-white/5 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 ${ errors.password ? 'border-red-500' : 'border-white/20' }`} required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">{showPassword ? <EyeSlashIcon /> : <EyeIcon />}</button></motion.div>{errors.password && ( <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-sm text-red-400 flex items-center"><span className="mr-1"><ExclamationTriangleIcon /></span>{errors.password}</motion.p> )}</motion.div>
                        <motion.div variants={itemVariants} className="flex items-center justify-between"><label className="flex items-center"><input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500 focus:ring-offset-0" /><span className="ml-2 text-sm text-blue-200">Remember me</span></label><button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-blue-300 hover:text-blue-200 transition-colors">Forgot password?</button></motion.div>
                        <motion.button variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center">{isLoading ? ( <><LoadingSpinner /><span className="ml-2">Signing in...</span></> ) : ( 'Sign In' )}</motion.button>
                    </form>
                    <motion.div variants={itemVariants} className="my-6"><div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/20" /></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-transparent text-blue-200">Or continue with</span></div></div></motion.div>

                    {/* MODIFIED: Social Login Buttons */}
                    <motion.div variants={itemVariants} className="flex justify-center">
                        <motion.button 
                            onClick={handleGoogleLogin}
                            disabled={isSocialLoading || isLoading}
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center px-4 py-2 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSocialLoading ? <LoadingSpinner /> : (
                                <>
                                    <svg className="w-5 h-5 text-white mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                    Google
                                </>
                            )}
                        </motion.button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="text-center mt-6">
                        <p className="text-blue-200">Don't have an account?{' '}<button type="button" onClick={() => navigate('/Signup')} className="text-blue-300 hover:text-blue-200 font-medium transition-colors">Sign up here</button></p>
                    </motion.div>
                </motion.div>
            </motion.div>
            <style jsx>{` @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } } .animate-blob { animation: blob 7s infinite; } .animation-delay-2000 { animation-delay: 2s; } .animation-delay-4000 { animation-delay: 4s; } `}</style>
        </div>
    );
=======
  // ======================== STATE MANAGEMENT ========================
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  
  const navigate = useNavigate();

  // ======================== INLINE SVG ICONS ========================
  const EyeIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeSlashIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
  );

  const EnvelopeIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const LockClosedIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const ExclamationTriangleIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  );

  const CheckCircleIcon = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  const LightningIcon = () => (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );

  // ======================== FORM VALIDATION ========================
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ======================== HANDLERS ========================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: '', message: '' });
    }, 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', formData.email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userEmail');
      }
      
      showNotification('success', 'Login successful! Redirecting...');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        default:
          errorMessage = error.message;
      }
      
      showNotification('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!resetEmail) {
      showNotification('error', 'Please enter your email address');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      showNotification('error', 'Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      showNotification('success', 'Password reset email sent! Check your inbox.');
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error) {
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      }
      
      showNotification('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ======================== EFFECTS ========================
  useEffect(() => {
    // Check if user wants to be remembered
    const remembered = localStorage.getItem('rememberMe');
    const savedEmail = localStorage.getItem('userEmail');
    
    if (remembered && savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  // ======================== ANIMATION VARIANTS ========================
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };

  // ======================== RENDER COMPONENTS ========================
  const renderNotification = () => {
    if (!notification.message) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg max-w-md w-full mx-4 ${
            notification.type === 'success' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            {notification.type === 'success' ? <CheckCircleIcon /> : <ExclamationTriangleIcon />}
            <p className="font-medium">{notification.message}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderForgotPasswordModal = () => {
    if (!showForgotPassword) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowForgotPassword(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-2">
              Reset Password
            </h3>
            <p className="text-blue-200 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <EnvelopeIcon />
                </div>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 px-4 py-3 text-white bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 font-medium border border-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      <span className="ml-2">Sending...</span>
                    </>
                  ) : (
                    'Send Reset Email'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // ======================== MAIN RENDER ========================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Notification */}
      {renderNotification()}

      {/* Forgot Password Modal */}
      {renderForgotPasswordModal()}

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo/Brand Section */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
            <LightningIcon />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-blue-200">Sign in to continue your fitness journey</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <motion.div 
                variants={inputVariants}
                whileFocus="focus"
                className="relative"
              >
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <EnvelopeIcon />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-white/20'
                  }`}
                  required
                />
              </motion.div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400 flex items-center"
                >
                  <span className="mr-1"><ExclamationTriangleIcon /></span>
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <motion.div 
                variants={inputVariants}
                whileFocus="focus"
                className="relative"
              >
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <LockClosedIcon />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-3 bg-white/5 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 ${
                    errors.password ? 'border-red-500' : 'border-white/20'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </motion.div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400 flex items-center"
                >
                  <span className="mr-1"><ExclamationTriangleIcon /></span>
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-blue-200">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-300 hover:text-blue-200 transition-colors"
              >
                Forgot password?
              </button>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-blue-200">Or continue with</span>
              </div>
            </div>
          </motion.div>

          {/* Social Login Buttons */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center px-4 py-2 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-white mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center px-4 py-2 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </motion.button>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div variants={itemVariants} className="text-center mt-6">
            <p className="text-blue-200">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/Signup')}
                className="text-blue-300 hover:text-blue-200 font-medium transition-colors"
              >
                Sign up here
              </button>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
>>>>>>> adf7b333b19adacd3463ffad555704561dad05d4
};

export default Login;
