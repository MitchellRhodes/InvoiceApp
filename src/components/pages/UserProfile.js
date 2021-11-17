import { useContext, useEffect, useRef, useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import axios from "axios";
import Modal from "../UI/Modal";
import Backdrop from "../UI/Backdrop";
import Card from "../UI/Card";
import classes from "../UI/forms.module.css";
import { UserContext } from "../../contexts/UserContext";


function UserProfilePage() {

    const { user, isAuthenticated, logout } = useAuth0();
    const { loggedUser, setLoggedUser } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(true);
    const [loadedUser, setLoadedUser] = useState({});
    const [error, setError] = useState(null);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [updateCardIsOpen, setUpdateCardIsOpen] = useState(false);


    const firstNameInputRef = useRef();
    const lastNameInputRef = useRef();
    const emailInputRef = useRef();
    const companyNameInputRef = useRef();
    const phoneNumberInputRef = useRef();


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
                    setLoggedUser(id);
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

    function deleteUser() {
        axios.delete(`http://localhost:8080/users/${loggedUser}`)
        closeModal();
        logout();
    }

    async function updateUser(event) {
        event.preventDefault();

        const enteredFirstName = firstNameInputRef.current.value;
        const enteredLastName = lastNameInputRef.current.value;
        const enteredEmail = emailInputRef.current.value;
        const enteredCompany = companyNameInputRef.current.value;
        const enteredPhone = phoneNumberInputRef.current.value;


        const updatedUser = {
            first_name: enteredFirstName,
            last_name: enteredLastName,
            email: enteredEmail,
            company_name: enteredCompany,
            phone_number: enteredPhone
        }

        //maybe work on userContext first
        await axios.put(`http://localhost:8080/users/${loggedUser}`, updatedUser)
            .then(response => {
                if (response.statusText !== 'OK') {

                    throw Error(response.statusText)
                }

                setLoadedUser(response.data);

            }).catch(err => {

                setError(err.message);
                console.log(error)
            });

        closeUpdate();
    }



    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    function openUpdate() {
        setUpdateCardIsOpen(true);
    }

    function closeUpdate() {
        setUpdateCardIsOpen(false);
    }

    return (
        isAuthenticated && (
            <section>
                {error && <div>{error}</div>}
                {isLoading && <div>Loading...</div>}
                {/* {loadedUser.name && <h1>{loadedUser.name}</h1>} */}
                <h2>{loadedUser.email}</h2>

                <button onClick={openUpdate}>Edit Profile</button>
                {updateCardIsOpen ?
                    <div>
                        <Card>
                            <form className={classes.form}>
                                <div className={classes.control}>
                                    <label htmlFor='First Name'>First Name</label>
                                    <input type='text' id='firstname' ref={firstNameInputRef} />
                                </div>
                                <div className={classes.control}>
                                    <label htmlFor='Last Name'>Last Name</label>
                                    <input type='text' id='lastname' ref={lastNameInputRef} />
                                </div>
                                <div className={classes.control}>
                                    <label htmlFor='Email'>Email</label>
                                    <input type='text' id='email' ref={emailInputRef} />
                                </div>
                                <div className={classes.control}>
                                    <label htmlFor='Company Name'>Company Name</label>
                                    <input type='text' id='companyname' ref={companyNameInputRef} />
                                </div>
                                <div className={classes.control}>
                                    <label htmlFor='Phone Number'>Phone Number</label>
                                    <input type='text' id='phonenumber' ref={phoneNumberInputRef} />
                                </div>
                                <div className={classes.actions}>
                                    <button onClick={updateUser}>Submit</button>
                                    <button onClick={closeUpdate}>Cancel</button>
                                </div>
                            </form>
                        </Card>
                    </div>
                    : null}
                {updateCardIsOpen ? <Backdrop onClick={closeUpdate} /> : null}

                <button onClick={openModal}>Delete Profile</button>
                {modalIsOpen ? <Modal onCancel={closeModal} onRemove={deleteUser} /> : null}
                {modalIsOpen ? <Backdrop onClick={closeModal} /> : null}

            </section>
        )

    )
}

export default UserProfilePage;