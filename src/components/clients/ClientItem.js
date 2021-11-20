import axios from "axios";
import { useContext, useState } from "react";
import LoadedClientsContext from "../../contexts/LoadedClientContext";
import Backdrop from "../UI/Backdrop";
import Card from "../UI/Card";
import Modal from "../UI/Modal";

function ClientItem(props) {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const clientContext = useContext(LoadedClientsContext);

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

    return (
        <li>
            <Card>
                <div>
                    <h3>{props.first_name} {props.last_name}</h3>
                    <h4>{props.company_name}</h4>
                </div>
                <div>
                    <h5><span>Email: </span>{props.email}</h5>
                    <h5><span>Phone: </span>{props.phone_number}</h5>
                </div>
                <button>Edit Client</button>
                <button onClick={openDeleteCard}>Remove Client</button>
                {modalIsOpen ? <Modal onCancel={closeDeleteCard} onRemove={() => removeClient(props.id)} /> : null}
                {modalIsOpen ? <Backdrop onClick={closeDeleteCard} /> : null}
            </Card>
        </li>
    )

}

export default ClientItem;