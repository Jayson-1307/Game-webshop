import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
// import { UserService } from "../../../services/UserService";
import { OrderItemService } from "../../../services/OrderItemService";
import { RouterPage } from "../../RouterPage";

/**
 * Custom element based on Lit for the header of the webshop.
 *
 * @todo Most of the logic in this component is over-simplified. You will have to replace most of if with actual implementions.
 */
@customElement("admin-game-overview")
export class AdminHome extends LitElement {
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

        /* ------ styling for the table ------ */
        :host {
            display: block;
            padding: 16px;
            color: white;
            background-color: #1e1e1e;
        }

        h2 {
            text-align: center;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th, td {
            border: 1px solid #3a3a3a;
            padding: 10px;
            text-align: left;
        }

        th {
            background-color: #333;
        }

        td {
            background-color: #222;
        }

        .actions {
            justify-content: center;
            align-items: center;
            gap: 10px;
        }

        .actions button {
            background: none;
            border: none;
            cursor: pointer;
            color: white;
            padding: 8px 20px; /* Increased padding for larger buttons */
            font-size: 16px; /* Increased font size for larger buttons */
            border-radius: 4px;
            transition: background-color 0.3s;
        }

        .actions .edit {
            background-color: #4caf50;
            color: white;
        }

        .actions .edit:hover {
            background-color: #45a049;
        }

        .filters {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .filters input[type="search"] {
            padding: 5px;
            font-size: 16px;
        }

        .filters select {
            padding: 5px;
            font-size: 16px;
            background-color: #333;
            color: white;
            border: 1px solid #3a3a3a;
        }

        .create-button {
            margin-right: 10px;
            padding: 10px;
            background-color: #4caf50;
            color: white;
            border: none;
            cursor: pointer;
        }

        .create-button:hover {
            background-color: #45a049;
        }

        .load-more {
            display: block;
            width: 100%;
            padding: 10px;
            background-color: #444;
            color: white;
            text-align: center;
            border: none;
            cursor: pointer;
        }

        .thumbnail {
            max-width: 50px;
        }
    `;

    // @state()
    // private _isLoggedIn: boolean = false;

    @state()
    private _allGames: any[] = [];


    // private _userService: UserService = new UserService();
    private _orderItemService: OrderItemService = new OrderItemService();

    private _sortby: string = "id";
    private _orderby: string = "ASC";

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        console.log("callback test");

        await this.getAllGames();
        // this.handleNavigation();
    }

    // private handleNavigation(event: CustomEvent): void {
    //     const nextPage: boolean = event.detail;
    //     this._isLoggedIn = nextPage;
    // }


    /**
     * Get all available games from databse
     */
    /**
    * Fetches all available order items (games).
    */
    private async getAllGames(sort: string = "date", order: string = "ASC"): Promise<void> {
        const result: any = await this._orderItemService.getAllGames(sort, order);

        if (!result) {
            return;
        }

        this._allGames = result;
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


    private navigateTo(page: RouterPage, adminGameId?: string): void {
        console.log("Navigating to", page, "with gameId", adminGameId);
        this.dispatchEvent(new CustomEvent("navigate", { detail: { page, adminGameId } }));
    }

    private navigateToCreateGame(): void {
        console.log("Navigating to create game page");
        this.dispatchEvent(new CustomEvent("navigate", { detail: RouterPage.CreateGame }));
    }

    /**
     * Renders the admin game overview page, which contains a list of all games.
     */
    public render(): TemplateResult {
        return html`
            <h2>Game Overview</h2>

             <section class="filters">
                <button class="create-button" @click=${this.navigateToCreateGame}>Create Game</button>
                <form @submit=${this.handleFilterSubmit}>
                    <div class="filters-sort">
                        <p>Sort by: </p>
                        <select name="games-sort" id="gamesSort" @input=${this.handleInput} .value=${this._sortby}>
                            <option value="id">Id</option>
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
                    </div>
                </form>
                <input type="search" placeholder="Search">
            </section>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Thumbnail</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this._allGames.map(game => html`
                        <tr>
                            <td>${game.id}</td>
                            <td><img src="${game.thumbnail}" alt="${game.title}" width="50"></td>
                            <td>${game.name}</td>
                            <td>${game.price}</td>
                            <td>${game.status}</td>
                            <td class="actions">
                                <button class="edit" @click=${(): void => this.navigateTo(RouterPage.EditGame, game.id)}>
                                    Edit
                                </button>
                            </td>
                        </tr>
                    `)}
                </tbody>
            </table>
        `;
    }
}
