import { useEffect, useState } from 'react';

export const useAllData = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);

    // Express REST API url environment variable
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const USERS_API_URL = `${API_URL}/users`;
    const TASKS_API_URL = `${API_URL}/tasks`;
    const PROJECTS_API_URL = `${API_URL}/projects`;

    useEffect(() => {
        const dataFetch = async () => {
            // waiting for all data in parallel
            const result = (
                await Promise.all([
                    fetch(`${USERS_API_URL}`),
                    fetch(`${TASKS_API_URL}`),
                    fetch(`${PROJECTS_API_URL}`),
                ])
            ).map((res) => res.json());

            const [usersResult, tasksResult, projectsResult] =
                await Promise.all(result);

            // when data is ready, save it to state
            setUsers(usersResult);
            setTasks(tasksResult);
            setProjects(projectsResult);

            return true;
        };

        dataFetch();
    }, [USERS_API_URL, TASKS_API_URL, PROJECTS_API_URL]);

    return { users, tasks, projects, setUsers, setTasks, setProjects };
};
