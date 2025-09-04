import { useState } from 'react';
import Button from './Button';
import Icon from './Icon';
import { projects } from '../data';

export default function TaskForm({ handleCancel, handleConfirm }) {
    const [isDropdown, setIsDropdown] = useState(false);
    const [projectValue, setProjectValue] = useState('Project');

    const handleProjectDropdown = () => {
        console.log('Project dropdown clicked...');
        setIsDropdown(true);
    };

    const handleProjectValue = (value) => {
        setProjectValue(value);
        setIsDropdown(false);
    };

    return (
        <form id="addTaskForm" onSubmit={(e) => handleConfirm(e)}>
            <fieldset>
                <input
                    type="text"
                    name="taskTitleInput"
                    id="taskTitleInput"
                    placeholder="Take the dog for a walk"
                />
                <textarea
                    name="taskDescriptionText"
                    id="taskDescriptionText"
                    placeholder="Description"
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
                                projects={projects}
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
                            />
                            <label htmlFor="p1">P1</label>
                            <input
                                type="radio"
                                id="p2"
                                name="priority"
                                value="p2"
                                className="radios"
                            />
                            <label htmlFor="p2">P2</label>
                            <input
                                type="radio"
                                id="p3"
                                name="priority"
                                value="p3"
                                className="radios"
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
