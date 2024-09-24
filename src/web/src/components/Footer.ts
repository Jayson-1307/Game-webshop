import { LitElement, TemplateResult, css, html } from "lit";
import { customElement } from "lit/decorators.js";


@customElement("webshop-footer")   
export class Footer extends LitElement {

    public static styles = css`
        footer {
            background-color: #9900ff;
            padding: 10px 0;
            text-align: center;
            position: sticky;
            left: 0;
            bottom: 0;
            width: 100%;
        }
    `;

    public render(): TemplateResult {  
        return html`
                <div>
                    <footer>Copyright &copy; Luca Stars 2024</footer>
                </div>
        `;
    }
}