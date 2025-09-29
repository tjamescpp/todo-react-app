import { useRef, useState, useEffect } from 'react';
import ToDoList from './ToDoList.jsx';
import TaskForm from './TaskForm.jsx';
import { TaskList } from './Task.jsx';
import Project, { ProjectHeader } from './Project.jsx';
import { LoadingSpinner } from './LoadingSpinner.jsx';
import Dashboard from './Dashboard.jsx';

export default function Content({
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

    const handleCancel = (e) => {
        e.preventDefault();
        console.log('Cancel clicked...');
        setIsAddTask(false);
        setIsEditTask(false);
    };

    const handleEditTask = async (task, oldProjectId) => {
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
            updateProjectTasks(updatedTask, isEditTask, oldProjectId);

            setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
            setTasks((prevTasks) => [...prevTasks, updatedTask]);
            setIsEditTask(false);
            console.log('Edited task:', updatedTask);
        } catch (error) {
            console.error('Failed to edit task...', error);
        }
    };

    const handleEditClicked = async (taskId, handleClose) => {
        console.log('Edit clicked...');
        const task = tasks.find((task) => task.id === taskId);
        console.log('Edit task:', task);
        setEditTask(task);
        setIsEditTask(true);
        console.log('Edit clicked status:', isEditTask);
        handleClose();
    };

    const handleAddTask = async (newTask) => {
        console.log('All Tasks:', tasks);
        console.log('Adding task:', newTask);
        try {
            const res = await fetch(`http://localhost:3000/tasks/${user.id}`, {
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

            if (res.ok) {
                const createdTask = await res.json();
                updateProjectTasks(createdTask);
                setTasks((prevTasks) => [...prevTasks, createdTask]);
                setIsAddTask(false);
                console.log('New task created:', createdTask);
            }
        } catch (error) {
            console.error('Failed to create task...', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        const prevProjects = projects;

        // get project id
        const projectId = tasks.find((task) => task.id === taskId).projectId;
        console.log('Deleting taskId:', taskId);

        // Optimistically remove task from project
        setProjects((prevProjects) =>
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
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

        try {
            await fetch(`http://localhost:3000/tasks/${taskId}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Failed to delete task', error);
            // only re-render if the delete fails so it doesn't re-render twice
            setProjects(prevProjects);
        }
    };

    const handleDeleteProject = async (projectName) => {
        // get the project by name
        const project = projects.find(
            (project) => project.name === projectName
        );

        // update project project tasks to default projectId
        const updatedTasks = tasks.map((task) => {
            if (task.projectId === project.id) {
                task.projectId = 1;
            }
        });
        console.log('Updated tasks:', updatedTasks);

        console.log('Delete project id:', project.id);
        const res = await fetch(
            `http://localhost:3000/projects/${project.id}`,
            {
                method: 'DELETE',
            }
        );

        const deletedProject = await res.json();
        console.log('Deleted project:', deletedProject);

        setProjects(projects.filter((project) => project.name !== projectName));
        projectButtons = projectButtons.filter(
            (button) => button.name !== projectName
        );

        setStatus('dashboard');
    };

    // helper function for sidebar project buttons
    // displays project by name that equals the status
    function displayProjectByName() {
        return projects
            .filter((project) => project.name === status)
            .map((project) => (
                <div key={`${project.id}-key`}>
                    <Project
                        project={project}
                        projects={projects}
                        handleDeleteTask={handleDeleteTask}
                        handleEdit={handleEditClicked}
                        handleDeleteProject={handleDeleteProject}
                        handleAddTask={handleAddTaskClicked}
                        projectView={true}
                    />
                </div>
            ));
    }

    function updateProjectTasks(newTask, isEditTask, oldProjectId) {
        setProjects((prevProjects) =>
            prevProjects.map((project) => {
                // 📌 If editing and project changed: remove from old project
                if (
                    isEditTask &&
                    project.id === oldProjectId &&
                    oldProjectId !== newTask.projectId
                ) {
                    console.log(
                        '🗑️ Removing task from old project:',
                        project.name
                    );

                    return {
                        ...project,
                        tasks: project.tasks.filter(
                            (task) => task.id !== newTask.id
                        ),
                    };
                }

                // 📌 If editing within the same project: update the task
                if (
                    isEditTask &&
                    project.id === newTask.projectId &&
                    oldProjectId === newTask.projectId
                ) {
                    console.log('✏️ Updating task in project:', project.name);

                    return {
                        ...project,
                        tasks: project.tasks.map((task) =>
                            task.id === newTask.id
                                ? { ...task, ...newTask }
                                : task
                        ),
                    };
                }

                // 📌 If editing and project changed: add to new project
                if (
                    isEditTask &&
                    project.id === newTask.projectId &&
                    oldProjectId !== newTask.projectId
                ) {
                    console.log('📌 Adding task to new project:', project.name);

                    return {
                        ...project,
                        tasks: [...project.tasks, newTask],
                    };
                }

                // 📌 Adding a brand-new task (not editing)
                if (!isEditTask && project.id === newTask.projectId) {
                    console.log('➕ Adding new task to project:', project.name);

                    return {
                        ...project,
                        tasks: project.tasks
                            ? [...project.tasks, newTask]
                            : [newTask],
                    };
                }

                return project; // unchanged project
            })
        );
    }

    return (
        <div id="content" ref={contentRef}>
            {(isAddTask || isEditTask) && (
                <>
                    {console.log('Task form project:', addTaskProject)}
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
                        {projects.some((project) => project.name === status) &&
                            displayProjectByName()}
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
    console.log(formatted);

    return formatted;
};
