'use babel';

export default class MessageView {

    constructor(serializedState) {
        // Create root element
        this.element = document.createElement('div');
        this.element
            .classList
            .add('atom-fecs-message');
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.element
            .remove();
    }

    getElement(messages) {
        messages.forEach((item) => {
            const message = document.createElement('div');
            message.classList.add('atom-fecs-line-message');
            message.innerText = item;
            this.element.appendChild(message);
        });
        return this.element;
    }

}
