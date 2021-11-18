import { useAuth0 } from '@auth0/auth0-react';
import { useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Backdrop from '../UI/Backdrop';
import Card from '../UI/Card';
import classes from "../UI/forms.module.css";


function ClientInfoPage() {

    const { isAuthenticated } = useAuth0();

    const [clientPostIsOpen, setClientPostIsOpen] = useState(false);

    const firstNameInputRef = useRef();
    const lastNameInputRef = useRef();
    const emailInputRef = useRef();
    const companyNameInputRef = useRef();
    const phoneNumberInputRef = useRef();


    if (!isAuthenticated) {

        return <Navigate to='/' />

    }

    function openClientPost() {
        return setClientPostIsOpen(true);
    }

    function closeClientPost() {
        return setClientPostIsOpen(false);
    }

    return (
        <section>

            <h2>Client Information</h2>

            <button onClick={openClientPost}>Add Client</button>
            {clientPostIsOpen ?
                <li>
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
                                <button>Submit</button>
                                <button onClick={closeClientPost}>Cancel</button>
                            </div>
                        </form>
                    </Card>
                </li>
                : null}
            {clientPostIsOpen ? <Backdrop onClick={closeClientPost} /> : null}

        </section>

    )
}

export default ClientInfoPage;