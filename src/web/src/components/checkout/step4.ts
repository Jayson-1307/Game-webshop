import { LitElement, TemplateResult, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { RouterPage } from "../RouterPage";
import { OrderItemService } from "../../services/OrderItemService";
import { sendEmail } from "../../services/EmailService";

@customElement("step-four")
export class StepTwo extends LitElement {

    public static styles = css`

        main {
            min-height: 70vh;
            flex: 1;
        }
        body {
            font-family: Arial;
            font-size: 17px;
            margin: 0;
        }
        h2 {
            color: white;
            text-align: center;
            font-size: 50px;
            margin-top: 0;
        }
        h3 {
            color: white;
            text-align: center;
            font-size: 30px;
        }
        .text {
            color: white;
            text-align: center;
            font-size: 20px;
        }
        .container {
            background-color: transparent;
            padding: 1px 10px 15px 20px;
            width: 50%;
            margin: 0 auto;
            border: 1px #9900ff solid;
            border-radius: 3px;
        }
        .conf {
            background-color: #9900ff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            display: block;
            margin: 20px auto 0;
        }
    `;

    private _orderItemService: OrderItemService = new OrderItemService();

    private CustomerbillId: number | null = null;

    private billData: any[] = [];


    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.fetchBillData();
    }

    public async fetchBillData(): Promise<void> {
        try {
            // Fetch bill data
            this.billData = await this._orderItemService.getBillData(this.CustomerbillId);
            console.log("Bill Data:", this.billData);
            this.requestUpdate();
        } catch (error) {
            console.error("Error fetching bill data:", error);
        }
    }

    private async handleConfirm(): Promise<void> {
        this.navigateTo(RouterPage.Home);

        try {
            const emailResult: string = await sendEmail({
                from: { name: "RETRO GAME STORE", address: "no-reply@retrogamestore.com" },
                to: [{ address: this.billData[0].email }],
                subject: "Bill order Confirmation ✅",
                html: `<p>Thank you for your purchase, ${this.billData.length > 0 ? `${this.billData[0].first_name} ${this.billData[0].last_name}` : ""}!</p>
    
                <!-- Shipping Address -->
                <h3>Shipping Address</h3>
                <p>
                    Street: ${this.billData.length > 0 ? this.billData[0].shipping_street : ""}<br>
                    House Number: ${this.billData.length > 0 ? this.billData[0].shipping_house_number : ""}<br>
                    House Number Addition: ${this.billData.length > 0 ? this.billData[0].shipping_house_number_addition || "N/A" : "N/A"}<br>
                    ZIP Code: ${this.billData.length > 0 ? this.billData[0].shipping_zip : ""}<br>
                    City: ${this.billData.length > 0 ? this.billData[0].shipping_city : ""}<br>
                    Country: ${this.billData.length > 0 ? this.billData[0].shipping_country : ""}
                </p>
                
                <!-- Billing Address -->
                <h3>Billing Address</h3>
                <p>
                    Street: ${this.billData.length > 0 ? this.billData[0].billing_street : ""}<br>
                    House Number: ${this.billData.length > 0 ? this.billData[0].billing_house_number : ""}<br>
                    House Number Addition: ${this.billData.length > 0 ? this.billData[0].billing_house_number_addition || "N/A" : "N/A"}<br>
                    ZIP Code: ${this.billData.length > 0 ? this.billData[0].billing_zip : ""}<br>
                    City: ${this.billData.length > 0 ? this.billData[0].billing_city : ""}<br>
                    Country: ${this.billData.length > 0 ? this.billData[0].billing_country : ""}
                </p>
                
                <p>Order details:</p>
                <ul>
                    <li><strong>Ordered Products:</strong>
                        <ul>
                            ${this.billData.map((product: any) => `
                                <li>${product.product_title} - Price: ${product.product_price}, Quantity: ${product.quantity}</li>
                            `).join("")}
                        </ul>
                    </li>
                </ul>
                
                <!-- Total Prices -->
                <p>Total Price (Excluding VAT): € ${this.billData.length > 0 ? this.billData[0].total_price_excl_VAT : ""}</p>
                <p>VAT (21%): € ${this.billData.length > 0 ? this.billData[0].VAT_price : ""}</p>
                <p>Total Price (Including VAT): € ${this.billData.length > 0 ? this.billData[0].total_price_incl_VAT : ""}</p>
            
                <p>Have a great day 😁</p>`
            });

            console.log("Email sent successfully:", emailResult);
            
        } catch (emailError) {
            console.error("Failed to send email:", emailError);
        }
    }

    public render(): TemplateResult {

    
        return html`
            <main>
                <h2>Confirmation</h2>
                <div class="container">
                    <h3>Order Confirmation ${this.CustomerbillId}</h3>
                    <p class="text">Thank you for your purchase, ${this.billData.length > 0 ? html `${this.billData[0].username}` : ""}!</p>
                    
                    <!-- Shipping Address -->
                    <h3>Shipping Address</h3>
                    <p class="text">
                        Street: ${this.billData.length > 0 ? this.billData[0].shipping_street : ""}<br>
                        House Number: ${this.billData.length > 0 ? this.billData[0].shipping_house_number : ""}<br>
                        House Number Addition: ${this.billData.length > 0 ? this.billData[0].shipping_house_number_addition || "N/A" : "N/A"}<br>
                        ZIP Code: ${this.billData.length > 0 ? this.billData[0].shipping_zip : ""}<br>
                        City: ${this.billData.length > 0 ? this.billData[0].shipping_city : ""}<br>
                        Country: ${this.billData.length > 0 ? this.billData[0].shipping_country : ""}
                    </p>
                    
                    <!-- Billing Address -->
                    <h3>Billing Address</h3>
                    <p class="text">
                        Street: ${this.billData.length > 0 ? this.billData[0].billing_street : ""}<br>
                        House Number: ${this.billData.length > 0 ? this.billData[0].billing_house_number : ""}<br>
                        House Number Addition: ${this.billData.length > 0 ? this.billData[0].billing_house_number_addition || "N/A" : "N/A"}<br>
                        ZIP Code: ${this.billData.length > 0 ? this.billData[0].billing_zip : ""}<br>
                        City: ${this.billData.length > 0 ? this.billData[0].billing_city : ""}<br>
                        Country: ${this.billData.length > 0 ? this.billData[0].billing_country : ""}
                    </p>
                    
                    <p class="text">Order details:</p>
                    <ul>
                        <li><strong>Ordered Products:</strong>
                            <ul>
                                ${this.billData.map((product: any) => html`
                                    <li>${product.product_title} - Price: ${product.product_price}, Quantity: ${product.quantity}</li>
                                `)}
                            </ul>
                        </li>
                    </ul>
                    
                    <!-- Total Prices -->
                    <p class="text">Total Price (Excluding VAT): € ${this.billData[0].total_price_excl_VAT}</p>
                    <p class="text">VAT (21%): € ${this.billData[0].VAT_price}</p>
                    <p class="text">Total Price (Including VAT): € ${this.billData[0].total_price_incl_VAT}</p>
    
                    <p class="text">Click the Confirmation button to receive your confirmation email.</p>
                    <p class="text">Have a great day 😁</p>
                    <button @click="${this.handleConfirm}" class="conf">Confirmation</button>
                </div>
            </main>
        `;
    }


    private navigateTo(page: RouterPage): void {
        this.dispatchEvent(new CustomEvent("navigate", { detail: page }));
    }
}