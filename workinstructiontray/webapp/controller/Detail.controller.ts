import ObjectListItem from "sap/m/ObjectListItem";
import Component from "../Component";
import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import History from "sap/ui/core/routing/History";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
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

    private dialog: Dialog;

    public onInit(): void {

        const router = (<Component>this.getOwnerComponent()).getRouter();
        router.getRoute("RouteDetail")?.attachPatternMatched(this._onObjectMatched, this);

        //create model
        //display model in page
        var jModel = new JSONModel();
        jModel.setData({
            id: "97000410-00",
            version: "00",
            trayDescription: "Customized Efficient surgery tray",
            deliverCountry: "DK",
            versionDate: "2024-19-24",
            createdBy: "CZCSAZO",
            specialInstructionMarket: "Please send us WI before the first production",
            specialInstructionFactory: "Postal WI: CC2310835-00-, CC2310835-05-, CC2310835-00-",
            foldingMethod: "FE",
            WIStatus: "AQ rel TO PRODTN",
            colour: "Orange",
            colourLabel: "Side/Bottom Label",
            boxInBox: "Yes"
        })
        this.getView()?.setModel(jModel, "data");

        this.getView()?.getModel();

        //set select 
        var oSelectFolding = <Select>this.byId("selectStatus");
        var oSelectStatus = <Select>this.byId("selectFold");

        var jSelectStatus = new JSONModel();
        jSelectStatus.setData({
            "status": "999",
            "statuses": [{
                "StatusId": 10,
                "Name": "FE"
            },
            {
                "StatusId": 11,
                "Name": "WN"
            },
            {
                "StatusId": 12,
                "Name": "WP"
            },
            {
                "StatusId": 13,
                "Name": "AQ"
            },

            ]
        });
        this.getView()?.setModel(jSelectStatus, "statuses");

        var jSelectFolds = new JSONModel();
        jSelectFolds.setData({
            "fold": "999",
            "folds": [{
                "foldId": 10,
                "Name": "Fold One"
            },
            {
                "foldId": 11,
                "Name": "Fold two"
            },
            {
                "foldId": 12,
                "Name": "Fold three"
            },
            {
                "foldId": 13,
                "Name": "Fold four"
            },

            ]
        });
        this.getView()?.setModel(jSelectFolds, "folds");

        // //folds
        // oSelectFolding.setEditable(false);
        // oSelectStatus.setEditable(false);

        //ppoulate tables
        this.populateTable();
        this.populateVHTable();

        //textAreas
        this.toggleTextAreaSIM();
        this.toggleTextAreaSIF()


        // var oModel = (<Component>this.getOwnerComponent()).getModel("TrayHeaders");

        // //får tag i arrayen. Set specific data till modelen
        // var Trayheader = (<Component>this.getOwnerComponent()).getModel("TrayHeaders")?.getProperty("/TrayHeader")[0];
        // this.getView()?.bindElement(Trayheader); // funkar ej, kanske måste ha en path
        // this.getView()?.setModel(Trayheader, "model");

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
    populateTable(): void {

        var jModel = new JSONModel();
        jModel.setData({
            oum: [
                {
                    type: "PAL",
                    palletQty: 4,
                    palletHeight: 0.14,
                    trpQty: 1,
                    trpLength: 20,
                    trpWidth: 30,
                    trpHeight: 33,
                    trpGWeight: 4.02,
                    netWeight: 150.3
                },
                {
                    type: "TRP",
                    palletQty: 4,
                    palletHeight: 0.15,
                    trpQty: 1,
                    trpLength: 25,
                    trpWidth: 33,
                    trpHeight: 35,
                    trpGWeight: 5.25,
                    netWeight: 150.4
                }
            ]
        })
        var table = <Table>this.byId("UOM");
        var tableWeight = <Table>this.byId("netWeight");
        table.setModel(jModel);
        tableWeight.setModel(jModel);

    }
    populateVHTable(): void {

        var jModel = new JSONModel();
        jModel.setData({
            woihistory: [
                {
                    trayID: "97090022-20",
                    status: "DI",
                    version: "ZZ",
                    revisionDate: new Date("2013/01/13"),
                    createdBy: "BDU_API",
                    validFrom: new Date("2013/02/14"),
                    validTo: new Date("2013/02/16"),
                    woiPdf: "97090022-20.pdf"
                },
                {
                    trayID: "97090022-20",
                    status: "DI",
                    version: "ZB",
                    revisionDate: new Date("2016/10/30"),
                    createdBy: "A Bsson",
                    validFrom: new Date("2016/11/06"),
                    validTo: new Date("2016/11/12"),
                    woiPdf: "97090022-20.pdf"
                },
                {
                    trayID: "97090023-20",
                    status: "DI",
                    version: "ZB",
                    revisionDate: new Date("2013/12/09"),
                    createdBy: "A Bsson",
                    validFrom: new Date("2013/12/10"),
                    validTo: new Date("2012/12/12"),
                    woiPdf: "97090022-20.pdf"
                }
            ]
        });

        this.getView()?.setModel(jModel, "woihistory");

    }
    pressView(): void {
        //show PDF
    }
    pressTrayDesigner(): void {
        //send to tray designer application with parameters for current tray.
    }
    toggleTextAreaSIM(): void {
        var oTextArea = <TextArea>this.byId("SIM");
        oTextArea.setValue("Special instructions Mark");
        oTextArea.setEditable(false);
    }
    toggleTextAreaSIF(): void {
        var oTextArea = <TextArea>this.byId("SIF");
        oTextArea.setValue("Special instructions Factory");
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

        aColumns.forEach(function(column) {
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
        oTablenew.bindRows({path :"/tableData"});

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
    tablePaste(oEvent: Event): void{
        var aClipboardData = oEvent.getParameter("data");
        console.log("Pasted data:", aClipboardData);

        // Assuming the clipboard data is structured in rows and columns matching the table structure
        var aStructuredData = aClipboardData.map(function(row: any) {
            return {
                Type: row[0],
                Qty: parseInt(row[1], 10),
                Length: parseFloat(row[2]),
                Width: parseFloat(row[3]),
                Height: parseFloat(row[4]),
                GrossWeight: parseFloat(row[5]),
                NetWeight: parseFloat(row[6])
            };
        });
    
    }
    Clipboard(row: any): any{

    }
}