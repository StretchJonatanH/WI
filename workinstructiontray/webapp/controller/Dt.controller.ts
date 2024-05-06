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

        var oODataModel = <ODataModel>this.getOwnerComponent()?.getModel("Z_TRAYFACTPROCESS_SRV1");
        var oModelJson = new JSONModel();

        const sDoknr = "97000140-06";

        const aFilters = [
            new Filter("Doknr", FilterOperator.EQ, sDoknr),
            // new Filter("Dokvr", FilterOperator.EQ, sDokvr)
          ];
      
          // Fetch data using the read method with filters
          oODataModel.read("/WorkInstructions", {
            filters: aFilters,
            success: (oData: { results: Array<any> }) => {
              // Store filtered WorkInstruction data in the JSON model
              oModelJson.setData({
                WorkInstructions: oData.results
              });
      
              // Bind the JSON model to the view so the table will have access to the data
              this.getView()?.setModel(oModelJson, "workInstructionModel");
            },
            error: (oError: any) => {
              console.error("Error fetching data:", oError);
            }
          });

        // oModelss.read("/WorkInstructions", {
        //     filters: [new Filter("Doknr", FilterOperator.EQ, "97000140-06")],
        //     success: (oData: { results: Array<{ FileName: string }> }) => {
        //         if (oData && oData.results.length > 0) {
        //           const fileNames = oData.results.map(item => item.FileName);
        //           console.log("File Names:", fileNames);
        //         } else {
        //           console.log("No data found for the specified filter.");
        //         }
        //       },
        //       error: (oError: any) => {
        //         console.error("Error fetching data:", oError);
        //     }}
        //     );
            //funkar att hämta
        // var oModel = new JSONModel();
        // var that = this;
        // var aData = jQuery.ajax({
        //     type: "GET",
        //     contentType: "application/json",
        //     url: "/sap/opu/odata/SAP/Z_TRAYFACTPROCESS_SRV/WorkInstructions?$inlinecount=allpages&$filter=Doknr eq '97000140-06'",
        //     dataType: "json",
        //     async: false,
        //     success: function (data, textStatus, jqXHR) {
        //         oModel.setData(data);
        //         alert("success to post");
        //     }
        // });
        // this.getView()?.setModel(oModel);
    
    }
}
