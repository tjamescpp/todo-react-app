export default function LogIn({ setStatus }) {
    const handleLogIn = (e) => {
        e.preventDefault();
        setStatus('dashboard');
    };

    return (
        <div id="logIn">
            <h1>Tasker</h1>
            <h2>Log In</h2>
            <form id="logInForm">
                <div className="logInInput">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        placeholder="Enter your email..."
                        type="email"
                    />
                </div>
                <div className="logInInput">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        placeholder="Create a password..."
                        type="password"
                    />
                </div>
                <button
                    id="logInBtn"
                    type="submit"
                    onClick={(e) => handleLogIn(e)}
                >
                    Log In
                </button>
            </form>
        </div>
    );
}
