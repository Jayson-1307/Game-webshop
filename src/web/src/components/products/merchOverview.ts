import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { RouterPage } from "../RouterPage";
import { OrderItemService } from "../../services/OrderItemService";
import { UserService } from "../../services/UserService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";


@customElement("merch-overview")   
export class MerchOverview extends LitElement {
    public static styles = css`
        /* ------ general page styling ------ */
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

        .page-title {
            width: 100%;
            text-align: center;
        }

        /* ------ merchs block styling ------ */
        .merchs {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-content: stretch;
        }

        .merch {
            width: 100%;
            flex: 0 100%;
            max-width: 100%;
            
        }

        .merch .merch-inside {
            padding: 20px;
        }

        .merch .info .image {
            width: 100%;
            max-width: 100%;
            height: 200px;
            max-height: 200px;
        }
            
        .merch .info .image img{
            width: 100%;
            max-width: 100%;
            height: 200px;
            max-height: 200px;
            object-fit: cover;
            border-radius: 10px;
            cursor: pointer;
        }

        .merch .info .description {
            padding-top: 10px;
        }

        .merch .info .description .descr {
            padding: 3px 0;
        }

        .merch .info .description .title {
            font-size: 20px;
            cursor: pointer;
        }

        .merch .info .description .type {
            font-family: cursive;
        }

        .merch .actions {
            padding-top: 15px;
            display: flex;
            flex-wrap: wrap;

        }

        .merch .actions .view-merch {
            width: 100%;
            max-width: 100%;
        }
        
        .merch .actions .view-merch .btn.button{
            width: 100%;
            max-width: 100%;
            font-weight: bold;

        }

        .merch .actions .buy-options {
            display: flex;
            width: 100%;
            padding: 10px 0;
        }

        .merch .actions .buy-options .price {
            width: 50%;
            flex: 0 50%;
            max-width: 50%;
            font-size: 24px;
        }

        .merch .actions .buy-options .price p {
            margin: 0;
            font-weight: bold;
        }

        .merch .actions .buy-options .to-cart {
            width: 50%;
            flex: 0 50%;
            max-width: 50%;
        }

        .merch .actions .buy-options .to-cart .button {
            width: 100%;
            margin: auto;
            font-weight: italic;
        }


        @media screen and (min-width: 480px) {
            .merch {
                width: 50%;
                flex: 0 50%;
                max-width: 50%;
            }
        }

        @media screen and (min-width: 768px) {
            .merch {
                width: 33.333%;
                flex: 0 33.333%;
                max-width: 33.333%;
            }
        }

        @media screen and (min-width: 992px) {
            .merch {
                width: 25%;
                flex: 0 25%;
                max-width: 25%;
            }
        }

        /* ------ Filter styling ------ */
        .filters {
            display: flex;

        }

        .filters select {
            height: fit-content;
            border-radius: 5px;
            margin: auto 0 auto 10px;
            background-color: #30b4cf;
            border: 1px solid #2790a5;
            cursor: pointer;
        }

    `;

    // The count of items in the cart
    @state()
    private _cartItemsCount: number = 0;

    // State to store the order items to be displayed
    @state()
    private _orderItems: any[] = [];

    // Instance of OrderItemService to fetch order items
    private _orderItemService: OrderItemService = new OrderItemService();

    private _userService: UserService = new UserService();

    @state() private _isLoggedIn: boolean = false;

    /**
     * Lifecycle method called when the component is added to the DOM.
     * Fetches all games when the component is first connected.
     */
    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.checkLoginStatus();
        await this.getAllMerch();
        
    }

    private async checkLoginStatus(): Promise<void> {
        try {
            const result: UserHelloResponse | undefined = await this._userService.getWelcome();
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

    /**
 * Adds an order item to the cart.
 * @param itemId - The ID of the item to add to the cart
 */
private async addOrderItemToCart(itemId: number): Promise<void> {
    try {
        if (!this._isLoggedIn) {
            const confirmed: boolean = confirm("You need to be logged in to add items to your cart. Do you want to log in now?");
            if (confirmed) {
                // Redirect to Login page
                this.dispatchEvent(new CustomEvent("navigate", { detail: RouterPage.Login }));
                return;
            } else {
                return;
            }
        }
        
        const test: boolean = await this._orderItemService.addOrderItemToCart(itemId);

        if (!test) {
            alert("Merch is already in cart");
        } else {
            this._cartItemsCount += 1;
            this.dispatchEvent(new CustomEvent("added-product-success", { bubbles: true, composed: true }));
            alert("Merchandise item added to cart");
        }

        console.log(this._cartItemsCount);

    } catch (error) {
        console.error("Failed to add item to cart", error);
    }
}

/**
    * Fetches all available order items (games).
    */
private async getAllMerch(): Promise<void> {
    const result: any = await this._orderItemService.getAllMerch();

    if (!result) {
        return;
    }

    this._orderItems = result;

}

    
    /**
     * Navigates to a specified page.
     * @param page - The page to navigate to
     * @param merchandiseId - (Optional) The ID of the game to view
     */
    private navigateTo(page: RouterPage, merchandiseId?: string): void {
        console.log("Navigating to", page, "with merchandiseId", merchandiseId);

        // Dispatch a custom event named "navigate" with the detail containing the target page and game ID
        const check: boolean = this.dispatchEvent(new CustomEvent("navigate", { detail: { page, merchandiseId } }));

        console.log(check);
    }

    public render(): TemplateResult {  
        return html`
            <div class="page-title">
                <h2>All of our merchandise</h2>
            </div>

            <div class="page-content">
                <section class="filters">
                    <p>Sort by: </p>
                    <select name="merchs-sort" id="merchsSort">
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                        <option value="Type">Type</option>
                    </select>
                    <select name="asc-or-desc" id="ascOrDesc">
                        <option value="ascending">Ascending</option>
                        <option value="descending">descending</option>
                    </select>
                </section>

                <section class="merchs">
                ${this._orderItems.map(merchandise => html`
                    <div class="merch">
                        <div class="merch-inside">
                        <div class="info" @click=${(): void => this.navigateTo(RouterPage.MerchDetail, merchandise.id)}>
                                <div class="image">
                                <img class="thumbnail" src="${merchandise.thumbnail}" alt="${merchandise.title}"/>
                                </div>
                                <div class="description">
                                    <div class="title descr">
                                        <span class="output">${merchandise.name}</span>
                                        ${console.log(merchandise.name)}
                                    </div>

                                </div>
                            </div>
                            <div class="actions">
                                <div class="view-merch">
                                    <button class="btn button primairy" @click=${(): void => this.navigateTo(RouterPage.MerchDetail, merchandise.id)}>
                                        More info
                                    </button>
                                </div>
                                <div class="buy-options">
                                    <div class="price">
                                    <p>€<span id="price-output">${merchandise.price}</span>-</p>
                                    </div>
                                    <div class="to-cart">
                                    <button class="btn button secondairy" @click=${(): Promise<void> => this.addOrderItemToCart(merchandise.product_id)}>In cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `)}
                </section>
            </div>
        `;
    }

}