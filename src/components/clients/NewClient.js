import { useRef } from 'react';
import Card from '../UI/Card';
import classes from "../UI/forms.module.css";


function NewClient(props) {


    const firstNameInputRef = useRef();
    const lastNameInputRef = useRef();
    const emailInputRef = useRef();
    const companyNameInputRef = useRef();
    const phoneNumberInputRef = useRef();

    function submitHandler(event) {
        event.preventDefault();
        props.onConfirm();

        const enteredFirstName = firstNameInputRef.current.value
        const enteredLastName = lastNameInputRef.current.value;
        const enteredEmail = emailInputRef.current.value;
        const enteredCompany = companyNameInputRef.current.value;
        const enteredPhone = phoneNumberInputRef.current.value;

        const clientInfo = {
            first_name: enteredFirstName,
            last_name: enteredLastName,
            email: enteredEmail,
            company_name: enteredCompany,
            phone_number: enteredPhone
        }

        props.updateClients(clientInfo)

    }

    function cancelHandler() {
        props.onCancel();
    }

    return (

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
                        <button onClick={submitHandler}>Add Client</button>
                        <button onClick={cancelHandler}>Cancel</button>
                    </div>
                </form>
            </Card>
        </li>
    )
}

export default NewClient;