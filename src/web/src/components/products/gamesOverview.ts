import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { OrderItemService } from "../../services/OrderItemService";
import { RouterPage } from "../RouterPage";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { UserService } from "../../services/UserService";

/**
 * Webshop Games Overview component.
 */
@customElement("webshop-games-overview")
export class GamesOverview extends LitElement {

    /**
     * CSS styles specific to the GamesOverview component.
     */
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

        /* ------ games block styling ------ */
        .games {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-content: stretch;
        }

        .game {
            width: 100%;
            flex: 0 100%;
            max-width: 100%;
            margin-bottom: 20px;
        }

        .game .game-inside {
            padding: 20px;
            height: calc(100% - 40px);
            max-height: calc(100% - 40px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .game .info .image {
            width: 100%;
            max-width: 100%;
            height: 200px;
            max-height: 200px;
        }
            
        .game .info .image img{
            width: 100%;
            max-width: 100%;
            height: 200px;
            max-height: 200px;
            object-fit: cover;
            border-radius: 10px;
            cursor: pointer;
        }

        .game .info .description {
            padding-top: 10px;
        }

        .game .info .description .descr {
            padding: 3px 0;
        }

        .game .info .description .title {
            font-size: 20px;
            cursor: pointer;
        }

        .game .info .description .genre {
            font-family: cursive;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .game .actions {
            padding-top: 15px;
            display: flex;
            flex-wrap: wrap;
            
        }

        .game .actions .view-game {
            width: 100%;
            max-width: 100%;
        }
        
        .game .actions .view-game .btn.button{
            width: 100%;
            max-width: 100%;
            font-weight: bold;

        }

        .game .actions .buy-options {
            display: flex;
            width: 100%;
            padding: 10px 0;
        }

        .game .actions .buy-options .price {
            width: 50%;
            flex: 0 50%;
            max-width: 50%;
            font-size: 24px;
        }

        .game .actions .buy-options .price p {
            margin: 0;
            font-weight: bold;
        }

        .game .actions .buy-options .to-cart {
            width: 50%;
            flex: 0 50%;
            max-width: 50%;
        }

        .game .actions .buy-options .to-cart .button {
            width: 100%;
            margin: auto;
            font-weight: italic;
        }


        @media screen and (min-width: 480px) {
            .game {
                width: 50%;
                flex: 0 50%;
                max-width: 50%;
            }
        }

        @media screen and (min-width: 768px) {
            .game {
                width: 33.333%;
                flex: 0 33.333%;
                max-width: 33.333%;
            }
        }

        @media screen and (min-width: 992px) {
            .game {
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

        .filter-submit {
            padding: 5px 10px;
            cursor: pointer;
            margin: auto 0 auto 10px;
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
    private _sortby: string = "date";
    private _orderby: string = "ASC";

    /**
     * Lifecycle method called when the component is added to the DOM.
     * Fetches all games when the component is first connected.
     */
    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.checkLoginStatus();

        await this.getAllGames(this._sortby, this._orderby);
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
        
        const gameInLibrary: boolean = await this._orderItemService.isGameInLibrary(itemId);

        if (gameInLibrary) {
            alert("Game is already in library");
            return;
        }

        const addToCart: boolean = await this._orderItemService.addOrderItemToCart(itemId);

        if (!addToCart) {
            alert("Game is already in cart");
            return;
        } else {
            this._cartItemsCount += 1;
            this.dispatchEvent(new CustomEvent("added-product-success", { bubbles: true, composed: true }));
            alert("Game added to cart");

        }

        console.log(this._cartItemsCount);

    } catch (error) {
        console.error("Failed to add item to cart", error);
    }
}

    /**
     * Navigates to a specified page.
     * @param page - The page to navigate to
     * @param gameId - (Optional) The ID of the game to view
     */
    private navigateTo(page: RouterPage, gameId?: string): void {
        console.log("Navigating to", page, "with gameId", gameId);

        // Dispatch a custom event named "navigate" with the detail containing the target page and game ID
        const check: boolean = this.dispatchEvent(new CustomEvent("navigate", { detail: { page, gameId } }));

        console.log(check);
    }

    /**
    * Fetches all available order items (games).
    */
    private async getAllGames(sort: string = "date", order: string = "ASC"): Promise<void> {
        const result: any = await this._orderItemService.getAllGames(sort, order);

        if (!result) {
            return;
        }

        this._orderItems = result;
    }

    /**
     * Handles form submission to filter games.
     * @param event - The form submission event
     */
    private async handleFilterSubmit(event: Event): Promise<void> {
        event.preventDefault();
        await this.getAllGames(this._sortby, this._orderby);
    }

    /**
     * Handles input events for the filter fields.
     * Updates corresponding state variables based on user input.
     * @param event The input event.
     */
    private handleInput(event: Event): void {
        const target: HTMLSelectElement = event.target as HTMLSelectElement;
        const id: string = target.id;
        const value: string = target.value;

        if (id === "gamesSort") {
            this._sortby = value;
        } else if (id === "ascOrDesc") {
            this._orderby = value;
        }
    }

    private handleImageError(event: Event): void {
        const img:HTMLImageElement = event.target as HTMLImageElement;
        console.error("Failed to load image:", img.src);
    }

    /**
     * Renders the GamesOverview component.
     * @returns TemplateResult - The HTML template for the component.
     */
    public render(): TemplateResult {
        return html`
            <div class="page-title">
                <h2>All of our games</h2>
            </div>
    
            <div class="page-content">
                <form @submit=${this.handleFilterSubmit}>
                    <section class="filters">
                        <p>Sort by: </p>
                        <select name="games-sort" id="gamesSort" @input=${this.handleInput} .value=${this._sortby}>
                            <option value="date">Date</option>
                            <option value="price">Price</option>
                            <option value="name">Name</option>
                            <option value="authors">Author</option>
                        </select>
                        <select name="asc-or-desc" id="ascOrDesc" @input=${this.handleInput} .value=${this._orderby}>
                            <option value="ASC">Ascending</option>
                            <option value="DESC">Descending</option>
                        </select>
                        <button class="button btn secondairy filter-submit" type="submit">Submit</button>
                    </section>
                </form>
    
                <section class="games">
                    ${this._orderItems.map(game => html`
                        <div class="game">
                            <div class="game-inside">
                                <div class="info" @click=${():void => this.navigateTo(RouterPage.GameDetail, game.id)}>
                                    <div class="image">
                                        <img src="${game.thumbnail}" alt="${game.title}" @error="${this.handleImageError}">
                                    </div>
                                    <div class="description">
                                        <div class="title descr">
                                            <span class="output">${game.title}</span>
                                        </div>
                                        <div class="genre descr">
                                            <span class="output">${game.descriptionMarkdown}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="actions">
                                    <div class="view-game" @click=${():void => this.navigateTo(RouterPage.GameDetail, game.id)}>
                                        <button class="btn button primairy">More info</button>
                                    </div>
                                    <div class="buy-options">
                                        <div class="price">
                                            <p>€<span id="price-output">${game.price}</span>-</p>
                                        </div>
                                        
                                        <div class="to-cart">
                                            <button class="btn button secondairy" @click=${(): Promise<void> => this.addOrderItemToCart(game.product_id)}>In cart</button>
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
