import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";
// import { OrderItem } from "@shared/types/OrderItem";
import { OrderItemService } from "../services/OrderItemService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { RouterPage } from "./RouterPage";

@customElement("webshop-home")
export class Home extends LitElement {
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

        .btn,
        .button {
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

        /* ------ pageheader styling ------ */
        .pageheader {
            width: calc(100% + 40px)!important;
            margin: 0 -20px;
            position: relative;
            padding-bottom: 20px;
        }

        .pageheader .game-banner {
            width: 100%;
            position: relative;

        }

        .pageheader .game-banner img {
            width: 100%;
            max-height: 400px;
            object-fit: cover;
            width: calc(100% + 20px)!important;
            margin-left: -20px;
        }

        .pageheader .carousel {

        }

        .pageheader .carousel .inner {

        }

        .pageheader .carousel .carousel-inner .active {
            position: relative;
        }

        .pageheader .carousel .carousel-inner .add-to-cart {
            position: absolute;
            bottom: 10%;
            left: calc(50% - 92px);

        }

        .pageheader .carousel .carousel-inner .add-to-cart .btn{
            padding: 7.5px 30px
        }

        .pageheader .carousel .carousel-control-prev,
        .pageheader .carousel .carousel-control-next {
            background-color: rgba(0, 0, 0, 0.5);
            width: 10%;
        }

        .carousel-indicators {
            position: relative;
            display: flex;
            justify-content: space-between;
            gap: 15px;
            margin-left: 0;
            margin-right: 0;
            margin-top: 40px;
            padding: 0 40px;
        }

        .carousel-indicators .counter {
            display: none;
        }

        .carousel-indicators .title {
            display: inline-block;
            text-align: center;
            padding-top: 10px;
            width: 100%;
            text-indent: 0;
        }

        .carousel-indicators .indicator {
            border: none;
            background-color: transparent;
            box-sizing: inherit;
            height: unset;
            max-width: 250px;
            max-height: 50px;
            flex: 1 250px;
            margin: 0;
            padding: 0 10px;
            opacity: 0.4;
            cursor: pointer;
        }

        

        @media screen and (min-width:480px) {
             .carousel-indicators .indicator {
                max-height: 75px;
            }
        }

        @media screen and (min-width:550px) {
             .carousel-indicators .indicator {
                max-height: 100px;
            }
        }

        @media screen and (min-width:768px) {
             .carousel-indicators .indicator {
                max-height: 150px;
            }
        }

        @media screen and (min-width:991px) {
             .carousel-indicators .indicator {
                max-height: 200px;
            }
        }

        .carousel-indicators .indicator.active {
                opacity: 1.2;
            }


        .carousel-indicators .indicator img {
            border: none;
            height: 100%;
            width: 100% !important;
            margin-left: 0;
            object-fit: cover;
            max-width: 100%;
            max-height: 100%;
        }

        .carousel-indicators::before {
            display: none;
        }

        /* ------ highlighted games ------ */
        .highlighted-games {

        }

        .highlighted-games .games-wrapper {
            display: flex;
            justify-content: space-between;
            gap: 15px;
        }

        .highlighted-games .games-wrapper .game {
            max-width: 250px;
            max-height: 200px;
            display: flex;
            flex-direction: column;
            /* padding: 0 15px; */
        }

        .highlighted-games .games-wrapper .game img {
            height: 100%;
            width: 100%;
            object-fit: cover;
        }

        .highlighted-games .games-wrapper .game p {
            width: 100%;
            text-align: center;
            padding-top: 5px;
        }

        .more-games {
            margin-top: 40px;
            display: flex;
            width: 100%;
        }

        .more-games .btn.button {
            margin: 0 auto;
            paddinG: 7.5px 15px
        }


        /* ------ merch-carousel styling ------ */
        .block-title {
            text-align: center;
            width: 100%;
        }

        .merch-slider {
            position: relative;
            /* color: #000a1a; */
            display: flex;
            flex-wrap :wrap; 
        }

        .merch {
            width: 100%;
            flex: 0 100%;
            max-width: 100%; 
        }

        @media screen and (min-width: 768px) {
            .merch {
                width: 50%;
                flex: 0 50%;
                max-width: 50%; 
            }
        }

        @media screen and (min-width: 991px) {
            .merch {
                width: 33.333%;
                flex: 0 33.333%;
                max-width: 33.333%; 
            }
        }


        .merch .merch-inside {
            padding: 20px;
        }

        .merch .info .image {
            width: 100%;
            max-width: 100%;
            height: 250px;
            max-height: 250px;
        }

        .merch .info .image img{
            width: 100%;
            max-width: 100%;
            height: 250px;
            max-height: 250px;
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

        /* ------ social media ------ */
        .social-media {
            display: flex;
            flex-direction: column;
        }

        .social-media .title {
            text-align: center;
        }

        .social-media .social-media-links {
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap: 20px;
        }

        .social-media .social-media-links .media-item {
            max-height: 50px;
            max-width: 50px;
        }

        .social-media .social-media-links .media-item img{
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

    `;

    @state()
    private _isLoggedIn: boolean = false;
    

    @state()
    private _orderItems: any[] = [];


    @state()
    public _cartItemsCount: number = 0;

    @state()
    private _randomGames: any[] = [];

    @state()
    private _randomMerch: any[] = [];

    @state()
    private _activeSlideIndex: number = 0;

    private _userService: UserService = new UserService();
    private _orderItemService: OrderItemService = new OrderItemService();

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();

        await this.getWelcome();
        await this.getOrderItems();
        await this.getRandomGames();
        await this.getRandomMerch();
        this.handleNavigation;
    }

    private handleNavigation(event: CustomEvent): void {
        const nextPage: boolean = event.detail;
        this._isLoggedIn = nextPage;
    }

    private async getWelcome(): Promise<void> {
        const result: UserHelloResponse | undefined = await this._userService.getWelcome();

        if (result) {
            this._isLoggedIn = true;
            console.log(this._isLoggedIn);
            this._cartItemsCount = result.cartItems?.length || 0;
            console.log(this._isLoggedIn);
        }
    }

    private async getOrderItems(): Promise<void> {
        const result: any[] | undefined = await this._orderItemService.getAll();

        if (!result) {
            return;
        }

        this._orderItems = result;
        console.log(this._orderItems);
    }

    /**
     * Handler for the "Add to cart"-button
     *
     * @param orderItem Order item to add to the cart
     */
    // private async addItemToCart(orderItem: OrderItem): Promise<void> {
         
    //       try {
    //         await this._userService.addOrderItemToCart(orderItem.id);

    //         this._cartItemsCount ++;
    //         console.log("Cart items count updated:", this._cartItemsCount);
    //     } catch (error) {
    //         console.error("Failed to add item to cart", error);
    //     }
    

     

    // }

    private navigateTo(page: RouterPage, gameId?: string): void {
        console.log("Navigating to", page, "with gameId", gameId);
        const check: boolean = this.dispatchEvent(new CustomEvent("navigate", { detail: { page, gameId } }));
        console.log(check);
    }

    private navigate(page: RouterPage): void {
        this.dispatchEvent(new CustomEvent("navigate", { detail: page }));
    }

    private async getRandomGames(): Promise<void> {
        const result: any = await this._orderItemService.getFourRandomGames();
        if (result) {
            this._randomGames = result;
            console.log(this._randomGames);
        }
    }

    private async getRandomMerch(): Promise<void> {
        const result: any = await this._orderItemService.getThreeRandomMerch();
        if (result) {
            this._randomMerch = result;
            console.log(this._randomMerch);
        }
    }

    private setActiveSlide(index: number): void {
        const items: never[] | NodeListOf<Element> = this.shadowRoot?.querySelectorAll(".carousel-item") || [];
        items.forEach((item, i) => {
            item.classList.toggle("active", i === index);
        });
    
        this._activeSlideIndex = index;
    }
    
    private nextSlide(): void {
        const items:  never[] | NodeListOf<Element> = this.shadowRoot?.querySelectorAll(".carousel-item") || [];
        const activeIndex:number = Array.from(items).findIndex(item => item.classList.contains("active"));
        const nextIndex:number = (activeIndex + 1) % items.length;
        this.setActiveSlide(nextIndex);
    }
    
    private prevSlide(): void {
        const items: never[] | NodeListOf<Element> = this.shadowRoot?.querySelectorAll(".carousel-item") || [];
        const activeIndex: number = Array.from(items).findIndex(item => item.classList.contains("active"));
        const prevIndex: number = (activeIndex - 1 + items.length) % items.length;
        this.setActiveSlide(prevIndex);
    }


    public render(): TemplateResult {
        

        // const orderItems: TemplateResult[] = this._orderItems.map((e) => this.renderOrderItem(e));

        // if (orderItems.length === 0) {
        //     return html`<div class="order-items">Laden... Even geduld alstublieft.</div> `;
        // }

        return html`
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
            <style>
                /* Add your custom styles here */
                .carousel-item {
                    display: none;
                }
                .carousel-item.active {
                    display: block;
                }
            </style>

            <section class="pageheader block">
                <div class="game-banner">
                    <div id="carouselExampleIndicators" class="carousel">
                        
                        <div class="carousel-inner">
                            ${this._randomGames.map((game, index) => html`
                                <div class="carousel-item ${index === 0 ? "active" : ""}">
                                    <img class="d-block w-100" src="${game.thumbnail}" alt="First slide">
                                    <div class="add-to-cart">
                                        <button class="btn button secondairy" @click=${(): void => this.navigateTo(RouterPage.GameDetail, game.id)}>More information</button>
                                    </div>
                                </div>
                            `)}  
                        </div>

                        <a class="carousel-control-prev" @click=${this.prevSlide}>
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                        </a>    
                        <a class="carousel-control-next" @click=${this.nextSlide}>
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only">Next</span>
                        </a>         
                    </div>

                    <div class="carousel-indicators">
                        ${this._randomGames.map((game, index) => html`
                        <div class="indicator ${index === this._activeSlideIndex ? "active" : ""}" @click=${():void => this.setActiveSlide(index)}>
                                <img class="d-block w-100" src="${game.thumbnail}" alt="Slide ${index}">
                            </div>
                        `)}  
                    </div>

                    <div class="more-games">
                        <button class="secondairy button btn" @click=${(): void => this.navigate(RouterPage.Game)}>View more games</button>
                    </div>

                </div>
            </section>

            <section class="merch-slider for-you">
                <h2 class="block-title">Our official merchandise</h2>
            
                ${this._randomMerch.map((merch) => html`
                    <div class="merch">
                        <div class="merch-inside">
                            <div class="info">
                                <div class="image">
                                    <img class="thumbnail" src="${merch.thumbnail}" alt="${merch.name}" @click=${(): void => this.navigateTo(RouterPage.MerchDetail)}>
                                </div>
                                <div class="description">
                                    <div class="title descr">
                                        <span class="output" @click=${(): void => this.navigateTo(RouterPage.MerchDetail)}>${merch.name}</span>
                                    </div>
                                    <div class="type descr">
                                        <span class="output">${merch.type}</span>
                                    </div>

                                </div>
                            </div>
                            <div class="actions">
                                <div class="view-merch">
                                    <button class="btn button primairy" @click=${(): void => this.navigateTo(RouterPage.MerchDetail)}>
                                        More info
                                    </button>
                                </div>
                                <div class="buy-options">
                                    <div class="price">
                                        <p>€<span id="price-output">${merch.price}</span>-</p>
                                    </div>
                                    <div class="to-cart">
                                        <button class="btn button secondairy">In cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `)}
            </section>

            <section class="social-media block">
                <h2 class="title">Join our worldwide community</h2>
                <div class="social-media-links">
                    <div class="media-item">
                        <img src="assets/img/Icons/x.png" alt="X">
                    </div>
                    <div class="media-item">
                        <img src="assets/img/Icons/facebook.png" alt="facebook">
                    </div>
                    <div class="media-item">
                        <img src="assets/img/Icons/insta.png" alt="insta">
                    </div>
                    <div class="media-item">
                        <img src="assets/img/Icons/youtube.png" alt="youtube">
                    </div>
                </div>
            </section>

        `;
    }

    /**
     * Renders a single order item
     *
     * @param orderItem Order item to render
     */
    // private renderOrderItem(orderItem: any): TemplateResult {
    //     return html`
    //         <div class="order-item">
    //             <h2>${orderItem.name}</h2>
    //             <p>${orderItem.description}</p>
    //             ${this._isLoggedIn
    //                 ? html`<button @click=${async (): Promise<void> => await this.addItemToCart(orderItem)}>
    //                       Toevoegen aan winkelmandje
    //                   </button>`
    //                 : nothing}
    //         </div>
    //     `;
    // }
}



