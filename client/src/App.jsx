import './App.css';
import { useState, useEffect } from 'react';
import { useFetchUsers } from './hooks/useFetchUsers.js';
import Sidebar from './components/Sidebar.jsx';
import projectIcon from '/icons/pound.svg';
import Content from './components/Content.jsx';
import SignUp from './components/SignUp.jsx';
import LogIn from './components/LogIn.jsx';
import { dateUtils } from '../../client/utils/dateUtils.js';

function App() {
    const { users, setUsers } = useFetchUsers();
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [user, setUser] = useState({});
    const [isAddTask, setIsAddTask] = useState(false);
    const [status, setStatus] = useState('dashboard');
    const [addTaskProject, setAddTaskProject] = useState(null);
    const [searchTaskResults, setSearchTaskResults] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [isAuthenticated, setIsAuthenticated] = useState(false);

    // loads all data into state
    useEffect(() => {
        if (!users || users.length === 0) {
            setLoading(true);
            return;
        }

        setLoading(false);

        const firstUser = users[0];
        setUser(firstUser);
        setTasks(
            firstUser.tasks.map((task) => {
                // format due date
                return {
                    ...task,
                    dueDate: dateUtils.toDateString(task.dueDate),
                };
            }) || []
        );
        setProjects(firstUser.projects || []);

        console.log('Users:', users);
        console.log('User:', firstUser);
        console.log('Tasks:', firstUser.tasks);
        console.log('Projects:', firstUser.projects);
    }, [users]);

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
            {status === 'signup' && (
                <SignUp setStatus={setStatus} setUsers={setUsers} />
            )}
            {status === 'login' && <LogIn setStatus={setStatus} />}
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
        </>
    );
}

export default App;
