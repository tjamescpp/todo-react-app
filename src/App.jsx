// import { useState } from 'react';
import { TasksContext } from './components/tasksContext.js';
import './App.css';
import Button from './components/Button';
import Content from './components/Content';
import Icon from './components/Icon';
import Project from './components/Project.jsx';
import Sidebar from './components/Sidebar';
import SidebarHeader from './components/SidebarHeader';
import SidebarList from './components/SidebarList';
import ToDoList from './components/ToDoList.jsx';
import TaskForm from './components/TaskForm.jsx';
import { users, tasks } from './data.js';
import { useState } from 'react';

function App() {
    const [allTasks, setAllTasks] = useState(tasks);
    const [addTask, setAddTask] = useState(false);

    console.log(allTasks);

    const handleTaskDeleted = (taskId) => {
        console.log('Deleting task...');
        setAllTasks((allTasks) =>
            allTasks.filter((task) => task.id !== taskId)
        );
    };

    const handleAddTask = () => {
        console.log('Adding a task...');
        setAddTask(true);
    };

    const handleCancel = () => {
        console.log('Cancel clicked...');
        setAddTask(false);
    };

    const handleConfirm = (e) => {
        e.preventDefault();
        console.log('Confirm clicked...');

        const newTask = {
            id: crypto.randomUUID(),
            title: e.target.taskTitleInput.value,
            text: e.target.taskDescriptionText.value,
            project: document.getElementById('projectValue').textContent,
            dueDate: e.target.taskDateInput.value,
            priority: document
                .querySelector('input[name="priority"]:checked')
                ?.value.toLowerCase(),
        };

        console.log('Created new task...', newTask);
        setAllTasks([...allTasks, newTask]);
        setAddTask(false);
    };

    sidebarButtons.find((button) => button.name === 'Add task').onClick =
        handleAddTask;

    return (
        <div id="container">
            <Sidebar>
                <SidebarHeader user={users[0]} />
                <SidebarList listId="sidebarList" buttons={sidebarButtons} />
                <div id="projectsSidebar">
                    <p id="projectListHeader">Projects</p>
                    <Button
                        className="sidebarBtn"
                        type="button"
                        id="newProjectBtn"
                    >
                        <Icon
                            className="sidebarIcons"
                            src="/icons/plus.svg"
                            alt="plus"
                        />
                        <p>New project</p>
                    </Button>
                    <SidebarList
                        listId="projectSidebarList"
                        buttons={projectButtons}
                    />
                </div>
            </Sidebar>
            <Content>
                {addTask && (
                    <TaskForm
                        handleCancel={handleCancel}
                        handleConfirm={handleConfirm}
                    />
                )}
                <ToDoList>
                    <Project
                        id="allProject"
                        name="All"
                        tasks={allTasks}
                        handleTaskDeleted={handleTaskDeleted}
                    />
                    <Project
                        id="generalProject"
                        name="General"
                        tasks={allTasks}
                        handleTaskDeleted={handleTaskDeleted}
                    />
                    <Project
                        id="fitnessProject"
                        name="Fitness"
                        tasks={allTasks}
                        handleTaskDeleted={handleTaskDeleted}
                    />
                    <Project
                        id="schoolProject"
                        name="School"
                        tasks={allTasks}
                        handleTaskDeleted={handleTaskDeleted}
                    />
                </ToDoList>
            </Content>
        </div>
    );
}

const sidebarButtons = [
    {
        name: 'Search',
        id: 'searchBtn',
        src: '/icons/magnify.svg',
        onClick: null,
    },
    {
        name: 'Add task',
        id: 'addTaskBtn',
        src: '/icons/plus-box-outline.svg',
        onClick: null,
    },
    {
        name: 'Dashboard',
        id: 'dashboardBtn',
        src: '/icons/home-outline.svg',
        onClick: null,
    },
    {
        name: 'Inbox',
        id: 'inboxBtn',
        src: '/icons/inbox.svg',
        onClick: null,
    },
    {
        name: 'Today',
        id: 'todayBtn',
        src: '/icons/calendar-check.svg',
        onClick: null,
    },
];

const projectIcon = '/icons/pound.svg';

const projectButtons = [
    {
        name: 'General',
        id: 'generalProjectBtn',
        src: projectIcon,
    },
    {
        name: 'Fitness',
        id: 'fitnessProjectBtn',
        src: projectIcon,
    },
    {
        name: 'School',
        id: 'schoolProjectBtn',
        src: projectIcon,
    },
];

export default App;
