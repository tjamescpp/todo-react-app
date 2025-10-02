import './App.css';
import { useState, useEffect } from 'react';
// import { useFetchUsers } from './hooks/useFetchUsers.js';
import Sidebar from './components/Sidebar.jsx';
import projectIcon from '/icons/pound.svg';
import Content from './components/Content.jsx';
import SignUp from './components/SignUp.jsx';
import Login from './components/Login.jsx';
import { dateUtils } from '../../client/utils/dateUtils.js';

function App() {
    // const { users, setUsers } = useFetchUsers();
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [user, setUser] = useState(null);
    const [isAddTask, setIsAddTask] = useState(false);
    const [status, setStatus] = useState('login');
    const [addTaskProject, setAddTaskProject] = useState(null);
    const [searchTaskResults, setSearchTaskResults] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Express REST API url environment variable
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    // central function to load user data
    // central function to load user data
    const loadUserData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/users/me`, {
                credentials: 'include', // send session cookie
            });

            if (!res.ok) {
                setStatus('login');
                setUser(null);
                return;
            }

            const userData = await res.json();
            setUser(userData);
            setTasks(
                userData.tasks?.map((task) => ({
                    ...task,
                    dueDate: dateUtils.toDateString(task.dueDate),
                })) || []
            );
            setProjects(userData.projects || []);
            setStatus('dashboard');
        } catch (err) {
            console.error('Failed to load user data:', err);
            setStatus('login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUserData();
    }, []);

    const handleProjectButton = (e) => {
        const projectName = e.target.textContent;
        console.log('Project button name:', projectName);
        projectName.toLowerCase() === 'my projects'
            ? setStatus('projects')
            : setStatus(projectName);
        console.log('Status:', status);
    };

    const handleAddTaskClicked = (e) => {
        const projectName = e.target.id;
        !projectName || projectName === 'All'
            ? setAddTaskProject('Project')
            : setAddTaskProject(projectName);
        setIsAddTask(true);
    };

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            await fetch(`${API_URL}/users/logout`, {
                method: 'POST',
                credentials: 'include', // include cookies/session
            });
            setUser(null); // clear user from state
            setTasks([]);
            setProjects([]);
            setStatus('login'); // go back to login screen
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    // create project buttons for the sidebar
    let projectButtons = projects.map((project, idx) => {
        return {
            id: idx,
            name: project.name,
            src: projectIcon,
            onClick: handleProjectButton,
        };
    });

    return (
        <>
            {status === 'signup' && <SignUp setStatus={setStatus} />}
            {status === 'login' && (
                <Login
                    setUser={setUser}
                    setStatus={setStatus}
                    loadUserData={loadUserData}
                />
            )}
            {status === 'dashboard' && (
                <div id="container">
                    <Sidebar
                        user={user}
                        tasks={tasks}
                        projects={projects}
                        setProjects={setProjects}
                        loading={loading}
                        status={status}
                        setStatus={setStatus}
                        projectButtons={projectButtons}
                        handleProjectButton={handleProjectButton}
                        handleAddTaskClicked={handleAddTaskClicked}
                        handleLogout={handleLogout}
                        onSearchResults={setSearchTaskResults}
                    />
                    <Content
                        user={user}
                        tasks={tasks}
                        setTasks={setTasks}
                        projects={projects}
                        setProjects={setProjects}
                        status={status}
                        setStatus={setStatus}
                        loading={loading}
                        isAddTask={isAddTask}
                        setIsAddTask={setIsAddTask}
                        searchTaskResults={searchTaskResults}
                        addTaskProject={addTaskProject}
                        projectButtons={projectButtons}
                        handleAddTaskClicked={handleAddTaskClicked}
                    />
                </div>
            )}
        </>
    );
}

export default App;
