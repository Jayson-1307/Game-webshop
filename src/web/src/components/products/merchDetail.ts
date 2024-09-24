import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { RouterPage } from "../RouterPage";
import { OrderItemService } from "../../services/OrderItemService";
import { UserService } from "../../services/UserService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";


@customElement("merch-detail")   
export class MerchDetail extends LitElement {
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

        /* ------ merch detail page general ------ */
        .pageheader {
            width: 100%;
            max-height: 400px;
            margin: 0 -20px;
            position: relative;
            display: flex;
            justify-content: row;
            flex-wrap: wrap;
        }

        .merch-images {
            max-height: 400px;
        }

        .merch-images img {
            max-height: 400px;
            object-fit: contain;
            width: 100%;
        }

        .pageheader .merch-banner img {
            width: 100%;
            max-height: 400px;
            object-fit: cover;
            width: calc(100% + 40px);
            margin-left: -20px;
        }

        .pageheader .merch-actions {
            max-height: 100%;
            height: 100%;
        }

        
        .pageheader .action {
            padding: 10px 0;
        }

        .in-stock {
            color: green;
        }
        
        .out-of-stock {
            color: red
        }

        .pageheader .add-to-cart {
            
        }

        .pageheader .add-to-cart .button {
            padding: 7.5px 50px;
            font-size: 20px;
        }

