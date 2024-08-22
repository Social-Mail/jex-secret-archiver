import styled from "@web-atoms/core/dist/style/styled";
import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import AtomList from "@web-atoms/core/dist/core/AtomList";
import Pack from "@web-atoms/core/dist/Pack";
import MobileDesktopApp from "@web-atoms/web-controls/dist/desktop-app/MobileDesktopApp";
import Route from "@web-atoms/core/dist/core/Route";
import PageNavigator from "@web-atoms/web-controls/dist/PageNavigator";
import Command from "@web-atoms/core/dist/core/Command";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { FilesDragDrop } from "./controls/FilesDragDrop";
import Action from "@web-atoms/core/dist/view-model/Action";
import AtomRepeater from "@web-atoms/web-controls/dist/basic/AtomRepeater";
import Modules from "./Modules";

import "./styles/GlobalStyle";


(Symbol as any).asyncDispose ??= Symbol("asyncDispose");
(Symbol as any).dispose ??= Symbol("dispose");

    styled.css `
    `.installGlobal("secret-archiver");

@Pack
export default class AppIndex extends AtomControl {

    files = [];

    constructor(app, e = document.createElement("secret-archiver")) {
        super(app, e);
        this.runAfterInit(() => this.app.runAsync(() => this.init()));
    }

    async init() {
        this.renderer = <section data-layout="center-page-900px">
            <section style-height="100px"/>
            <section
                data-layout="frame-vertical-flex"
                { ... FilesDragDrop({
                uploadRequested: "upload-requested"
                })}>
                <section>Drop files here</section>
                <AtomRepeater
                    for="table"
                    items={this.files}
                    itemRenderer={(file) => <tr>
                        <td><span text={file.name}/></td>
                        <td><span text={file.size}/></td>
                        <td><button
                            data-click-event="delete-file"
                            text="delete"/></td>
                    </tr>}
                    />
            </section>
        </section>;
    }

    @Action({
        onEvent: "upload-requested"
    })
    async uploadRequested({ files }: { files: File[], uploadEvent: string, extra: string }) {

        // const { Archive } = await Modules.import("https://cdn.jsdelivr.net/npm/libarchive.js@2.0.2/dist/libarchive.js") ;

        this.files.addAll(files);
        
    }

}