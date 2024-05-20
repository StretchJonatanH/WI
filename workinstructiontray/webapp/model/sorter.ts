import Table from "sap/m/Table";
import ListBinding from "sap/ui/model/ListBinding";
import Sorter from "sap/ui/model/Sorter";

export function  applyInitialSorting(this: any): void {
        const oTable: Table = this.getView().byId("TrayIDs") as Table;
        const oBinding = oTable.getBinding("items");

        if (oBinding instanceof ListBinding) {
            // Create a sorter (ascending order, replace "propertyName" with your data model's property)
            const oSorter = new Sorter("Dokvr", true);  // false for ascending order

            // Apply the sorter to the binding
            oBinding.sort(oSorter);
        } else {
            console.error("Binding is not of type ListBinding and cannot be sorted.");
        }
    }
