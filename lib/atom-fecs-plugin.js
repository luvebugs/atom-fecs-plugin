'use babel';

import StatusBarView from './status-bar-view';
import MessageView from './message-view';
import {CompositeDisposable} from 'atom';
import fecs from 'fecs';
import $ from './util';

export default {

    statusBarView : null,
    subscriptions : null,
    messageMap: {} ,
    activate(state) {

        this.statusBarView = new StatusBarView(state.StatusBarView);

        // Events subscribed to in atom's system can be easily cleaned up with a
        // CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions
            .add(atom.workspace.observeActivePaneItem(() => this.registerEvent()));

    },

    serialize() {
        return {
            StatusBarViewState: this
                .statusBarView
                .serialize()
        };
    },

    deactivate() {
        this
            .subscriptions
            .dispose();
        this
            .statusBarView
            .destroy();
        this
            .statusBarTile
            .destroy();
    },

    consumeStatusBar(statusBar) {
        this.statusBarTile = statusBar.addLeftTile({
            item: this
                .statusBarView
                .getElement(),
            priority: 100
        })
    },
    registerEvent() {
        const editor = atom.workspace.getActiveTextEditor();
        if (!editor) {
            return;
        }
        this.subscriptions.add(editor.onDidSave(() => this.check(editor)));
        this.subscriptions.add(editor.onDidChangeCursorPosition(() => this.updateStatusBar(editor, this.messageMap)));
        this.bindEvent(editor);
    },
    check(editor) {
        fecs.check(Object.assign({}, fecs.getOptions(), {
            /* eslint-disable */
            _: [editor && editor.getPath()],
            /* eslint-enable */
            reporter: 'baidu'
        }), (success, errors = []) => {
            this.clearAllDecorators(editor);
            if (errors && errors[0]) {
                this.messageMap = this.addDecorators(editor, errors[0].errors);
            }
            this.updateStatusBar(editor, this.messageMap);
        });
    },
    addDecorators(editor, errors) {
        let messageMap = {};
        errors.forEach((item, index) => {
            const {line, severity} = item;
            if (messageMap[line]) {
                messageMap[line].push(item);
            } else {
                messageMap[line] = [item];
            }
        });
        for (key in messageMap) {
            const marker = editor.markBufferRange([
                [key - 1,1],
                [key - 1,1]
            ]);
            const decorations = [
                editor.decorateMarker(marker, {
                    'type': 'block',
                    'position': 'after',
                    'item': new MessageView().getElement(messageMap[key]),
                })
            ].concat(messageMap[key].map(item => {
                return item.severity ? [editor.decorateMarker(marker, {
                    'type': 'line',
                    'class': 'fecs-line-warning'
                }),
                editor.decorateMarker(marker, {
                    'type': 'line-number',
                    'class': 'fecs-line-number-warning'
                })] : [
                    editor.decorateMarker(marker, {
                        'type': 'line',
                        'class': 'fecs-line-error'
                    }),
                    editor.decorateMarker(marker, {
                        'type': 'line-number',
                        'class': 'fecs-line-number-error'
                    })
                ]
            }));
        }
        return messageMap;
    },
    clearAllDecorators(editor) {
        editor.getDecorations().forEach(decoration => decoration.destroy());
    },
    updateStatusBar(editor, messageMap) {
        let line = editor.getCursorBufferPosition ? editor.getCursorBufferPosition().row + 1 : 0;
        let error = 0;
        let warning = 0;
        console.log(messageMap);
        Object.keys(messageMap).forEach(key => messageMap[key].forEach(item => {
            if (item.severity === 1) {
                error ++;
            } else {
                warning ++;
            }
        }))
        this.statusBarView.setMessage({
            error,
            warning
        });
        if (messageMap[line]) {
            this.statusBarView.setInfo(messageMap[line][0].message);
        } else {
            this.statusBarView.setInfo('');
        }
    },
    bindEvent(editor) {
        $(document).on('click', '.icon-issue-opened', () => {

            this.check(editor)
        });
    }
};
