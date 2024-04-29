import Controller from "sap/ui/core/mvc/Controller";
import Component from "../Component";
import PDFViewer from "sap/m/PDFViewer";
import Table from "sap/m/Table";

/**
 * @namespace witray.controller
 */
export default class Main extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {

    }
    showPDF(): void{
        var opdfViewer = new PDFViewer();
        this.getView()?.addDependent(opdfViewer);
        var sServiceURL = "https://icseindia.org/document/sample.pdf"; //get serviceurl

        opdfViewer.setSource(sServiceURL);
        opdfViewer.setTitle( "My PDF");
        opdfViewer.open();	


        //Z_TRAYDATA_SRV 
        var oModel = this.getOwnerComponent()?.getModel("Z_TRAYDATA_SRV");
        this.getView()?.setModel(oModel, "data");

        // var table = new Table().placeAt();
}
}