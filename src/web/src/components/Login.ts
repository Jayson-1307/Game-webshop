import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { RouterPage } from "./RouterPage";
import "./CustomInputElement.ts";

/**
 * Custom element for handling user login functionality.
 */
@customElement("webshop-login")
export class Login extends LitElement {

    /**
     * Styles for the login form
     */
    public static styles = css`
    .form {
        background-color: transparent; /* Dark background color */
        padding: 20px;
        border-radius: 10px;
        max-width: 400px;
        margin: auto;
        border: 1px solid #9900ff; /* Purple border */
    }

    custom-input-element {
        width: 100%;
        margin: 10px 0;
        display: block;
        padding: 1px !important;
        border: 1px solid #9900ff;
        border-radius: 8px 8px 8px 8px;
        background: transparent;
        box-sizing: border-box;
    }

    .email, .password {
        width: 100%;
        margin: 10px 0;
        display: block;
        padding: 10px 10px !important;
        border: 1px solid #9900ff;
        border-radius: 8px 8px 8px 8px;
        background: transparent;
        box-sizing: border-box;
        color: white;
    }

    input:focus:not(:focus-visible) {
        border-color: #ccc; /* Revert focus styling when not :focus-visible */
        box-shadow: none;
        outline: none;
    }   

    input:focus-visible {
        border: 1px solid #9900ff;
        box-shadow: 0 0 0 2px #9900ff;
        outline: none;
    }

    /* Styling error messages */
    .error {
        color: #ff3b30; /* Red color for error messages */
        font-size: 14px;
        margin-top: -5px;
        margin-bottom: 10px;
    }

    /* Styling the submit button */
    .devider {
        width: 100%;
        text-align: center;
    }

    .loginButton,
    .registerButton {
        width: 100%;
        text-align: center;
        margin: 20px 0;
    }

    .loginButton button,
    .registerButton button {
        width: 100%;
        background-color: #9900ff; /* Purple background color */
        color: white; /* White text color */
        padding: 9px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }

    /* Adding hover effect to the button */
    .loginButton button:hover,
    .registerButton button:hover {
        background-color: #9900ff; /* Darker purple color */
    }

    /* Styling the link */
    .hrefText {
        text-align: center;
        color: #b3b3b3; /* Light grey text color */
        margin-top: 20px;
    }

    .hrefText a {
        color: #9900ff; /* Purple color */
        text-decoration: none;
    }

    .hrefText a:hover {
        text-decoration: underline;
    }

    /* Additional styling for better appearance */
    body {
        background-color: #121212; /* Matching background color */
        color: white; /* White text color */
        font-family: Arial, sans-serif;
    }

        .form {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .error {
            color: red;
        }
    `;

    // Flag to check if the user is logged in
    public _isLoggedIn: boolean = false;
    private _authLevel: string = "";


    // Instance of the UserService class
    @state() private _userService: UserService = new UserService();

    // State variables for email and password
    @state() private _email: string = "";
    @state() private _password: string = "";

    // State variables for email error and visibility
    @state() private _emailError: string | null = null;
    @state() private _visibleErrorEmail: boolean = false;

    // State variables for password error and visibility
    @state() private _passwordError: string | null = null;
    @state() private _visibleErrorPassword: boolean = false;


    

    // This code runs when your login form is put onto the web page
    public async connectedCallback(): Promise<void> {
        await this.getAuthlevel();

        super.connectedCallback();
        await this.getWelcome();
    }

    public async getAuthlevel(): Promise<void> {
        this._authLevel = await this._userService.getAuthLevel();
        console.error(this._authLevel);
    }   

    /**
     * Fetches welcome message for the logged-in user.
     */
    private async getWelcome(): Promise<void> {
        const result: UserHelloResponse | undefined = await this._userService.getWelcome();
        if (result) {
            this._isLoggedIn = true;
        }
    }

