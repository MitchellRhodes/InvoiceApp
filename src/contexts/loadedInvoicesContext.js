import { createContext, useState } from "react";


const LoadedInvoicesContext = createContext({
    loadedInvoices: [],
    removeInvoice: (invoiceId) => { },
    invoiceIsComplete: (completedInvoice) => { }
})

export function LoadedInvoicesContextProvider(props) {

    const [invoices, setInvoices] = useState([]);

    function removeInvoiceHandler(invoiceId) {

        setInvoices((previousInvoices) => {
            return previousInvoices.filter(invoice => invoice.id !== invoiceId)
        })
    };

    function invoiceIsCompleteHandler(completedInvoice) {

        setInvoices((previousInvoices) => {

            return previousInvoices.concat(completedInvoice)
        })
    }

    const context = {
        loadedInvoices: invoices,
        removeInvoice: removeInvoiceHandler,
        invoiceIsComplete: invoiceIsCompleteHandler
    }

    return (
        <LoadedInvoicesContext.Provider value={context}>
            {props.children}
        </LoadedInvoicesContext.Provider>
    )

}

export default LoadedInvoicesContext;