import { useEffect, useState } from 'react';
import projectIcon from '/icons/pound.svg';
import SidebarHeader from './SidebarHeader';
import SidebarList from './SidebarList';
import Button from './Button';
import Icon from './Icon';
import LoadingSpinner from './LoadingSpinner';

export default function Sidebar({
    user,
    tasks,
    projects,
    setProjects,
    loading,
    status,
    setStatus,
    projectButtons,
    handleProjectButton,
    handleAddTaskClicked,
    handleLogout,
    onSearchResults,
}) {
    const [searchFor, setSearchFor] = useState('');
    const [isSearch, setIsSearch] = useState(false);
    const [addNewProject, setAddNewProject] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');

    useEffect(() => {
        if (searchFor.trim() === '') {
            onSearchResults([]); // clear results
        } else {
            const results = tasks.filter(
                (task) =>
                    task.title.toLowerCase().includes(searchFor) ||
                    task.text.toLowerCase().includes(searchFor)
            );
            onSearchResults(results);
        }
    }, [searchFor, tasks, onSearchResults]);

    const handleSearchClicked = () => {
        console.log('Search clicked:');
        setIsSearch(!isSearch);

        if (status === 'search') {
            setStatus('dashboard');
        } else {
            setStatus('search');
        }
    };

    const handleDashboard = () => {
        console.log('Home clicked...');
        setStatus('dashboard');
    };

    const handleToday = () => {
        console.log('Today clicked...');
        setStatus('today');
    };

    const handleNewProject = () => {
        setAddNewProject(!addNewProject);
    };

    const handleNewProjectInput = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!newProjectName.trim()) return;

            if (projects.some((p) => p.name === newProjectName)) {
                alert(`${newProjectName} already exists`);
            } else {
                const res = await fetch(
                    `http://localhost:3000/projects/${user.id}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: newProjectName,
                            userId: user.id,
                        }),
                    }
                );

                const newProject = await res.json();
                setProjects((prevProjects) => [...prevProjects, newProject]);

                const newProjectButton = {
                    id: projectButtons.length + 1,
                    name: newProject.name,
                    src: projectIcon,
                    onClick: handleProjectButton,
                };

                projectButtons = {
                    ...projectButtons,
                    newProjectButton,
                };
                setNewProjectName('');
                setAddNewProject(false);
            }
        }
    };

    const sidebarButtons = [
        {
            name: 'Search',
            id: 'searchBtn',
            src: '/icons/magnify.svg',
            onClick: handleSearchClicked,
        },
        {
            name: 'Add task',
            id: 'addTaskBtn',
            src: '/icons/plus.svg',
            onClick: handleAddTaskClicked,
        },
        {
            name: 'Dashboard',
            id: 'homeBtn',
            src: '/icons/home-outline.svg',
            onClick: handleDashboard,
        },
        {
            name: 'Today',
            id: 'todayBtn',
            src: '/icons/calendar-check.svg',
            onClick: handleToday,
        },
    ];

    return (
        <div id="sidebar">
            {loading ? (
                <LoadingSpinner size={10} />
            ) : (
                <SidebarHeader user={user} />
            )}
            {status === 'search' && (
                <input
                    id="searchInput"
                    type="text"
                    placeholder="Search"
                    value={searchFor ?? ''}
                    onChange={(e) => setSearchFor(e.target.value.toLowerCase())}
                />
            )}
            <SidebarList buttons={sidebarButtons} />
            <div id="projectsSidebar">
                <Button
                    className="sidebarBtn"
                    type="button"
                    id="myProjectsBtn"
                    onClick={handleProjectButton}
                >
                    <p id="projectListHeader">My Projects</p>
                </Button>
                <Button
                    className="sidebarBtn"
                    type="button"
                    id="newProjectBtn"
                    onClick={handleNewProject}
                >
                    <Icon
                        className="sidebarIcons"
                        src="/icons/plus.svg"
                        alt="plus"
                    />
                    <p>New project</p>
                </Button>
                {addNewProject && (
                    <input
                        id="newProjectInput"
                        type="text"
                        max={30}
                        placeholder="Name"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        onKeyDown={handleNewProjectInput}
                    />
                )}
                <SidebarList
                    listId="projectSidebarList"
                    buttons={projectButtons}
                />
            </div>
            <Button
                className="sidebarBtn"
                type="button"
                id="logoutBtn"
                onClick={handleLogout}
            >
                <Icon
                    className="sidebarIcons"
                    src="/icons/logout.svg"
                    alt="plus"
                />
                <p>Logout</p>
            </Button>
        </div>
    );
}
