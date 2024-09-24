import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AdminService } from "../../../services/AdminService";
import { RouterPage } from "../../RouterPage";

/**
 * Custom element based on Lit for the header of the webshop.
 *
 * @todo Most of the logic in this component is over-simplified. You will have to replace most of it with actual implementations.
 */
@customElement("admin-employee-overview")
export class AdminEmployeeOverview extends LitElement {
    public static styles = css`
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

    @state()
    private _employees: any[] = [];

    private _adminService: AdminService = new AdminService();

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        console.log("callback test");

        await this.getAllEmployees();
    }

    /**
     * Get all employees from database
     */
    private async getAllEmployees(): Promise<void> {
        console.log("get all employees");
        const result: any = await this._adminService.getAllEmployees();
        console.log(result);

        if (!result) {
            return;
        }

        this._employees = result;
    }

    private navigateTo(page: RouterPage, userId?: string): void {
        console.log("Navigating to", page, "with userId", userId);
        this.dispatchEvent(new CustomEvent("navigate", { detail: { page, userId } }));
    }

    private navigateToCreateAccount(): void {
        console.log("Navigating to create account page");
        this.dispatchEvent(new CustomEvent("navigate", { detail: RouterPage.CreateAccount }));
    }

    /**
     * Renders the employees overview page, which contains a list of all employees.
     */
    public render(): TemplateResult {
        return html`
            <h2>Employee Overview</h2>

            <div class="filters">
                <button class="create-button" @click=${this.navigateToCreateAccount}>Create Employee</button>
                <div>
                    <label for="sort">Sort by:</label>
                    <select id="sort">
                        <option value="id">ID</option>
                        <option value="username">Username</option>
                        <option value="role">Role</option>
                        <option value="email">Email</option>
                    </select>
                </div>
                <input type="search" placeholder="Search">
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this._employees.map(employee => html`
                        <tr>
                            <td>${employee.id}</td>
                            <td>${employee.username}</td>
                            <td>${employee.authorization_level}</td>
                            <td>${employee.email}</td>
                            <td class="actions">
                            <button class="edit" @click=${(): void => this.navigateTo(RouterPage.EditAccount, employee.id)}>
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
