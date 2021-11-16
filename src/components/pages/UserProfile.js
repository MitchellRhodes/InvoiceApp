import { useEffect, useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import axios from "axios";
import Modal from "../UI/Modal";
import Backdrop from "../UI/Backdrop";


function UserProfilePage() {

    const { user, isAuthenticated, logout } = useAuth0();

    const [isLoading, setIsLoading] = useState(true);
    const [loadedUser, setLoadedUser] = useState({});
    const [error, setError] = useState(null);

    const [modalIsOpen, setModalIsOpen] = useState(false);

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

    }, [user, isAuthenticated]);

    if (!isAuthenticated) {
        return <Navigate to='/' />
    }

    function deleteUser(id) {
        axios.delete(`http://localhost:8080/users/${id}`)
        closeModal();
        logout();
    }

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    return (
        isAuthenticated && (
            <section>
                {error && <div>{error}</div>}
                {isLoading && <div>Loading...</div>}
                {/* {loadedUser.name && <h1>{loadedUser.name}</h1>} */}
                <h2>{loadedUser.email}</h2>

                <button>Edit Profile</button>

                <button onClick={openModal}>Delete Profile</button>
                {modalIsOpen ? <Modal onCancel={closeModal} onRemove={() => deleteUser(loadedUser.id)} /> : null}
                {modalIsOpen ? <Backdrop onClick={closeModal} /> : null}

            </section>
        )

    )
}

export default UserProfilePage;