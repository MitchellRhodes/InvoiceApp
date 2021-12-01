import axios from "axios";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import LoadedClientsContext from "../../contexts/LoadedClientContext";
import Backdrop from "../UI/Backdrop";
import Card from "../UI/Card";
import DeleteModal from "../UI/DeleteModal";
import UpdateClient from "./UpdateClient";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import classes from "./ClientItem.module.css";


function ClientItem(props) {

    //contexts
    const clientContext = useContext(LoadedClientsContext);

    //states
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [updateIsOpen, setUpdateIsOpen] = useState(false);
    const [error, setError] = useState(null);


    function openUpdateCard() {
        return setUpdateIsOpen(true);
    }

    function closeUpdateCard() {
        return setUpdateIsOpen(false);
    }

    function openDeleteCard() {
        setModalIsOpen(true);
    }

    function closeDeleteCard() {
        setModalIsOpen(false);
    }

    function removeClient(id) {

        axios.delete(`http://localhost:8080/clients/${id}`)
        clientContext.removeClient(id);
        return closeDeleteCard();
    }

    async function updateClientInfo(clientInfo, id) {

        await axios.put(`http://localhost:8080/clients/${id}`, clientInfo)
            .then(response => {
                if (response.statusText !== 'OK') {

                    throw Error(response.statusText)
                }

                clientContext.addClient(response.data);

            }).catch(err => {

                setError(err.message);
                console.log(error)
            });

        closeUpdateCard();
    }

    return (
        <ul>
            <Card>
                <div>
                    <h3>{props.first_name} {props.last_name}</h3>
                    <h4>{props.company_name}</h4>
                </div>
                <div>
                    <h5><span>Email: </span>{props.email}</h5>
                    <h5><span>Phone: </span>{props.phone_number}</h5>
                </div>

                <div className={classes.actions}>
                    <button>View {props.first_name}'s Invoices</button>

                    <Link to={`/generate-invoice/${props.id}`}>
                        <button>Create Invoice</button>
                    </Link>

                    <FontAwesomeIcon icon={faEdit} onClick={openUpdateCard} className={classes.icon}></FontAwesomeIcon>
                    {updateIsOpen ? <UpdateClient onCancel={closeUpdateCard} onConfirm={closeUpdateCard} updateClientInfo={updateClientInfo} currentClient={props} /> : null}
                    {updateIsOpen ? <Backdrop onClick={closeUpdateCard} /> : null}

                    <FontAwesomeIcon icon={faTrashAlt} onClick={openDeleteCard} className={classes.icon}></FontAwesomeIcon>
                    {modalIsOpen ? <DeleteModal onCancel={closeDeleteCard} onRemove={() => removeClient(props.id)} /> : null}
                    {modalIsOpen ? <Backdrop onClick={closeDeleteCard} /> : null}
                </div>
            </Card>
        </ul>
    )

}

export default ClientItem;