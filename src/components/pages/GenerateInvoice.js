import { useAuth0 } from '@auth0/auth0-react';
import { useState, useRef, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Backdrop from '../UI/Backdrop';
import Card from "../UI/Card";
import classes from "../UI/forms.module.css";


function GenerateInvoicePage() {

    //context
    const { isAuthenticated } = useAuth0();

    //states
    const [addItemIsOpen, setAddItemIsOpen] = useState(false);
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [incrementID, setIncrementID] = useState(1);
    const [cost, setCost] = useState(0);

    //Refs
    const itemNameInputRef = useRef();
    const chargeRateInputRef = useRef();
    const hoursWorkedInputRef = useRef();

    const { clientId } = useParams();


    useEffect(() => {

        let total = 0;

        invoiceItems.forEach(item =>
            total += item.charge_rate * item.hours
        );

        let tax = total * 0.06;
        let finalCost = total + tax;
        console.log(finalCost);

        return setCost(finalCost);

    }, [cost, invoiceItems])


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
                            <td>${item.charge_rate}</td>
                            <td>{item.hours}</td>
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

            <h3>Total: ${cost}</h3>

            <button>Finalize</button>

        </section >
    )
}

export default GenerateInvoicePage;