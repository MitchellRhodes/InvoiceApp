import Card from '../UI/Card';
import classes from "../UI/forms.module.css";


function FinalInvoicePage(props) {

    const client = props.chosenClient

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
                        <h1>Send {client.first_name} {client.last_name}'s Invoice?</h1>
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