import Card from "../UI/Card";

function ClientItem(props) {


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
            </Card>
        </li>
    )

}

export default ClientItem;