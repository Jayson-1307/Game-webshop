import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { RouterPage } from "../RouterPage";
import { AdminService } from "../../services/AdminService";

/**
 * Webshop news Overview component.
 */
@customElement("webshop-news-overview")
export class NewsOverview extends LitElement {

    /**
     * CSS styles specific to the newsOverview component.
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

        /* ------ news block styling ------ */
        .news {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-content: stretch;
        }

        .new {
            width: 100%;
            flex: 0 100%;
            max-width: 100%;
            margin-bottom: 20px;
        }

        .new .new-inside {
            padding: 20px;
            height: calc(100% - 40px);
            max-height: calc(100% - 40px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .new .info .image {
            width: 100%;
            max-width: 100%;
            height: 200px;
            max-height: 200px;
        }
            
        .new .info .image img{
            width: 100%;
            max-width: 100%;
            height: 200px;
            max-height: 200px;
            object-fit: cover;
            border-radius: 10px;
            cursor: pointer;
        }

        .new .info .description {
            padding-top: 10px;
        }

        .new .info .description .descr {
            padding: 3px 0;
        }

        .new .info .description .title {
            font-size: 20px;
            cursor: pointer;
        }

        .new .info .description .genre {
            font-family: cursive;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .new .actions {
            padding-top: 15px;
            display: flex;
            flex-wrap: wrap;
            
        }

        .new .actions .view-new {
            width: 100%;
            max-width: 100%;
        }
        
        .new .actions .view-new .btn.button{
            width: 100%;
            max-width: 100%;
            font-weight: bold;

        }

        .new .actions .buy-options {
            display: flex;
            width: 100%;
            padding: 10px 0;
        }

        .new .actions .buy-options .price {
            width: 50%;
            flex: 0 50%;
            max-width: 50%;
            font-size: 24px;
        }

        .new .actions .buy-options .price p {
            margin: 0;
            font-weight: bold;
        }

        .new .actions .buy-options .to-cart {
            width: 50%;
            flex: 0 50%;
            max-width: 50%;
        }

        .new .actions .buy-options .to-cart .button {
            width: 100%;
            margin: auto;
            font-weight: italic;
        }


        @media screen and (min-width: 480px) {
            .new {
                width: 50%;
                flex: 0 50%;
                max-width: 50%;
            }
        }

        @media screen and (min-width: 768px) {
            .new {
                width: 33.333%;
                flex: 0 33.333%;
                max-width: 33.333%;
            }
        }

        @media screen and (min-width: 992px) {
            .new {
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
    public _cartItemsCount: number = 0;

    // Instance of AdminService to manage admin-related operations, but in this case only to fetch news.
    private _adminService: AdminService = new AdminService();

    // State to store the order items to be displayed
    @state()
    private _orderItems: any[] = [];




    /**
     * Lifecycle method called when the component is added to the DOM.
     * Fetches all news when the component is first connected.
     */
    public async connectedCallback(): Promise<void> {
        super.connectedCallback();

        await this.getAllnews();
    }

    /**
     * Navigates to a specified page.
     * @param page - The page to navigate to
     * @param newId - (Optional) The ID of the new to view
     */
    private navigateTo(page: RouterPage, newsId?: string): void {
        console.log("Navigating to", page, "with newId", newsId);

        // Dispatch a custom event named "navigate" with the detail containing the target page and new ID
        const check: boolean = this.dispatchEvent(new CustomEvent("navigate", { detail: { page, newsId } }));
        
        console.log(check);
    }

    /**
    * Fetches all available order items (news).
    */
    private async getAllnews(): Promise<void> {
        const result: any = await this._adminService.getAllNewsItems();

        if (!result) {
            return;
        }

        this._orderItems = result;

    }

    /**
     * Renders the newsOverview component.
     * @returns TemplateResult - The HTML template for the component.
     */
    public render(): TemplateResult {
        return html`
            <div class="page-title">
                <h2>All of our news</h2>
            </div>
    
            <div class="page-content">
                <section class="filters">
                    <p>Sort by: </p>
                    <select name="news-sort" id="newsSort">
                        <option value="date">Date</option>
                        <option value="price">Price</option>
                        <option value="name">Name</option>
                        <option value="author">Author</option>
                        <option value="genre">Genre</option>
                    </select>
                    <select name="asc-or-desc" id="ascOrDesc">
                        <option value="ascending">Ascending</option>
                        <option value="descending">Descending</option>
                    </select>
                </section>
    
                <section class="news">
                    ${this._orderItems.map(news => html`
                        <div class="new">
                            <div class="new-inside">
                                <div class="info" @click=${(): void => this.navigateTo(RouterPage.NewsDetail, news.id)}>
                                    <div class="image">
                                        <img src="${news.thumbnail}" alt="${news.title}" @error="${this.handleImageError}">
                                    </div>
                                    <div class="description">
                                        <div class="title descr">
                                            <span class="output">${news.title}</span>
                                        </div>
                                        <div class="genre descr">
                                            <span class="output" >${news.description}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="actions">
                                    <div class="view-new" @click=${(): void => this.navigateTo(RouterPage.NewsDetail, news.id)}>
                                        <button class="btn button primairy">More info</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `)}
                </section>
            </div>
        `;
    }

    private handleImageError(event: Event):void {
        const img:any = event.target as HTMLImageElement;
        console.error("Failed to load image:", img.src); // Debugging: log image loading error
    }

}
