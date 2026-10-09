import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p style={{ marginTop: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">Return to Home</Link>
    </div>
  );
}
