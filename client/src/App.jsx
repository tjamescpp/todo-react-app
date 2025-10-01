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

    useEffect(() => {
        if (user) {
            // user is logged in, now fetch their data
            setStatus('dashboard');
            setLoading(true);
            console.log('Logged in...');
            fetch(`${API_URL}/users/${user.id}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    setTasks(
                        data.tasks.map((task) => {
                            // format due date
                            return {
                                ...task,
                                dueDate: dateUtils.toDateString(task.dueDate),
                            };
                        }) || []
                    );
                    setProjects(data.projects);
                })
                .catch((error) =>
                    console.error('Failed to fetch user data:', error)
                )
                .finally(setLoading(false));
        }
    }, [user, API_URL]);

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
                <Login setUser={setUser} setStatus={setStatus} />
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