    /**
     * Handles form submission for user login.
     * Validates user input and logs the user if input is valid.
     */
    private async submitLoginForm(): Promise<void> {
        await this.getAuthlevel();

        // alert(this._authLevel);
        // TODO: Validation

        // Call the login method from the user service with the form data
        const result: boolean = await this._userService.login({
            email: this._email,
            password: this._password,
        });

        // Handle the result of the login attempt
        if (result) {

            // alert("Successfully logged in!");
            const userId: string | null = localStorage.getItem("userId");
            const token: string | null = localStorage.getItem("token"); // Log token
            console.log("Logged in userId:", userId);
            console.log("Logged in token:", token); // Log token
            await this.getAuthlevel();

            // console.log(req.user.authorizationLevel);
            // location.reload();
            await this.getWelcome();

            // Navigate to the home page after successful registration
            if (this._authLevel ===  "admin" || this._authLevel === "employee") {
                this.navigateTo(RouterPage.AdminHome);
                this.dispatchEvent(new CustomEvent("admin-login-success", { bubbles: true, composed: true }));
                console.log("kanker", this._authLevel);
            } else {
                this.navigateTo(RouterPage.Home);
            }


            this.dispatchEvent(new CustomEvent("login-success", { bubbles: true, composed: true }));

        } else {

            // If login fails, perform validation checks and display appropriate error messages

            // Check if email exists
            const emailExists: boolean = await this._userService.checkExistingEmail(this._email);
            if (this._email.trim() === "") {

                // Display error message for empty email field
                this._emailError = "Please fill in the email field";
                this._visibleErrorEmail = true;

            } else if (!this.validateEmail(this._email)) {

                // Display error message for invalid email format
                this._emailError = "Please enter a valid email address";
                this._visibleErrorEmail = true;

            } else if (emailExists) {

                // Display error message for non-existing email in the system
                this._emailError = "Email doesn't exist in our system. Please register.";
                this._visibleErrorEmail = true;

            }
            if (this._password.trim() === "") {

                // Display error message for empty password field
                this._passwordError = "Please fill in the password field";
                this._visibleErrorPassword = true;

            } else {

                // Display error message for incorrect password
                this._passwordError = "Invalid password";
                this._visibleErrorPassword = true;

            }
        }
    }



    /**
     * Validates an email address.
     * @param email The email address to validate.
     * @returns A boolean indicating whether the email is valid or not.
     */
    private validateEmail(email: string): boolean {

        // Regular expression to validate email format
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(email);

    }

    /**
         * Renders the login form.
         * @returns The HTML template for the login form.
         */
    public render(): TemplateResult {
        return html`
        <div class="form">
            <!-- <custom-input-element class="${"email"}" type="${"email"}" Id="${"email"}" @input=${this.input} .value=${this._email} placeholder="${"Email"}"></custom-input-element> -->
            <input class="${"email"}" type="${"email"}" Id="${"email"}" @input=${this.input} .value=${this._email} placeholder="${"Email"}">
            ${this._visibleErrorEmail ? html`<div class="error">${this._emailError}</div>` : ""}
            <!-- <custom-input-element class="${"password"}" type="${"password"}" Id="${"password"}" @input=${this.input} .value=${this._password} placeholder="${"Password"}"></custom-input-element> -->
            <input class="${"password"}" type="${"password"}" Id="${"password"}" @input=${this.input} .value=${this._password} placeholder="${"Password"}">
            ${this._visibleErrorPassword ? html`<div class="error">${this._passwordError}</div>` : ""}
            <div class="loginButton">
                <button @click="${this.submitLoginForm}" type="button">Login</button>
            </div>
            <p class="devider">Or</p>
            <div class="registerButton">
                <button @click="${(): void => this.navigateTo(RouterPage.Register)}">Create an account</button>
            </div>
            <p>Forgot password?<a href="#" @click="${(): void => this.navigateTo(RouterPage.passwordRecovery)}"> Click here!</a></p>
        </div>
    `;
    }


    /**
     * Navigates to a specified page.
     * @param page The page to navigate to.
     */
    private navigateTo(page: RouterPage): void {

        // Dispatches a custom event with the specified page detail
        this.dispatchEvent(new CustomEvent("navigate", { detail: page }));

    }

    /**
     * Handles input events for email and password fields.
     * Updates corresponding state variables based on user input.
     * @param event The input event.
     */
    private input(event: InputEvent): void {

        // Extracts the target element from the input event
        const target: HTMLInputElement | HTMLTextAreaElement = event.target as HTMLInputElement | HTMLTextAreaElement;

        // Retrieves the ID attribute of the target element
        const id: string = target.id;

        // Switch statement to handle different input fields based on their IDs
        const value: string = target.value;

        switch (id) {
            case "email":
                // Update email state variable and hide email error message
                this._email = value;
                this._visibleErrorEmail = false;
                break;
            case "password":
                // Update password state variable and hide password error message
                this._password = value;
                this._visibleErrorPassword = false;
                break;
        }
    }
}