        .merch-info {
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


        .merch-bottom {
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

        /* ------ merch-carousel styling ------ */
        .merch-bottom .carousel {
            width: 100%;
        }

        .merch-bottom .carousel-inner {
            padding: 0 190px;
        }

        .merch-bottom .carousel-item.active{
            display: flex;
        }

        .merch-bottom .carousel-control-prev, .carousel-control-next {
            
        }


        .merch {
            width: 33.333%;
            flex: 0 33.333%;
            max-width: 33.333%; 
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

        .no-stock {
            background-color:grey;
        }

        p {
            font-size: 20px;
        }

        .price {
            font-size: 24px;;
        }

    `;

    // The ID of the game to be displayed
    private merchandiseId: string | null = null;

    // Details of the game fetched from the service
    private merchDetail: any = null;

    // Instance of OrderItemService to fetch game details
    private _orderItemService: OrderItemService = new OrderItemService();

    private _userService: UserService = new UserService();

    @state() private _isLoggedIn: boolean = false;
    private _getThreeRelatedItems: any[] = [];


    /**
     * Lifecycle method called when the component is added to the DOM.
     * Fetches the game details when the component is first connected.
     */
    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.checkLoginStatus();
        await this.fetchMerchDetail();
        console.log(this.merchDetail.item_type, this.merchDetail.type);
        // await this._orderItemService.getThreeRelatedItems(this.merchDetail.type);
        if (this.merchDetail && this.merchDetail.type) {
            const merchId: string = this.merchandiseId || ""; // Use an empty string if merchandiseId is null
            this._getThreeRelatedItems = await this._orderItemService.getThreeRelatedItems(this.merchDetail.type, merchId);
            console.log("Related items:", this._getThreeRelatedItems); // Debug log
        }
        this.requestUpdate();
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


    private navigateTo(page: RouterPage, _merchandiseId?: string): void {
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
                
                const itemAdded: boolean = await this._orderItemService.addOrderItemToCart(itemId);
                if (!itemAdded) {
                    alert("Merch is already in the cart");
                } else if (this.merchDetail.quantity <= 0) {
                    alert("Item is out of stock");
                    
                } else {
                    this.dispatchEvent(new CustomEvent("added-product-success", { bubbles: true, composed: true }));
                    alert("Merchandise item added to cart");
                }
        
            } catch (error) {
                console.error("Failed to add item to cart", error);
            }
        }

    /**
     * Fetches the game details using the game ID.
     * Updates the component with the fetched game details.
     */
    private async fetchMerchDetail(): Promise<void> {
        console.log(this.merchandiseId);
        if (this.merchandiseId) {
            this.merchDetail = await this._orderItemService.getMerchById(this.merchandiseId);
            this.requestUpdate();

            console.log(this.merchDetail);
        }
    }

    private checkStock():any{
        if (this.merchDetail.quantity > 0) {
            return html`
                <p id="inStock" class="in-stock">${this.merchDetail.quantity} items left in stock</p>
            `;
        } else {
            return html`
                <p id="outOfStock" class="out-of-stock">Out of Stock</p> 
            `;
        }
    }

    private addToCartButton():any{
        if(this.merchDetail.quantity > 0) {
            return html`<button class="btn button secondairy" @click=${(): Promise<void> => this.addOrderItemToCart(this.merchDetail.product_id)}>Add to cart</button>`;
        } else {
            return html`<h3>Come back later!</h3>`;
        }
    }

    private showAmount():any{
        if(this.merchDetail.quantity > 0) {
            return html`                                    
                <div class="amount action">
                    <input type="number" value="1" min="1" >
                </div>
            `;
        } else {
            return html``;
        }
    }
   

    public render(): TemplateResult {  
        return html`
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

            <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>

            <section class="page-title">
                <h2 class="merch-title">Merch</h2>
            </section>

            <section class="page-content">
                <div class="merch-detail">
                   <div class="detail-content">
                        <div class="pageheader block">
                            <div class="merch-images block-left block-50">
                                <div class="inner">
                                    <img src="${this.merchDetail.thumbnail}" alt="Game banner">
                                </div>
                            </div>
                            <div class="merch-actions block-right block-50">
                                <div class="inner">
                                    <div class="name action">
                                        <h2>${this.merchDetail.name}</h2>
                                    </div>
                                    <div class="type action">
                                        <p>${this.merchDetail.type}</p>
                                    </div>
                                    <div class="price">
                                        <p>€${this.merchDetail.price}</p>
                                    </div>
                                    <div class="sizes action">
                                        <select name="sizes" id="merchSizes">
                                            <option value="3">XS</option>
                                            <option value="4">S</option>
                                            <option value="5">M</option>
                                            <option value="6">L</option>
                                            <option value="7">XL</option>
                                        </select>
                                    </div>
                                    <div class="in-stock-part">
                                        ${this.checkStock()}
                                    </div>
                                    ${this.showAmount()}
                                    <div class="add-to-cart action">
                                        <!-- <button class="btn button secondairy" @click=${(): Promise<void> => this.addOrderItemToCart(this.merchDetail.product_id)}>Add to cart</button> -->
                                        ${this.addToCartButton()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="merch-info block">
                            <div class="block-left block-50">
                                <div class="description inner">
                                    <p>
                                    
                                    </p>
                                </div>
                            </div>
                            <div class="block-right block-50">
                                <div class="extra-info inner">       
                                                 
                                </div>
                            </div>
                        </div>


                        <div class="merch-bottom for-you">
                            <div class="bottom-title">
                                <h2>You might also like: </h2>
                            </div>
                            <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                                <div class="carousel-inner">
                                    <div class="carousel-item active">
                                        ${this._getThreeRelatedItems.map((merchandise: any) => html`
                                                <div class="merch">
                                                    <div class="merch-inside">
                                                        <div class="info">
                                                            <div class="image">
                                                                <img class="thumbnail" src="${merchandise.thumbnail}" alt="merch" @click=${(): void => this.navigateTo(RouterPage.MerchDetail, merchandise.id)}>
                                                            </div>
                                                            <div class="description">
                                                                <div class="title descr">
                                                                    <span class="output" @click=${(): void => this.navigateTo(RouterPage.MerchDetail, merchandise.id)}>${merchandise.title}</span>
                                                                </div>
                                                                <div class="type descr">
                                                                    <span class="output">${merchandise.type}</span>
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
                                                                    <button class="btn button secondairy">In cart</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>`
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>

                   </div>
                </div>
            </section>
        `;
    }
}