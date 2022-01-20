import GeneratePDF from './GeneratePDF';
import classes from './Modal.module.css';


function SavePDFModal(props) {

    function cancelHandler() {
        props.onCancel();
    }



    return (
        <div className={classes.modal}>
            <p>Would you like to save a PDF of your invoice?</p>
            <GeneratePDF />
            <button onClick={cancelHandler}>Cancel</button>
        </div>
    )
}

export default SavePDFModal;