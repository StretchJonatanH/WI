interface RouteArguments {
    Doknr: string;
    Dokar: string;
    Dokvr: string;
    Doktl: string;
  }

import ObjectListItem from "sap/m/ObjectListItem";
import Component from "../Component";
import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import History from "sap/ui/core/routing/History";
import { Route$MatchedEventParameters, Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import Event from "sap/ui/base/Event";
import View from "sap/ui/core/mvc/View";
import Select from "sap/m/Select";
import Item from "sap/ui/core/Item";
import Table from "sap/ui/table/Table";
import mTable from "sap/m/Table";
import TextArea from "sap/m/TextArea";
import Dialog from "sap/m/Dialog";
import Button from "sap/m/Button";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Label from "sap/m/Label";
import Library from "sap/m/library";
import Element from "sap/ui/core/Element";
import Column from "sap/ui/table/Column";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import Route from "sap/ui/vbm/Route";
import MessageBox from "sap/m/MessageBox";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import formatter from "workinstructiontray/model/formatter";
import ListBinding from "sap/ui/model/ListBinding";
import Sorter from "sap/ui/model/Sorter";
import SearchField from "sap/m/SearchField";

/**
 * @namespace workinstructiontray.controller
 */

var DialogType = Library.DialogType;
var ButtonType = Library.ButtonType;

/**
 * Lock all the controls.
 *  edit button to unlock them.
 *  Save butotn to pick up data.
 * Change UoM's. Paste values functions
 * 
 * Connection / Cert
 * Build components page
 * Choosing page creation
 */
export default class Detail extends Controller {
   
    public formatter = formatter;
    private dialog: Dialog;
    private oODataModel: ODataModel;
    private oJSONModel: JSONModel;
    private oJSONModelTray: JSONModel;
    private oJSONModelHistory: JSONModel;

    public onInit(): void {
        
        //init model and data
        const router = (<Component>this.getOwnerComponent()).getRouter();
        router.getRoute("RouteDetail")?.attachPatternMatched(this._onObjectMatched, this);

        this.oODataModel = this.getOwnerComponent()?.getModel("Z_TRAYFACTPROCESS_SRV") as ODataModel;
        this.oJSONModel = new JSONModel();
        this.oJSONModelTray = new JSONModel();
        this.oJSONModelHistory = new JSONModel();

        this.getView()?.setModel(this.oJSONModel, "WIDetail");
        this.getView()?.setModel(this.oJSONModelTray, "TrayModel");
        this.getView()?.setModel(this.oJSONModelHistory, "WIHistory");

        // Attach the route pattern matched event to capture the workInstructionId parameter
        const oRouter = (<Component>this.getOwnerComponent()).getRouter();
        oRouter.getRoute("RouteDetail")?.attachPatternMatched(this._onPatternMatched, this);

    }
    _onPatternMatched(oEvent: Route$PatternMatchedEvent): void {
        // Extract the workInstructionId parameter from the route
        const sWorkInstructionId = oEvent.getParameter("arguments") as RouteArguments;

        if(sWorkInstructionId.hasOwnProperty("Doknr") && sWorkInstructionId.hasOwnProperty("Dokar") && sWorkInstructionId.hasOwnProperty("Dokvr") && sWorkInstructionId.hasOwnProperty("Doktl")){
            
            // Find DOKAR, DOKNR, DOKVR, DOKTL for request
            const Doknr = sWorkInstructionId.Doknr;
            const Dokar = sWorkInstructionId.Dokar;
            const Dokvr = sWorkInstructionId.Dokvr;
            const Doktl = sWorkInstructionId.Doktl;

            // Fetch the data using the OData model and set it to the JSON model
            this.oODataModel.read(`/WorkInstructions(Dokar='${Dokar}',Doknr='${Doknr}',Dokvr='${Dokvr}',Doktl='${Doktl}')`, {
                success: (oData: any) => {
                    // Set the data to the JSON model for the detail view
                    this.oJSONModel.setData(oData);
                    this.applySorting("Dokvr", true);
                },
                error: (oError: any) => {
                    console.error("Error fetching data:", oError.message);
                }
            })

             // Trays (color, box in box etc request)
            // const aFilters = [new Filter("Doknr", FilterOperator.StartsWith, sSearchValue)];

            this.oODataModel.read(`/Trays('${Doknr}')`, {
                urlParameters: {
                    $expand: "All_TrayUoms"
                },
                success: (oData: any) => {

                    let uoms = oData.All_TrayUoms.results;
                    let UoMFiltered = uoms.filter((obj: { Meinh: string; }) => {
                        return obj.Meinh === "PAL" || obj.Meinh === "TRP"
                      });
                      oData.All_TrayUoms.results = UoMFiltered;
                    // Store filtered WorkInstruction data in the JSON model
                    this.oJSONModelTray.setData(oData);

               
                },
                error: (oError: any) => {
                    MessageBox.warning("Error fetching data: " + oError.message)
                    this.oJSONModelTray.setData({ WorkInstructions: [] }); // Clear the table if an error occurs
                   
                }
            });
            
            //Version History
            const aFilters = [new Filter("Doknr", FilterOperator.EQ, Doknr)];
            
            this.oODataModel.read('/WorkInstructions', {
                filters: aFilters,
                success: (oData: any) => {
                    // Set the data to the JSON model for the detail view
                    this.oJSONModelHistory.setData(oData.results);
                },
                error: (oError: any) => {
                    console.error("Error fetching data:", oError.message);
                }
            })
            
        }
    }
    _onObjectMatched(oEvent: Route$PatternMatchedEvent): void {
        var oArgs = (<any>oEvent.getParameter("arguments"));
        var oView = <View>this.getView();

        // var oModel = new JSONModel( oArgs.tPath +"/Products");



        oView.bindElement({
            path: oArgs.tPath + "/Products",
            events: {
                dataRequested: function (oEvent: any) {
                    oView.setBusy(true);
                },
                dataReceived: function (oEvent: any) {
                    oView.setBusy(false);
                }
            }
        });
    }
    handleBackPress(): void {
        const oHistory = History.getInstance();
        const sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
            window.history.go(-1);
        } else {
            const router = (<Component>this.getOwnerComponent()).getRouter();
            router.navTo("RouteMain", {}, true);
        }
    }

    toTrayDesigner(): void {

    }
    toPDF(): void {

    }
    selectStatus(): void {
        var oSelect = <Select>this.byId("selectStatus");
        var oModel = this.getView()?.getModel("data");
        var oItem = new Item({
            id: "2",
            text: "one"
        });

        oSelect.addItem(oItem);
        oSelect.setSelectedKey("2");
    }
    pressView(): void {
        //show PDF
    }
    pressTrayDesigner(): void {
        //send to tray designer application with parameters for current tray.
    }
    toggleTextAreaSIM(): void {
        var oTextArea = <TextArea>this.byId("SIM");
        oTextArea.setEditable(false);
    }
    toggleTextAreaSIF(): void {
        var oTextArea = <TextArea>this.byId("SIF");
        oTextArea.setEditable(false);
    }
    editSIM(): void {

        //turn button back to standard state if already pressed
        var oButton = <Button>this.byId("editSIM")
        oButton.setType("Default");

        var oTextArea = <TextArea>this.byId("SIM");
        var sText = oTextArea.getValue();
        var dialog = this.dialog;


        dialog = new Dialog({
            type: DialogType.Message,
            title: "New Instructions",
            content: [
                new Label({
                    text: "Edit Special Market Instructions",
                    labelFor: "dialogSIMAREA"
                }),
                new TextArea("dialogSIMAREA",
                    {
                        width: "100%",
                        height: "5rem",
                        value: sText,
                    })
            ],
            beginButton: new Button({
                type: ButtonType.Emphasized,
                text: "Submit",
                press: function () {
                    //send data
                    //if succefull
                    var sText = (<TextArea>Element.getElementById("dialogSIMAREA"))?.getValue();
                    oButton.setType("Success");
                    //if fail
                    dialog.destroy();

                }.bind(this)
            }),
            endButton: new Button({
                text: "Close",
                press: function () {
                    dialog.destroy();
                }.bind(this)
            })
        });
        dialog.open();

    }
    editSIF(): void {

        //turns button back to default if already pressed
        var oButton = <Button>this.byId("editSIF")
        oButton.setType("Default");
        //
        var oTextArea = <TextArea>this.byId("SIF");
        var sText = oTextArea.getValue();
        var dialog = this.dialog;


        dialog = new Dialog({
            type: DialogType.Message,
            title: "New Instructions",
            content: [
                new Label({
                    text: "Edit Special Market Factory",
                    labelFor: "dialogSIFAREA"
                }),
                new TextArea("dialogSIFAREA",
                    {
                        width: "100%",
                        height: "5rem",
                        value: sText,
                    })
            ],
            beginButton: new Button({
                type: ButtonType.Emphasized,
                text: "Submit",
                press: function () {
                    //send data
                    //if succefull
                    var sText = (<TextArea>Element.getElementById("dialogSIFAREA"))?.getValue();
                    oTextArea.setValue(sText);
                    oButton.setType("Success");
                    dialog.destroy();

                }.bind(this)
            }),
            endButton: new Button({
                text: "Close",
                press: function () {
                    dialog.destroy();
                }.bind(this)
            })
        });
        dialog.open();
    }
    editFold(): void {


        // turns button back to default if already pressed 
        var oButton = <Button>this.byId("editFold")
        oButton.setType("Default");

        var dialog = this.dialog;

        var oInput = <Input>this.byId("inputFold")
        var oModel = this.getView()?.getModel("folds");

        var oSelect = new Select({
            items: {
                path: "/folds", template: new Item({
                    key: "{foldId}",
                    text: "{Name}"
                })
            }
        });
        oSelect.setModel(oModel);

        dialog = new Dialog({
            type: DialogType.Message,
            title: "New Fold",
            content: [
                new Label({
                    text: "Edit Folding: ",
                    labelFor: "dialogFoldAREA",

                }).addStyleClass("sapUiSmallMarginEnd"),
                oSelect
            ],
            beginButton: new Button({
                type: ButtonType.Emphasized,
                text: "Submit",
                press: function () {
                    //send data
                    //if succefull
                    oButton.setType("Success");
                    var oSelectedItem = oSelect.getSelectedItem();
                    var sText = <string>oSelectedItem?.getText();
                    oInput.setValue(sText);

                    // oSelect.setSelectedKey(oSelectedItem);
                    //if fail
                    dialog.destroy();

                }.bind(this)
            }),
            endButton: new Button({
                text: "Close",
                press: function () {
                    dialog.destroy();
                }.bind(this)
            })
        });
        dialog.open();
    }
    editStatus(): void {
        var oButton = <Button>this.byId("editStatus")
        oButton.setType("Default");
        var that = this;
        var dialog = this.dialog;

        var oInput = <Input>this.byId("inputStatus")
        var oModel = this.getView()?.getModel("statuses");

        var oSelect = new Select({
            items: {
                path: "/statuses", template: new Item({
                    key: "{statusesId}",
                    text: "{Name}"
                })
            }
        });
        oSelect.setModel(oModel);

        dialog = new Dialog({
            type: DialogType.Message,
            title: "New Status",
            content: [
                new Label({
                    text: "Edit Status: ",
                    labelFor: "dialogStatusAREA",

                }).addStyleClass("sapUiSmallMarginEnd"),
                oSelect
            ],
            beginButton: new Button({
                type: ButtonType.Emphasized,
                text: "Submit",
                press: function () {
                    //send data
                    //trigger /sap/opu/odata/SAP/Z_TRAYFACTPROCESS_SRV/SaveWI?Matnr='97000140-06'&ReasonForRejectionChange=''&Werks='CZ26'&DIFlag=false&Dokst=''&MarketText=''&Dokvr=''&ReasonForRejection=''&PdfLink=''&FoldingMethod=''&FactoryText=''&$format=json
                    that.triggerSaveWi();

                    //##if succefull
                    oButton.setType("Success");
                    var oSelectedItem = oSelect.getSelectedItem();
                    var sText = <string>oSelectedItem?.getText();
                    oInput.setValue(sText);

                    // oSelect.setSelectedKey(oSelectedItem);
                    //##if fail
                    dialog.destroy();

                }.bind(this)
            }),
            endButton: new Button({
                text: "Close",
                press: function () {
                    dialog.destroy();
                }.bind(this)
            })
        });
        dialog.open();
    }
    triggerSaveWi(): void {
       //&Dokst=''&MarketText=''&Dokvr=''&ReasonForRejection=''&PdfLink=''&FoldingMethod=''&FactoryText=''&$format=json
        this.oJSONModel.getProperty("Brgew");
       this.oODataModel.callFunction("/SaveWI", 
        {
            method: "POST",
            urlParameters: {
                "Matnr": this.oJSONModel.getProperty("Brgew"),
                "ReasonForRejectionChange": "",
                "Werks": this.oJSONModel.getProperty("Werks"),
                "DIFlag": false,
                "Dokst": this.oJSONModel.getProperty("Dokst"),
                "MarketText": "",
                "Dokvr": this.oJSONModel.getProperty("Dokvr"),
                "ReasonForRejection": "",
                "PdfLink": "",
                "FoldingMethod": "",
                "FactoryText": "",
            },
            success: (oData: any) => {
                // Set the data to the JSON model for the detail view
                this.oJSONModel.setData(oData);
            },
            error: (oError: any) => {
                console.error("Error fetching data:", oError.message);
            }
        })
    }
    editUOM(): void {

        var dialog = this.dialog;
        var oTable = this.getView()?.byId("UOM");

        //create model
        var oModel = new JSONModel({
            tableData: [
                { Type: "PAL", Qty: 4, Length: 20, Width: 30, Height: 33, GrossWeight: 4.02, NetWeight: 150.3 },
                { Type: "TRP", Qty: 4, Length: 25, Width: 33, Height: 35, GrossWeight: 5.25, NetWeight: 150.4 }
            ]
        });
        this.getView()?.setModel(oModel, "uom");
        //create table for dialog
        var oTablenew = new Table({
            title: "Unit of Measures",
            editable: true,
            visibleRowCount: 2,
            selectionMode: "None",
            // paste: this.tablePaste()
        });
        //collumn
        var aColumns = [
            { label: "Type", template: "Type" },
            { label: "Qty (PC)", template: "Qty" },
            { label: "Length (MM)", template: "Length" },
            { label: "Width (MM)", template: "Width" },
            { label: "Height (MM)", template: "Height" },
            { label: "Gross Weight (KG)", template: "GrossWeight" },
        ];

        aColumns.forEach(function (column) {
            oTablenew.addColumn(new Column({
                label: new Label({ text: column.label }),
                template: new Input({ value: "{" + column.template + "}" }),
            }));
        });
        oTablenew.addColumn(new Column({
            label: new Label({ text: "Paste Here" }),
            template: new Text({ text: "" }),

        }));

        oTablenew.setModel(oModel);
        oTablenew.bindRows({ path: "/tableData" });

        dialog = new Dialog({
            type: DialogType.Message,
            title: "Edit UoM",
            content: [

                oTablenew

            ],
            beginButton: new Button({
                type: ButtonType.Emphasized,
                text: "Submit",
                press: function () {
                    //send data
                    //##if succefull


                    // oSelect.setSelectedKey(oSelectedItem);
                    //##if fail
                    dialog.destroy();

                }.bind(this)
            }),
            endButton: new Button({
                text: "Close",
                press: function () {
                    dialog.destroy();
                }.bind(this)
            })
        });
        dialog.open();
    }
    tablePaste(oEvent: Event): void {
        // var aClipboardData = oEvent.getParameter("data");
        // console.log("Pasted data:", aClipboardData);

        // Assuming the clipboard data is structured in rows and columns matching the table structure
        // var aStructuredData = aClipboardData.map(function (row: any) {
        //     return {
        //         Type: row[0],
        //         Qty: parseInt(row[1], 10),
        //         Length: parseFloat(row[2]),
        //         Width: parseFloat(row[3]),
        //         Height: parseFloat(row[4]),
        //         GrossWeight: parseFloat(row[5]),
        //         NetWeight: parseFloat(row[6])
        //     };
        // });

    }
    Clipboard(row: any): any {

    }
    private applySorting(property: string, bSort: boolean): void {
        const oTable: Table = this.byId("woiHistory") as Table;
        const oBinding = oTable.getBinding("items");

        if (oBinding instanceof ListBinding) {
            const oSorter = new Sorter(property, bSort);
            oBinding.sort(oSorter);
        } else {
            console.error("Binding is not of type ListBinding and cannot be sorted.");
        }
    }
    onSearchHistory(oEvent: Event): void {

        const oTable = <Table> this.byId("woiHistory"); 
        const oSearch = <SearchField>this.byId("searchVers");
        const oBinding: ListBinding = oTable.getBinding("items") as ListBinding;

        if(oTable && oSearch){
            var sSearch = oSearch.getValue();
            const oFilter = new Filter("Dokvr", FilterOperator.Contains, sSearch);
            oBinding.filter([oFilter]);
            
        }else {
            oBinding.filter([]);
        }


    }
}