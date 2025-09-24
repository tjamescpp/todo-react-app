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
import Dashboard from './components/Dashboard.jsx';

function App() {
    const [users, setUsers] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [allProjects, setAllProjects] = useState([]);
    const [projectButtons, setProjectButtons] = useState([]);
    const [isAddTask, setIsAddTask] = useState(false);
    const [isEditTask, setIsEditTask] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [status, setStatus] = useState('dashboard');
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
                console.log('Tasks fetched:', data);
            } catch (error) {
                console.error('Failed to fetch tasks', error);
            }
        };

        fetchTasks();
    }, [apiCall]);

    useEffect(() => {
        console.log('allTasks updated:', allTasks);
    }, [allTasks]);

    // fetch all projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await apiCall('/projects');
                setAllProjects(data);

                // create project buttons for the sidebar
                const buttons = data.map((project, idx) => {
                    return {
                        id: idx,
                        name: project.name,
                        src: projectIcon,
                        onClick: handleProjectButton,
                    };
                });
                setProjectButtons(buttons);

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
        console.log('All Tasks:', allTasks);
        try {
            const res = await fetch(
                `http://localhost:3000/tasks/${users[0].id}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: newTask.title,
                        text: newTask.text,
                        projectId: newTask.projectId,
                        dueDate: newTask.dueDate,
                        priority: newTask.priority,
                    }),
                }
            );
            const createdTask = await res.json();
            updateProjectTasks(createdTask);
            setAllTasks((prevTasks) => [...prevTasks, createdTask]);
            setIsAddTask(false);
            console.log('New task created:', createdTask);
        } catch (error) {
            console.error('Failed to create task...', error);
        }
    };

    const handleEditTask = async (task) => {
        console.log('Editing task:', task);
        try {
            const res = await fetch(`http://localhost:3000/tasks/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: task.title,
                    text: task.text,
                    projectId: task.projectId,
                    dueDate: task.dueDate,
                    priority: task.priority,
                }),
            });

            const updatedTask = await res.json();
            updateProjectTasks(updatedTask);
            setAllTasks((prevTasks) =>
                prevTasks.filter((task) => task.id !== updatedTask.id)
            );
            setAllTasks((prevTasks) => [...prevTasks, updatedTask]);
            setIsEditTask(false);
            console.log('Edited task:', updatedTask);
        } catch (error) {
            console.error('Failed to edit task...', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        const prevProjects = allProjects;

        // get project id
        const projectId = allTasks.find((task) => task.id === taskId).projectId;
        console.log('Deleting task for projectId:', projectId);
        console.log('Deleting taskId:', taskId);

        // Optimistically remove task from project
        setAllProjects((prevProjects) =>
            prevProjects.map((project) =>
                project.id === projectId
                    ? {
                          ...project,
                          tasks: project.tasks.filter(
                              (task) => task.id !== taskId
                          ),
                      }
                    : project
            )
        );

        // Update all tasks
        setAllTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== taskId)
        );

        try {
            const deletedTask = await apiCall(`/tasks/${taskId}`, {
                method: 'DELETE',
            });
            console.log('Deleting task:', deletedTask);

            const updatedProjects = await apiCall('/projects');
            console.log('Updated projects:', updatedProjects);
            // setAllProjects(updatedProjects);
        } catch (error) {
            console.error('Failed to delete task', error);
            // only re-render if the delete fails so it doesn't re-render twice
            setAllProjects(prevProjects);
        }
    };

    const handleAddTaskClicked = (e) => {
        console.log('Add task clicked...');

        const projectName = e.target.id;
        !projectName || projectName === 'All'
            ? setAddTaskProject('Project')
            : setAddTaskProject(projectName);
        setIsAddTask(true);
    };

    const handleCancel = (e) => {
        e.preventDefault();
        console.log('Cancel clicked...');
        setIsAddTask(false);
        setIsEditTask(false);
    };

    const handleEditClicked = async (taskId, handleClose) => {
        console.log('Edit clicked...');
        const task = allTasks.find((task) => task.id === taskId);
        console.log('Edit task:', task);
        setEditTask(task);
        setIsEditTask(true);
        console.log('Edit clicked status:', isEditTask);
        handleClose();
    };

    const handleDashboard = () => {
        console.log('Home clicked...');
        setStatus('dashboard');
    };

    const handleToday = () => {
        console.log('Today clicked...');
        setStatus('today');
    };

    const handleProjectButton = (e) => {
        const projectName = e.target.textContent;
        console.log(`Clicked on ${projectName} button`);

        projectName.toLowerCase() === 'my projects'
            ? setStatus('projects')
            : setStatus(projectName);
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

                // projectButtons.push({
                //     ...project,
                //     src: projectIcon,
                //     onClick: null,
                // });

                setAllProjects([...allProjects, project]);
                setNewProjectName('');
                setAddNewProject(false);
            }
        }
    };

    const handleDeleteProject = (projectName) => {
        console.log(projectName);
        setAllProjects(allProjects.filter((p) => p.name !== projectName));
        // projectButtons = projectButtons.filter((p) => p.name !== projectName);
        setAllTasks(allTasks.filter((t) => t.project !== projectName));
        setStatus('home');
    };

    function updateProjectTasks(createdTask) {
        setAllProjects((prevProjects) =>
            prevProjects.map((project) =>
                project.id === createdTask.projectId
                    ? {
                          ...project,
                          tasks: [...project.tasks, createdTask],
                      }
                    : project
            )
        );
    }

    // helper function for sidebar project buttons
    // displays project by name that equals the status
    function displayProjectByName() {
        return allProjects
            .filter((project) => project.name === status)
            .map((project) => (
                <div key={`${project.id}-key`}>
                    <Project
                        project={project}
                        handleDeleteTask={handleDeleteTask}
                        handleEdit={handleEditClicked}
                        handleDeleteProject={handleDeleteProject}
                        projectView={true}
                    />
                </div>
            ));
    }

    // const createProjectButtons = (projects) => {
    //     return projects.map((project) => {
    //         return {
    //             name: project.name,
    //             src: projectIcon,
    //             onClick: handleProjectButton,
    //         };
    //     });
    // };

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
            onClick: handleAddTaskClicked,
        },
        {
            name: 'Dashboard',
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

    // projectButtons.map((button) => (button.onClick = handleProjectButton));

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
                        <Button
                            className="sidebarBtn"
                            type="button"
                            id="allProjectBtn"
                            onClick={handleProjectButton}
                        >
                            <p id="projectListHeader">My Projects</p>
                        </Button>
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
                        <>
                            {console.log('isEditTask:', isEditTask)}
                            {console.log('isAddTask:', isAddTask)}
                            {console.log('editTask:', editTask)}
                            <TaskForm
                                projects={allProjects}
                                handleCancel={handleCancel}
                                handleConfirm={
                                    isEditTask ? handleEditTask : handleAddTask
                                }
                                task={isEditTask ? editTask : null}
                                projectName={isEditTask ? null : addTaskProject}
                            />
                        </>
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
                                {status === 'dashboard' && (
                                    <Dashboard
                                        tasks={allTasks}
                                        projects={allProjects}
                                        handleDeleteTask={handleDeleteTask}
                                        handleEdit={handleEditClicked}
                                        handleAddTaskClick={
                                            handleAddTaskClicked
                                        }
                                    />

                                    // <>
                                    //     <ProjectHeader
                                    //         projectName="Dashboard"
                                    //         taskCount={allTasks.length}
                                    //     />
                                    //     <TaskList
                                    //         tasks={allTasks}
                                    //         handleTaskDeleted={handleDeleteTask}
                                    //         handleEdit={handleEdit}
                                    //     />
                                    //     {allProjects.map((project) => (
                                    //         <div key={`${project.id}Key`}>
                                    //             <Project
                                    //                 key={project.id}
                                    //                 project={project}
                                    //                 handleDeleteTask={
                                    //                     handleDeleteTask
                                    //                 }
                                    //                 handleEdit={handleEdit}
                                    //                 handleAddTask={
                                    //                     handleAddTaskClick
                                    //                 }
                                    //             />
                                    //         </div>
                                    //     ))}
                                    // </>
                                )}
                                {status === 'projects' &&
                                    allProjects.map((project) => (
                                        <div key={`${project.id}Key`}>
                                            <Project
                                                key={project.id}
                                                project={project}
                                                handleDeleteTask={
                                                    handleDeleteTask
                                                }
                                                handleEdit={handleEditClicked}
                                                handleAddTask={
                                                    handleAddTaskClicked
                                                }
                                            />
                                        </div>
                                    ))}
                                {status === 'today' && (
                                    <>
                                        <ProjectHeader
                                            projectName="Today"
                                            taskCount={
                                                allTasks.filter(
                                                    (task) =>
                                                        task.dueDate ===
                                                        getTodaysDate()
                                                ).length
                                            }
                                        />
                                        <TaskList
                                            tasks={allTasks.filter(
                                                (task) =>
                                                    task.dueDate ===
                                                    getTodaysDate()
                                            )}
                                            handleTaskDeleted={handleDeleteTask}
                                            handleEdit={handleEditClicked}
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

// let projectButtons = [
//     {
//         name: 'General',
//         id: 'generalProjectBtn',
//         src: projectIcon,
//         onClick: null,
//     },
//     {
//         name: 'Fitness',
//         id: 'fitnessProjectBtn',
//         src: projectIcon,
//         onClick: null,
//     },
//     {
//         name: 'School',
//         id: 'schoolProjectBtn',
//         src: projectIcon,
//         onClick: null,
//     },
// ];

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
