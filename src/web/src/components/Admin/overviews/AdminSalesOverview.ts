import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AdminService } from "../../../services/AdminService";
// import { RouterPage } from "../../RouterPage";

/**
 * Custom element based on Lit for the header of the webshop.
 *
 * @todo Most of the logic in this component is over-simplified. You will have to replace most of it with actual implementations.
 */
@customElement("sales-overview")
export class AdminOverview extends LitElement {
    public static styles = css`
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
            display: flex;
            gap: 10px;
        }

        .actions button {
            background: none;
            border: none;
            cursor: pointer;
            color: white;
        }

        .actions .edit {
            color: #4caf50;
        }

        .actions .delete {
            color: #f44336;
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
    `;

    @state()
    private _sales: any[] = [];

    private _adminService: AdminService = new AdminService();

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        console.log("callback test");

        await this.getAllAdmins();
    }

    /**
     * Get all admins from database
     */
    private async getAllAdmins(): Promise<void> {
        console.log("get all admins");
        const result: any = await this._adminService.getAllSales();
        console.log(result);

        if (!result) {
            return;
        }

        this._sales = result;
    }

    // private navigateTo(page: RouterPage, adminId?: string): void {
    //     console.log("Navigating to", page, "with adminId", adminId);
    //     this.dispatchEvent(new CustomEvent("navigate", { detail: { page, adminId } }));
    // }


    /**
     * Renders the admins overview page, which contains a list of all admins.
     */
    public render(): TemplateResult {
        return html`
            <h2>Sales Overview</h2>

            <div class="filters">
                <div>
                    <label for="sort">Sort by:</label>
                    <select id="sort">
                        <option value="id">ID</option>
                        <option value="username">Username</option>
                        <option value="role">Role</option>
                        <option value="email">Email</option>
                    </select>
                </div>
                <input type="search" placeholder="Search">
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product</th>
                        <th>quanitity</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this._sales.map(admin => html`
                        <tr>
                            <td>${admin.id}</td>
                            <td>${admin.product_title}</td>
                            <td>${admin.quantity}</td>
                            <td>${admin.product_price}</td>
                            <td class="actions">
                                <button class="delete" >
                                    Delete 
                                    <!-- (nog foto hier>??) -->
                                </button>
                            </td>
                        </tr>
                    `)}
                </tbody>
            </table>


        `;
    }

    // private async loadMoreAdmins(): Promise<void> {
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    //     console.log("Loading more admins...");
    // }
}
