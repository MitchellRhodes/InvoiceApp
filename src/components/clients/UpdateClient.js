import { useRef } from 'react';
import Card from "../UI/Card";
import classes from "../UI/forms.module.css";


function UpdateClient(props) {

    const firstNameInputRef = useRef();
    const lastNameInputRef = useRef();
    const emailInputRef = useRef();
    const companyNameInputRef = useRef();
    const phoneNumberInputRef = useRef();

    function submitHandler(event) {

        event.preventDefault();
        props.onConfirm();

        let enteredFirstName = firstNameInputRef.current.value;
        let enteredLastName = lastNameInputRef.current.value;
        let enteredEmail = emailInputRef.current.value;
        let enteredCompany = companyNameInputRef.current.value;
        let enteredPhone = phoneNumberInputRef.current.value;


        if (!enteredFirstName) {
            enteredFirstName = props.currentClient.first_name;
        }

        if (!enteredLastName) {
            enteredLastName = props.currentClient.last_name;
        }

        if (!enteredEmail) {
            enteredEmail = props.currentClient.email;
        }

        if (!enteredPhone) {
            enteredPhone = props.currentClient.phone_number;
        }

        if (!enteredCompany) {
            enteredCompany = props.currentClient.company_name;
        }

        const updatedClient = {
            first_name: enteredFirstName,
            last_name: enteredLastName,
            email: enteredEmail,
            company_name: enteredCompany,
            phone_number: enteredPhone
        }

        props.updateClientInfo(updatedClient, props.currentClient.id);


    }

    function cancelHandler() {

        props.onCancel();
    }

    return (
        <ul>
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
                        <button onClick={submitHandler}>Edit Client</button>
                        <button onClick={cancelHandler}>Cancel</button>
                    </div>
                </form>
            </Card>
        </ul>
    )
}

export default UpdateClient;