import ObjectListItem from "sap/m/ObjectListItem";
import PDFViewer from "sap/m/PDFViewer";
import Component from "../Component";
import Event from "sap/ui/base/Event";
import Controller from "sap/ui/core/mvc/Controller";

/**
 * @namespace workinstructiontray.controller
 */
export default class Main extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {

    }
    onPress(event: Event): void {
        const item = <ObjectListItem>event.getSource();
        if (item !== null && item !== undefined) {

            const router = (<Component>this.getOwnerComponent()).getRouter();

            const ssPath = <Object>item.getBindingContext("suppliers")?.getProperty("ID");
            const sPath = <Object>item.getBindingContext("suppliers")?.getPath().substring(1);

            router.navTo("RouteDetail", {
                tPath: sPath
            });
        }
    }
    navDt(): void {
        const router = (<Component>this.getOwnerComponent()).getRouter();
        router.navTo("RouteDt", {}, true);
    }

    //method for displaying PDF's
    showPDF(): void{
        var opdfViewer = new PDFViewer();
        this.getView()?.addDependent(opdfViewer);
        var sServiceURL = "https://icseindia.org/document/sample.pdf"; //get serviceurl

        opdfViewer.setSource(sServiceURL);
        opdfViewer.setTitle( "My PDF");
        opdfViewer.open();	
}
}