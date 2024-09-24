import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { OrderItemService } from "../../services/OrderItemService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { UserService } from "../../services/UserService";
import { RouterPage } from "../RouterPage";

/**
 * GameDetail component to display details of a specific game.
 */
@customElement("game-detail")
export class GameDetail extends LitElement {

    /**
     * CSS styles specific to the GameDetail component.
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

        /* ------ Game detail page general ------ */
        .pageheader {
            width: 100%;
            max-height: 400px;
            margin: 0 -20px;
            position: relative;
        }

        .pageheader .game-banner {
            width: 100%;
            max-height: 400px;
            position: relative;

        }

        .pageheader .game-banner img {
            width: 100%;
            max-height: 400px;
            object-fit: cover;
            width: calc(100% + 40px);
            margin-left: -20px;
        }

        .pageheader .add-to-cart {
            position: absolute;
            right: 0;
            bottom: 20px;
        }

        .pageheader .add-to-cart .button {
            padding: 7.5px 50px;
            font-size: 20px;
        }

        .game-info {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
        }

        .block-50 {
            width: 100%;
            flex: 0 100%;
            max-width: 100%;
        }

        .block {
            margin: 60px 0;
        }

        .game-images {
            max-height: 400px;
        }

        .game-images img {
            max-height: 400px;
            object-fit: contain;
        }

        .game-bottom {
            display: flex;
            flex-wrap: wrap;
        }

        @media screen and (min-width: 768px) {
            .block-50 {
                width: 50%;
                flex: 0 50%;
                max-width: 50%;
            }

            .block-left .inner {
                padding-right: 40px;
            }

            .block-right .inner {
                padding-left: 40px;
            }
        }

    `;
    // The ID of the game to be displayed
    private gameId: string | null = null;

    // Details of the game fetched from the service
    private gameDetail: any = null;

    // Instance of OrderItemService to fetch game details
    private _orderItemService: OrderItemService = new OrderItemService();

    private _userService: UserService = new UserService();

    @state() private _isLoggedIn: boolean = false;

    /**
     * Lifecycle method called when the component is added to the DOM.
     * Fetches the game details when the component is first connected.
     */
    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.checkLoginStatus();
        await this.fetchGameDetail();
    }

    private async checkLoginStatus(): Promise<void> {
        try {
            const result: UserHelloResponse | undefined = await this._userService.getWelcome();
            if (result) {
                this._isLoggedIn = true;
            } else {
                this._isLoggedIn = false;
            }
        } catch (error) {
            console.error("Error checking login status:", error);
        }

        this.requestUpdate();
    }

    private navigateTo(page: RouterPage): void {
        this.dispatchEvent(new CustomEvent("navigate", { detail: page }));
    }

        /**
     * Voegt een order item toe aan de winkelwagen.
     * @param itemId - Het ID van het item om aan de winkelwagen toe te voegen
     */
        private async addOrderItemToCart(itemId: number): Promise<void> {
            try {
                if (!this._isLoggedIn) {
                    const confirmed: boolean = confirm("You need to be logged in to add items to your cart. Do you want to log in now?");
                    if (confirmed) {
                        this.navigateTo(RouterPage.Login);
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
                    this.dispatchEvent(new CustomEvent("added-product-success", { bubbles: true, composed: true }));
                    alert("Game added to cart");
                }
        
            } catch (error) {
                console.error("Failed to add item to cart", error);
            }
        }

    /**
     * Fetches the game details using the game ID.
     * Updates the component with the fetched game details.
     */
    private async fetchGameDetail(): Promise<void> {
        if (this.gameId) {
            this.gameDetail = await this._orderItemService.getGameById(this.gameId);
            this.requestUpdate();

            console.log(this.gameDetail);
        }
    }

    private checkAuthors(): TemplateResult {
        if (this.gameDetail.authors) {
            return html`
                <h4>Authors</h4>
                <p>${this.gameDetail.authors.join(", ")}</p>
            `;
        } else if (this.gameDetail.authors_text){
            return html`
                <h4>Authors</h4>
                <p>${this.gameDetail.authors_text}</p>
            `;
        } else {
            return html`
                <h4>Authors</h4>
                <p>Unknown</p>
            `;
        }
    }

    private checkTags(): TemplateResult {
        if (this.gameDetail.tags) {
            return html`
                <h4>Tags</h4>
                <p>${this.gameDetail.tags.join(", ")}</p>
            `;
        } else if (this.gameDetail.tags_text){
            return html`
                <h4>Tags</h4>
                <p>${this.gameDetail.tags_text}</p>
            `;
        } else {
            return html`
                <h4>Authors</h4>
                <p>Unknown</p>
            `;
        }
    }


    /**
     * Renders the GameDetail component.
     * @returns TemplateResult - The HTML template for the component.
     */
    public render(): TemplateResult {
        return html`
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

            <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>

            <section class="page-title">
                <h2 class="game-title">${this.gameDetail?.name}</h2>
            </section>

            <section class="page-content">
                <div class="game-detail">
                   <div class="detail-content">
                        <div class="pageheader block">
                            <div class="game-banner">
                                <img src="${this.gameDetail?.thumbnail}" alt="Game banner">
                            </div>
                            <div class="add-to-cart">
                                <button class="btn button secondairy" @click=${(): Promise<void> => this.addOrderItemToCart(this.gameDetail.product_id)}>Add to cart</button>
                            </div>
                        </div>
                        <div class="game-info block">
                            <div class="block-left block-50">
                                <div class="description inner">
                                    <h4>Description</h4>
                                    <p>${this.gameDetail?.descriptionMarkdown}</p>
                                </div>
                            </div>
                            <div class="block-right block-50">
                                <div class="extra-info inner">
                                    <h3>€${this.gameDetail?.price}-</h3>
                                </div>
                            </div>
                        </div>
                        
                        <div class="game-bottom block">
                            <div class="block-left block-50">
                                <div class="description inner">
                                    <p>${this.checkAuthors()}</p>
                                </div>
                            </div>
                            <div class="block-right block-50">
                                <p>${this.checkTags()}</p>
                                
                            </div>
                        </div>
                   </div>
                </div>
            </section>


        `;
    }
}