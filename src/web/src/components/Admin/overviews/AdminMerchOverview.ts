import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AdminService } from "../../../services/AdminService";
import { RouterPage } from "../../RouterPage";

/**
 * Custom element based on Lit for the admin merch overview page.
 *
 * @todo Most of the logic in this component is over-simplified. You will have to replace most of it with actual implementations.
 */
@customElement("admin-merch-overview")
export class AdminMerchOverview extends LitElement {
    public static styles = css`
        header {
            background-color: #fbfbfa;
            padding: 10px;
        }

        main {
            padding: 10px;
        }

        footer {
            background-color: #ecae20;
            padding: 10px;
            text-align: center;
        }

        section {
            margin: 60px 0;
        }

        .form {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .form label {
            display: block;
            margin-bottom: 5px;
        }

        .btn, .button {
            border-radius: 10px;
            cursor: pointer;
            padding: 7.5px 7.5px;
        }

        .button.primairy {
            background-color: #9900ff;
            color: white;
            border: 2px solid #7a00cc;
            padding: 7.5px 7.5px;
        }

        .button.primairy:hover {
            background-color: #7a00cc;
            border-color: #5c0099;
            color: white;
        }

        .button.secondairy {
            background-color: #30b4cf; 
            border: 2px solid #2790a5;
            color: #000a1a;
        }
        
        .button.secondairy:hover {
            background-color: #2790a5;
            border-color: #1d6c7c;
            color: white;
        }

        /* ------ styling for the table ------ */
        :host {
            display: block;
            padding: 16px;
            color: white;
            background-color: #1e1e1e;
        }

        h2 {
            text-align: center;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th, td {
            border: 1px solid #3a3a3a;
            padding: 10px;
            text-align: left;
        }

        th {
            background-color: #333;
        }

        td {
            background-color: #222;
        }

        .actions {
            justify-content: center;
            align-items: center;
            gap: 10px;
        }

        .actions button {
            background: none;
            border: none;
            cursor: pointer;
            color: white;
            padding: 8px 20px; /* Increased padding for larger buttons */
            font-size: 16px; /* Increased font size for larger buttons */
            border-radius: 4px;
            transition: background-color 0.3s;
        }

        .actions .edit {
            background-color: #4caf50;
            color: white;
        }

        .actions .edit:hover {
            background-color: #45a049;
        }

        .filters {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .filters input[type="search"] {
            padding: 5px;
            font-size: 16px;
        }

        .filters select {
            padding: 5px;
            font-size: 16px;
            background-color: #333;
            color: white;
            border: 1px solid #3a3a3a;
        }

        .create-button {
            margin-right: 10px;
            padding: 10px;
            background-color: #4caf50;
            color: white;
            border: none;
            cursor: pointer;
        }

        .create-button:hover {
            background-color: #45a049;
        }

        .load-more {
            display: block;
            width: 100%;
            padding: 10px;
            background-color: #444;
            color: white;
            text-align: center;
            border: none;
            cursor: pointer;
        }

        .thumbnail {
            max-width: 50px;
        }
    `;

    @state()
    private _merchItems: any[] = [];

    private _adminService: AdminService = new AdminService();

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        console.log("callback test");

        await this.getAllMerchItems();
    }

    /**
     * Get all merch items from database
     */
    private async getAllMerchItems(): Promise<void> {
        console.log("get all merch items");
        const result: any = await this._adminService.getAllMerch();
        console.log(result);

        if (!result) {
            return;
        }

        this._merchItems = result;
    }

    private navigateTo(page: RouterPage, adminMerchId?: string): void {
        console.log("Navigating to", page, "with merchId", adminMerchId);
        this.dispatchEvent(new CustomEvent("navigate", { detail: { page, adminMerchId } }));
    }

    private navigateToCreateMerch(): void {
        console.log("Navigating to create merch page");
        this.dispatchEvent(new CustomEvent("navigate", { detail: RouterPage.CreateMerch }));
    }

    // private async deleteMerch(merchId: string): Promise<void> {
    //     const confirmed: boolean = confirm("Are you sure you want to delete this merch item?");
    //     if (confirmed) {
    //         const result: boolean = await this._adminService.deleteMerch(merchId);
    //         if (result) {
    //             console.log("Merch deleted successfully");
    //             await this.getAllMerchItems();
    //         } else {
    //             console.error("Failed to delete merch");
    //         }
    //     }
    // }

    /**
     * Renders the merch overview page, which contains a list of all merch items.
     */
    public render(): TemplateResult {
        return html`
            <h2>Merch Overview</h2>

            <div class="filters">
                <button class="create-button" @click=${this.navigateToCreateMerch}>Create Merch</button>
                <div>
                    <label for="sort">Sort by:</label>
                    <select id="sort">
                        <option value="id">ID</option>
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                        <option value="quantity">Quantity</option>
                    </select>
                </div>
                <input type="search" placeholder="Search">
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Thumbnail</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this._merchItems.map(merch => html`
                        <tr>
                            <td>${merch.id}</td>
                            <td><img src="${merch.thumbnail}" alt="Thumbnail" class="thumbnail"></td>
                            <td>${merch.name}</td>
                            <td>${merch.price}</td>
                            <td>${merch.quantity}</td>
                            <td>${merch.status}</td>
                            <td class="actions">
                                <button class="edit" @click=${(): void => this.navigateTo(RouterPage.EditMerch, merch.id)}>
                                    Edit
                                </button>
                            </td>
                        </tr>
                    `)}
                </tbody>
            </table>
        `;
    }
}
