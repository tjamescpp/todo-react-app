import { useState } from 'react';
import Button from './Button';
import Icon from './Icon';
import { projects } from '../data';

export default function TaskForm() {
    const [isDropdown, setIsDropdown] = useState(false);

    const handleProjectDropdown = () => {
        console.log('Project dropdown clicked...');
        setIsDropdown(!isDropdown);
    };

    return (
        <div id="addTaskForm">
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
                        <Button id="projectBtn" onClick={handleProjectDropdown}>
                            <div id="projectDropdown">
                                <p id="projectValue">Project</p>
                                <Icon
                                    id="projectMenuIcon"
                                    src="/icons/menu-down.svg"
                                    alt="project dropdown"
                                />
                            </div>
                        </Button>
                        {isDropdown && <ProjectList projects={projects} />}
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
                        <form id="priorityForm">
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
                        </form>
                    </div>
                </div>
                <div id="addTaskBtns">
                    <Button id="confirmAddTask">Confirm</Button>
                    <Button id="cancelAddTask">Cancel</Button>
                </div>
            </fieldset>
        </div>
    );
}

function ProjectList({ projects }) {
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
                        />
                    </li>
                );
            })}
        </ul>
    );
}
