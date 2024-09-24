import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { RouterPage } from "./RouterPage";
import "./Login";
import "./Home";
import "./Register";
import "./Navbar";
import "./Footer";
import "./passwordRecovery";
import "./products/gamesOverview";
import "./account/library";
import "./account/personalPage";
import "./account/profile";
import "./checkout/step1";
import "./checkout/step2";
import "./checkout/step3";
import "./checkout/step4";
import "./products/gamesOverview";
import "./products/gameDetail";
import "./products/merchOverview";
import "./products/merchDetail";
import "./Admin/AdminHome";
import "./Admin/overviews/AdminGameOverview";
import "./Admin/overviews/AdminMerchOverview";
import "./Admin/overviews/AdminUserOverview";
import "./Admin/overviews/AdminOverview";
import "./Admin/overviews/AdminEmployeesOverview";
import "./Admin/overviews/AdminNewsOverview";
import "./Admin/overviews/AdminSalesOverview";   
import "./Admin/overviews/AdminBillsOverview";   
import "./BillDetail";   
import "./Admin/CreatePages/CreateAccount";
import "./Admin/CreatePages/CreateGame";
import "./Admin/CreatePages/CreateMerch";
import "./Admin/CreatePages/CreateNews";
import "./Admin/EditPages/EditAccount";
import "./news/NewsOverview";
import "./news/NewsDetail";
import "./Admin/EditPages/EditGame";
import "./Admin/EditPages/EditMerch";
import "./Admin/EditPages/EditNews";



/**
 * Root component for the webshop
 */
@customElement("webshop-root")
export class Root extends LitElement {
    

    /**
     * Styles for the root component
     */
    public static styles = css`
        .wrapper {
            display: flex;
            flex-direction: column;
            flex: 1;
        }

        main {
            display: flex;
            justify-content: center;
            padding: 20px;
            max-width: 1260px;
            width: 100%;
            margin: 0 auto 40px;
            height: 100%;
            
            .container {
                width: 100%;
            }
        }

    `;



    // State for the current page being viewed
    

    @state()
        private _currentPage: RouterPage = RouterPage.Home;

    // State for whether the user is logged in
    @state()
    private _isLoggedIn: boolean = false;

    // State for the number of items in the cart
    @state()
    private _cartItemsCount: number = 0;

    // Service for user-related operations
    private _userService: UserService = new UserService();

    private _authLevel: string = "";

   

