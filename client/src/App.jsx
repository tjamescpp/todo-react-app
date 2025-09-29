import './App.css';
import { useState, useEffect } from 'react';
import { useAllData } from './hooks/useAllData.js';
import Sidebar from './components/Sidebar.jsx';
import projectIcon from '/icons/pound.svg';
import Content from './components/Content.jsx';

function App() {
    const { users, tasks, projects, setTasks, setProjects } = useAllData();
    const [user, setUser] = useState([]);
    const [isAddTask, setIsAddTask] = useState(false);
    const [status, setStatus] = useState('dashboard');
    const [addTaskProject, setAddTaskProject] = useState(null);
    const [searchTaskResults, setSearchTaskResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // loads all data into state
    useEffect(() => {
        if (!users || !tasks || !projects) {
            setLoading(true);
        } else {
            setLoading(false);
            setUser(users[0]);
            console.log('Users:', users);
            console.log('Tasks:', tasks);
            console.log('Projects:', projects);
        }
    }, [users, user, tasks, projects]);

    const handleProjectButton = (e) => {
        const projectName = e.target.textContent;
        projectName.toLowerCase() === 'my projects'
            ? setStatus('projects')
            : setStatus(projectName);
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
    );
}

export default App;
