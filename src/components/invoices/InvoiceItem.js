import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Backdrop from "../UI/Backdrop";
import Card from "../UI/Card";
import DeleteModal from "../UI/DeleteModal";
import LoadedInvoicesContext from "../../contexts/loadedInvoicesContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrashAlt, faTimes, faChevronCircleDown, faChevronCircleUp } from "@fortawesome/free-solid-svg-icons";




//placeholder, will probably need a more specific one for this component
import classes from "../clients/ClientItem.module.css";
import SavePDFModal from "../UI/SavePDFModal";


function InvoiceItem(props) {

    //contexts
    const invoiceContext = useContext(LoadedInvoicesContext);

    //states
    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState(null);
    const [loadedItems, setLoadedItems] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [unpaidIsCollapsed, setUnpaidIsCollapsed] = useState(true);
    const [paidIsCollapsed, setPaidIsCollapsed] = useState(true);
    const [saveModal, setSaveModal] = useState(false);

    invoiceContext.invoiceItems = loadedItems;

    useEffect(() => {

        async function getInvoiceItems() {

            setIsLoading(true);

            await axios.get(
                `http://localhost:8080/invoice-items/${props.id}`
            ).then(response => {

                if (response.statusText !== 'OK') {

                    throw Error(response.statusText)
                }

                setIsLoading(false);
                setError(null);
                setLoadedItems(response.data)

            }).catch(err => {

                setIsLoading(false);
                setError(err.message);

            });


        }
        getInvoiceItems();

    }, [props.id, invoiceContext])


    function openDeleteCard() {
        setModalIsOpen(true);
    }

    function closeDeleteCard() {
        setModalIsOpen(false);
    }

    function openUnpaid() {
        return setUnpaidIsCollapsed(false);
    }

    function closeUnpaid() {
        return setUnpaidIsCollapsed(true);
    }

    function openPaid() {
        return setPaidIsCollapsed(false);
    }

    function closePaid() {
        return setPaidIsCollapsed(true);
    }



    async function completeInvoice(invoiceId) {

        await axios.put(`http://localhost:8080/invoices/${invoiceId}`, { completed: true })

            .then(response => {

                if (response.statusText !== 'OK') {

                    throw Error(response.statusText)
                }

                invoiceContext.removeInvoice(invoiceId)
                invoiceContext.invoiceIsComplete(response.data)

            }).catch(err => {

                setError(err.message);
                console.log(error)
            })
    }

    async function undoCompleteInvoice(invoiceId) {

        await axios.put(`http://localhost:8080/invoices/${invoiceId}`, { completed: false })

            .then(response => {

                if (response.statusText !== 'OK') {

                    throw Error(response.statusText)
                }

                invoiceContext.removeInvoice(invoiceId)
                invoiceContext.invoiceIsComplete(response.data)

            }).catch(err => {

                setError(err.message);
                console.log(error)
            })
    }

    function removeInvoice(id) {

        axios.delete(`http://localhost:8080/invoices/${id}`)
        invoiceContext.removeInvoice(id);
        return closeDeleteCard();
    }

    function openSaveModal() {
        return setSaveModal(true);
    }

    function closeSaveModal() {
        return setSaveModal(false);
    }

    return (
        <ul>

            {props.showCompleted === false && props.completed === false && unpaidIsCollapsed === true &&
                <Card>
                    {error && <div>{error}</div>}
                    {isLoading && <div>Loading...</div>}
                    <h3>Date Posted: {props.date_created}</h3>
                    <h4>Amount Due: ${props.total}</h4>
                    <FontAwesomeIcon icon={faChevronCircleDown} onClick={openUnpaid} className={classes.icon}></FontAwesomeIcon>
                </Card>
            }

            {props.showCompleted === false && props.completed === false && unpaidIsCollapsed === false &&
                <Card>
                    {error && <div>{error}</div>}
                    {isLoading && <div>Loading...</div>}
                    <h3>Date Posted: {props.date_created}</h3>

                    <table>
                        <tbody>
                            <tr>
                                <th>Item</th>
                                <th>Rate</th>
                                <th>Quantity</th>
                            </tr>

                            {loadedItems.map((item) => (
                                <tr key={item.item_id}>
                                    <td>{item.item}</td>
                                    <td>{item.rate}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div>
                        <h4>Amount Due: ${props.total}</h4>
                    </div>

                    <FontAwesomeIcon icon={faCheck} onClick={() => completeInvoice(props.id)} className={`${classes.icon} ${classes.greenIcon}`}></FontAwesomeIcon>

                    <FontAwesomeIcon icon={faTrashAlt} onClick={openDeleteCard} className={classes.icon}></FontAwesomeIcon>
                    {modalIsOpen ? <DeleteModal onCancel={closeDeleteCard} onRemove={() => removeInvoice(props.id)} /> : null}
                    {modalIsOpen ? <Backdrop onClick={closeDeleteCard} /> : null}

                    <FontAwesomeIcon icon={faChevronCircleUp} onClick={closeUnpaid} className={classes.icon}></FontAwesomeIcon>

                    <button onClick={openSaveModal}>Save PDF</button>
                    {saveModal ? <SavePDFModal onCancel={closeSaveModal} invoice={props} /> : null}
                    {saveModal ? <Backdrop onClick={closeSaveModal} /> : null}

                </Card>
            }

            {props.showCompleted === true && props.completed === true && paidIsCollapsed === true &&
                <Card>
                    {error && <div>{error}</div>}
                    {isLoading && <div>Loading...</div>}
                    <h3>Date Posted: {props.date_created}</h3>
                    <h4>PAID IN FULL: ${props.total}</h4>
                    <FontAwesomeIcon icon={faChevronCircleDown} onClick={openPaid} className={classes.icon}></FontAwesomeIcon>
                </Card>
            }

            {props.showCompleted === true && props.completed === true && paidIsCollapsed === false &&
                <Card>
                    {error && <div>{error}</div>}
                    {isLoading && <div>Loading...</div>}
                    <h2>PAID IN FULL</h2>
                    <h3>Date Posted: {props.date_created}</h3>

                    <table>
                        <tbody>
                            <tr>
                                <th>Item</th>
                                <th>Rate</th>
                                <th>Quantity</th>
                            </tr>

                            {loadedItems.map((item) => (
                                <tr key={item.item_id}>
                                    <td>{item.item}</td>
                                    <td>{item.rate}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div>
                        <h4>Total: ${props.total}</h4>
                    </div>

                    <FontAwesomeIcon icon={faTimes} onClick={() => undoCompleteInvoice(props.id)} className={`${classes.icon} ${classes.redIcon}`}></FontAwesomeIcon>

                    <FontAwesomeIcon icon={faTrashAlt} onClick={openDeleteCard} className={classes.icon}></FontAwesomeIcon>
                    {modalIsOpen ? <DeleteModal onCancel={closeDeleteCard} onRemove={() => removeInvoice(props.id)} /> : null}
                    {modalIsOpen ? <Backdrop onClick={closeDeleteCard} /> : null}

                    <FontAwesomeIcon icon={faChevronCircleUp} onClick={closePaid} className={classes.icon}></FontAwesomeIcon>

                </Card>
            }
        </ul>

    )
}

export default InvoiceItem;