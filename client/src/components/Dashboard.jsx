import { useEffect } from 'react';
import Project from './Project';
export default function Dashboard({
    tasks,
    projects,
    handleDeleteTask,
    handleEdit,
    handleAddTaskClick,
}) {
    useEffect(() => {
        console.log('Dashboard:');
        console.log('Tasks:', tasks);
        console.log('Projects:', projects);
    }, [tasks, projects]);

    const newProject = {
        id: crypto.randomUUID(),
        name: 'All',
        tasks: tasks,
    };

    return (
        <>
            <Project
                project={newProject}
                projects={projects}
                handleDeleteTask={handleDeleteTask}
                handleEdit={handleEdit}
                handleAddTask={handleAddTaskClick}
            />
            {projects.map((project) => (
                <div key={`${project.id}Key`}>
                    <Project
                        project={project}
                        projects={projects}
                        handleDeleteTask={handleDeleteTask}
                        handleEdit={handleEdit}
                        handleAddTask={handleAddTaskClick}
                        expand={false}
                    />
                </div>
            ))}
        </>
    );
}
