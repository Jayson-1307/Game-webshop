import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { AdminService } from "../../../services/AdminService";
import { createNewsFormModel } from "@shared/formModels/CreateNewsFormModel";
import { RouterPage } from "../../RouterPage";

/**
 * Custom element based on Lit for editing a news item.
 */
@customElement("edit-news")
export class EditNews extends LitElement {
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

    @property({ type: String }) public adminNewsId: string = "";

    @state() private _title: string = "";
    @state() private _thumbnail: string | File | null = null;
    @state() private _description: string = "";
    @state() private _introduction: string = "";
    @state() private _content: string = "";
    @state() private _newThumbnailFile: File | null = null;

   private _adminService: AdminService = new AdminService();

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        if (this.adminNewsId) {
            await this.getNewsData(this.adminNewsId);
        }
    }

    private async getNewsData(adminNewsId: string): Promise<void> {
        try {
            console.log("Fetching news data");
            const result: createNewsFormModel | undefined = await this._adminService.getNewsById(adminNewsId);
            if (result) {
                this._title = result.title;
                this._thumbnail = result.thumbnail;
                this._description = result.description;
                this._introduction = result.introduction;
                this._content = result.content;
            }
        } catch (error) {
            console.error("Error fetching news data:", error);
        }
    }

    private handleInput(event: Event): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        (this as any)[target.name as keyof this] = target.value;
    }

    private handleThumbnailChange(event: Event): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        const file: File | null = target.files ? target.files[0] : null;
        this._newThumbnailFile = file;
    }

    private async saveDetails(): Promise<void> {
        if (this.adminNewsId) {
            const formData: FormData = new FormData();
            formData.append("title", this._title);
            formData.append("description", this._description);
            formData.append("introduction", this._introduction);
            formData.append("content", this._content);
            if (this._newThumbnailFile) {
                formData.append("thumbnail", this._newThumbnailFile);
            } else if (this._thumbnail) {
                formData.append("thumbnail", this._thumbnail);
            }

            const newsData: createNewsFormModel = {
                title: this._title,
                description: this._description,
                thumbnail: this._newThumbnailFile || this._thumbnail as any,
                introduction: this._introduction,
                content: this._content,
            };

            const result: boolean = await this._adminService.updateNews(this.adminNewsId, newsData);
            if (result) {
                console.log("News updated successfully");
                this.requestUpdate();
            } else {
                console.error("Failed to update news");
            }
        }
    }

    private async deleteNews(): Promise<void> {
        if (this.adminNewsId) {
            const confirmed: boolean = confirm("Are you sure you want to delete this news item?");
            if (confirmed) {
                const result: boolean = await this._adminService.deleteNews(this.adminNewsId);
                if (result) {
                    console.log("News deleted successfully");
                    this.dispatchEvent(new CustomEvent("navigate", { detail: RouterPage.AdminNewsOverview }));
                } else {
                    console.error("Failed to delete news");
                }
            }
        }
    }

    public render(): TemplateResult {
        return html`
            <div class="news-info">
                <h2>Edit News</h2>
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
                        <strong>Introduction:</strong>
                        <textarea name="_introduction" .value="${this._introduction}" @input="${this.handleInput}"></textarea>
                    </label>
                    <label>
                        <strong>Content:</strong>
                        <textarea name="_content" .value="${this._content}" @input="${this.handleInput}"></textarea>
                    </label>
                    <button type="button" @click="${this.saveDetails}">Save Details</button>
                    <button type="button" @click="${this.deleteNews}">Delete News</button>
                </form>
            </div>
        `;
    }
}