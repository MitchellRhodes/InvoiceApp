import { createContext, useState } from "react";


const LoadedInvoicesContext = createContext({
    loadedInvoices: [],
    removeInvoice: (invoiceId) => { }
})

export function LoadedInvoicesContextProvider(props) {

    const [invoices, setInvoices] = useState([]);

    function removeInvoiceHandler(invoiceId) {

        setInvoices((previousInvoices) => {
            return previousInvoices.filter(invoice => invoice.id !== invoiceId)
        })
    };

    const context = {
        loadedInvoices: invoices,
        removeInvoice: removeInvoiceHandler
    }

    return (
        <LoadedInvoicesContext.Provider value={context}>
            {props.children}
        </LoadedInvoicesContext.Provider>
    )

}

export default LoadedInvoicesContext;