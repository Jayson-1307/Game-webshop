import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
// import { RouterPage } from "../RouterPage";
import { UserService } from "../../services/UserService";


@customElement("games-library")   
export class Library extends LitElement {

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

        a {
            color: white; 
            text-decoration: none;
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
    `;

    private _userService: UserService = new UserService();

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        console.log("callback test");

        await this.getAllBills();
    }

    private _userID: number = localStorage.getItem("userId") ? parseInt(localStorage.getItem("userId") as string) : 0;

    @state()
    private _libraryGames: any[] = [];
    

    /**
     * Get all admins from database
     */
    private async getAllBills(): Promise<void> {
        console.log("get all bills");
        const result: any = await this._userService.getUserLibrary(this._userID);
        console.log(result);
    
        if (!result) {
            return;
        }
        // alert("library games fetched");

        this._libraryGames = result;
        console.log(this._libraryGames);
    
    }

    // private navigateTo(page: RouterPage, billId?: string): void {
    //     console.log("Navigating to", page, "with billId", billId);
    //     this.dispatchEvent(new CustomEvent("navigate", { detail: { page, billId } }));
    // }

    public render(): TemplateResult {  
        return html`
                <h2 class="page-title">Your owned games</h2>
    
                <section class="games">
                    ${this._libraryGames.map(game => html`
                        <div class="game">
                            <div class="game-inside">
                                <div class="info">
                                    <div class="image">
                                        <a href="${game.url}"><img src="${game.thumbnail}" alt="${game.name}"></a>
                                    </div>
                                    <div class="description">
                                        <div class="title descr">
                                            <a href="${game.url}"><span class="output">${game.name}</span></a>
                                        </div>
                                        <div class="genre descr">
                                            <span class="output" >${game.descriptionMarkdown}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="actions">
                                    <div class="view-game">
                                    <a href="${game.url}"><button class="btn button secondairy">Play Game</button></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `)}
                </section>
        `;
    }
}