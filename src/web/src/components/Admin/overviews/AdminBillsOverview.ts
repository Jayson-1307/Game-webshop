import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AdminService } from "../../../services/AdminService";
import { RouterPage } from "../../RouterPage";

/**
 * Custom element based on Lit for the header of the webshop.
 *
 * @todo Most of the logic in this component is over-simplified. You will have to replace most of it with actual implementations.
 */
@customElement("admin-bills-overview")
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
    private _bills: any[] = [];

    private _adminService: AdminService = new AdminService();

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        console.log("callback test");

        await this.getAllBills();
    }

    /**
     * Get all admins from database
     */
    private async getAllBills(): Promise<void> {
        console.log("get all bills");
        const result: any = await this._adminService.getAllBills();
        console.log(result);
    
        if (!result) {
            return;
        }
    
        // Group the data by bill_id
        const bills: { [key: string]: any } = {};
    
        result.forEach((row: any) => {
            const billId:any = row.bill_id;
            if (!bills[billId]) {
                // Initialize bill entry if not present
                bills[billId] = {
                    id: row.bill_id,
                    user_id: row.user_id,
                    created_at: row.created_at,
                    shipping_street: row.shipping_street,
                    shipping_house_number: row.shipping_house_number,
                    shipping_house_number_addition: row.shipping_house_number_addition,
                    shipping_zip: row.shipping_zip,
                    shipping_city: row.shipping_city,
                    shipping_country: row.shipping_country,
                    billing_street: row.billing_street,
                    billing_house_number: row.billing_house_number,
                    billing_house_number_addition: row.billing_house_number_addition,
                    billing_zip: row.billing_zip,
                    billing_city: row.billing_city,
                    billing_country: row.billing_country,
                    total_price_excl_VAT: row.total_price_excl_VAT,
                    VAT_price: row.VAT_price,
                    total_price_incl_VAT: row.total_price_incl_VAT,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    email: row.email,
                    products: []
                };
            }
            // Add products to the bill
            if (row.bill_product_id) {
                bills[billId].products.push({
                    id: row.bill_product_id,
                    product_title: row.product_title,
                    product_price: row.product_price,
                    quantity: row.quantity
                });
            }
        });
    
        // Convert the bills object to an array if needed
        this._bills = Object.values(bills);
        console.log(this._bills);
    }

    private navigateTo(page: RouterPage, billId?: string): void {
        console.log("Navigating to", page, "with adminId", billId);
        this.dispatchEvent(new CustomEvent("navigate", { detail: { page, billId } }));
    }


    /**
     * Renders the admins overview page, which contains a list of all admins.
     */
    public render(): TemplateResult {
        return html`
            <h2>Bills Overview</h2>
    
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
                        <th>Bill Id</th>
                        <th>Customer</th>
                        <th>Products</th>
                        <th>Total Price (incl Vat)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this._bills.map(bill => html`
                        <tr>
                            <td>${bill.id}</td>
                            <td>${bill.first_name} ${bill.last_name}</td>
                            <td>
                                <ul>
                                    ${bill.products.map((product: { product_title: unknown; quantity: unknown; product_price: unknown; }) => html`
                                        <li>${product.product_title} (x${product.quantity}) - $${product.product_price}</li>
                                    `)}
                                </ul>
                            </td>
                            <td>€${bill.total_price_incl_VAT}</td>
                            <td class="actions">
                                <button class="edit" @click=${(): void => this.navigateTo(RouterPage.BillDetail, bill.id)}>
                                    View
                                </button>
                                <button class="delete">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    `)}
                </tbody>
            </table>
        `;
    }

}
