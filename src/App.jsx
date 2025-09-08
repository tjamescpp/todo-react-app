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
import { TaskList } from './components/Task.jsx';
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
    const [addTaskProject, setAddTaskProject] = useState(null);

    console.log(allTasks);

    const handleTaskDeleted = (taskId) => {
        console.log('Deleting task...');
        setAllTasks((allTasks) =>
            allTasks.filter((task) => task.id !== taskId)
        );
    };

    const handleAddTask = (e) => {
        console.log('Adding a task...');
        console.log(e.target.id);
        e.target.id
            ? setAddTaskProject(e.target.id)
            : setAddTaskProject('Project');
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

    const handleToday = () => {
        console.log('Today clicked...');
        setStatus('today');
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

            if (allProjects.some((p) => p.name === newProjectName)) {
                alert(`${newProjectName} already exists`);
            } else {
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
        }
    };

    const handleDeleteProject = (projectName) => {
        console.log(projectName);
        setAllProjects(allProjects.filter((p) => p.name !== projectName));
        projectButtons = projectButtons.filter((p) => p.name !== projectName);
        setAllTasks(allTasks.filter((t) => t.project !== projectName));
        setStatus('dashboard');
    };

    // assign the handleAddTask function to the Add task button
    sidebarButtons.find((button) => button.name === 'Add task').onClick =
        handleAddTask;

    // assign the handleDashboard function to the Add task button
    sidebarButtons.find((button) => button.name === 'Dashboard').onClick =
        handleDashboard;

    // assign the handleDashboard function to the Add task button
    sidebarButtons.find((button) => button.name === 'Today').onClick =
        handleToday;

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
                        projectName={addTaskProject}
                    />
                )}
                <ToDoList>
                    {status === 'dashboard' &&
                        allProjects.map((project) => (
                            <div key={`${project.id}Key`}>
                                <Project
                                    key={project.id}
                                    id={project.id}
                                    name={project.name}
                                    tasks={allTasks}
                                    handleTaskDeleted={handleTaskDeleted}
                                    handleEdit={handleEdit}
                                />
                                <Button
                                    key={`${project.id}Btn`}
                                    className="projectAddTaskBtn"
                                    type="button"
                                    onClick={handleAddTask}
                                >
                                    <Icon
                                        className="sidebarIcons"
                                        src="/icons/plus.svg"
                                        alt="add"
                                    />
                                    <p id={project.name}>Add task</p>
                                </Button>
                            </div>
                        ))}
                    {status === 'today' && (
                        <>
                            <p className="projectTitle">Today</p>
                            <TaskList
                                tasks={allTasks.filter(
                                    (task) => task.dueDate === getTodaysDate()
                                )}
                                handleTaskDeleted={handleTaskDeleted}
                                handleEdit={handleEdit}
                            />
                        </>
                    )}
                    {/* Displays project for project sidebar buttons */}
                    {allProjects.some((project) => project.name === status) &&
                        allProjects
                            .filter((project) => project.name === status)
                            .map((project) => (
                                <div key={`${project.id}Key`}>
                                    <Project
                                        key={project.id}
                                        id={project.id}
                                        name={project.name}
                                        tasks={allTasks}
                                        handleTaskDeleted={handleTaskDeleted}
                                        handleEdit={handleEdit}
                                    />
                                    <div
                                        key={`${project.id}Btns`}
                                        className="projectBtns"
                                    >
                                        <Button
                                            key={`${project.id}AddBtn`}
                                            className="projectAddTaskBtn"
                                            type="button"
                                            onClick={handleAddTask}
                                        >
                                            <Icon
                                                className="sidebarIcons"
                                                id={project.name}
                                                src="/icons/plus.svg"
                                                alt="add"
                                            />
                                        </Button>
                                        <Button
                                            key={`${project.id}DeleteBtn`}
                                            type="Button"
                                            className="projectDeleteBtn"
                                            onClick={() =>
                                                handleDeleteProject(
                                                    project.name
                                                )
                                            }
                                        >
                                            <Icon
                                                className="sidebarIcons"
                                                src="/icons/trash-can-outline.svg"
                                            />
                                        </Button>
                                    </div>
                                </div>
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
        src: '/icons/plus.svg',
        onClick: null,
    },
    {
        name: 'Dashboard',
        id: 'dashboardBtn',
        src: '/icons/home-outline.svg',
        onClick: null,
    },
    // {
    //     name: 'Inbox',
    //     id: 'inboxBtn',
    //     src: '/icons/inbox.svg',
    //     onClick: null,
    // },
    {
        name: 'Today',
        id: 'todayBtn',
        src: '/icons/calendar-check.svg',
        onClick: null,
    },
];

let projectButtons = [
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

const getTodaysDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const formatted = `${yyyy}-${mm}-${dd}`;
    console.log(formatted); // "2025-08-18"

    return formatted;
};

export default App;