    /**
     * Lifecycle method called when the component is added to the DOM
     */
    public async connectedCallback(): Promise<void> {
        await this.getAuthlevel();
        super.connectedCallback();
        await this.getWelcome();
        window.addEventListener("admin-login-success", this.handleLoginSuccess);
        

        if (this._authLevel === "admin" || this._authLevel === "employee") {
             this._currentPage = RouterPage.AdminHome;
        } else {
             this._currentPage = RouterPage.Home;
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        window.removeEventListener("login-success", this.handleLoginSuccessWrapper);
        

    }

    private handleLoginSuccessWrapper = (): void => {
        this.handleLoginSuccess().catch((error: any) => console.error("Error handling login success:", error));
    };

    private handleLoginSuccess(): any {
        // Update login status and cart items on login success
        this.requestUpdate();
    };

    public async getAuthlevel(): Promise<void> {
        this._authLevel = await this._userService.getAuthLevel();
        console.error(this._authLevel);
    }   

    /**
     * Check if the current token is valid and update the cart item total
     */
    private async getWelcome(): Promise<void> {
        const result: UserHelloResponse | undefined = await this._userService.getWelcome();

        if (result) {
            this._isLoggedIn = true;
            this._cartItemsCount = result.cartItems?.length || 0;
        }
    }

    // Optional gameId for navigation
    // user pages
    private gameId: number | undefined;
    private merchandiseId: number | undefined;
    private newsId: number | undefined;
    // private merchId: number | undefined;
    private CustomerbillId: string = "";
    private billId: string = "";

    // admin pages
    private userId: string = "";
    private adminNewsId: string = "";
    private adminGameId: string = "";
    private adminMerchId: string = "";


    /**

    /**
     * Handle navigation events to change the current page
     * @param event - The navigation event
     */
   private handleNavigation(event: CustomEvent): void {
    // Extract the next page from the event detail
    let nextPage: RouterPage = event.detail;

    // Extract the gameId from the event detail and store it for potential use
    // user pages
    this.gameId = event.detail.gameId;
    // this.merchId = event.detail.merchId;
    this.newsId = event.detail.newsId;
    this.billId = event.detail.billId;

    // Extract the gameId from the event detail and store it for potential use
    this.gameId = event.detail.gameId;
    this.CustomerbillId = event.detail.CustomerbillId;
    this.merchandiseId = event.detail.merchandiseId;

    // If a gameId is present, navigate to the GameDetail page
    if (event.detail.gameId) {
        nextPage = RouterPage.GameDetail;
    }
    if (event.detail.CustomerbillId) {
        nextPage = RouterPage.checkoutStepFour;
    }
    if (event.detail.merchandiseId) {
        nextPage = RouterPage.MerchDetail;
    }

    this._currentPage = nextPage;
    
    // admin pages
    this.userId = event.detail.userId;
    this.adminNewsId = event.detail.adminNewsId;
    this.adminGameId = event.detail.adminGameId;
    this.adminMerchId = event.detail.adminMerchId;

    // If a gameId is present, navigate to the GameDetail page
    // user pages
    
    if (event.detail.gameId) {
        nextPage = RouterPage.GameDetail;
    }
    // if (event.detail.merchId) {
    //     nextPage = RouterPage.MerchDetail;
    // }
    if (event.detail.newsId) {
        nextPage = RouterPage.NewsDetail;
    }

    if (event.detail.billId) {
        nextPage = RouterPage.BillDetail;
    }


    // admin pages
     if (event.detail.userId) {
        nextPage = RouterPage.EditAccount;
    }
    if (event.detail.adminGameId) {
        nextPage = RouterPage.EditGame;
    }
    if (event.detail.adminMerchId) {
        nextPage = RouterPage.EditMerch;
    }
    if (event.detail.adminNewsId) {
        nextPage = RouterPage.EditNews;
    }

    

    // Update the current page to the next page determined by the event detail
    this._currentPage = nextPage;
}

   

    /**
     * Render the root component
     * @returns The template result for rendering
     */
    protected render(): TemplateResult {
        let contentTemplate: TemplateResult;

        // Switch statement to determine which page to render based on the current page
        switch (this._currentPage) {
            case RouterPage.Login:
                contentTemplate = html`<webshop-login @navigate="${this.handleNavigation}"></webshop-login>`;
                break;

            case RouterPage.passwordRecovery:
                contentTemplate = html`<webshop-password-recovery @navigate="${this.handleNavigation}"></webshop-password-recovery>`;
                break;

            case RouterPage.Register:
                contentTemplate = html`<webshop-register @navigate="${this.handleNavigation}"></webshop-register>`;
                break;

            case RouterPage.Game:
                contentTemplate = html`<webshop-games-overview @navigate="${this.handleNavigation}"></webshop-games-overview>`;
                break;

            case RouterPage.News:
                contentTemplate = html`<webshop-news-overview @navigate="${this.handleNavigation}"></webshop-news-overview>`;
                break;

            case RouterPage.Merch:
                contentTemplate = html`<merch-overview @navigate="${this.handleNavigation}"></merch-overview>`;
                break;

            case RouterPage.GameDetail:
                contentTemplate = html`<game-detail .gameId="${this.gameId}" @navigate="${this.handleNavigation}"></game-detail>`;
                break;

            case RouterPage.MerchDetail:
                contentTemplate = html`<merch-detail .merchandiseId="${this.merchandiseId}" @navigate="${this.handleNavigation}"></merch-detail>`;
                break;

            case RouterPage.NewsDetail: 
                contentTemplate = html`<news-detail .newsId="${this.newsId}" @navigate="${this.handleNavigation}"></news-detail>`;
                break;

            case RouterPage.checkoutStepOne:
                contentTemplate = html`<step-one @navigate="${this.handleNavigation}"></step-one>`;
                break;

            case RouterPage.checkoutStepTwo:
                contentTemplate = html`<step-two @navigate="${this.handleNavigation}"></step-two>`;
                break;

            case RouterPage.checkoutStepThree:
                contentTemplate = html`<step-three @navigate="${this.handleNavigation}"></step-three>`;
                break;

            case RouterPage.checkoutStepFour:
                contentTemplate = html`<step-four .CustomerbillId="${this.CustomerbillId}" @navigate="${this.handleNavigation}"></step-four>`;
                break;

            case RouterPage.Library:
                contentTemplate = html`<games-library @navigate="${this.handleNavigation}"></games-library>`;
                break;

            case RouterPage.PersonalPage:
                contentTemplate = html`<personal-page @navigate="${this.handleNavigation}"></personal-page>`;
                break;

            case RouterPage.BillDetail:
                contentTemplate = html`<bill-detail .billId="${this.billId}" @navigate="${this.handleNavigation}"></bill-detail>`;
                break;

            case RouterPage.Profile:
                contentTemplate = html`<profile-page @navigate="${this.handleNavigation}"></profile-page>`;
                break;

            // ------ admin pages ------
            
            // Admin home + overviews
            case RouterPage.AdminHome:
                contentTemplate = html`<admin-home @navigate="${this.handleNavigation}"></admin-home>`;
                break;

            case RouterPage.AdminGameOverview:
                contentTemplate = html`<admin-game-overview @navigate="${this.handleNavigation}"></admin-game-overview>`;
                break;

            case RouterPage.AdminMerchOverview:
                contentTemplate = html`<admin-merch-overview @navigate="${this.handleNavigation}"></admin-merch-overview>`;
                break;
            
            case RouterPage.AdminOverview:
                contentTemplate = html`<admin-overview @navigate="${this.handleNavigation}"></admin-overview>`;
                break;

            case RouterPage.AdminUserOverview:
                contentTemplate = html`<admin-users-overview @navigate="${this.handleNavigation}"></admin-users-overview>`;
                break;

            case RouterPage.AdminEmployeesOverview:
                contentTemplate = html`<admin-employee-overview @navigate="${this.handleNavigation}"></admin-employee-overview>`;
                break;

            case RouterPage.AdminNewsOverview:
                contentTemplate = html`<admin-news-overview @navigate="${this.handleNavigation}"></admin-news-overview>`;
                break;

            case RouterPage.SalesOveview:
                contentTemplate = html`<sales-overview @navigate="${this.handleNavigation}"></sales-overview>`;
                break;

            case RouterPage.AdminBillsOverview:
                contentTemplate = html`<admin-bills-overview @navigate="${this.handleNavigation}"></admin-bills-overview>`;
                break;

            // Admin Create pages
            case RouterPage.CreateAccount:
                contentTemplate = html`<create-account @navigate="${this.handleNavigation}"></create-account>`;
                break;
            
            case RouterPage.CreateGame:
                contentTemplate = html`<create-game @navigate="${this.handleNavigation}"></create-game>`;
                break;

            case RouterPage.CreateMerch:
                contentTemplate = html`<create-merch @navigate="${this.handleNavigation}"></create-merch>`;
                break;

            case RouterPage.CreateNews:
                contentTemplate = html`<create-news @navigate="${this.handleNavigation}"></create-news>`;
                break;

            // Admin Edit pages
            case RouterPage.EditAccount:
                contentTemplate = html`<edit-account .userId="${this.userId}" @navigate="${this.handleNavigation}"></edit-account>`;
                break;

            case RouterPage.EditGame:
                contentTemplate = html`<edit-game .adminGameId="${this.adminGameId}" @navigate="${this.handleNavigation}"></edit-game>`;
                break;
                    
            case RouterPage.EditNews:
                    contentTemplate = html`<edit-news .adminNewsId="${this.adminNewsId}" @navigate="${this.handleNavigation}"></edit-news>`;
                    break;

            case RouterPage.EditMerch:
                    contentTemplate = html`<edit-merch .adminMerchId="${this.adminMerchId}" @navigate="${this.handleNavigation}"></edit-merch>`;
                    break;



            default:
                contentTemplate = html`<webshop-home @navigate="${this.handleNavigation}"></webshop-home>`;
                break;
                
        }

        // Render the navigation bar, main content, and footer
        return html`
        <div class="wrapper">
            <webshop-navbar
                .currentPage=${this._currentPage}
                .isLoggedIn=${this._isLoggedIn}
                .cartItemsCount=${this._cartItemsCount}
                @navigate=${this.handleNavigation}
            ></webshop-navbar>
                
            <main>
                <div class="container">
                    ${contentTemplate}
                </div>
            </main>
            <webshop-footer></webshop-footer>
        </div>
            
        `;
    }

}
