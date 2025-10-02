import { useState } from 'react';

export default function LogIn({ API_URL, setStatus, loadUserData }) {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
                credentials: 'include', // important for sessions
            });

            if (res.ok) {
                // const data = await res.json();

                // setUser(data.user);
                // setStatus('dashboard');
                await loadUserData();
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div id="logIn">
            <h1>Tasker</h1>
            <h2>Log In</h2>
            <form id="logInForm" onSubmit={handleLogin}>
                <div className="logInInput">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        placeholder="Enter your email..."
                        type="email"
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />
                </div>
                <div className="logInInput">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        placeholder="Enter your password..."
                        type="password"
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />
                </div>
                <button id="logInBtn" type="submit">
                    Log In
                </button>
            </form>
            <p>
                Not registered?{' '}
                <a
                    href="#"
                    style={{ color: 'var(--button-red)' }}
                    onClick={(e) => {
                        e.preventDefault();
                        setStatus('signup');
                    }}
                >
                    Sign up
                </a>
            </p>
        </div>
    );
}
