export default function Task({ task }) {
    return (
        <div className="task" id={task.id}>
            <p className="taskTitle">{task.title}</p>
            <p className="taskText">{task.text}</p>
        </div>
    );
}
