import Project from './Project';
export default function Dashboard({
    tasks,
    projects,
    handleDeleteTask,
    handleEdit,
    handleAddTaskClick,
}) {
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
