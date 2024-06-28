import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../../backend/db/firebase';
import { doc, setDoc } from 'firebase/firestore';
import upload from '../../utils/upload';
import './SignUp.css';

const SignUp = ({ onSwitchToLogin }) => {
  const [avatar, setAvatar] = useState({ file: null, url: '' });
  const [loading, setLoading] = useState(false);

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, 'users', res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
      });

      await setDoc(doc(db, 'userchats', res.user.uid), {
        chats: [],
      });

      toast.success('Account created! You can login now!');

      // Clear the input fields
      usernameRef.current.value = '';
      emailRef.current.value = '';
      passwordRef.current.value = '';
      setAvatar({ file: null, url: '' });
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-content">
          <div className="register-info">
            <h2>Stay Connected with Our Chat App!</h2>
            <p>Join thousands of users worldwide in our secure and user-friendly chat platform. Whether {`you're`} chatting with friends, colleagues, or family, our app ensures seamless communication anytime, anywhere.</p>
            <p>{`Don't`} have an account?{" "}  <button onClick={onSwitchToLogin}>Sign Up</button>

            </p>
          </div>
          <form className="register-form" onSubmit={handleRegister}>
            <h3>Sign Up</h3>
            <div>
              <input
                name="username"
                type="username"
                autoComplete="username"
                required
                className="register-input"
                placeholder="Username"
                ref={usernameRef}
              />
            </div>
            <div>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="register-input"
                placeholder="Email address"
                ref={emailRef}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="register-input"
                placeholder="Password"
                ref={passwordRef}
              />
            </div>

            <div className="uploadImage">
              <label htmlFor="file">
                <img src={avatar.url || './avatar.png'} alt="Avatar" />
                Upload an image
              </label>
              <input type="file" id="file" style={{ display: 'none' }} onChange={handleAvatar} />
            </div>

            <div className="register-options">
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
            <div className="register-button-wrapper">
              <button className="register-button" disabled={loading}>
                {loading ? <span className="loading-spinner"></span> : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
