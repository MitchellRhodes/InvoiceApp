import Card from "../UI/Card";


function CompletedInvoiceItem(props) {

    return (
        <ul>
            {props.completed === true &&

                <Card>

                </Card>
            }
        </ul>
    )
}

export default CompletedInvoiceItem;