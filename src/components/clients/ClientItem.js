import axios from "axios";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import LoadedClientsContext from "../../contexts/LoadedClientContext";
import Backdrop from "../UI/Backdrop";
import Card from "../UI/Card";
import DeleteModal from "../UI/DeleteModal";
import UpdateClient from "./UpdateClient";

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

                <button>View {props.first_name}'s Invoices</button>

                <Link to={`/generate-invoice/${props.id}`}>
                    <button>Create Invoice</button>
                </Link>

                <button onClick={openUpdateCard}>Edit Client</button>
                {updateIsOpen ? <UpdateClient onCancel={closeUpdateCard} onConfirm={closeUpdateCard} updateClientInfo={updateClientInfo} currentClient={props} /> : null}
                {updateIsOpen ? <Backdrop onClick={closeUpdateCard} /> : null}

                <button onClick={openDeleteCard}>Remove Client</button>
                {modalIsOpen ? <DeleteModal onCancel={closeDeleteCard} onRemove={() => removeClient(props.id)} /> : null}
                {modalIsOpen ? <Backdrop onClick={closeDeleteCard} /> : null}
            </Card>
        </ul>
    )

}

export default ClientItem;