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
        const pageHeight = doc.internal.pageSize.height;

        let text = `Client: ${chosenClient.first_name} ${chosenClient.last_name}`
        let textX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(text)) / 2
        doc.text(text, textX, 10);

        //date
        let date = `Date Posted: ${invoice.date_created}`
        let dateX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(date)) / 2
        doc.text(date, dateX, 20);

        //items


        // if (y >= pageHeight) {
        //     doc.addPage();
        // }

        //total
        let total = `Total: ${invoice.total}`
        doc.text(total, 20, pageHeight - 20);

        doc.save(`${chosenClient.first_name}_${chosenClient.last_name}_${invoice.id}.pdf`);

        //handle closing the modal emit it up
    }

    return (

        <button onClick={generateJsPDF}>GeneratePDF</button>
    )
}

export default GeneratePDF;