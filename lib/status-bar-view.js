'use babel';

export default class StatusBarView {

    constructor(serializedState) {
        // Create root element
        this.element = document.createElement('div');
        this.element
            .classList
            .add('atom-fecs-plugin');
        const iconCheck =  document.createElement('i');
        iconCheck.classList.add('icon', 'icon-issue-opened');
        this.element.appendChild(iconCheck);
        this.message =  document.createElement('span');
        iconCheck.appendChild(this.message);
        // Create message element
        this.info = document.createElement('div');
        this.info.classList.add('atom-fecs-info');
        this.element.appendChild(this.info);
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.info.remove();
        this.element.remove();
    }

    getElement() {
        return this.element;
    }

    setInfo(info) {
        this.info.textContent = info;
        
    }
    setMessage({error, warning}) {
        this.message.textContent = `error: ${error} warning: ${warning}`;
        
    }

}
