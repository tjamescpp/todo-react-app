import { useState } from 'react';
import Button from './Button';
import Icon from './Icon';

function TaskDetails({ task, handleClose }) {
    return (
        <div id="taskDetails">
            <div id="detailsTitleDescription">
                <p id="detailsTitle">{task.title}</p>
                <p id="detailsDescription">{task.text}</p>
            </div>
            <div id="detailsSidebar">
                <div id="detailsSidebarHeader">
                    <Button type="Button" className="detailsBtn">
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

export default function Task({ task }) {
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
            {isClicked && <TaskDetails task={task} handleClose={handleClick} />}
        </>
    );
}

export function TaskList({ tasks, id }) {
    return (
        <ul className="taskList" id={id}>
            {tasks.map((task) => {
                return (
                    <li key={task.id}>
                        <Task task={task} />
                    </li>
                );
            })}
        </ul>
    );
}
