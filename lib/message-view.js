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
            const {column, line, message, rule, severity} = item;
            const div = document.createElement('div');
            const highlightError = document.createElement('span');
            highlightError.classList.add('inline-block', 'highlight-error');
            highlightError.innerText = 'error';
            const highlightWarning = document.createElement('span');
            highlightWarning.classList.add('inline-block', 'highlight-warning');
            highlightWarning.innerText =  'warning';
            div.appendChild(severity === 1 ? highlightWarning : highlightError);
            const highlightInfo = document.createElement('span');
            highlightInfo.classList.add('inline-block', 'highlight-info');
            highlightInfo.innerText = rule;
            div.appendChild(highlightInfo);
            div.classList.add('atom-fecs-line-message');
            const text = document.createElement('span');
            text.innerText = message;
            div.appendChild(text);
            const position = document.createElement('span');
            position.classList.add('status-added');
            position.innerText = `line: ${line} column: ${column}`;
            div.appendChild(position);
            this.element.appendChild(div);
        });
        return this.element;
    }

}
