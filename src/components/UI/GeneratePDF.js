import { jsPDF } from "jspdf";
import 'jspdf-autotable'
import { useContext, useState, useEffect } from "react";
import LoadedClientsContext from "../../contexts/LoadedClientContext";
import LoadedInvoicesContext from "../../contexts/loadedInvoicesContext";


function GeneratePDF(props) {

    const invoice = props.invoice;
    const clientContext = useContext(LoadedClientsContext);
    const invoiceContext = useContext(LoadedInvoicesContext);

    const [chosenClient, setChosenClient] = useState({});


    useEffect(() => {

        let chosen = clientContext.loadedClients.find(client => client.id === invoice.client_id);
        return setChosenClient(chosen);
    }, [setChosenClient, chosenClient, invoice, clientContext.loadedClients])


    function generateJsPDF() {

        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;

        //client name
        let text = `Client: ${chosenClient.first_name} ${chosenClient.last_name}`
        let textX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(text)) / 2
        doc.text(text, textX, 10);

        //date
        let date = `Date Posted: ${invoice.date_created}`
        let dateX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(date)) / 2
        doc.text(date, dateX, 20);

        //items
        const rows = [];

        invoiceContext.invoiceItems.map(item => rows.push(item));

        doc.autoTable({
            columns: [{ header: 'Item', dataKey: 'item' }, { header: 'Rate', dataKey: 'rate' }, { header: 'Quantity', dataKey: 'quantity' }],
            body: rows,
            startY: 30
        })

        let finalY = doc.previousAutoTable.finalY;
        if (finalY >= pageHeight || finalY + 10 >= pageHeight) {
            doc.addPage();
        }

        //total
        let total = `Total: ${invoice.total}`
        doc.text(total, 20, finalY + 10);

        doc.save(`${chosenClient.first_name}_${chosenClient.last_name}_${invoice.id}.pdf`);

        props.onCancel();
    }

    return (

        <button onClick={generateJsPDF}>GeneratePDF</button>
    )
}

export default GeneratePDF;