import { LightningElement, api } from 'lwc';

export default class CmSidebar extends LightningElement {
    @api stageNum;

    connectedCallback() {
        console.log("stageNum SideBar: ", this.stageNum);
    }
    get isActive1() {
        if (this.stageNum == "1") return 'active';
        return '';
    }
    get isActive2() {
        if (this.stageNum == "2") return 'active';
        return '';
    }
    get isActive3() {
        if (this.stageNum == "3") return 'active';
        return '';
    }
    get isActive4() {
        if (this.stageNum == "4") return 'active';
        return '';
    }
    get isActive5() {
        if (this.stageNum == "5") return 'active';
        return '';
    }
}