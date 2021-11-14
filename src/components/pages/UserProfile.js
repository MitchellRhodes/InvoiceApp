import { useEffect, useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import axios from "axios";


function UserProfilePage() {

    const { user, isAuthenticated, logout } = useAuth0();

    const [isLoading, setIsLoading] = useState(true);
    const [loadedUser, setLoadedUser] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {

        if (!isAuthenticated) {

            return <Navigate to='/' />
        } else {

            const getUser = async () => {

                setIsLoading(true);

                await axios.get(
                    `http://localhost:8080/users/${user.email}`
                ).then(response => {

                    if (response.statusText !== 'OK') {

                        throw Error(response.statusText)
                    }

                    const person = response.data

                    const { id } = person

                    setIsLoading(false);
                    setError(null);
                    return setLoadedUser(person);

                }).catch(err => {

                    setIsLoading(false);
                    setError(err.message);

                    if (err.message === 'Request failed with status code 404') {

                        const postUser = async (user) => {
                            axios.post(`http://localhost:8080/users`, {
                                email: user.email
                            })
                            //patchwork fix later
                            setTimeout(() => {
                                return getUser();
                            }, 1000)
                        }
                        return postUser(user)
                    }
                });
            }
            getUser();
        }

    }, [user]);

    if (!isAuthenticated) {
        return <Navigate to='/' />
    }

    return (
        <section>
            <h1>User Profile</h1>
            <h2>{user.name}</h2>
        </section>

    )
}

export default UserProfilePage;