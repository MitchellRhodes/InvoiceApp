import { useContext, useEffect, useRef, useState } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import axios from "axios";
import DeleteModal from "../UI/DeleteModal";
import Backdrop from "../UI/Backdrop";
import Card from "../UI/Card";
import classes from "../UI/forms.module.css";
import { UserContext } from "../../contexts/UserContext";


function UserProfilePage() {

    //contexts
    const { user, isAuthenticated, logout } = useAuth0();
    const { loggedUser, setLoggedUser } = useContext(UserContext);

    //states
    const [isLoading, setIsLoading] = useState(true);
    const [loadedUser, setLoadedUser] = useState({});
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [updateCardIsOpen, setUpdateCardIsOpen] = useState(false);


    //refs
    const firstNameInputRef = useRef();
    const lastNameInputRef = useRef();
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

    }, [user, isAuthenticated, setLoggedUser]);

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

        let enteredFirstName = firstNameInputRef.current.value;
        let enteredLastName = lastNameInputRef.current.value;
        let enteredCompany = companyNameInputRef.current.value;
        let enteredPhone = phoneNumberInputRef.current.value;


        if (!enteredFirstName) {
            enteredFirstName = loadedUser.first_name;
        }

        if (!enteredLastName) {
            enteredLastName = loadedUser.last_name;
        }

        if (!enteredPhone) {
            enteredPhone = loadedUser.phone_number;
        }

        if (!enteredCompany) {
            enteredCompany = loadedUser.company_name;
        }

        const updatedUser = {
            first_name: enteredFirstName,
            last_name: enteredLastName,
            company_name: enteredCompany,
            phone_number: enteredPhone
        }

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
                <div>
                    <h2>{loadedUser.first_name} {loadedUser.last_name}</h2>
                    <h3>{loadedUser.company_name}</h3>
                </div>
                <div>
                    <h5><span>Email: </span>{loadedUser.email}</h5>
                    <h5><span>Phone: </span>{loadedUser.phone_number}</h5>
                </div>

                <button onClick={openUpdate}>Edit Profile</button>
                <button onClick={openModal}>Delete Profile</button>
                {modalIsOpen ? <DeleteModal onCancel={closeModal} onRemove={deleteUser} /> : null}
                {modalIsOpen ? <Backdrop onClick={closeModal} /> : null}

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

            </section>
        )

    )
}

export default UserProfilePage;