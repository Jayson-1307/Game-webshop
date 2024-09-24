import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { AdminService } from "../../../services/AdminService";
import { createGameFormModel } from "@shared/formModels/CreateGameFormModel";

/**
 * Custom element based on Lit for editing a game.
 */
@customElement("edit-game")
export class EditGame extends LitElement {
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

    @property({ type: String }) public adminGameId: string = "";

    @state() private _title: string = "";
    @state() private _thumbnail: string | File | null = null;
    @state() private _description: string = "";
    @state() private _price: string = ""; 
    @state() private _url: string = "";
    @state() private _authors: string = "";
    @state() private _tags: string = "";
    @state() private _status: string = "active";
    @state() private _newThumbnailFile: File | null = null;

    private _adminService: AdminService = new AdminService();

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        if (this.adminGameId) {
            await this.getGameData(this.adminGameId);
        }
    }

    private async getGameData(adminGameId: string): Promise<void> {
        console.log("Fetching game data...");
        try {
            const result: any = await this._adminService.getGameById(adminGameId);
            console.log(result);
            if (result) {
                this._title = result.title;
                this._thumbnail = result.thumbnail;
                this._description = result.descriptionMarkdown;
                this._price = result.price.toString(); // Convert to string
                this._url = result.url;
                this._authors = result.authors_text || result.authors.join(", ");
                this._tags = result.tags_text || result.tags.join(", ");
                this._status = result.status; // Get status
            }
        } catch (error) {
            console.error("Error fetching game data:", error);
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
        if (this.adminGameId) {
            const confirmed: boolean = confirm("Are you sure you want to save this game? This action cannot be undone.");
            if (!confirmed) {
                return;
            }

            const formData: FormData = new FormData();
            formData.append("title", this._title);
            formData.append("description", this._description);
            formData.append("price", this._price); // String
            formData.append("url", this._url);
            formData.append("authors", this._authors);
            formData.append("tags", this._tags);
            formData.append("status", this._status);
            if (this._newThumbnailFile) {
                formData.append("thumbnail", this._newThumbnailFile);
            } else if (this._thumbnail) {
                formData.append("thumbnail", this._thumbnail);
            }

            const gameData: createGameFormModel = {
                gameTitle: this._title,
                Thumbnail: this._newThumbnailFile || this._thumbnail as any,
                Description: this._description,
                price: parseFloat(this._price), // Convert to number before sending
                images: [], // handle images properly if required
                url: this._url,
                authors: this._authors,
                tags: this._tags,
                status: this._status, 
            };

            const result: boolean = await this._adminService.updateGame(this.adminGameId, gameData);
            if (result) {
                console.log("Game updated successfully");
                this.requestUpdate();
            } else {
                console.error("Failed to update game");
            }
        }
    }

    private async deleteGame(): Promise<void> {
        if (this.adminGameId) {
            
            const confirmed: boolean = confirm("Are you sure you want to delete this game? This action cannot be undone.");
        if (!confirmed) {
            return;
        }

            const result: boolean = await this._adminService.deleteGame(this.adminGameId);
            if (result) {
                console.log("Game deleted successfully");
                window.location.reload();
                // Handle post-deletion logic, e.g., redirecting the user or showing a message
            } else {
                console.error("Failed to delete game");
            }
        }
    }

    public render(): TemplateResult {
        return html`
            <div class="game-info">
                <h2>Edit Game</h2> 
                <form>
                    <label>
                        <strong>Title:</strong>
                        <input type="text" name="_title" .value="${this._title}" @input="${this.handleInput}">
                    </label>
                    <label>
                        <strong>Thumbnail:</strong>
                        ${this._thumbnail ? html`<img .src="${this._thumbnail}" alt="Thumbnail">` : ""}
                        <input type="file" name="_newThumbnailFile" .value="${this._newThumbnailFile ? "" : ""}" @change="${this.handleThumbnailChange}">
                    </label>
                    <label>
                        <strong>Description:</strong>
                        <textarea name="_description" .value="${this._description}" @input="${this.handleInput}"></textarea>
                    </label>
                    <label>
                        <strong>Price:</strong>
                        <input type="number" name="_price" .value="${this._price}" @input="${this.handleInput}">
                    </label>
                    <label>
                        <strong>URL:</strong>
                        <input type="text" name="_url" .value="${this._url}" @input="${this.handleInput}">
                    </label>
                    <label>
                        <strong>Authors:</strong>
                        <input type="text" name="_authors" .value="${this._authors}" @input="${this.handleInput}">
                    </label>
                    <label>
                        <strong>Tags:</strong>
                        <input type="text" name="_tags" .value="${this._tags}" @input="${this.handleInput}">
                    </label>
                    <label>
                        <strong>Status:</strong>
                        <select name="_status" .value="${this._status}" @change="${this.handleStatusChange}">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </label>
                    <button type="button" @click="${this.saveDetails}">Save Details</button>
                    <button type="button" @click="${this.deleteGame}">Delete Game</button>
                </form>
            </div>
        `;
    }
}
