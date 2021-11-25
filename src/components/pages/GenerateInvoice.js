import { useAuth0 } from '@auth0/auth0-react';
import { useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import Backdrop from '../UI/Backdrop';
import Card from "../UI/Card";
import classes from "../UI/forms.module.css";

function GenerateInvoicePage(props) {

    //context
    const { isAuthenticated } = useAuth0();

    //states
    const [addItemIsOpen, setAddItemIsOpen] = useState(false);
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [incrementID, setIncrementID] = useState(1);

    //Refs
    const itemNameInputRef = useRef();
    const chargeRateInputRef = useRef();
    const hoursWorkedInputRef = useRef();

    if (!isAuthenticated) {

        return <Navigate to='/' />

    }

    function openAddItem() {

        return setAddItemIsOpen(true);
    }

    function closeAddItem() {

        return setAddItemIsOpen(false);
    }

    function addNewItem(event) {

        event.preventDefault();

        let enteredItemName = itemNameInputRef.current.value;
        let enteredChargeRate = chargeRateInputRef.current.value;
        let enteredHours = hoursWorkedInputRef.current.value;

        setIncrementID(previousState => {
            return previousState + 1
        })

        const newItem = {
            id: incrementID,
            item_name: enteredItemName,
            charge_rate: enteredChargeRate,
            hours: enteredHours
        }

        setInvoiceItems((currentItems) => {

            return currentItems.concat(newItem)
        });

        return closeAddItem();
    }

    function removeInvoiceItem(itemId) {

        setInvoiceItems((currentItems) => {
            return currentItems.filter(item => item.id !== itemId)
        })
    };

    return (
        <section>
            <h3>Generate Invoice</h3>

            <table>
                <tbody>
                    <tr>
                        <th>Item</th>
                        <th>Rate</th>
                        <th>Hours</th>
                    </tr>

                    {invoiceItems.map((item) => (
                        <tr key={item.id}>
                            <td>{item.item_name}</td>
                            <td>{item.charge_rate}</td>
                            <td>{item.hours}</td>
                            <td>
                                <button>Edit</button>
                            </td>
                            <td>
                                <button onClick={() => { removeInvoiceItem(item.id) }}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={openAddItem}>Add Item</button>
            {
                addItemIsOpen ?
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
                                    <label htmlFor='Hours Worked'>Hours Worked</label>
                                    <input type='text' id='hoursworked' ref={hoursWorkedInputRef} />
                                </div>
                                <div className={classes.actions}>
                                    <button onClick={addNewItem}>Add Item</button>
                                    <button onClick={closeAddItem}>Cancel</button>
                                </div>
                            </form>
                        </Card>
                    </ul>
                    : null
            }
            {addItemIsOpen ? <Backdrop onClick={closeAddItem} /> : null}


        </section >
    )
}

export default GenerateInvoicePage;