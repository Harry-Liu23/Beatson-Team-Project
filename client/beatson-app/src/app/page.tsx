import './globals.css';
import LoginForm from '../components/login/LoginForm'

export default function Login() {
  return (
    <div className="page">
      <header className='page-header'>
        MOSAIC Data Portal
      </header>
      <div className="page-content">
        <LoginForm />
      </div>
    </div>
    );
}
