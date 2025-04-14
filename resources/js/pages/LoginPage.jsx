import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import styles from '../../css/styles/login/LoginPage.module.css';
import '../../css/font.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Get the CSRF token from the meta tag
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
      setCsrfToken(token);
    }
    
    // Fetch CSRF cookie
    fetch('/sanctum/csrf-cookie', {
      method: 'GET',
      credentials: 'include'
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email, 
          password,
          remember: rememberPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to dashboard on success
        window.location.href = data.redirect || '/dashboard';
      } else {
        // Show error message
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles['login-page']}>
      <div className={styles['login-card']}>
        {/* Back to main page button */}
        <a href="/" className={styles['back-button']}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
          Back to Main Page
        </a>
        
        <div className={styles['login-header']}>
          <h2 className={styles['title']}>Login to Account</h2>
          <p className={styles['subtitle']}>
            Please enter your email and password to continue
          </p>
        </div>
        <div className={styles['login-content']}>
          {error && (
            <div className={styles['error-message']}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className={styles['login-form']}>
            <input type="hidden" name="_token" value={csrfToken} />
            
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

            <button 
              type="submit" 
              className={styles['sign-in-button']}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.spinner}></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
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