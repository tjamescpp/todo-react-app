import { useState } from 'react';
import './App.css';
import Button from './components/Button';
import Content from './components/Content';
import Icon from './components/Icon';
import Project from './components/Project.jsx';
import Sidebar from './components/Sidebar';
import SidebarHeader from './components/SidebarHeader';
import SidebarList from './components/SidebarList';
import ToDoList from './components/ToDoList.jsx';
import TaskForm from './components/TaskForm.jsx';
import { users, tasks, projects } from './data.js';
import projectIcon from '/icons/pound.svg';

function App() {
    const [allTasks, setAllTasks] = useState(tasks);
    const [allProjects, setAllProjects] = useState(projects);
    const [addTask, setAddTask] = useState(false);
    const [isEditTask, setIsEditTask] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [status, setStatus] = useState('dashboard');
    const [addNewProject, setAddNewProject] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');

    console.log(allTasks);

    const handleTaskDeleted = (taskId) => {
        console.log('Deleting task...');
        setAllTasks((allTasks) =>
            allTasks.filter((task) => task.id !== taskId)
        );
    };

    const handleAddTask = () => {
        console.log('Adding a task...');
        setAddTask(true);
    };

    const handleCancel = (e) => {
        e.preventDefault();
        console.log('Cancel clicked...');
        setAddTask(false);
        setIsEditTask(false);
    };

    const handleConfirm = (task) => {
        if (task.id) {
            // Editing existing task
            setAllTasks(allTasks.map((t) => (t.id === task.id ? task : t)));
            console.log('Edited task...', task);
        } else {
            // Adding new task
            const newTask = {
                ...task,
                id: crypto.randomUUID(),
            };
            setAllTasks([...allTasks, newTask]);
            console.log('Created new task...', newTask);
        }

        setAddTask(false);
        setIsEditTask(false);
    };

    const handleEdit = (taskId, handleClose) => {
        console.log('Edit clicked...');
        console.log('Task ID', taskId);
        setEditTask(allTasks.find((task) => task.id === taskId));
        setIsEditTask(true);
        handleClose();
    };

    const handleDashboard = () => {
        console.log('Dashboard clicked...');
        setStatus('dashboard');
    };

    const handleProjectButton = (e) => {
        console.log(e.target.textContent);
        setStatus(e.target.textContent);
    };

    const handleNewProject = () => {
        setAddNewProject(!addNewProject);
    };

    const handleNewProjectInput = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!newProjectName.trim()) return;

            const project = {
                name: newProjectName,
                id: `${newProjectName.toLowerCase()}Project`,
            };

            projectButtons.push({
                ...project,
                src: projectIcon,
                onClick: null,
            });

            setAllProjects([...allProjects, project]);
            setNewProjectName('');
            setAddNewProject(false);
        }
    };

    // assign the handleAddTask function to the Add task button
    sidebarButtons.find((button) => button.name === 'Add task').onClick =
        handleAddTask;

    // assign the handleDashboard function to the Add task button
    sidebarButtons.find((button) => button.name === 'Dashboard').onClick =
        handleDashboard;

    projectButtons.map((button) => (button.onClick = handleProjectButton));

    // assign handleProjectButton to each project button

    return (
        <div id="container">
            <Sidebar>
                <SidebarHeader user={users[0]} />
                <SidebarList listId="sidebarList" buttons={sidebarButtons} />
                <div id="projectsSidebar">
                    <p id="projectListHeader">Projects</p>
                    <Button
                        className="sidebarBtn"
                        type="button"
                        id="newProjectBtn"
                        onClick={handleNewProject}
                    >
                        <Icon
                            className="sidebarIcons"
                            src="/icons/plus.svg"
                            alt="plus"
                        />
                        <p>New project</p>
                    </Button>
                    {addNewProject && (
                        <input
                            type="text"
                            placeholder="Name"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            onKeyDown={handleNewProjectInput} // only uses it on Enter
                        />
                    )}
                    <SidebarList
                        listId="projectSidebarList"
                        buttons={projectButtons}
                    />
                </div>
            </Sidebar>
            <Content>
                {(addTask || isEditTask) && (
                    <TaskForm
                        handleCancel={handleCancel}
                        handleConfirm={handleConfirm}
                        task={isEditTask ? editTask : null}
                    />
                )}
                <ToDoList>
                    {status === 'dashboard' &&
                        allProjects.map((project) => (
                            <Project
                                key={project.id}
                                id={project.id}
                                name={project.name}
                                tasks={allTasks}
                                handleTaskDeleted={handleTaskDeleted}
                                handleEdit={handleEdit}
                            />
                        ))}
                    {allProjects.some((project) => project.name === status) &&
                        allProjects
                            .filter((project) => project.name === status)
                            .map((project) => (
                                <Project
                                    key={project.id}
                                    id={project.id}
                                    name={project.name}
                                    tasks={allTasks}
                                    handleTaskDeleted={handleTaskDeleted}
                                    handleEdit={handleEdit}
                                />
                            ))}
                </ToDoList>
            </Content>
        </div>
    );
}

const sidebarButtons = [
    {
        name: 'Search',
        id: 'searchBtn',
        src: '/icons/magnify.svg',
        onClick: null,
    },
    {
        name: 'Add task',
        id: 'addTaskBtn',
        src: '/icons/plus-box-outline.svg',
        onClick: null,
    },
    {
        name: 'Dashboard',
        id: 'dashboardBtn',
        src: '/icons/home-outline.svg',
        onClick: null,
    },
    {
        name: 'Inbox',
        id: 'inboxBtn',
        src: '/icons/inbox.svg',
        onClick: null,
    },
    {
        name: 'Today',
        id: 'todayBtn',
        src: '/icons/calendar-check.svg',
        onClick: null,
    },
];

const projectButtons = [
    {
        name: 'General',
        id: 'generalProjectBtn',
        src: projectIcon,
        onClick: null,
    },
    {
        name: 'Fitness',
        id: 'fitnessProjectBtn',
        src: projectIcon,
        onClick: null,
    },
    {
        name: 'School',
        id: 'schoolProjectBtn',
        src: projectIcon,
        onClick: null,
    },
];

export default App;
