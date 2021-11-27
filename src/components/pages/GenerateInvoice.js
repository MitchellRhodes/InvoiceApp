import { useAuth0 } from '@auth0/auth0-react';
import { useState, useRef, useEffect, useContext } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import LoadedClientsContext from '../../contexts/LoadedClientContext';
import Backdrop from '../UI/Backdrop';
import Card from "../UI/Card";
import classes from "../UI/forms.module.css";
import FinalInvoicePage from './FinalInvoice';


function GenerateInvoicePage() {

    //context
    const { isAuthenticated } = useAuth0();
    const clientContext = useContext(LoadedClientsContext);


    //states
    const [addItemIsOpen, setAddItemIsOpen] = useState(false);
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [incrementID, setIncrementID] = useState(1);
    const [cost, setCost] = useState(0);
    const [finalizeInvoice, setFinalizeInvoice] = useState(false);
    const [chosenClient, setChosenClient] = useState({});

    //Refs
    const itemNameInputRef = useRef();
    const chargeRateInputRef = useRef();
    const quantityInputRef = useRef();


    //Need to access the loadedClients context and use this id to get the specific client then pass it to finalize INvoice
    const { clientId } = useParams();


    useEffect(() => {


        function getTotal() {
            let total = 0;

            invoiceItems.forEach(item =>
                total += item.rate * item.quantity
            );

            let tax = total * 0.06;
            let finalCost = total + tax;
            let roundedCost = finalCost.toFixed(2);


            return setCost(roundedCost);
        }

        function getClient() {

            let chosen = clientContext.loadedClients.find(client => client.id === +clientId);

            return setChosenClient(chosen);
        }

        getClient();
        getTotal();

    }, [cost, invoiceItems, clientId, clientContext.loadedClients])


    if (!isAuthenticated) {

        return <Navigate to='/' />

    }

    function openAddItem() {

        return setAddItemIsOpen(true);
    }


    function closeAddItem() {

        return setAddItemIsOpen(false);
    }

    function openFinalizeInvoice() {

        return setFinalizeInvoice(true);
    }

    function closeFinalizeInvoice() {

        return setFinalizeInvoice(false);
    }

    function addNewItem(event) {

        event.preventDefault();

        let enteredItemName = itemNameInputRef.current.value;
        let enteredChargeRate = chargeRateInputRef.current.value;
        let enteredQuantity = quantityInputRef.current.value;

        setIncrementID(previousState => {
            return previousState + 1
        })

        const newItem = {
            id: incrementID,
            item: enteredItemName,
            rate: enteredChargeRate,
            quantity: enteredQuantity
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
            <h3>Generate Invoice for {chosenClient.first_name} {chosenClient.last_name}</h3>

            <table>
                <tbody>
                    <tr>
                        <th>Item</th>
                        <th>Rate</th>
                        <th>Quantity</th>
                    </tr>

                    {invoiceItems.map((item) => (
                        <tr key={item.id}>
                            <td>{item.item}</td>
                            <td>${item.rate}</td>
                            <td>{item.quantity}</td>
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
                                    <label htmlFor='Quantity'>Quantity</label>
                                    <input type='text' id='quantity' ref={quantityInputRef} />
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

            <button onClick={openFinalizeInvoice}>Finalize</button>
            {finalizeInvoice ? <FinalInvoicePage onSend={closeFinalizeInvoice} onCancel={closeFinalizeInvoice} /> : null}
            {finalizeInvoice ? <Backdrop onClick={closeFinalizeInvoice} /> : null}


        </section >
    )
}

export default GenerateInvoicePage;