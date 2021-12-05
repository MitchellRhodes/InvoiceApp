import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect, useContext } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import LoadedClientsContext from '../../contexts/LoadedClientContext';
import AddItem from '../invoices/AddItem';
import Backdrop from '../UI/Backdrop';
import FinalInvoicePage from '../invoices/FinalInvoice';
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";


function GenerateInvoicePage() {

    //contexts
    const { isAuthenticated } = useAuth0();
    const clientContext = useContext(LoadedClientsContext);


    //states
    const [addItemIsOpen, setAddItemIsOpen] = useState(false);
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [cost, setCost] = useState(0);
    const [finalizeInvoice, setFinalizeInvoice] = useState(false);
    const [chosenClient, setChosenClient] = useState({});
    const [error, setError] = useState(null);
    // const [addedInvoice, setAddedInvoice] = useState({});

    //URL Param
    const { clientId } = useParams();

    //variables
    let navigate = useNavigate()

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

    }, [cost, invoiceItems, clientId, clientContext.loadedClients, error])


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

        const postItem = {
            item: newItem.item,
            rate: newItem.rate
        }

        await axios.post(`http://localhost:8080/items`, postItem)

            .then(response => {

                if (response.statusText !== 'Created') {

                    throw Error(response.statusText)
                }

                setInvoiceItems((currentItems) => {

                    const addedItem = {
                        id: response.data.id,
                        item: response.data.item,
                        rate: response.data.rate,
                        quantity: newItem.quantity
                    }

                    return currentItems.concat(addedItem)
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

        const newInvoice = {
            date_created: moment().format("DD-MM-YYYY hh:mm:ss"),
            total: cost
        }

        await axios.post(`http://localhost:8080/invoices/${chosenClient.id}`, newInvoice)

            .then(response => {

                if (response.statusText !== 'Created') {

                    throw Error(response.statusText)
                }

                postInvoiceItems(response.data);

            }).catch(err => {

                setError(err.message);
                console.log(error)
            })


        closeFinalizeInvoice();
    }

    async function postInvoiceItems(invoice) {

        let postArray = []

        invoiceItems.forEach(item => {
            let postData = {
                item_id: item.id,
                quantity: item.quantity
            }

            let newPromise = axios({
                method: 'post',
                url: `http://localhost:8080/invoice-items/${invoice.id}`,
                data: postData
            })

            postArray.push(newPromise);
        })

        await axios.all(postArray)

            .then(axios.spread((...responses) => {

                responses.forEach(res => console.log(res))
            }))
            .catch(err => {

                setError(err.message);
                console.log(error)
            })

        return navigate(`/client`)

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
                            <td>{item.rate}</td>
                            <td>{item.quantity}</td>
                            <td>
                                <FontAwesomeIcon icon={faTrashAlt} onClick={() => { removeInvoiceItem(item.id) }}></FontAwesomeIcon>
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