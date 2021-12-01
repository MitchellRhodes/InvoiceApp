import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import Card from '../UI/Card';
import classes from "../UI/forms.module.css";


function FinalInvoicePage(props) {

    //contexts
    const { isAuthenticated } = useAuth0();

    const client = props.chosenClient

    if (!isAuthenticated) {

        return <Navigate to='/' />

    }

    function submitHandler(event) {

        event.preventDefault();
        props.onSend();


    }

    function cancelHandler() {

        props.onCancel();
    }

    return (
        <ul>
            <Card>
                <form className={classes.form}>
                    <div className={classes.control}>
                        <h1>{client.first_name} {client.last_name}</h1>
                    </div>
                    <div className={classes.actions}>
                        <button onClick={submitHandler}>Send Invoice</button>
                        <button onClick={cancelHandler}>Cancel</button>
                    </div>
                </form>
            </Card>
        </ul>


    )
}

export default FinalInvoicePage;