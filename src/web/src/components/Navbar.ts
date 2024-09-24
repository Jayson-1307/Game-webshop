import { LitElement, TemplateResult, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";
import { TokenService } from "../services/TokenService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { RouterPage } from "./RouterPage";
import { OrderItemService } from "../services/OrderItemService";

@customElement("webshop-navbar")
export class Navbar extends LitElement {

    public static styles = css`
    header {
        /* background-color: #fbfbfa; */
        padding: 20px;
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

    nav {
        max-width: 1260px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    nav .logo img {
        width: auto;
        height: 100px;
        cursor: pointer;
    }

    .nav-content {
        display: flex;
        /* justify-content: space-between; */
        width: 100%;
    }

    .nav-item {
       margin: auto 30px; 
    }

    .nav-item span {
        font-weight: bold;
    }

    .nav-item span:hover{
        cursor: pointer;
        text-decoration: underline;
        /* color: lightblue; */
        color: #30b4cf;
    }

    /* -------- dorpdown item styling -------- */
    .dropdown-title {
        display: flex;
    }

    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #000a1a;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
    }

    .dropdown-content .dropdown-item {
        color: white;
        padding: 12px 5px;
        text-decoration: none;
        display: block;
        width: 100%
    }

    .dropdown-content p:hover {
        background-color: #000a1a;
    }

    .dropdown:hover .dropdown-content {
        display: flex;
        flex-direction: column;
    }

    .dropdown:hover .dropbtn {
        background-color: #000a1a;
    }

    .dropdown-icon {
        max-height: 8px;
        margin: auto 0 auto 6px;
    }

    /* -------- shopping cart styling -------- */
    .shopping-cart {
        display: flex;
        position: relative;
        padding-right: 10px;
        cursor: pointer;
    }

    .shopping-cart p {
        font-size: 14px;
        position: absolute;
        bottom: -5px;
        right: 0;
        margin: 0;
    }
    
    .shopping-cart-icon {
        max-height: 30px;
    }

    .login .btn{
        padding: 7.5px 15px;
    }

    .cart-item-container {
        display: none;
        position: absolute; 
        top: 100%;
        right: -10px;
        min-width: 250px; 
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 100;
        padding-top: 20px;
    }

    .cart-item-container .cart-content {
        max-height: 400px; 
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        width: 100%;
        border: 1px solid #9900ff;
        border-radius: 5px;
        background-color: #001433;
    }

    .cart-item-container .cart-content .cart-item {
        padding: 12px 5px;
        display: flex;
        align-items: center; 
        width: 400px;
        justify-content: space-between;
        border-bottom: 1px solid #5c0099;
    }

    .cart-item-container .cart-content .cart-item:last-of-type {
        border: none;
    }

    .cart-item-container .cart-content .cart-item span {
        margin: 0 10px;
    }

    .cart-item-container .cart-content .cart-item span.item-name {
        flex-grow: 1; 
        white-space: nowrap; 
        overflow: hidden; 
        text-overflow: ellipsis; 
        max-width: calc(75% - 200px);
    }

    .cart-item-container .cart-content .cart-item img {
        padding: 10px;
        width: 30px; 
        height: 30px; 
        object-fit: cover;
    }

    .cart-item-container .cart-content .cart-bottom {
        position: sticky; 
        bottom: 0;
        background-color: #001433;
        padding-top: 10px;
    }

    .cart-item-container .cart-content .cart-bottom .total-price {
        display: flex;
        justify-content: space-between;
        padding: 0 5px;
    }
    
    .cart-item-container .cart-content .cart-bottom .total-price .total-label {
        flex-grow: 1; 
        text-align: right; 
        padding-right: 10px; 
    }

    .cart-item-container .cart-content .cart-item .quantity-container {
        display: flex;
        align-items: center;
    }
    
    .cart-item-container .cart-content .cart-item .quantity-btn {
        background-color: #9900ff; 
        border: 10px;
        border-radius: 50%;
        color: #fff; 
        cursor: pointer;
        font-size: 1rem;
        padding: 0.25rem 0.5rem;
        transition: background-color 0.3s;
    }
    
    .cart-item-container .cart-content .cart-item .quantity-btn:hover {
        background-color: #fff; 
        color: #9900ff; 
        border-radius: 50%;
    }
    
    .cart-item-container .cart-content .cart-item .quantity {
        margin: 0 0.5rem;
        font-size: 1rem;
    }

    .delete-button {
    background-color: red;
    border: none;
    cursor: pointer;
    padding: 5px;
    transition: background-color 0.3s;
    border-radius: 50%;
    }

    .delete-button img {
        max-width: 20px;
        max-height: 20px;
    }

    .delete-button:hover {
        background-color: white;
    }

    .cart-item-container .cart-content .checkout-button {
        padding: 12px 5px;
    }

    .cart-item-container .cart-content .checkout-button button {
        width: 100%;
    }


    @media screen and (min-width:768px) {
        .shopping-cart:hover .cart-item-container {
            display: block;
        }
    }

    /* -------- Search bar styling -------- */
    .nav-item.searchbar {
        width: 100%;
        background: transparent;
        border: 3px solid #9900ff;
        padding: 10px 7px;
        color: white;
        border-radius: 5px;
    } 

    .nav-item.searchbar::placeholder {
        color: lightgray;
    }

    .nav-item.searchbar:focus-visible {
        outline: none;

    }
    
`;

    @state() private _isLoggedIn: boolean = false;
    public _cartItemsCount: number = 0;

    private _userService: UserService = new UserService();
    private _orderItemService: OrderItemService = new OrderItemService();
    private _tokenService: TokenService = new TokenService();
    @state() private _cartItems: any[] = [];
    @state() private userData: any[] = [];


    private _authLevel: string = "";

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.handleLoginSuccess();

        // Listen for login-success event
        window.addEventListener("login-success", this.handleLoginSuccessWrapper);
        window.addEventListener("added-product-success", this.handleLoginSuccessWrapper);
        window.addEventListener("add-quantity-cart-item", this.handleLoginSuccessWrapper);
        window.addEventListener("sub-quantity-cart-item", this.handleLoginSuccessWrapper);
        window.addEventListener("delete-cart-item", this.handleLoginSuccessWrapper);
        window.addEventListener("after-confirmation", this.handleLoginSuccessWrapper);

    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        window.removeEventListener("login-success", this.handleLoginSuccessWrapper);
        window.removeEventListener("added-product-success", this.handleLoginSuccessWrapper);
        window.removeEventListener("add-quantity-cart-item", this.handleLoginSuccessWrapper);
        window.removeEventListener("sub-quantity-cart-item", this.handleLoginSuccessWrapper);
        window.removeEventListener("delete-cart-item", this.handleLoginSuccessWrapper);
        window.removeEventListener("after-confirmation", this.handleLoginSuccessWrapper);

    }

    private handleLoginSuccessWrapper = (): void => {
        this.handleLoginSuccess().catch(error => console.error("Error handling login success:", error));
    };

    private async handleLoginSuccess(): Promise<void> {
        // Update login status and cart items on login success
        await this.checkLoginStatus();
        await this.showUserCartItems();
        await this.fetchUser();
        this.requestUpdate();
    };

    private async fetchUser(): Promise<void> {
        try {
            const userData: any = await this._userService.getUser();

            console.log(userData);

            this.userData = userData.username;

        } catch (error) {
            console.error("Error fetching user data:", error);
        }
        await this.getAuthlevel();

        
    }

    

    public async getAuthlevel(): Promise<void> {
        this._authLevel = await this._userService.getAuthLevel();
        console.error(this._authLevel);
    }   

    private async checkLoginStatus(): Promise<void> {
        try {
            const result: UserHelloResponse | undefined = await this._userService.getWelcome();
            console.log(result);
            if (result) {
                this._isLoggedIn = true;
                this._cartItemsCount = result.cartItems?.length || 0;
            } else {
                this._isLoggedIn = false;
            }
        } catch (error) {
            console.error("Error checking login status:", error);
        }

        this.requestUpdate();
    }

    private async showUserCartItems(): Promise<void> {
        try {
            const cartItems: any = await this._orderItemService.showUserCartItems();

            this._cartItems = cartItems;
            this._cartItemsCount = cartItems.reduce((total: any, item: any) => total + item.quantity, 0);

        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
        this.requestUpdate();
    }

    private async addQuantityCartItems(gameId: number): Promise<void> {
        try {
            const cartItems: any = await this._orderItemService.addQuantityInCart(gameId);

            if (cartItems) {
                window.dispatchEvent(new Event("add-quantity-cart-item"));
            }

            this._cartItemsCount = cartItems.reduce((total: any, item: any) => total + item.quantity, 0);

        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
        this.requestUpdate();
    }

    private async subQuantityCartItems(gameId: number): Promise<void> {
        try {
            const cartItems: any = await this._orderItemService.subQuantityInCart(gameId);

            if (cartItems) {
                window.dispatchEvent(new Event("sub-quantity-cart-item"));
            }

            this._cartItemsCount = cartItems.reduce((total: any, item: any) => total + item.quantity, 0);

        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
        this.requestUpdate();
    }

    private async deleteUserCartItem(gameId: number): Promise<void> {
        try {
            const cartItems: any = await this._orderItemService.deleteUserCartItem(gameId);

            if (cartItems) {
                confirm("Are you sure you want to delete this product from your cart?");
                window.dispatchEvent(new Event("delete-cart-item"));
            }

        } catch (error) {
            console.error("Error delting item in cart:", error);
        }
        this.requestUpdate();
    }

    /**
     * Handler for the cart button
     */
    private async clickCartButton(): Promise<void> {
        if (!this._isLoggedIn) {
            const confirmed: boolean = confirm("You need to be logged in to view shopping cart. Do you want to log in now?");
            if (confirmed) {
                this.navigateTo(RouterPage.Login);
            }
            return;
        }

        // Fetch and display cart items
        await this.showUserCartItems();
        alert(
            `Je hebt de volgende producten in je winkelwagen:\n${this._cartItems.map(item => `${item.productName} (${item.quantity}) - €${item.price}`).join("\n") || "Geen items"}`
        );
    }

    /**
     * Handler for the logout button
     */
    private async clickLogoutButton(): Promise<void> {
        await this._userService.logout();

        this._tokenService.removeToken();

        this._isLoggedIn = false;

        if (this._isLoggedIn === false) {
            this._cartItemsCount = 0;
            window.dispatchEvent(new Event("logout"));
            this.navigateTo(RouterPage.Login);

        }

        this.requestUpdate();

    }

    private navigateTo(page: RouterPage): void {
        this.dispatchEvent(new CustomEvent("navigate", { detail: page }));
    }

    public render(): unknown {
        if (this._authLevel === "admin" || this._authLevel === "employee") {
            return html`
                <div>
                    <header>
                        <nav>
                            <div class="logo" @click=${(): void => this.navigateTo(RouterPage.AdminHome)}>
                                <img src="/assets/img/logo.png" alt="Logo" />
                            </div>
                            ${this.renderButtons()}
                        </nav>
                    </header>
                </div>
            `;
        }
        return html`
            <div>
                <header>
                    <nav>
                        <div class="logo" @click=${(): void => this.navigateTo(RouterPage.Home)}>
                            <img src="/assets/img/logo.png" alt="Logo" />
                        </div>
                        ${this.renderButtons()}
                    </nav>
                </header>
            </div>
        `;
    }

    private renderButtons(): TemplateResult {

        console.log("cartitems", this._cartItems);
        if (this._isLoggedIn) {
            if (this._authLevel === "admin") {
                console.error("User is an admin");
                return html`
                    <div class="nav-content">
                        <div class="nav-item dropdown" >
                            <span class="dropdown-title">Accounts <img class="dropdown-icon" src="/assets/img/Icons/dropdown.png" alt=""></span>
                            <div class="dropdown-content">
                                <span class="dropdown-item" @click=${(): void => this.navigateTo(RouterPage.AdminUserOverview)}>Users</span>
                                <span class="dropdown-item" @click=${(): void => this.navigateTo(RouterPage.AdminOverview)}>Admins</span>
                                <span class="dropdown-item" @click=${(): void => this.navigateTo(RouterPage.AdminEmployeesOverview)}>Employees</span>
                            </div>
                        </div>

                        <div class="nav-item" @click=${(): void => this.navigateTo(RouterPage.AdminGameOverview)}>
                            <span>Games</span>
                        </div>

                        <div class="nav-item" @click=${(): void => this.navigateTo(RouterPage.AdminMerchOverview)}>
                            <span>Merchandise</span>
                        </div>

                        <div class="nav-item" @click=${(): void => this.navigateTo(RouterPage.AdminNewsOverview)}>
                            <span>News</span>
                        </div>

                        <div class="nav-item" @click=${(): void => this.navigateTo(RouterPage.AdminBillsOverview)}>
                            <span>Bills</span>
                        </div>

                        <div class="nav-item" @click=${(): void => this.navigateTo(RouterPage.SalesOveview)}>
                            <span>Sales</span>
                        </div>
                        
                    </div>

                    <div class="nav-item dropdown" >
                        <span class="dropdown-title">Account <img class="dropdown-icon" src="/assets/img/Icons/dropdown.png" alt=""></span>
                        <div class="dropdown-content">
                            <span class="dropdown-item" @click=${(): void => this.navigateTo(RouterPage.Profile)}>Profile</span>
                            <span class="dropdown-item" @click=${this.clickLogoutButton}>Logout</span>
                        </div>
                    </div>

                `;
            } else if (this._authLevel === "employee") {
                console.error("User is an admin");
                return html`
                    <div class="nav-content">
                        <div class="nav-item" @click=${(): void => this.navigateTo(RouterPage.AdminGameOverview)}>
                            <span>Games</span>
                        </div>

                        <div class="nav-item" @click=${(): void => this.navigateTo(RouterPage.AdminMerchOverview)}>
                            <span>Merchandise</span>
                        </div>

                        <div class="nav-item" @click=${(): void => this.navigateTo(RouterPage.AdminNewsOverview)}>
                            <span>News</span>
                        </div>

                        <div class="nav-item" @click=${(): void => this.navigateTo(RouterPage.AdminBillsOverview)}>
                            <span>Bills</span>
                        </div>

                        <div class="nav-item" @click=${(): void => this.navigateTo(RouterPage.SalesOveview)}>
                            <span>Sales</span>
                        </div>
                    </div>

                    <div class="nav-item dropdown" >
                        <span class="dropdown-title">Account <img class="dropdown-icon" src="/assets/img/Icons/dropdown.png" alt=""></span>
                        <div class="dropdown-content">
                            <span class="dropdown-item" @click=${(): void => this.navigateTo(RouterPage.Profile)}>Profile</span>
                            <span class="dropdown-item" @click=${this.clickLogoutButton}>Logout</span>
                        </div>
                    </div>
                `;
            } else {
                console.error("User is not an admin");
                return html`
                <div class="nav-content">
                    <div class="nav-item" @click=${(): void => this.navigateTo(RouterPage.Game)}>
                        <span>Games</span>
                    </div>
                    <div class="nav-item" @click=${(): void => this.navigateTo(RouterPage.Merch)}>
                        <span>Merchandise</span>
                    </div>

                    <div class="nav-item" @click=${(): void => this.navigateTo(RouterPage.News)}>
                        <span>News</span>
                    </div>

                    <input class="nav-item searchbar" type="text" placeholder="Search..">
                    <div class="nav-item dropdown" >
                        <span class="dropdown-title">${this.userData}<img class="dropdown-icon" src="/assets/img/Icons/dropdown.png" alt=""></span>
                        <div class="dropdown-content">
                            <span class="dropdown-item" @click=${(): void => this.navigateTo(RouterPage.Profile)}>Profile</span>
                            <span class="dropdown-item" @click=${(): void => this.navigateTo(RouterPage.Library)}>Library</span>
                            <span class="dropdown-item" @click=${(): void => this.navigateTo(RouterPage.PersonalPage)}>My Orders</span>
                            <span class="dropdown-item" @click=${this.clickLogoutButton}>Logout</span>
                        </div>
                    </div>
                    <div class="nav-item shopping-cart" >
                        <div class="cart-click" @click=${this.clickCartButton}>
                            <img class="shopping-cart-icon" src="/assets/img/Icons/cart.png" alt="Logo" />
                            <p>${this._cartItemsCount}</p>
                        </div>

                        <div class="cart-item-container">
                            <div class="cart-content">

                            ${this._cartItems.length === 0 ? html`
                                    <div class="cart-item">No items in cart</div>
                                ` : this._cartItems.map(item => html`
                            <div class="cart-item">
                                <div class="quantity-container">
                                        ${item.item_type === "game" || item.quantity === 1 ? nothing : html`<button class="quantity-btn" @click=${(): Promise<void> => this.subQuantityCartItems(item.productId)}>-</button>`}
                                        <span class="quantity">${item.quantity}</span>
                                        ${item.item_type === "game" ? nothing : html`<button class="quantity-btn" @click=${(): Promise<void> => this.addQuantityCartItems(item.productId)}>+</button>`}
                                </div>
                                    <img src="${item.thumbnail}" alt="${item.productName}">
                                    <span class="item-name">${item.productName}</span>
                                    <span class="item-amount">${item.quantity} x € ${item.price}</span>
                                    <button class="delete-button" @click=${(): Promise<void> => this.deleteUserCartItem(item.productId)}><img src="/assets/img/Icons/delete.png" alt="Logo" /></button>
                            </div>
                                `)}

                                ${this._cartItems.length === 0 ? nothing : html`
                                <div class="cart-bottom">
                                    <div class="total-price">
                                        <span class="total-label">Total price (Excl. VAT):</span>
                                        <span class="price">€ ${this._cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
                                    </div>
                                    <div class="total-price">
                                        <span class="total-label">VAT 21%:</span>
                                        <span class="price">€ ${(this._cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.21).toFixed(2)}</span>
                                    </div>
                                    <div class="total-price">
                                        <span class="total-label">Total price (Incl. VAT):</span>
                                        <span class="price">€ ${(this._cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * 1.21).toFixed(2)}</span>
                                    </div>
                                    <div class="checkout-button">
                                        <button class="btn button secondairy" @click=${(): void => this.navigateTo(RouterPage.checkoutStepOne)}>checkout</button>
                                    </div>
                                </div>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
                `;
            }
        
        }  else {
            return html`
                <div class="nav-content">
                    <div class="nav-item" @click=${(): void => this.navigateTo(RouterPage.Game)}>
                        <span>Games</span>
                    </div>
                    <div class="nav-item" @click=${(): void => this.navigateTo(RouterPage.Merch)}>
                        <span>Merchandise</span>
                    </div>
                    <div class="nav-item" @click=${(): void => this.navigateTo(RouterPage.News)}>
                        <span>News</span>
                    </div>
                    <input class="nav-item searchbar" type="text" placeholder="Search..">
                    <div class="nav-item login" >
                        <div @click=${(): void => this.navigateTo(RouterPage.Login)}>
                            <button class="btn button primairy">Login</button>
                        </div>
                    </div>
                    <div class="nav-item shopping-cart" @click=${this.clickCartButton}>
                        <img class="shopping-cart-icon" src="/assets/img/Icons/cart.png" alt="Logo" />
                        <p>${this._cartItemsCount}</p>
                    </div>
 
                </div>
            `;
        }
    }
}


