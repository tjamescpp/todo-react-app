import './App.css';
import Button from './components/Button';
import Content from './components/Content';
import Icon from './components/Icon';
import Project from './components/Project.jsx';
import Sidebar from './components/Sidebar';
import SidebarHeader from './components/SidebarHeader';
import SidebarList from './components/SidebarList';
import ToDoList from './components/ToDoList.jsx';
import {
    users,
    sidebarButtons,
    projectButtons,
    tasks,
    projects,
} from './data.js';

// add all tasks to the All project
const allProject = projects.find((project) => project.title === 'All');
allProject.tasks = tasks;

// add tasks the the General project
const generalProject = projects.find((project) => project.title === 'General');
generalProject.tasks = tasks.filter((task) => task.project === 'General');

// add tasks the the Fitness project
const fitnessProject = projects.find((project) => project.title === 'Fitness');
fitnessProject.tasks = tasks.filter((task) => task.project === 'Fitness');

// add tasks the the School project
const schoolProject = projects.find((project) => project.title === 'School');
schoolProject.tasks = tasks.filter((task) => task.project === 'School');

console.log('All project:', allProject);

function App() {
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
                    <Project id="allProject" project={allProject} />
                    <Project id="generalProject" project={generalProject} />
                    <Project id="fitnessProject" project={fitnessProject} />
                    <Project id="schoolProject" project={schoolProject} />
                </ToDoList>
            </Content>
        </div>
    );
}

export default App;
