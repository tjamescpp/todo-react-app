import CheckButton from './CheckButton';
import Task from './Task';

export default function TaskList({
    tasks,
    projects,
    handleDeleteTask,
    handleEdit,
}) {
    if (!tasks || tasks.length === 0) {
        return <p>No tasks</p>;
    }

    return (
        <>
            <ul className="taskList">
                {
                    // sort by oldest first then return a list of tasks
                    tasks
                        .sort(
                            (a, b) =>
                                new Date(a.createdAt) - new Date(b.createdAt)
                        )
                        .map((task, idx) => {
                            return (
                                <li key={task.id ?? idx}>
                                    <CheckButton
                                        handleDeleteTask={handleDeleteTask}
                                        task={task}
                                    ></CheckButton>
                                    <Task
                                        task={task}
                                        projects={projects}
                                        handleDeleteTask={handleDeleteTask}
                                        handleEdit={handleEdit}
                                    />
                                </li>
                            );
                        })
                }
            </ul>
        </>
    );
}
