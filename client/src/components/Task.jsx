import { useState } from 'react';
import Button from './Button';
import Icon from './Icon';

export default function Task({ task, projects, handleDeleteTask, handleEdit }) {
    const [isClicked, setIsClicked] = useState(false);

    const priorityColor =
        task.priority === 'p2'
            ? 'orange'
            : task.priority === 'p3'
            ? 'var(--button-red)'
            : 'darkgray';

    const handleClick = () => {
        console.log('Task clicked!');
        console.log(task);
        setIsClicked(!isClicked);
    };

    return (
        <>
            <div className="task" onClick={handleClick}>
                <p className="taskTitle">{task.title}</p>
                <div className="taskText">
                    {task.text}
                    <svg
                        id="priorityFlag"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={`${priorityColor}`}
                    >
                        <title>flag-variant-outline</title>
                        <path d="M6,3A1,1 0 0,1 7,4V4.88C8.06,4.44 9.5,4 11,4C14,4 14,6 16,6C19,6 20,4 20,4V12C20,12 19,14 16,14C13,14 13,12 11,12C8,12 7,14 7,14V21H5V4A1,1 0 0,1 6,3M7,7.25V11.5C7,11.5 9,10 11,10C13,10 14,12 16,12C18,12 18,11 18,11V7.5C18,7.5 17,8 16,8C14,8 13,6 11,6C9,6 7,7.25 7,7.25Z" />
                    </svg>
                </div>
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

function TaskDetails({
    task,
    projects,
    handleClose,
    handleDeleteTask,
    handleEdit,
}) {
    const project = projects.find((project) => project.id === task.projectId);
    console.log('Task project: ', project);

    const priorityColor =
        task.priority === 'p2'
            ? 'orange'
            : task.priority === 'p3'
            ? 'var(--button-red)'
            : 'darkgray';

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
                    <>
                        <p>Priority</p>
                        <svg
                            id="priorityFlag"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={`${priorityColor}`}
                        >
                            <title>flag-variant-outline</title>
                            <path d="M6,3A1,1 0 0,1 7,4V4.88C8.06,4.44 9.5,4 11,4C14,4 14,6 16,6C19,6 20,4 20,4V12C20,12 19,14 16,14C13,14 13,12 11,12C8,12 7,14 7,14V21H5V4A1,1 0 0,1 6,3M7,7.25V11.5C7,11.5 9,10 11,10C13,10 14,12 16,12C18,12 18,11 18,11V7.5C18,7.5 17,8 16,8C14,8 13,6 11,6C9,6 7,7.25 7,7.25Z" />
                        </svg>
                    </>
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
