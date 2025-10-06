import { useState } from 'react';
import Button from './Button';
import Icon from './Icon';
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
    const [oldProjectId, setOldProjectId] = useState(null);
    const [form, setForm] = useState({
        title: '',
        text: '',
        dueDate: '',
        priority: '',
        projectId: '',
    });

    // set projectId on mount
    useEffect(() => {
        if (!task && projectValue !== 'Project') {
            const id = projects.find(
                (project) => project.name === projectValue
            ).id;
            console.log('Task form projectId:', id);
            setForm((prevForm) => ({ ...prevForm, projectId: id }));
        }
    }, [task, projects, projectValue]);

    // if task exists then it's an edit
    // load values from task into state
    useEffect(() => {
        if (task) {
            console.log('Editing task:', task);
            setOldProjectId(task.projectId);

            // find project using the task's projectId
            const project = projects.find(
                (project) => project.id === task.projectId
            );

            setProjectValue(project.name || '');

            setForm((prevForm) => ({
                ...prevForm,
                title: task?.title ?? '',
                text: task?.text ?? '',
                dueDate: task?.dueDate ?? '',
                priority: task?.priority ?? '',
                projectId: task?.projectId ?? '',
            }));
        }
    }, [task, projects]);

    const onSubmit = (e) => {
        e.preventDefault();

        if (e.target.querySelector('#taskTitleInput').validity.rangeOverflow) {
            alert('Title must be less than max characters');
        }

        if (task) {
            // if editing, it will call handleEditTask and pass the old project id in case the task's project gets changed
            handleConfirm(
                {
                    ...task, // keep existing id if editing
                    ...form, // copy form object
                },
                oldProjectId
            );
        } else {
            handleConfirm({
                ...form, // copy form object
            });
        }
    };

    const handleProjectDropdown = () => {
        console.log('Project dropdown clicked...');
        setIsDropdown(true);
    };

    const handleProjectValue = (value) => {
        const id = projects.find((project) => project.name === value).id;
        setForm({ ...form, projectId: id });
        setProjectValue(value);
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
                            maxLength={50}
                            placeholder="Take the dog for a walk"
                            value={form.title ?? ''}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                        />
                        <textarea
                            id="taskDescriptionText"
                            placeholder="Description"
                            value={form.text ?? ''}
                            onChange={(e) =>
                                setForm({ ...form, text: e.target.value })
                            }
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
                                    value={form.dueDate ?? ''}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            dueDate: e.target.value,
                                        })
                                    }
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
                                        checked={form.priority === 'p1'}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                priority: e.target.value,
                                            })
                                        }
                                    />
                                    <label htmlFor="p1">
                                        <svg
                                            className="detailsSidebarIcons"
                                            fill="darkgray"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                        >
                                            <title>flag-variant-outline</title>
                                            <path d="M6,3A1,1 0 0,1 7,4V4.88C8.06,4.44 9.5,4 11,4C14,4 14,6 16,6C19,6 20,4 20,4V12C20,12 19,14 16,14C13,14 13,12 11,12C8,12 7,14 7,14V21H5V4A1,1 0 0,1 6,3M7,7.25V11.5C7,11.5 9,10 11,10C13,10 14,12 16,12C18,12 18,11 18,11V7.5C18,7.5 17,8 16,8C14,8 13,6 11,6C9,6 7,7.25 7,7.25Z" />
                                        </svg>
                                    </label>
                                    <input
                                        type="radio"
                                        id="p2"
                                        name="priority"
                                        value="p2"
                                        className="radios"
                                        checked={form.priority === 'p2'}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                priority: e.target.value,
                                            })
                                        }
                                    />
                                    <label htmlFor="p2">
                                        <svg
                                            className="detailsSidebarIcons"
                                            fill="orange"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                        >
                                            <title>flag-variant-outline</title>
                                            <path d="M6,3A1,1 0 0,1 7,4V4.88C8.06,4.44 9.5,4 11,4C14,4 14,6 16,6C19,6 20,4 20,4V12C20,12 19,14 16,14C13,14 13,12 11,12C8,12 7,14 7,14V21H5V4A1,1 0 0,1 6,3M7,7.25V11.5C7,11.5 9,10 11,10C13,10 14,12 16,12C18,12 18,11 18,11V7.5C18,7.5 17,8 16,8C14,8 13,6 11,6C9,6 7,7.25 7,7.25Z" />
                                        </svg>
                                    </label>
                                    <input
                                        type="radio"
                                        id="p3"
                                        name="priority"
                                        value="p3"
                                        className="radios"
                                        checked={form.priority === 'p3'}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                priority: e.target.value,
                                            })
                                        }
                                    />
                                    <label htmlFor="p3">
                                        <svg
                                            className="detailsSidebarIcons"
                                            fill="var(--button-red)"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                        >
                                            <title>flag-variant-outline</title>
                                            <path d="M6,3A1,1 0 0,1 7,4V4.88C8.06,4.44 9.5,4 11,4C14,4 14,6 16,6C19,6 20,4 20,4V12C20,12 19,14 16,14C13,14 13,12 11,12C8,12 7,14 7,14V21H5V4A1,1 0 0,1 6,3M7,7.25V11.5C7,11.5 9,10 11,10C13,10 14,12 16,12C18,12 18,11 18,11V7.5C18,7.5 17,8 16,8C14,8 13,6 11,6C9,6 7,7.25 7,7.25Z" />
                                        </svg>
                                    </label>
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
