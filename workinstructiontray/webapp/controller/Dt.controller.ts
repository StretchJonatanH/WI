import List from "sap/m/List";
import StandardListItem from "sap/m/StandardListItem";
import Controller from "sap/ui/core/mvc/Controller";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import odata4analytics from "sap/ui/model/analytics/odata4analytics";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";

export default class Dt extends Controller {

    public onInit(): void {
        var that = this;
        var list = <List>that.getView()?.byId("trayPing");
 
        // var oModel = this.getOwnerComponent()?.getModel("Z_TRAYFACTPROCESS_SRV")
        // this.getView()?.setModel(oModel)

        // var oModelTray = new ODataModel("/sap/opu/odata/SAP/Z_TRAYFACTPROCESS_SRV/WorkInstructions?$format=json&$inlinecount=allpages&$filter=Doknr eq '97000140-06'");
        var oModel = new ODataModel({ 
            serviceUrl: "/sap/opu/odata/SAP/Z_TRAYFACTPROCESS_SRV/WorkInstructions",
            parameters : {
                $filter : 'Doknr eq "97000140-06"',
                $inlinecount : 'allpages',
                $format: 'json'
            }
        }).setDefaultCountMode("Request").attachRequestCompleted(function() {
            // Set the loaded JSONModel to the view
            that.getView()?.setModel(oModel);

            // Bind the List control's items to the data
            // Assuming the data is in the "results" array of the JSON (adjust if needed)
            list.bindItems({
                path: "/d/results", // Adjust the binding path based on your JSON structure
                template: new StandardListItem({
                    title: "{Doknr}"
                })
            });
        }.bind(this));

        FilterOperator.EQ
        list.bindItems({ path : "/SalesOrderList",
        parameters : {
            "$count" : true,
            "$filter" : "Doknr eq '97000140-06'",    
        }
    });
        //  oModelTray.read("/sap/opu/odata/sap/Z_TRAYFACTPROCESS_SRV");
        // var oJson = new JSONModel();
        // oJson.loadData("/sap/opu/odata/SAP/Z_TRAYFACTPROCESS_SRV/WorkInstructions?$format=json&$inlinecount=allpages&$filter=Doknr eq '97000140-06'");

        // oJson.attachRequestCompleted(function() {
        //     Set the loaded JSONModel to the view
        //     that.getView()?.setModel(oJson);

        //     Bind the List control's items to the data
        //     Assuming the data is in the "results" array of the JSON (adjust if needed)
        //     view.bindItems({
        //         path: "/d/results", // Adjust the binding path based on your JSON structure
        //         template: new StandardListItem({
        //             title: "{Doknr}"
        //         })
        //     });
        // }.bind(this));


    }
}