import { useRef } from "react";
import Card from "../UI/Card";
import classes from "../UI/forms.module.css";


function AddItem(props) {

    const itemNameInputRef = useRef();
    const chargeRateInputRef = useRef();
    const quantityInputRef = useRef();


    function submitHandler(event) {

        event.preventDefault();
        props.onConfirm();

        let enteredItemName = itemNameInputRef.current.value;
        let enteredChargeRate = chargeRateInputRef.current.value;
        let enteredQuantity = quantityInputRef.current.value;

        const newItem = {
            item: enteredItemName,
            rate: enteredChargeRate,
            quantity: enteredQuantity
        }

        props.updateItems(newItem);
    }

    function cancelHandler() {
        props.onCancel();
    }

    return (
        <ul>
            <Card>
                <form className={classes.form}>
                    <div className={classes.control}>
                        <label htmlFor='Item Name'>Item Name</label>
                        <input type='text' id='itemname' ref={itemNameInputRef} />
                    </div>
                    <div className={classes.control}>
                        <label htmlFor='Charge Rate'>Charge Rate</label>
                        <input type='text' id='chargerate' ref={chargeRateInputRef} />
                    </div>
                    <div className={classes.control}>
                        <label htmlFor='Quantity'>Quantity</label>
                        <input type='number' id='quantity' ref={quantityInputRef} />
                    </div>
                    <div className={classes.actions}>
                        <button onClick={submitHandler}>Add Item</button>
                        <button onClick={cancelHandler}>Cancel</button>
                    </div>
                </form>
            </Card>
        </ul>
    )
}

export default AddItem;