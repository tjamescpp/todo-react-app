import './App.css';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import projectIcon from '/icons/pound.svg';
import Content from './components/Content.jsx';
import SignUp from './components/SignUp.jsx';
import LogIn from './components/LogIn.jsx';
import { dateUtils } from '../../client/utils/dateUtils.js';

function App() {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [user, setUser] = useState(null);
    const [isAddTask, setIsAddTask] = useState(false);
    const [status, setStatus] = useState(null);
    const [addTaskProject, setAddTaskProject] = useState(null);
    const [searchTaskResults, setSearchTaskResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Express REST API url environment variable
    const API_URL = import.meta.env.VITE_API_URL;

    // central function to load user data
    const loadUserData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return setStatus('login');

        try {
            const res = await fetch(`${API_URL}/users/me`, {
                // credentials: 'include', // send session cookie
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                setStatus('login');
                setUser(null);
                return;
            }

            const userData = await res.json();
            // setLoading(false);
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
        }
    };

    useEffect(() => {
        loadUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleProjectButton = (e) => {
        const projectName = e.target.textContent.toLowerCase();
        console.log('Project button name:', projectName);
        projectName === 'my projects'
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
        localStorage.removeItem('token'); // remove JWT
        setUser(null); // clear user state
        setTasks([]);
        setProjects([]);
        setStatus('login'); // redirect to login
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
            {status === 'signup' && (
                <SignUp API_URL={API_URL} setStatus={setStatus} />
            )}
            {status === 'login' && (
                <LogIn
                    API_URL={API_URL}
                    setUser={setUser}
                    setStatus={setStatus}
                    loading={loading}
                    setLoading={setLoading}
                    loadUserData={loadUserData}
                />
            )}
            {user && (
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
                        API_URL={API_URL}
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
