import Button from './Button';
import Icon from './Icon';
import { useState } from 'react';
import TaskList from './TaskList';
import ProjectHeader from './ProjectHeader';

const icons = {
    expand: '/icons/menu-down.svg',
    collapse: '/icons/menu-right.svg',
};

export default function Project({
    project,
    projects,
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
                        projects={projects}
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
                taskCount={project.tasks?.length || 0}
                iconSrc={isExpanded ? icons.expand : icons.collapse}
                onClick={handleExpand}
            />
            {showTaskList()}
        </div>
    );
}
