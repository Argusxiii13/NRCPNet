import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import styles from '../../css/styles/login/LoginPage.module.css';
import '../../css/font.css';

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
    <div className={styles['login-page']}>
      <div className={styles['login-card']}>
        <div className={styles['login-header']}>
          <h2 className={styles['title']}>Login to Account</h2>
          <p className={styles['subtitle']}>
            Please enter your email and password to continue
          </p>
        </div>
        <div className={styles['login-content']}>
          <form onSubmit={handleSubmit} className={styles['login-form']}>
            <div className={styles['form-group']}>
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
            
            <div className={styles['form-group']}>
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

            <div className={styles['remember-password']}>
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

            <button type="submit" className={styles['sign-in-button']}>
              Sign In
            </button>

            <div className={styles['forgot-password-link']}>
              <a href="/forgot-password" className={styles['forgot-password']}>
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