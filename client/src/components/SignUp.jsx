import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function SignUp({ API_URL, loading, setLoading, setStatus }) {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
    });

    const handleSignUp = async (e) => {
        setLoading(true);
        e.preventDefault();
        console.log('Creating user:', form);
        setStatus('dashboard');

        try {
            const res = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const user = await res.json();
            if (res.ok) {
                setLoading(false);
                console.log('Signed up:', user);
            }
        } catch (error) {
            console.error('Failed to create user...', error);
        }

        return true;
    };

    return (
        <div id="signUp">
            <h1>Tasker</h1>
            <h2>Sign Up</h2>
            <form id="signUpForm">
                <div className="signUpInput">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        id="firstName"
                        name="firstName"
                        placeholder="Enter your first name..."
                        type="text"
                        onChange={(e) =>
                            setForm({ ...form, firstName: e.target.value })
                        }
                    />
                </div>
                <div className="signUpInput">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        id="lastName"
                        name="lastName"
                        placeholder="Enter your last name..."
                        type="text"
                        onChange={(e) =>
                            setForm({ ...form, lastName: e.target.value })
                        }
                    />
                </div>
                <div className="signUpInput">
                    <label htmlFor="email">Email</label>
                    <input
                        id="signUpEmail"
                        name="email"
                        placeholder="Enter your email..."
                        type="email"
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />
                </div>
                <div className="signUpInput">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        placeholder="Create a username..."
                        type="text"
                        onChange={(e) =>
                            setForm({ ...form, username: e.target.value })
                        }
                    />
                </div>
                <div className="signUpInput">
                    <label htmlFor="password">Password</label>
                    <input
                        id="signUpPassword"
                        name="password"
                        placeholder="Create a password..."
                        type="password"
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />
                </div>
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <button
                        id="signUpBtn"
                        type="submit"
                        onClick={(e) => handleSignUp(e)}
                    >
                        Sign Up
                    </button>
                )}
            </form>
            <p>
                Already registered?{' '}
                <a
                    href="#"
                    style={{ color: 'var(--button-red)' }}
                    onClick={(e) => {
                        e.preventDefault();
                        setStatus('login');
                    }}
                >
                    Go to login
                </a>
            </p>
        </div>
    );
}
