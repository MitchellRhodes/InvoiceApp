import axios from "axios";
import { UserContext } from '../../contexts/UserContext';
import { useContext, useRef, useState, useEffect } from 'react';
import Card from '../UI/Card';
import classes from "../UI/forms.module.css";


function NewClient(props) {
    const { loggedUser } = useContext(UserContext);


    // const firstNameInputRef = useRef();
    // const lastNameInputRef = useRef();
    // const emailInputRef = useRef();
    // const companyNameInputRef = useRef();
    // const phoneNumberInputRef = useRef();



    {/* {clientPostIsOpen ?
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
                : null} */}
}

export default NewClient;