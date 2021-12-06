import axios from "axios";
import { useEffect, useState } from "react";
import Card from "../UI/Card";


function InvoiceItem(props) {

    //states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadedItems, setLoadedItems] = useState([]);

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

    return (
        <ul>
            <Card>
                {error && <div>{error}</div>}
                {isLoading && <div>Loading...</div>}
                {props.date_created}

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

            </Card>
        </ul>
    )
}

export default InvoiceItem;