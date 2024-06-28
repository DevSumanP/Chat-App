import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../../backend/db/firebase';

import './Login.css';

const Login = ({ onSwitchToSignUp }) => {
  const [loading, setLoading] = useState(false);
  
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Sign in successful!');
      console.log('Sign in successful!');

      // Clear the input fields
      emailRef.current.value = '';
      passwordRef.current.value = '';
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-content">
          <div className="login-info">
            <h2>Stay Connected with Our Chat App!</h2>
            <p>Join thousands of users worldwide in our secure and user-friendly chat platform. Whether {`you're`} chatting with friends, colleagues, or family, our app ensures seamless communication anytime, anywhere.</p>
            <p>{`Don't`} have an account?{" "}  <button onClick={onSwitchToSignUp}>Sign Up</button>
            </p>
          </div>
          <form className="login-form" onSubmit={handleLogin}>
            <h3>Sign in</h3>
            <div>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="login-input"
                placeholder="Email address"
                ref={emailRef}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="login-input"
                placeholder="Password"
                ref={passwordRef}
              />
            </div>
            <div className="login-options">
              <div className="remember-me">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="remember-me-checkbox"
                />
                <label htmlFor="remember-me" className="remember-me-label">
                  Remember me
                </label>
              </div>
              <div className="forgot-password">
                <a href="javascript:void(0);" className="forgot-password-link">
                  Forgot your password?
                </a>
              </div>
            </div>
            <div className="login-button-wrapper">
              <button className="login-button" disabled={loading}>
                {loading ? <span className="loading-spinner"></span> : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
