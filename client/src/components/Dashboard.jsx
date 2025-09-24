import Project, { ProjectHeader } from './Project';
import { TaskList } from './Task';

export default function Dashboard({
    tasks,
    handleDeleteTask,
    handleEdit,
    projects,
    handleAddTaskClick,
}) {
    const newProject = {
        id: crypto.randomUUID(),
        name: 'All',
        tasks: tasks,
    };

    return (
        <>
            {/* <ProjectHeader projectName="Dashboard" taskCount={tasks.length} />
            <TaskList
                tasks={tasks}
                handleTaskDeleted={handleDeleteTask}
                handleEdit={handleEdit}
            /> */}
            <Project
                project={newProject}
                handleDeleteTask={handleDeleteTask}
                handleEdit={handleEdit}
                handleAddTask={handleAddTaskClick}
            />
            {projects.map((project) => (
                <div key={`${project.id}Key`}>
                    <Project
                        project={project}
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
