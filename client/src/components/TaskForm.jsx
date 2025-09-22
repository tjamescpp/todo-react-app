import { useState } from 'react';
import Button from './Button';
import Icon from './Icon';
// import { projects } from '../data';
import { useEffect } from 'react';

export default function TaskForm({
    projects,
    handleCancel,
    handleConfirm,
    task,
    projectName,
}) {
    const [isDropdown, setIsDropdown] = useState(false);
    const [projectValue, setProjectValue] = useState(projectName);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('');
    const [projectId, setProjectId] = useState('');

    // when editing, load values from task into state
    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setText(task.text || '');
            setDueDate(task.dueDate || '');
            setPriority(task.priority || '');
            setProjectId(task.project || '');
            setProjectValue(task.project || '');
        }
    }, [task]);

    const onSubmit = (e) => {
        e.preventDefault();
        handleConfirm({
            ...task, // keep existing id if editing
            title,
            text,
            dueDate,
            priority,
            projectId,
        });
    };

    console.log('Editing task:', task);
    console.log('Project:', projectValue);

    const handleProjectDropdown = () => {
        console.log('Project dropdown clicked...');
        setIsDropdown(true);
    };

    const handleProjectValue = (value) => {
        setProjectValue(value);
        setProjectId(projects.find((project) => project.name === value).id);
        setIsDropdown(false);
    };

    return (
        <div className="overlay">
            <div id="addTaskForm">
                <form onSubmit={onSubmit}>
                    <fieldset>
                        <input
                            id="taskTitleInput"
                            type="text"
                            placeholder="Take the dog for a walk"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            id="taskDescriptionText"
                            placeholder="Description"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <div id="projectDatePriority">
                            <div>
                                <Button
                                    id="projectBtn"
                                    type="button"
                                    onClick={handleProjectDropdown}
                                >
                                    <div id="projectDropdown">
                                        <p id="projectValue">{projectValue}</p>
                                        <Icon
                                            id="projectMenuIcon"
                                            src="/icons/menu-down.svg"
                                            alt="project dropdown"
                                        />
                                    </div>
                                </Button>
                                {isDropdown && (
                                    <ProjectList
                                        projects={projects.map(
                                            (project) => project.name
                                        )}
                                        handleProjectValue={handleProjectValue}
                                    />
                                )}
                            </div>
                            <div>
                                <label htmlFor="taskDateInput">Due date</label>
                                <input
                                    type="date"
                                    name="taskDateInput"
                                    id="taskDateInput"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </div>
                            <div id="priorityRadios">
                                <p>Priority</p>
                                <div id="priorityForm">
                                    <input
                                        type="radio"
                                        id="p1"
                                        name="priority"
                                        value="p1"
                                        className="radios"
                                        checked={priority === 'p1'}
                                        onChange={(e) =>
                                            setPriority(e.target.value)
                                        }
                                    />
                                    <label htmlFor="p1">P1</label>
                                    <input
                                        type="radio"
                                        id="p2"
                                        name="priority"
                                        value="p2"
                                        className="radios"
                                        checked={priority === 'p2'}
                                        onChange={(e) =>
                                            setPriority(e.target.value)
                                        }
                                    />
                                    <label htmlFor="p2">P2</label>
                                    <input
                                        type="radio"
                                        id="p3"
                                        name="priority"
                                        value="p3"
                                        className="radios"
                                        checked={priority === 'p3'}
                                        onChange={(e) =>
                                            setPriority(e.target.value)
                                        }
                                    />
                                    <label htmlFor="p3">P3</label>
                                </div>
                            </div>
                        </div>
                        <div id="addTaskBtns">
                            <Button id="confirmAddTask" type="submit">
                                Confirm
                            </Button>
                            <Button id="cancelAddTask" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}

function ProjectList({ projects, handleProjectValue }) {
    return (
        <ul id="projectList">
            {projects.map((project) => {
                console.log(project);
                return (
                    <li key={project}>
                        <input
                            className="projectListBtn"
                            type="button"
                            value={project}
                            onClick={() => handleProjectValue(project)}
                        />
                    </li>
                );
            })}
        </ul>
    );
}
