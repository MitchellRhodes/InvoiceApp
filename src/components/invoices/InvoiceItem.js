import axios from "axios";
import { useEffect, useState } from "react";
import Backdrop from "../UI/Backdrop";
import Card from "../UI/Card";
import DeleteModal from "../UI/DeleteModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";


//placeholder, will probably need a more specific one for this component
import classes from "../clients/ClientItem.module.css";


function InvoiceItem(props) {

    //states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadedItems, setLoadedItems] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);


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

    }, [props.id])


    function openDeleteCard() {
        setModalIsOpen(true);
    }

    function closeDeleteCard() {
        setModalIsOpen(false);
    }

    function removeInvoice(id) {

        //UPDATE CONTEXT like with the clientItem
        axios.delete(`http://localhost:8080/invoices/${id}`)
        return closeDeleteCard();
    }


    return (
        <ul>
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
                    <h4>Amount Due: {props.total}</h4>
                </div>

                <FontAwesomeIcon icon={faCheck} className={`${classes.icon} ${classes.greenIcon}`}></FontAwesomeIcon>

                <FontAwesomeIcon icon={faTrashAlt} onClick={openDeleteCard} className={classes.icon}></FontAwesomeIcon>
                {modalIsOpen ? <DeleteModal onCancel={closeDeleteCard} onRemove={() => removeInvoice(props.id)} /> : null}
                {modalIsOpen ? <Backdrop onClick={closeDeleteCard} /> : null}

            </Card>
        </ul>
    )
}

export default InvoiceItem;