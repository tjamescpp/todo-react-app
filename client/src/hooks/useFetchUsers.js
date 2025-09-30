import { useEffect, useState } from 'react';

export const useFetchUsers = () => {
    const [users, setUsers] = useState([]);

    // Express REST API url environment variable
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const USERS_API_URL = `${API_URL}/users`;

    useEffect(() => {
        const dataFetch = async () => {
            const result = await fetch(USERS_API_URL);
            const usersResult = await result.json();

            // when data is ready, save it to state
            setUsers(usersResult);
            return true;
        };

        dataFetch();
    }, [USERS_API_URL]);

    return { users, setUsers };
};
