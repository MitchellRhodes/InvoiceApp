import classes from './Modal.module.css';

function Backdrop(props) {
    return (
        <div className={classes.backdrop} onClick={props.onClick} />
    )
}

export default Backdrop;