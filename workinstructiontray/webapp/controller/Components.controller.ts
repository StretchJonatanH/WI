import Controller from "sap/ui/core/mvc/Controller";
import Component from "../Component";

/**
 * @namespace workinstructiontray.controller
 */

export default class Components extends Controller {
   
    onInit(): void {
        
    }

    navComponents(): void {
        const router = (<Component>this.getOwnerComponent()).getRouter();
        router.navTo("RouteComponentsDetail", {}, true);
    }
}