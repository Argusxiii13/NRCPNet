import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../css/styles/login/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ email, password, rememberPassword });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2 className="title">Login to Account</h2>
          <p className="subtitle">
            Please enter your email and password to continue
          </p>
        </div>
        <div className="login-content">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="remember-password">
              <input
                type="checkbox"
                id="remember"
                checked={rememberPassword}
                onChange={(e) => setRememberPassword(e.target.checked)}
              />
              <label htmlFor="remember">
                Remember Password
              </label>
            </div>

            <button type="submit" className="sign-in-button">
              Sign In
            </button>

            <div className="forgot-password-link">
              <a href="/forgot-password" className="forgot-password">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Mount the application
if (document.getElementById('login-root')) {
  const container = document.getElementById('login-root');
  const root = createRoot(container);
  root.render(<LoginPage />);
}

export default LoginPage;