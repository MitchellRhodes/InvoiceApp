import { jsPDF } from "jspdf";


function GeneratePDF() {

    function generateJsPDF() {

        const doc = new jsPDF();

        doc.text("Hello world!", 10, 10); //set text with the info from invoice and client
        doc.save("a4.pdf"); //save it using client info and maybe date/time
    }

    return (


        <button onClick={generateJsPDF}>GeneratePDF</button>
    )
}

export default GeneratePDF;