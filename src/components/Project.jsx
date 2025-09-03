import Button from './Button';
import Icon from './Icon';
import { useState } from 'react';
import { TaskList } from './Task';

const icons = {
    expand: '/icons/menu-down.svg',
    collapse: '/icons/menu-right.svg',
};

function ProjectHeader({ projectName, iconSrc, onClick }) {
    return (
        <div className="projectHeader">
            <Button className="listExpandCollapse" onClick={onClick}>
                <Icon
                    className="contentIcons"
                    src={iconSrc}
                    alt="Expand-Collapse"
                    id="expandCollapseIcon"
                ></Icon>
            </Button>
            <p className="projectTitle">{projectName}</p>
        </div>
    );
}

export default function Project({ id, name, tasks, handleTaskDeleted }) {
    const [isExpanded, setIsExpanded] = useState(true);

    const handleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // convert to useEffect when the app is connected to a server
    const showTaskList = () => {
        if (isExpanded) {
            return (
                <TaskList
                    tasks={
                        name === 'All'
                            ? tasks
                            : tasks.filter((task) => task.project === name)
                    }
                    handleTaskDeleted={handleTaskDeleted}
                />
            );
        }
    };

    return (
        <div className="project" id={id}>
            <ProjectHeader
                projectName={name}
                iconSrc={isExpanded ? icons.expand : icons.collapse}
                onClick={handleExpand}
            />
            {showTaskList()}
        </div>
    );
}
