import { useRef, useState, useEffect } from 'react';
import ToDoList from './ToDoList.jsx';
import TaskForm from './TaskForm.jsx';
import TaskList from './TaskList.jsx';
import Project from './Project.jsx';
import ProjectHeader from './ProjectHeader.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import Dashboard from './Dashboard.jsx';
import Confirmation from './Confirmation.jsx';

export default function Content({
    API_URL,
    user,
    tasks,
    setTasks,
    projects,
    setProjects,
    status,
    setStatus,
    loading,
    isAddTask,
    setIsAddTask,
    searchTaskResults,
    addTaskProject,
    projectButtons,
    handleAddTaskClicked,
}) {
    const [editTask, setEditTask] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isEditTask, setIsEditTask] = useState(false);
    const [deleteProject, setDeleteProject] = useState(null);
    const contentRef = useRef(null);

    // adds a bottom border to the content header when the page scrolls
    useEffect(() => {
        const handleScroll = () => {
            if (contentRef.current.scrollTop > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        const contentEl = contentRef.current;
        contentEl.addEventListener('scroll', handleScroll);

        return () => {
            contentEl.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        console.log('Content status:', status);
    }, [status]);

    const handleCancel = (e) => {
        e.preventDefault();
        setIsAddTask(false);
        setIsEditTask(false);
    };

    const handleEditTask = async (task, oldProjectId) => {
        try {
            const res = await fetch(`${API_URL}/tasks/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task),
            });

            const updatedTask = await res.json();
            editProjectTasks(updatedTask, isEditTask, oldProjectId);

            setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
            setTasks((prevTasks) => [...prevTasks, updatedTask]);
            setIsEditTask(false);
        } catch (error) {
            console.error('Failed to edit task...', error);
        }

        return true;
    };

    const handleEditClicked = async (taskId, handleClose) => {
        const task = tasks.find((task) => task.id === taskId);
        setEditTask(task);
        setIsEditTask(true);
        handleClose();
    };

    const handleAddTask = async (newTask) => {
        try {
            const res = await fetch(`${API_URL}/tasks/${user.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask),
            });

            if (res.ok) {
                const createdTask = await res.json();
                const createdTaskProject = projects.find(
                    (project) => project.id === newTask.projectId
                );
                setProjects((prevProjects) =>
                    prevProjects.map((project) =>
                        project.id === newTask.projectId
                            ? {
                                  ...addProjectTask(
                                      createdTaskProject,
                                      createdTask
                                  ),
                              }
                            : project
                    )
                );
                setTasks((prevTasks) => [...prevTasks, createdTask]);
                setIsAddTask(false);
            }
        } catch (error) {
            console.error('Failed to create task...', error);
        }

        return true;
    };

    const handleDeleteTask = async (taskId) => {
        const prevProjects = projects;

        // get project id
        const projectId = tasks.find((task) => task.id === taskId).projectId;

        // Optimistically remove task from project
        setProjects((prevProjects) =>
            prevProjects.map((project) =>
                project.id === projectId
                    ? removeTaskFromProject(project, taskId)
                    : project
            )
        );

        // Update all tasks
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

        try {
            await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Failed to delete task', error);
            // only re-render if the delete fails so it doesn't re-render twice
            setProjects(prevProjects);
        }

        return true;
    };

    const handleDeleteProjectClicked = (projectName) => {
        setDeleteProject(projectName);
    };

    const handleDeleteProject = async (projectName) => {
        console.log('Deleting...', projectName);

        // get the project by name
        const project = projects.find(
            (project) => project.name === projectName
        );

        // update project project tasks to default projectId
        tasks.map((task) => {
            if (task.projectId === project.id) {
                task.projectId = 1;
            }
        });

        // delete project request
        await fetch(`${API_URL}/projects/${project.id}`, {
            method: 'DELETE',
        });

        setProjects(projects.filter((project) => project.name !== projectName));
        projectButtons = projectButtons.filter(
            (button) => button.name !== projectName
        );

        setStatus('dashboard');
        return true;
    };

    // helper function for sidebar project buttons
    // displays project by name that equals the status
    const displayProjectByName = () => {
        console.log('Display project by name...');
        const project = projects.filter(
            (project) => project.name.toLowerCase() === status
        );
        console.log('Project button:', project);

        return projects
            .filter((project) => project.name.toLowerCase() === status)
            .map((project) => (
                <div key={`${project.id}-key`}>
                    <Project
                        project={project}
                        projects={projects}
                        handleDeleteTask={handleDeleteTask}
                        handleEdit={handleEditClicked}
                        handleDeleteProject={handleDeleteProjectClicked}
                        handleAddTask={handleAddTaskClicked}
                        projectView={true}
                    />
                </div>
            ));
    };

    const editProjectTasks = (newTask, isEditTask, oldProjectId) => {
        setProjects((prevProjects) =>
            prevProjects.map((project) => {
                // If editing and project changed: remove from old project
                if (
                    isEditTask &&
                    project.id === oldProjectId &&
                    oldProjectId !== newTask.projectId
                ) {
                    return removeTaskFromProject(project, newTask.id);
                }

                // If editing within the same project: update the task
                if (
                    isEditTask &&
                    project.id === newTask.projectId &&
                    oldProjectId === newTask.projectId
                ) {
                    return updateProjectTasks(project, newTask);
                }

                // If editing and project changed: add to new project
                if (
                    isEditTask &&
                    project.id === newTask.projectId &&
                    oldProjectId !== newTask.projectId
                ) {
                    return addProjectTask(project, newTask);
                }

                // Adding a brand-new task (not editing)
                if (!isEditTask && project.id === newTask.projectId) {
                    return addProjectTask(project, newTask);
                }

                return project;
            })
        );
    };

    const addProjectTask = (project, newTask) => {
        return {
            ...project,
            tasks: project.tasks ? [...project.tasks, newTask] : [newTask],
        };
    };

    const updateProjectTasks = (project, newTask) => {
        return {
            ...project,
            tasks: project.tasks.map((task) =>
                task.id === newTask.id ? { ...task, ...newTask } : task
            ),
        };
    };

    const removeTaskFromProject = (project, taskId) => {
        return {
            ...project,
            tasks: project.tasks.filter((task) => task.id !== taskId),
        };
    };

    return (
        <div id="content" ref={contentRef}>
            {(isAddTask || isEditTask) && (
                <>
                    <TaskForm
                        projects={projects}
                        handleCancel={handleCancel}
                        handleConfirm={
                            isEditTask ? handleEditTask : handleAddTask
                        }
                        task={isEditTask ? editTask : null}
                        projectName={isEditTask ? null : addTaskProject}
                    />
                </>
            )}
            <div id="contentHeader" className={isScrolled ? 'scrolled' : ''}>
                <p>Tasker</p>
                <p id="status">/ {status.toLowerCase()}</p>
            </div>
            <div id="toDoWrapper">
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <ToDoList>
                        {status === 'search' && (
                            <>
                                <ProjectHeader
                                    projectName="Results"
                                    taskCount={searchTaskResults.length}
                                />
                                <TaskList
                                    tasks={searchTaskResults}
                                    projects={projects}
                                    handleTaskDeleted={handleDeleteTask}
                                    handleEdit={handleEditClicked}
                                />
                            </>
                        )}
                        {status === 'dashboard' && (
                            <Dashboard
                                tasks={tasks}
                                projects={projects}
                                handleDeleteTask={handleDeleteTask}
                                handleEdit={handleEditClicked}
                                handleAddTaskClick={handleAddTaskClicked}
                            />
                        )}
                        {status === 'projects' &&
                            projects.map((project) => (
                                <div key={`${project.id}Key`}>
                                    <Project
                                        key={project.id}
                                        project={project}
                                        projects={projects}
                                        handleDeleteTask={handleDeleteTask}
                                        handleEdit={handleEditClicked}
                                        handleAddTask={handleAddTaskClicked}
                                    />
                                </div>
                            ))}
                        {status === 'today' && (
                            <>
                                <ProjectHeader
                                    projectName="Today"
                                    taskCount={
                                        tasks.filter(
                                            (task) =>
                                                task.dueDate === getTodaysDate()
                                        ).length
                                    }
                                />
                                <TaskList
                                    tasks={tasks.filter(
                                        (task) =>
                                            task.dueDate === getTodaysDate()
                                    )}
                                    projects={projects}
                                    handleTaskDeleted={handleDeleteTask}
                                    handleEdit={handleEditClicked}
                                />
                            </>
                        )}
                        {deleteProject && (
                            <Confirmation
                                setDeleteProject={setDeleteProject}
                                handleDeleteProject={handleDeleteProject}
                                projectName={deleteProject}
                            />
                        )}
                        {projects.some(
                            (project) => project.name.toLowerCase() === status
                        ) && displayProjectByName()}
                    </ToDoList>
                )}
            </div>
        </div>
    );
}

const getTodaysDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formatted = `${yyyy}-${mm}-${dd}`;
    return formatted;
};
