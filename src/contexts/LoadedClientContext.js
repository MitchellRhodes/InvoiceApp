import { createContext, useState } from "react";


const LoadedClientsContext = createContext({
    loadedClients: [],
    addClient: (newClient) => { },
    removeClient: (clientId) => { }
})

export function LoadedClientsContextProvider(props) {

    const [clients, setClients] = useState([]);

    function addClientHandler(newClient) {

        setClients((previousClients) => {
            return previousClients.concat(newClient)
        })
    };

    function removeClientHandler(clientId) {

        setClients((previousClients) => {
            return previousClients.filter(client => client.id !== clientId)
        })
    };

    const context = {
        loadedClients: clients,
        addClient: addClientHandler,
        removeClient: removeClientHandler
    }

    return (
        <LoadedClientsContext.Provider value={context}>
            {props.children}
        </LoadedClientsContext.Provider>
    )
};


export default LoadedClientsContext;