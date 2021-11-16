import classes from './Modal.module.css';


function Modal(props) {

    function cancelHandler() {
        props.onCancel();
    }

    function removeHandler() {
        props.onRemove();
    }

    return (
        <div className={classes.modal}>
            <p>Would you like to delete?</p>
            <button onClick={removeHandler}>Remove</button>
            <button onClick={cancelHandler}>Cancel</button>
        </div>
    )
}

export default Modal;