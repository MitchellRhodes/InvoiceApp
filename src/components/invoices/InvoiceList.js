import classes from "../UI/forms.module.css";
import InvoiceItem from "./InvoiceItem";


function InvoiceList(props) {

    return (


        <ul className={classes.list}>


            {props.clientInvoices.map(invoices => (

                <InvoiceItem
                    key={invoices.id}
                    id={invoices.id}
                    client_id={invoices.client_id}
                    date_created={invoices.date_created}
                    total={invoices.total}
                    completed={invoices.completed}
                    showCompleted={props.showCompleted} />
            ))}

        </ul>

    )
}

export default InvoiceList;