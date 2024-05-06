import Controller from "sap/ui/core/mvc/Controller";
import Component from "../Component";
import History from "sap/ui/core/routing/History";

/**
 * @namespace workinstructiontray.controller
 */

export default class ComponentsDetail extends Controller {
   
    onInit(): void {
        
    }

    navComponents(): void {
        const router = (<Component>this.getOwnerComponent()).getRouter();
        router.navTo("RouteComponentsDetail", {}, true);
    }
    handleBackPress(): void {
        const oHistory = History.getInstance();
        const sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
            window.history.go(-1);
        } else {
            const router = (<Component>this.getOwnerComponent()).getRouter();
            router.navTo("RouteComponents", {}, true);
        }

    }
}