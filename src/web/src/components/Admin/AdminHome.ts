import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UserService } from "../../services/UserService";
import { OrderItemService } from "../../services/OrderItemService";
import { RouterPage } from "../RouterPage";
import { AdminService } from "../../services/AdminService";


/**
 * Custom element based on Lit for the header of the webshop.
 *
 * @todo Most of the logic in this component is over-simplified. You will have to replace most of if with actual implementions.
 */
@customElement("admin-home")
export class AdminHome extends LitElement {
    public static styles = css`
        /* ------ general styling ------ */

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

        /* ------ admin homepage styling ------ */
        .admin-block {
            cursor: pointer;
        }
    `;

    // @state()
    // private _isLoggedIn: boolean = false;

    @state()
    private _orderItems: any[] = [];

    @state() private _gameAmount: any;
    @state() private _merchAmount: any;
    @state() private _salesAmount: any;
    @state() private _billAmount: any;
    @state() private _usersAmount: any;
    @state() private _adminsAmount: any;
    @state() private _employeesAmount: any;
    @state() private _newsItemsAmount: any;
    @state() private _totalQuantity: any;

    private _userService: UserService = new UserService();
    private _orderItemService: OrderItemService = new OrderItemService();
    private _adminService: AdminService = new AdminService();

    private _authLevel: string = "";


    public async connectedCallback(): Promise<void> {
        await this.getAuthlevel();
        super.connectedCallback();
        console.log("callback test");

        await this.getAllGames();
        await this.getAllSales();
        await this.getAllMerch();
        await this.getAllUsers();
        await this.getAllAdmins();
        await this.getAllEmployees();
        await this.getAllNewsItems();
        await this.getAllBills();
        // this.handleNavigation();

    }

    // private handleNavigation(event: CustomEvent): void {
    //     const nextPage: boolean = event.detail;
    //     this._isLoggedIn = nextPage;
    // }

    /**
     * Get all available games from databse
     */
    private async getAllGames(): Promise<void> {
        console.log("get all games ");
        const result: any = await this._orderItemService.getAllGames("date", "ASC");
        console.log(result);

        console.log(this._orderItems);

        this._gameAmount = result.length;
        console.log(this._salesAmount);

        if (!result) {
            return;
        }

        this._orderItems = result;
    }

    /**
     * Get all available games from databse
     */
    private async getAllSales(): Promise<void> {
        console.log("get all games");
        const result: any = await this._adminService.getAllSales();
        console.log("orders" + result);

        this._salesAmount = result.length;
        console.log(this._gameAmount);

        if (!result) {
            return;
        }

        // Sum the quantity column
        const totalQuantity: any = result.reduce((acc: number, item: { quantity: number }) => acc + (item.quantity || 0), 0);

        // Log the total quantity
        console.log(`Total Quantity: ${totalQuantity}`);

        // Optionally, store the total quantity in a class property if needed
        this._totalQuantity = totalQuantity;

        this._orderItems = result;
    }

    /**
     * Get all available merchandise from databse
     */
    private async getAllMerch(): Promise<void> {
        console.log("get all games ");
        const result: any = await this._adminService.getAllMerch();
        console.log(result);

        this._merchAmount = result.length;
        console.log(this._merchAmount);

        if (!result) {
            return;
        }

        this._orderItems = result;
    }

    private async getAllUsers():Promise<void> {
        const result: any = await this._adminService.getAllUsers();
        console.log(result);
        this._usersAmount = result.length;

        if (!result) {
            console.log("gebruikers ophalen niet gelukt");
        }
    }

    private async getAllAdmins():Promise<void> {
        const result: any = await this._adminService.getAllAdmins();
        console.log(result);
        this._adminsAmount = result.length;

        if (!result) {
            console.log("admins ophalen niet gelukt");
        }
    }

    private async getAllEmployees():Promise<void> {
        const result: any = await this._adminService.getAllEmployees();
        console.log(result);
        this._employeesAmount = result.length;

        if (!result) {
            console.log("admins ophalen niet gelukt");
        }
    }

