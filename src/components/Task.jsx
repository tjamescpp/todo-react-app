import { useState } from 'react';
import Button from './Button';
import Icon from './Icon';

export function TaskList({ tasks, handleTaskDeleted }) {
    return (
        <ul className="taskList">
            {tasks.map((task) => {
                return (
                    <li key={task.id}>
                        <Task
                            task={task}
                            handleTaskDeleted={handleTaskDeleted}
                        />
                    </li>
                );
            })}
        </ul>
    );
}

export default function Task({ task, handleTaskDeleted }) {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        console.log('Task clicked!');
        setIsClicked(!isClicked);
    };

    return (
        <>
            <div className="task" id={task.id} onClick={handleClick}>
                <p className="taskTitle">{task.title}</p>
                <p className="taskText">{task.text}</p>
            </div>
            {isClicked && (
                <TaskDetails
                    task={task}
                    handleClose={handleClick}
                    handleTaskDeleted={handleTaskDeleted}
                />
            )}
        </>
    );
}

function TaskDetails({ task, handleClose, handleTaskDeleted }) {
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
                            onClick={() => handleTaskDeleted(task.id)} // needs wrapper function because it has arguments
                        >
                            <Icon
                                className="detailsSidebarIcons"
                                src="/icons/trash-can-outline.svg"
                            />
                        </Button>
                        <Button type="Button" className="detailsBtn">
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
                        taskDetail={task.project}
                        iconSrc="/icons/pound.svg"
                    />
                    <SidebarDetail
                        name="Due"
                        taskDetail={task.dueDate}
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
