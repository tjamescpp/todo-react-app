import { useState } from 'react';
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
import { users, sidebarButtons, projectButtons, tasks } from './data.js';

function App() {
    const [allTasks, setAllTasks] = useState(tasks);

    console.log(allTasks);

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
                <ToDoList>
                    <Project id="allProject" name="All" tasks={allTasks} />
                    <Project
                        id="generalProject"
                        name="General"
                        tasks={allTasks}
                    />
                    <Project
                        id="fitnessProject"
                        name="Fitness"
                        tasks={allTasks}
                    />
                    <Project
                        id="schoolProject"
                        name="School"
                        tasks={allTasks}
                    />
                </ToDoList>
            </Content>
        </div>
    );
}

export default App;
