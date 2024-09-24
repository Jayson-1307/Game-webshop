import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("custom-input-element")
export class CustomInputElement extends LitElement {

    // Dit zijn de attributen voor de input
    @property() private type: string = "";
    @property() private Id: string = "";
    @property() private placeholder: string = "";
    @property() public value: string = "";
    @property() public class: string = "";

    public static styles = css`

        
    `;

    /**
     * Renders the input element.
     * @returns TemplateResult
     */
    public render(): TemplateResult {
        return html`
            <div class="${this.class}">
                <input type="${this.type}" id="${this.Id}" @input="${this.getInputValue}" value="${this.value}" placeholder="${this.placeholder}">
            </div>
        `;
    }

    /**
     * Functie om de waarde van de input te krijgen.
     * @param event de input
     */
    private getInputValue(event: Event): void {

        this.requestUpdate();

        this.value = (event.target as HTMLInputElement).value;

    }


}
