import { LitElement, TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";


@customElement("step-three")   
export class StepThree extends LitElement {
    public render(): TemplateResult {  
        return html`
                <div>
                    <h2>step 3</h2>
                </div>
        `;
    }
}