    private async getAllNewsItems():Promise<void> {
        const result: any = await this._adminService.getAllNewsItems();
        console.log(result);
        this._newsItemsAmount = result.length;

        if (!result) {
            console.log("admins ophalen niet gelukt");
        }
    }
    public async getAuthlevel(): Promise<void> {
        this._authLevel = await this._userService.getAuthLevel();
        console.error(this._authLevel);
    } 

    private async getAllBills():Promise<void> {
        const result: any = await this._adminService.getAllBills();

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

        const objectArray: any[] = Object.values(bills);
        const billIds: any[] = objectArray.map((bill: any) => bill.id);
        console.log(billIds);
        this._billAmount = billIds.length;

    }

    private navigateTo(page: RouterPage): void {
        this.dispatchEvent(new CustomEvent("navigate", { detail: page }));
    }

    /**
     * Renders the home page, which contains a list of all order items.
     */
    public render(): TemplateResult {
        if (this._authLevel === "admin") {
            return html`
                <h2>Admin Interface</h2>

                <div class="sales-overview admin-block btn button primairy" @click=${(): void => this.navigateTo(RouterPage.SalesOveview)}>
                    <p>All sales: <span>${this._totalQuantity}</span> </p>
                </div>

                <div class="game-overview admin-block btn button primairy" @click=${(): void => this.navigateTo(RouterPage.AdminGameOverview)}>
                    <p>All games: <span>${this._gameAmount}</span> </p>
                </div>

                <div class="merch-overview admin-block btn button primairy" @click=${(): void => this.navigateTo(RouterPage.AdminMerchOverview)}>
                    <p>All merchandise: <span>${this._merchAmount}</span> </p>
                </div>

                <div class="user-overview admin-block btn button primairy" @click=${(): void => this.navigateTo(RouterPage.AdminUserOverview)}>
                    <p>All users: <span>${this._usersAmount}</span></p>
                </div>

                <div class="admin-overview admin-block btn button primairy" @click=${(): void => this.navigateTo(RouterPage.AdminOverview)}>
                    <p>All admins: <span>${this._adminsAmount}</span></p>
                </div>

                <div class="employee-overview admin-block btn button primairy" @click=${(): void => this.navigateTo(RouterPage.AdminEmployeesOverview)}>
                    <p>All employees: <span>${this._employeesAmount}</span></p>
                </div>

                <div class="news-overview admin-block btn button primairy" @click=${(): void => this.navigateTo(RouterPage.AdminNewsOverview)}>
                    <p>All news items: <span>${this._newsItemsAmount}</span></p>
                </div>

                <div class="news-overview admin-block btn button primairy" @click=${(): void => this.navigateTo(RouterPage.AdminBillsOverview)}>
                    <p>All Bills: <span>${this._billAmount}</span></p>
                </div>
            `;
        } else {
            return html`
                <h2>Employee Interface</h2>
    
                <div class="sales-overview admin-block btn button primairy" @click=${(): void => this.navigateTo(RouterPage.SalesOveview)}>
                    <p>All sales: <span>${this._totalQuantity}</span> </p>
                </div>
    
                <div class="game-overview admin-block btn button primairy" @click=${(): void => this.navigateTo(RouterPage.AdminGameOverview)}>
                    <p>All games: <span>${this._gameAmount}</span> </p>
                </div>
    
                <div class="merch-overview admin-block btn button primairy" @click=${(): void => this.navigateTo(RouterPage.AdminMerchOverview)}>
                    <p>All merchandise: <span>${this._merchAmount}</span> </p>
                </div>
    
                <div class="news-overview admin-block btn button primairy" @click=${(): void => this.navigateTo(RouterPage.AdminNewsOverview)}>
                    <p>All news items: <span>${this._newsItemsAmount}</span></p>
                </div>
    
                <div class="news-overview admin-block btn button primairy" @click=${(): void => this.navigateTo(RouterPage.AdminBillsOverview)}>
                    <p>All Bills: <span>${this._billAmount}</span></p>
                </div>
            `;
        }
    } 
}
