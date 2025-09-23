import { useState } from 'react';
import Button from './Button';
import Icon from './Icon';
import TaskForm from './TaskForm';

export function TaskList({ tasks, projectName, handleDeleteTask, handleEdit }) {
    if (tasks.length === 0) {
        return <p>No tasks</p>;
    }

    console.log('TaskList Tasks:', tasks);
    return (
        <ul className="taskList">
            {tasks.map((task, idx) => {
                return (
                    <li key={task.id ?? idx}>
                        <Task
                            task={task}
                            projectName={projectName}
                            handleDeleteTask={handleDeleteTask}
                            handleEdit={handleEdit}
                        />
                    </li>
                );
            })}
        </ul>
    );
}

export default function Task({
    task,
    projectName,
    handleDeleteTask,
    handleEdit,
}) {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        console.log('Task clicked!');
        console.log(task);
        setIsClicked(!isClicked);
    };

    return (
        <>
            <div className="task" onClick={handleClick}>
                <p className="taskTitle">{task.title}</p>
                <p className="taskText">{task.text}</p>
            </div>
            {isClicked && (
                <TaskDetails
                    task={task}
                    projectName={projectName}
                    handleClose={handleClick}
                    handleDeleteTask={handleDeleteTask}
                    handleEdit={handleEdit}
                />
            )}
        </>
    );
}

function TaskDetails({
    task,
    projectName,
    handleClose,
    handleDeleteTask,
    handleEdit,
}) {
    // const [isEdit, setIsEdit] = useState(null);
    console.log('Task details project: ', projectName);

    return (
        <div className="overlay">
            <div id="taskDetails">
                <div id="detailsTitleDescription">
                    <p id="detailsTitle">{task.title}</p>
                    <p id="detailsDescription">{task.text}</p>
                </div>
                <div id="detailsSidebar">
                    <div id="detailsSidebarHeader">
                        <Button
                            type="Button"
                            className="detailsBtn"
                            onClick={() => handleDeleteTask(task.id)} // needs wrapper function because it has arguments
                        >
                            <Icon
                                className="detailsSidebarIcons"
                                src="/icons/trash-can-outline.svg"
                            />
                        </Button>
                        <Button
                            type="Button"
                            className="detailsBtn"
                            onClick={() => handleEdit(task.id, handleClose)}
                        >
                            <Icon
                                className="detailsSidebarIcons"
                                src="/icons/square-edit-outline.svg"
                            />
                        </Button>
                        <Button
                            type="Button"
                            className="detailsBtn"
                            onClick={handleClose}
                        >
                            <Icon
                                className="detailsSidebarIcons"
                                src="/icons/close.svg"
                            />
                        </Button>
                    </div>
                    <SidebarDetail
                        name="Project"
                        taskDetail={projectName}
                        iconSrc="/icons/pound.svg"
                    />
                    <SidebarDetail
                        name="Due"
                        taskDetail={task.dueDate} // extract YYYY-MM-DD
                        iconSrc="/icons/calendar-blank.svg"
                    />
                    <SidebarDetail
                        name="Priority"
                        taskDetail={task.priority}
                        iconSrc="/icons/star-outline.svg"
                    />
                </div>
            </div>
        </div>
    );
}

function SidebarDetail({ name, taskDetail, iconSrc }) {
    return (
        <div className="detailsSidebarBody">
            <p>{name}</p>
            <div>
                <Icon className="detailsIcons" src={iconSrc} alt="hashtag" />
                <p>{taskDetail}</p>
            </div>
        </div>
    );
}
