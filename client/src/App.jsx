import { useState, useEffect, useRef } from 'react';
import './App.css';
import Button from './components/Button.jsx';
import Icon from './components/Icon.jsx';
import Project, { ProjectHeader } from './components/Project.jsx';
import Sidebar from './components/Sidebar.jsx';
import SidebarHeader from './components/SidebarHeader.jsx';
import SidebarList from './components/SidebarList.jsx';
import ToDoList from './components/ToDoList.jsx';
import TaskForm from './components/TaskForm.jsx';
import { TaskList } from './components/Task.jsx';
import projectIcon from '/icons/pound.svg';
import { LoadingSpinner } from './components/LoadingSpinner.jsx';
import { useApi } from './hooks/useApi.js';

function App() {
    const [users, setUsers] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [allProjects, setAllProjects] = useState([]);
    const [isAddTask, setIsAddTask] = useState(false);
    // const [isTaskAdded, setIsTaskAdded] = useState(false);
    const [isEditTask, setIsEditTask] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [status, setStatus] = useState('home');
    const [addNewProject, setAddNewProject] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [addTaskProject, setAddTaskProject] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    // const [error, setError] = useState(null);
    // const [loading, setLoading] = useState(true);
    const { apiCall, loading, error } = useApi();

    const contentRef = useRef(null);

    // fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await apiCall('/users');
                setUsers(data);
                console.log('Users fetched:', data);
            } catch (error) {
                console.error('Failed to fetch users', error);
            }
        };

        fetchUsers();
    }, [apiCall]);

    // fetch all tasks
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await apiCall('/tasks');
                setAllTasks(data);
                // setIsTaskAdded(false);
                console.log('Tasks fetched:', data);
            } catch (error) {
                console.error('Failed to fetch tasks', error);
            }
        };

        fetchTasks();
    }, [apiCall]);

    // fetch all projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await apiCall('/projects');
                setAllProjects(data);
                console.log('Projects fetched:', data);
            } catch (error) {
                console.error('Failed to fetch projects', error);
            }
        };

        fetchProjects();
    }, [apiCall]);

    // adds a bottom border to the content header when the page scrolls
    useEffect(() => {
        const handleScroll = () => {
            if (contentRef.current.scrollTop > 0) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        const contentEl = contentRef.current;
        contentEl.addEventListener('scroll', handleScroll);

        return () => {
            contentEl.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // onClick handlers

    const handleAddTask = async (newTask) => {
        try {
            const data = await apiCall(`/tasks/${users[0].id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newTask.title,
                    text: newTask.text,
                    projectId: newTask.projectId,
                    dueDate: newTask.dueDate,
                    priority: newTask.priority,
                }),
            });

            setAllProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project.id === newTask.projectId
                        ? { ...project, tasks: [...project.tasks, newTask] }
                        : project
                )
            );

            // setIsTaskAdded(true);
            setAllTasks((prev) => [...prev, data]);
            setIsAddTask(false);
            console.log('New task created:', data);
        } catch (error) {
            console.error('Failed to create task...', error);
        }
    };

    const handleTaskDeleted = (taskId) => {
        console.log('Deleting task...');
        setAllTasks((allTasks) =>
            allTasks.filter((task) => task.id !== taskId)
        );
    };

    const handleAddTaskClick = (e) => {
        console.log('Add task clicked...');
        console.log(e.target.id);
        e.target.id
            ? setAddTaskProject(e.target.id)
            : setAddTaskProject('Project');
        setIsAddTask(true);
    };

    const handleCancel = (e) => {
        e.preventDefault();
        console.log('Cancel clicked...');
        setIsAddTask(false);
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
        console.log('Home clicked...');
        setStatus('home');
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
        setStatus('home');
    };

    // helper function for sidebar project buttons
    // displays project by name that equals the status
    function displayProjectByName() {
        return allProjects
            .filter((project) => project.name === status)
            .map((project) => (
                <div key={`${project.id}-key`}>
                    <Project
                        project={project}
                        tasks={allTasks}
                        handleTaskDeleted={handleTaskDeleted}
                        handleEdit={handleEdit}
                        handleDeleteProject={handleDeleteProject}
                        projectView={true}
                    />
                </div>
            ));
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
            onClick: handleAddTaskClick,
        },
        {
            name: 'Home',
            id: 'homeBtn',
            src: '/icons/home-outline.svg',
            onClick: handleDashboard,
        },
        {
            name: 'Today',
            id: 'todayBtn',
            src: '/icons/calendar-check.svg',
            onClick: handleToday,
        },
    ];

    projectButtons.map((button) => (button.onClick = handleProjectButton));

    // assign handleProjectButton to each project button
    if (error) {
        return <p>A network error has occured...</p>;
    } else
        return (
            <div id="container">
                <Sidebar>
                    {users.length !== 0 && <SidebarHeader user={users[0]} />}
                    <SidebarList buttons={sidebarButtons} />
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
                                onChange={(e) =>
                                    setNewProjectName(e.target.value)
                                }
                                onKeyDown={handleNewProjectInput}
                            />
                        )}
                        <SidebarList
                            listId="projectSidebarList"
                            buttons={projectButtons}
                        />
                    </div>
                </Sidebar>
                <div id="content" ref={contentRef}>
                    {(isAddTask || isEditTask) && (
                        <TaskForm
                            projects={allProjects}
                            handleCancel={handleCancel}
                            handleConfirm={handleAddTask}
                            task={isEditTask ? editTask : null}
                            projectName={
                                isEditTask ? editTask.name : addTaskProject
                            }
                        />
                    )}
                    <div
                        id="contentHeader"
                        className={scrolled ? 'scrolled' : ''}
                    >
                        <p>Tasker</p>
                        <p id="status">/ {status.toLowerCase()}</p>
                    </div>
                    <div id="toDoWrapper">
                        {loading ? (
                            <LoadingSpinner />
                        ) : (
                            <ToDoList>
                                {status === 'home' &&
                                    allProjects.map((project) => (
                                        <div key={`${project.id}Key`}>
                                            <Project
                                                key={project.id}
                                                project={project}
                                                handleTaskDeleted={
                                                    handleTaskDeleted
                                                }
                                                handleEdit={handleEdit}
                                                handleAddTask={
                                                    handleAddTaskClick
                                                }
                                            />
                                        </div>
                                    ))}
                                {status === 'today' && (
                                    <>
                                        <ProjectHeader
                                            projectName="Today"
                                            iconSrc="/icons/check.svg"
                                        />
                                        <TaskList
                                            tasks={allTasks.filter(
                                                (task) =>
                                                    task.dueDate ===
                                                    getTodaysDate()
                                            )}
                                            projects={allProjects}
                                            handleTaskDeleted={
                                                handleTaskDeleted
                                            }
                                            handleEdit={handleEdit}
                                        />
                                    </>
                                )}
                                {allProjects.some(
                                    (project) => project.name === status
                                ) && displayProjectByName()}
                            </ToDoList>
                        )}
                    </div>
                </div>
            </div>
        );
}

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
