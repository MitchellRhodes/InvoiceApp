import classes from "../UI/forms.module.css";
import ClientItem from "./ClientItem";


function ClientList(props) {

    return (
        <ul className={classes.list}>
            {props.clientInfo.map(client => (

                <ClientItem
                    key={client.id}
                    id={client.id}
                    first_name={client.first_name}
                    last_name={client.last_name}
                    company_name={client.company_name}
                    email={client.email}
                    phone_number={client.phone_number} />
            ))}

        </ul>
    )
}

export default ClientList;