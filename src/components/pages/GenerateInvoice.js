import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect, useContext } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import LoadedClientsContext from '../../contexts/LoadedClientContext';
import AddItem from '../invoices/AddItem';
import Backdrop from '../UI/Backdrop';
import FinalInvoicePage from './FinalInvoice';
import axios from "axios";



function GenerateInvoicePage() {

    //context
    const { isAuthenticated } = useAuth0();
    const clientContext = useContext(LoadedClientsContext);


    //states
    const [addItemIsOpen, setAddItemIsOpen] = useState(false);
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [cost, setCost] = useState(0);
    const [finalizeInvoice, setFinalizeInvoice] = useState(false);
    const [chosenClient, setChosenClient] = useState({});
    const [error, setError] = useState(null);


    //Refs
    // const quantityInputRef = useRef();


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


    async function addNewItem(newItem) {

        await axios.post(`http://localhost:8080/items`, newItem)

            .then(response => {

                if (response.statusText !== 'Created') {

                    throw Error(response.statusText)
                }

                setInvoiceItems((currentItems) => {

                    return currentItems.concat(response.data)
                });

            }).catch(err => {

                setError(err.message);
                console.log(error)
            })

    }


    function removeInvoiceItem(itemId) {

        axios.delete(`http://localhost:8080/items/${itemId}`)

        setInvoiceItems((currentItems) => {
            return currentItems.filter(item => item.id !== itemId)
        })
    };


    async function postInvoice() {
        //come back to after fixing database with invoice items
        return closeFinalizeInvoice();
    }

    return (
        <section>
            <h3>Create Invoice for {chosenClient.first_name} {chosenClient.last_name}</h3>

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
            {addItemIsOpen ? <AddItem onConfirm={closeAddItem} onCancel={closeAddItem} updateItems={addNewItem} /> : null}
            {addItemIsOpen ? <Backdrop onClick={closeAddItem} /> : null}

            <h3>Total: ${cost}</h3>

            <button onClick={openFinalizeInvoice}>Finalize</button>
            {finalizeInvoice ? <FinalInvoicePage onSend={postInvoice} onCancel={closeFinalizeInvoice} chosenClient={chosenClient} /> : null}
            {finalizeInvoice ? <Backdrop onClick={closeFinalizeInvoice} /> : null}


        </section >
    )
}

export default GenerateInvoicePage;