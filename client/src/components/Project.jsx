import Button from './Button';
import Icon from './Icon';
import { useState } from 'react';
import { TaskList } from './Task';
// import { useEffect } from 'react';

const icons = {
    expand: '/icons/menu-down.svg',
    collapse: '/icons/menu-right.svg',
};

export function ProjectHeader({ projectName, iconSrc, onClick }) {
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

export default function Project({
    id,
    name,
    tasks,
    handleTaskDeleted,
    handleEdit,
    handleAddTask,
    handleDeleteProject,
    projectView,
}) {
    const [isExpanded, setIsExpanded] = useState(true);

    const handleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // convert to useEffect when the app is connected to a server
    const showTaskList = () => {
        if (isExpanded) {
            return (
                <>
                    <TaskList
                        // tasks={
                        //     name === 'All'
                        //         ? tasks
                        //         : tasks.filter((task) => task.project === name)
                        // }
                        tasks={tasks}
                        handleTaskDeleted={handleTaskDeleted}
                        handleEdit={handleEdit}
                    />
                    <div className="projectBtns">
                        <Button
                            key={`${id}Btn`}
                            className="projectAddTaskBtn"
                            type="button"
                            onClick={handleAddTask}
                        >
                            <Icon
                                className="sidebarIcons"
                                src="/icons/plus.svg"
                                alt="add"
                            />
                            <p id={name}>Add task</p>
                        </Button>
                        {projectView && (
                            <Button
                                key={`${id}DeleteBtn`}
                                type="Button"
                                className="projectDeleteBtn"
                                onClick={() => handleDeleteProject(name)}
                            >
                                <Icon
                                    className="sidebarIcons"
                                    src="/icons/trash-can-outline.svg"
                                />
                                <p>Delete</p>
                            </Button>
                        )}
                    </div>
                </>
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
