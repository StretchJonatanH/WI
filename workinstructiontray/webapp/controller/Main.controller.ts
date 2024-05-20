import ObjectListItem from "sap/m/ObjectListItem";
import PDFViewer from "sap/m/PDFViewer";
import Component from "../Component";
import Event from "sap/ui/base/Event";
import Controller from "sap/ui/core/mvc/Controller";
import List from "sap/m/List";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import JSONModel from "sap/ui/model/json/JSONModel";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import SearchField from "sap/m/SearchField";
import MessageBox from "sap/m/MessageBox";
import Table from "sap/m/Table";
import Button from "sap/m/Button";
import Sorter from "sap/ui/model/Sorter";
import ListBinding from "sap/ui/model/ListBinding";
import Message from "sap/ui/core/message/Message";
import MessageToast from "sap/m/MessageToast";
import formatter from "workinstructiontray/model/formatter";
/**
 * @namespace workinstructiontray.controller
 */
export default class Main extends Controller {

    public formatter = formatter;

    /*eslint-disable @typescript-eslint/no-empty-function*/
    private oODataModel: ODataModel;
    private oJSONModel: JSONModel;
    private bDescendVersion: boolean | undefined;
    private bDescendStatus: boolean | undefined;
    
    public onInit(): void {
        // Obtain the OData model from the owner component
        this.oODataModel = this.getOwnerComponent()?.getModel("Z_TRAYFACTPROCESS_SRV") as ODataModel;

        // Initialize the JSON model to hold the fetched data
        this.oJSONModel = new JSONModel();
        this.getView()?.setModel(this.oJSONModel, "WIModel");

        //Sets descending for the list sorting
        this.bDescendVersion = true;
        this.bDescendStatus = false;;
    }
    onPress(event: Event): void {
        const oItem = <ObjectListItem>event.getSource();
        const router = (<Component>this.getOwnerComponent()).getRouter();
        
        const oContext = oItem.getBindingContext("WIModel");

        if(oContext){
            const Doknr = oContext.getProperty("Doknr");
            const Dokar = oContext.getProperty("Dokar");
            const Dokvr = oContext.getProperty("Dokvr");
            const Doktl = oContext.getProperty("Doktl");

            router.navTo("RouteDetail", {
                Doknr: Doknr,
                Dokar: Dokar,
                Dokvr: Dokvr,
                Doktl: Doktl,
            });
        }

    }
    navDt(): void {
        const router = (<Component>this.getOwnerComponent()).getRouter();
        router.navTo("RouteDt", {}, true);
    }
    navComponents(): void {
        const router = (<Component>this.getOwnerComponent()).getRouter();
        router.navTo("RouteComponents", {}, true);
    }

    //method for displaying PDF's
    showPDF(): void {
        var opdfViewer = new PDFViewer();
        this.getView()?.addDependent(opdfViewer);
        var sServiceURL = "https://icseindia.org/document/sample.pdf"; //get serviceurl

        opdfViewer.setSource(sServiceURL);
        opdfViewer.setTitle("My PDF");
        opdfViewer.open();
    }
    public onSearch(): void {
        // Set table loading
        const oTable = <Table> this.byId("TrayIDs");
        oTable.setBusy(true);
        //show cancel button
        const oButton = <Button> this.byId("cancelBusy");
        oButton.setVisible(true);

        // Get the search field value
        var sIDSearch = <SearchField>this.byId("trayIDsearch");
        var sIDPlantSearch = <SearchField>this.byId("PlantIDsearch");

        const aFilters: Filter[] = [];

        if (sIDSearch && sIDPlantSearch) {
            const sSearched = sIDSearch;
            const sPlantSearch = sIDPlantSearch;
            var sSearchValue = sSearched.getValue() || "";
            var sPlantSearchValue = sPlantSearch.getValue() || "";
            
            if (!sSearchValue || !sPlantSearchValue) {
                // If no search value, reset the table data or show a message
                this.oJSONModel.setData([]);
                oTable.setBusy(false);
                if(!sSearchValue){
                    MessageToast.show("Please enter an ID")
                }
                if(!sPlantSearchValue){
                    MessageToast.show("Please enter a Plant")
                }
                return;
            }else if(sSearchValue && sPlantSearchValue) {

                // Create a filter based on the search value
                const aFilters = [new Filter("Doknr", FilterOperator.StartsWith, sSearchValue), new Filter("Werks", FilterOperator.EQ, sPlantSearchValue)];
                
                this.oODataModel.read("/WorkInstructions", {
                    filters: aFilters,
                    success: (oData: { results: Array<any> }) => {
                        // Store filtered WorkInstruction data in the JSON model
                        this.oJSONModel.setData({
                            WorkInstructions: oData.results
                        });
                        oTable.setBusy(false);
                        oButton.setVisible(false);
                        this.bDescendVersion = false;
                        this.onSortVersion();
                    },
                    error: (oError: any) => {
                        MessageBox.warning("Error fetching data: " + oError)
                        this.oJSONModel.setData([]); // Clear the table if an error occurs
                        oTable.setBusy(false);
                        oButton.setVisible(false);
                    }
                });
            }
        }

    }
    private applySorting(property: string, bSort: boolean): void {
        const oTable: Table = this.byId("TrayIDs") as Table;
        const oBinding = oTable.getBinding("items");

        if (oBinding instanceof ListBinding) {
            const oSorter = new Sorter(property, bSort);
            oBinding.sort(oSorter);
        } else {
            console.error("Binding is not of type ListBinding and cannot be sorted.");
        }
    }
    onSortVersion(): void {
        //reverse the property
        this.bDescendVersion = !this.bDescendVersion;
        this.applySorting("Dokvr", this.bDescendVersion);
    }
    onSortStatus(): void {
        //reverse the property
        this.bDescendStatus = !this.bDescendStatus
        this.applySorting("Dokst", this.bDescendStatus);
    }
    cancelBusyTable(): void {
        const oTable = <Table> this.byId("TrayIDs");
        oTable.setBusy(false)
    }
}
