import './App.css';
import Button from './components/Button';
import Content from './components/Content';
import Icon from './components/Icon';
import Project from './components/Project.jsx';
import Sidebar from './components/Sidebar';
import SidebarHeader from './components/SidebarHeader';
import SidebarList from './components/SidebarList';
import ToDoList from './components/ToDoList.jsx';
import { users, sidebarButtons, projectButtons } from './data.js';

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
                    <Project id="allProject" projectName="All" />
                </ToDoList>
            </Content>
        </div>
    );
}

export default App;
