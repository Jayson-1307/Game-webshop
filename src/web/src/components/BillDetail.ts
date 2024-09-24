import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
// import { ProfileData } from "@shared/types/ProfileData";
import { AdminService } from "../services/AdminService";

/**
 * Custom element based on Lit for editing an account (user, admin, employee).
 */
@customElement("bill-detail")
export class BillDetail extends LitElement {
    

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

        form {
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
            margin: 0 auto;
        }

        input, select, textarea {
            padding: 10px;
            border: 1px solid #3a3a3a;
            background-color: #333;
            color: white;
        }

        button {
            padding: 10px;
            background-color: #444;
            color: white;
            border: none;
            cursor: pointer;
        }

        button:hover {
            background-color: #555;
        }

        section {
            display: flex;
            flex-wrap: wrap;

        }

        .block-50 {
            width: 100%;
            max-width: 100%;
            flex: 1 100%;
        }

        .block-100 {
            width: 100%;
            max-width: 100%;
            flex: 1 100%;
        }

        ul {
            display: flex;
            flex-wrap: wrap
        }

        li {
            width: 100%;
            max-width: 100%;
            flex: 1 100%;
        }

        @media screen and (min-width: 768px) {
            .block-50 {
                width: 50%;
                max-width: 50%;
                flex: 1 50%;
            }

            li {
                width: 50%;
                max-width: 50%;
                flex: 1 50%;
            }
        }

        
    `;



    @property({ type: String }) public billId: string = "";
    @property({ type: Object }) private bill: any = {};

    private _adminService: AdminService = new AdminService();

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        if (this.billId) {
            await this.getBillById(this.billId);
        }
    }

    private async getBillById(billId: string): Promise<void> {
        console.log("get all bills");
        const result: any = await this._adminService.getBillById(billId);
        console.log(result);
    
        if (!result) {
            return;
        }
    
        // Group the data by bill_id
        const bills: { [key: string]: any } = {};
    
        result.forEach((row: any) => {
            const billId: any = row.bill_id;
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
    
        // Assuming you want to use the first bill in the result
        this.bill = Object.values(bills)[0];
        console.log(this.bill);
    }

    public render(): TemplateResult {
        return html`
            <div class="account-info">
                <h2>Bill Detail</h2>
                <section class="content">
                    <div class="block-50">
                        <h3>Shipping Information</h3>
                        <p>Date: ${this.bill.created_at}</p>
                        <p>Street: ${this.bill.shipping_street}</p>
                        <p>House Number: ${this.bill.shipping_house_number}</p>
                        <p>House Number Addition: ${this.bill.shipping_house_number_addition}</p>
                        <p>ZIP: ${this.bill.shipping_zip}</p>
                        <p>City: ${this.bill.shipping_city}</p>
                        <p>Country: ${this.bill.shipping_country}</p>
                    </div>
                    
                    <div class="block-50">
                        <h3>Billing Information</h3>
                        <p>Street: ${this.bill.billing_street}</p>
                        <p>House Number: ${this.bill.billing_house_number}</p>
                        <p>House Number Addition: ${this.bill.billing_house_number_addition}</p>
                        <p>ZIP: ${this.bill.billing_zip}</p>
                        <p>City: ${this.bill.billing_city}</p>
                        <p>Country: ${this.bill.billing_country}</p>
                    </div>
                    
                    <div class="block-50">
                        <h3>Prices</h3>
                        <p>Total Price Excl. VAT: ${this.bill.total_price_excl_VAT}</p>
                        <p>VAT Price: ${this.bill.VAT_price}</p>
                        <p>Total Price Incl. VAT: ${this.bill.total_price_incl_VAT}</p>
                        
                    </div>

                    <div class="block-50">
                        <h3>Customer Information</h3>
                        <p>First Name: ${this.bill.first_name}</p>
                        <p>Last Name: ${this.bill.last_name}</p>
                        <p>Email: ${this.bill.email}</p>
                    </div>

                    <div class="block-100 products">
                        <h3>Products</h3>
                        <ul>
                            ${this.bill.products.map(
                                (product: any) => html`
                                    <li>
                                        <p>Title: ${product.product_title}</p>
                                        <p>Price: ${product.product_price}</p>
                                        <p>Quantity: ${product.quantity}</p>
                                    </li>
                                `
                            )}
                        </ul>
                    </div>    
                </section>
            </div>
        `;
    }
}