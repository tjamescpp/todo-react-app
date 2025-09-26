import { useState } from 'react';
import Button from './Button';
import Icon from './Icon';
import CheckButton from './CheckButton';

export default function Task({ task, projects, handleDeleteTask, handleEdit }) {
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
                    projects={projects}
                    handleClose={handleClick}
                    handleDeleteTask={handleDeleteTask}
                    handleEdit={handleEdit}
                />
            )}
        </>
    );
}

export function TaskList({ tasks, projects, handleDeleteTask, handleEdit }) {
    if (!tasks || tasks.length === 0) {
        return <p>No tasks</p>;
    }

    console.log('TaskList Tasks:', tasks);
    return (
        <ul className="taskList">
            {tasks.map((task, idx) => {
                return (
                    // <div>
                    <li key={task.id ?? idx}>
                        <CheckButton
                            handleDeleteTask={handleDeleteTask}
                            task={task}
                        ></CheckButton>
                        {/* <button
                            onClick={() => handleDeleteTask(task.id)}
                            id="taskIconBtn"
                            aria-label="Delete"
                        ></button> */}
                        <Task
                            task={task}
                            projects={projects}
                            handleDeleteTask={handleDeleteTask}
                            handleEdit={handleEdit}
                        />
                    </li>
                    // </div>
                );
            })}
        </ul>
    );
}

function TaskDetails({
    task,
    projects,
    handleClose,
    handleDeleteTask,
    handleEdit,
}) {
    const project = projects.find((project) => project.id === task.projectId);
    console.log('Task project: ', project);

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
                        taskDetail={project.name}
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
