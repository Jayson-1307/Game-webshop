import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { AdminService } from "../../../services/AdminService";
import { createMerchFormModel } from "@shared/formModels/CreateMerchFormModel";

/**
 * Custom element based on Lit for editing merch.
 */
@customElement("edit-merch")
export class EditMerch extends LitElement {
    public static styles = css`
    :host {
        display: block;
        padding: 16px;
        color: white;
        background-color: #1e1e1e;
        font-family: Arial, sans-serif;
    }

    h2 {
        text-align: center;
        font-size: 24px;
        margin-bottom: 16px;
        color: #f5f5f5;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 15px;
        max-width: 500px;
        margin: 0 auto;
        padding: 20px;
        background: #2a2a2a;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 5px;
        font-size: 14px;
        color: #cfcfcf;
    }

    input, select, textarea {
        padding: 12px;
        border: 1px solid #3a3a3a;
        border-radius: 4px;
        background-color: #333;
        color: white;
        transition: border-color 0.3s;
    }

    input:focus, select:focus, textarea:focus {
        border-color: #555;
        outline: none;
    }

    button {
        padding: 12px;
        background-color: #444;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #555;
    }

    img {
        max-width: 100%;
        margin-bottom: 10px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
`;

    @property({ type: String }) public adminMerchId: string = "";

    @state() private _name: string = "";
    @state() private _thumbnail: string | null = null;
    @state() private _price: string = ""; 
    @state() private _type: string = "";
    @state() private _quantity: string = "";
    @state() private _status: string = "active";
    @state() private _newThumbnailFile: File | null = null;

    private _adminService: AdminService = new AdminService();

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        if (this.adminMerchId) {
            await this.getMerchData(this.adminMerchId);
        }
    }

    private async getMerchData(adminMerchId: string): Promise<void> {
        console.log("Fetching merch data...");
        try {
            const result: any = await this._adminService.getMerchById(adminMerchId);
            console.log(result);
            if (result) {
                this._name = result.name;
                this._thumbnail = result.thumbnail;
                this._price = result.price.toString(); // Convert to string
                this._type = result.type;
                this._quantity = result.quantity.toString(); // Convert to string
                this._status = result.status; // Get status
            }
        } catch (error) {
            console.error("Error fetching merch data:", error);
        }
    }

    private handleInput(event: Event): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        (this as any)[target.name as keyof this] = target.value;
    }

    private handleStatusChange(event: Event): void {
        const target: HTMLSelectElement = event.target as HTMLSelectElement;
        this._status = target.value;
    }

    private handleThumbnailChange(event: Event): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        const file: File | null = target.files ? target.files[0] : null;
        this._newThumbnailFile = file;
    }

    private async saveDetails(): Promise<void> {
        if (this.adminMerchId) {
            const confirmed: boolean = confirm("Are you sure you want to Edit this MerchItem? This action cannot be undone.");
        if (!confirmed) {
            return;
        }


            const formData: FormData = new FormData();
            formData.append("name", this._name);
            formData.append("price", this._price); // String
            formData.append("type", this._type);
            formData.append("quantity", this._quantity); // String
            formData.append("status", this._status);
            if (this._newThumbnailFile) {
                formData.append("thumbnail", this._newThumbnailFile);
            } else if (this._thumbnail) {
                formData.append("thumbnail", this._thumbnail);
            }

            const merchData: createMerchFormModel = {
                name: this._name,
                Thumbnail: this._newThumbnailFile || this._thumbnail as any,
                price: parseFloat(this._price), // Convert to number before sending
                images: [], // handle images properly if required
                type: this._type,
                quantity: parseInt(this._quantity, 10), // Convert to number before sending
                status: this._status, // Include status
            };

            const result: boolean = await this._adminService.updateMerch(this.adminMerchId, merchData);
            if (result) {
                console.log("Merchandise updated successfully");
                this.requestUpdate();
            } else {
                console.error("Failed to update merchandise");
            }
        }
    }

    private async deleteMerch(): Promise<void> {
        if (this.adminMerchId) {
            const confirmed: boolean = confirm("Are you sure you want to delete this MerchItem? This action cannot be undone.");
        if (!confirmed) {
            return;
        }
            

            const result: boolean = await this._adminService.deleteMerch(this.adminMerchId);
            if (result) {
                console.log("Merchandise deleted successfully");
                window.location.reload();
                // Handle post-deletion logic, e.g., redirecting the user or showing a message
            } else {
                console.error("Failed to delete merchandise");
            }
        }
    }

    public render(): TemplateResult {
        return html`
            <div class="merch-info">
                <h2>Edit Merchandise</h2>
                <form>
                    <label>
                        <strong>Name:</strong>
                        <input type="text" name="_name" .value="${this._name}" @input="${this.handleInput}">
                    </label>
                    <label>
                        <strong>Thumbnail:</strong>
                        ${this._thumbnail ? html`<img .src="${this._thumbnail}" alt="Thumbnail">` : ""}
                        <input type="file" name="_newThumbnailFile" .value="${this._newThumbnailFile ? "" : ""}" @change="${this.handleThumbnailChange}">
                    </label>
                    <label>
                        <strong>Price:</strong>
                        <input type="number" name="_price" .value="${this._price}" @input="${this.handleInput}">
                    </label>
                    <label>
                    <strong>Type:</strong>
                        <select name="_type" .value="${this._type}" @change="${this.handleInput}">
                            <option value="hoodies">Hoodies</option>
                            <option value="t-shirts">T-shirts</option>
                            <option value="mugs">Mugs</option>
                        </select>
                    </label>
                    <label>
                    <strong>Quantity:</strong>
                        <input type="number" name="_quantity" .value="${this._quantity}" @input="${this.handleInput}">
                    </label>
                    <label>
                        <strong>Status:</strong>
                        <select name="_status" .value="${this._status}" @change="${this.handleStatusChange}">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </label>
                    <button type="button" @click="${this.saveDetails}">Save Details</button>
                    <button type="button" @click="${this.deleteMerch}">Delete Merchandise</button>
                </form>
            </div>
        `;
    }
}
