import { jsPDF } from "jspdf";
import { useContext, useState, useEffect } from "react";
import LoadedClientsContext from "../../contexts/LoadedClientContext";


function GeneratePDF(props) {

    const invoice = props.invoice;
    const clientContext = useContext(LoadedClientsContext);

    const [chosenClient, setChosenClient] = useState({});


    useEffect(() => {

        let chosen = clientContext.loadedClients.find(client => client.id === invoice.client_id);
        return setChosenClient(chosen);
    }, [setChosenClient, chosenClient, invoice, clientContext.loadedClients])


    function generateJsPDF() {

        const doc = new jsPDF();
        doc.text(`Client: ${chosenClient.first_name} ${chosenClient.last_name}`, 10, 10); //set text with the info from invoice and client
        doc.save(`${chosenClient.first_name}_${chosenClient.last_name}_${invoice.id}.pdf`);
    }

    return (


        <button onClick={generateJsPDF}>GeneratePDF</button>
    )
}

export default GeneratePDF;