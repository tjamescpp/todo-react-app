import Button from './Button';
import Icon from './Icon';
import { useState } from 'react';
import { TaskList } from './Task';
// import { useEffect } from 'react';

const icons = {
    expand: '/icons/menu-down.svg',
    collapse: '/icons/menu-right.svg',
};

export default function Project({
    project,
    allProjects,
    handleDeleteTask,
    handleEdit,
    handleAddTask,
    handleDeleteProject,
    projectView,
    expand = true,
}) {
    const [isExpanded, setIsExpanded] = useState(expand);

    const handleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // convert to useEffect when the app is connected to a server
    const showTaskList = () => {
        if (isExpanded) {
            return (
                <>
                    <TaskList
                        tasks={project.tasks}
                        projects={allProjects}
                        handleDeleteTask={handleDeleteTask}
                        handleEdit={handleEdit}
                    />
                    <div className="projectBtns">
                        <Button
                            key={`${project.name}Btn`}
                            className="projectAddTaskBtn"
                            type="button"
                            onClick={handleAddTask}
                        >
                            <Icon
                                className="sidebarIcons"
                                src="/icons/plus.svg"
                                alt="add"
                            />
                            <p id={project.name}>Add task</p>
                        </Button>
                        {projectView && (
                            <Button
                                key={`${project.name}DeleteBtn`}
                                type="Button"
                                className="projectDeleteBtn"
                                onClick={() =>
                                    handleDeleteProject(project.name)
                                }
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
        <div className="project">
            <ProjectHeader
                projectName={project.name}
                taskCount={project.tasks.length}
                iconSrc={isExpanded ? icons.expand : icons.collapse}
                onClick={handleExpand}
            />
            {showTaskList()}
        </div>
    );
}

export function ProjectHeader({ projectName, taskCount, iconSrc, onClick }) {
    return (
        <>
            <div id="projectHeader">
                {iconSrc && (
                    <Button className="listExpandCollapse" onClick={onClick}>
                        <Icon
                            className="contentIcons"
                            src={iconSrc}
                            alt="Expand-Collapse"
                            id="expandCollapseIcon"
                        ></Icon>
                    </Button>
                )}
                <p id="projectTitle">{projectName}</p>
                <p id="projectTaskCount">{taskCount}</p>
            </div>
        </>
    );
}
