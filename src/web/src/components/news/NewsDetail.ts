import { css, html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
// import { OrderItemService } from "../../services/OrderItemService";
import { AdminService } from "../../services/AdminService";

@customElement("news-detail")
export class NewsDetail extends LitElement {   
    /**
     * CSS styles specific to the newsDetail component.
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

        /* ------ news detail page general ------ */
        .pageheader {
            width: 100%;
            max-height: 400px;
            margin: 0 -20px;
            position: relative;
        }

        .pageheader .news-banner {
            width: 100%;
            max-height: 400px;
            position: relative;

        }

        .pageheader .news-banner img {
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

        .news-info {
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

        .news-images {
            max-height: 400px;
        }

        .news-images img {
            max-height: 400px;
            object-fit: contain;
        }

        .news-bottom {
            display: flex;
            flex-wrap: wrap;
        }

        .block-content {
            width: 100%;
            text-align: center;
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
    // The ID of the news to be displayed
    private newsId: string | null = null;

    // Details of the news fetched from the service
    private newsDetail: any = null;

    // Instance of OrderItemService to fetch news details
    private _adminService: AdminService = new AdminService();

    /**
     * Lifecycle method called when the component is added to the DOM.
     * Fetches the news details when the component is first connected.
     */
    public async connectedCallback(): Promise<void> {
        super.connectedCallback();

        await this.fetchnewsDetail();
    }

    /**
     * Fetches the news details using the news ID.
     * Updates the component with the fetched news details.
     */
    private async fetchnewsDetail(): Promise<void> {
        console.log(this.newsId);
        if (this.newsId) {
            this.newsDetail = await this._adminService.getNewsById(this.newsId);
            this.requestUpdate();

            console.log(this.newsDetail);
        } else {
            console.error("No news ID provided.");
        }
    }

    /**
     * Renders the newsDetail component.
     * @returns TemplateResult - The HTML template for the component.
     */
    public render(): TemplateResult {  
        return html`
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

            <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>

            <section class="page-title">
                <h2 class="news-title">${this.newsDetail?.title}</h2>
            </section>

            <section class="page-content">
                <div class="news-detail">
                   <div class="detail-content">
                        <div class="pageheader block">
                            <div class="news-banner">
                                <img src="${this.newsDetail?.thumbnail}" alt="news banner">
                            </div>
                        </div>
                        <div class="news-info block">
                            <div class="block-content">
                                <div class="extra-info inner">
                                    <p>${this.newsDetail?.introduction}</p>
                                </div>
                            </div>
                        </div>
                        <div class="news-bottom block">
                            <div class="block-content">
                                <div class="description inner">
                                    <p>
                                        ${this.newsDetail?.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                   </div>
                </div>
            </section>


        `;
    }
}
