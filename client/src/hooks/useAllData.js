import { useEffect, useState } from 'react';

export const useAllData = () => {
    const [tasks, setTasks] = useState();
    const [users, setUsers] = useState();
    const [projects, setProjects] = useState();

    // REST API url environment variable
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    useEffect(() => {
        const dataFetch = async () => {
            // waiting for all data in parallel
            const result = (
                await Promise.all([
                    fetch(`${API_URL}/users`),
                    fetch(`${API_URL}/tasks`),
                    fetch(`${API_URL}/projects`),
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
    }, [API_URL]);

    return { users, tasks, projects };
};
