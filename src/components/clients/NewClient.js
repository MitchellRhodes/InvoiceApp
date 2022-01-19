import { useRef, useState } from 'react';
import Card from '../UI/Card';
import classes from "../UI/forms.module.css";


function NewClient(props) {

    const [firstNameError, setFirstNameError] = useState()
    const [lastNameError, setLastNameError] = useState()
    const [emailError, setEmailError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [isValid, setIsValid] = useState(false);


    const firstNameInputRef = useRef();
    const lastNameInputRef = useRef();
    const emailInputRef = useRef();
    const companyNameInputRef = useRef();
    const phoneNumberInputRef = useRef();

    function validate(clientInfo) {


        if (!clientInfo.email) {

            setEmailError("Email is required and must have an @")
            setIsValid(false);
        }
        if (!clientInfo.first_name) {

            setFirstNameError("First name is required")
            setIsValid(false);
        }
        if (!clientInfo.last_name) {

            setLastNameError("Last name is required")
            setIsValid(false);
        }
        if (!clientInfo.phone_number) {

            setPhoneError("Phone number is required")
            setIsValid(false);
        }

        if (!emailError && !firstNameError && !lastNameError && !phoneError) {

            return setIsValid(true);
        }

    }

    function submitHandler(event) {
        event.preventDefault();

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

        validate(clientInfo);

        if (isValid) {
            props.updateClients(clientInfo)
            props.onConfirm();
        }

    }

    function cancelHandler() {
        props.onCancel();
    }

    return (

        <ul>
            <Card>
                <form className={classes.form}>

                    <div className={classes.required}>{firstNameError}</div>
                    <div className={classes.control}>
                        <label htmlFor='First Name'>First Name</label> <span className={classes.required}>*</span>
                        <input type='text' id='firstname' ref={firstNameInputRef} />
                    </div>

                    <div className={classes.required}>{lastNameError}</div>
                    <div className={classes.control}>
                        <label htmlFor='Last Name'>Last Name</label> <span className={classes.required}>*</span>
                        <input type='text' id='lastname' ref={lastNameInputRef} />
                    </div>

                    <div className={classes.required}>{emailError}</div>
                    <div className={classes.control}>
                        <label htmlFor='Email'>Email</label> <span className={classes.required}>*</span>
                        <input type='text' id='email' ref={emailInputRef} />
                    </div>

                    <div className={classes.control}>
                        <label htmlFor='Company Name'>Company Name</label>
                        <input type='text' id='companyname' ref={companyNameInputRef} />
                    </div>

                    <div className={classes.required}>{phoneError}</div>
                    <div className={classes.control}>
                        <label htmlFor='Phone Number'>Phone Number</label> <span className={classes.required}>*</span>
                        <input type='text' id='phonenumber' ref={phoneNumberInputRef} />
                    </div>
                    <div className={classes.actions}>
                        <button onClick={submitHandler}>Add Client</button>
                        <button onClick={cancelHandler}>Cancel</button>
                    </div>
                </form>
            </Card>
        </ul>
    )
}

export default NewClient;