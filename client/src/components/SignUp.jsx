import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function SignUp({
    API_URL,
    loading,
    setLoading,
    setStatus,
    loadUserData,
}) {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        picture: null,
    });

    const handleSignUp = async (e) => {
        e.preventDefault();

        const data = new FormData();

        Object.keys(form).forEach((key) => {
            data.append(key, form[key]);
        });

        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                body: data,
            });

            const user = await res.json();
            if (res.ok) {
                await loadUserData();
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
            <form id="signUpForm" encType="multipart/form-data">
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
                <div className="signUpInput">
                    <label htmlFor="picture">Picture</label>
                    <input
                        id="picture"
                        name="picture"
                        type="file"
                        accept="image/jpeg"
                        onChange={(e) =>
                            setForm({ ...form, picture: e.target.files[0] })
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
