import Controller from "sap/ui/core/mvc/Controller";
import Event from "sap/ui/base/Event";
import GenericTile from "sap/m/GenericTile";
import Component from "../Component";

export default class OverviewController extends Controller {
    public onNavigate(oEvent: Event): void {
        const oTile: GenericTile = oEvent.getSource() as GenericTile;
        const oRouter = Component.getRouterFor(this);
        const sRoute: string = oTile.getTileContent(); // You might need to adjust how to retrieve the route name

        oRouter.navTo(sRoute);
    }
}