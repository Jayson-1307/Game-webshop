import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";
import { RouterPage } from "./RouterPage";
import "./CustomInputElement.ts";
import { sendEmail } from "../services/EmailService";

/**
 * Custom element for handling user register functionality.
 */
@customElement("webshop-password-recovery")
export class Register extends LitElement {

    /**
     * Styles for the registration form.
     */
    public static styles = css`
        .form {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .error {
            color: red;
        }
    `;

    // Instance of the UserService class
    private _userService: UserService = new UserService();

    // State variables for form inputs
    @state() private _verificationCode: string = "";
    @state() private _enteredVerificationCode: string = "";
    @state() private _email: string = "";
    @state() private _password: string = "";
    @state() private _repeatPassword: string = "";

    // State variables for input error messages and visibility
    @state() private _verificationCodeError: string | null = null;
    @state() private _visibleErrorVerificationCode: boolean = false;

    @state() private _emailError: string | null = null;
    @state() private _visibleErrorEmail: boolean = false;

    @state() private _passwordError: string | null = null;
    @state() private _visibleErrorPassword: boolean = false;

    @state() private _repeatPasswordError: string | null = null;
    @state() private _visibleErrorRepeatPassword: boolean = false;

    @state() private _showEmailField: boolean = true;
    @state() private _showVerificationCode: boolean = false;
    @state() private _showPasswordFields: boolean = false;

    /**
     * Resets all error messages and visibility flags.
     */
    private resetErrors(): void {
        this._verificationCodeError = null;
        this._visibleErrorVerificationCode = false;
        this._emailError = null;
        this._visibleErrorEmail = false;
        this._passwordError = null;
        this._visibleErrorPassword = false;
        this._repeatPasswordError = null;
        this._visibleErrorRepeatPassword = false;
    }

    /**
     * Validates the email field.
     * @returns A boolean indicating whether the email field is valid or not.
     */
    private validateEmailField(): boolean {
        if (this._email.trim() === "") {
            this._emailError = "Please fill in the email field";
            this._visibleErrorEmail = true;
            return false;
        } else if (!this.validateEmail(this._email)) {
            this._emailError = "Please enter a valid email address";
            this._visibleErrorEmail = true;
            return false;
        }
        return true;
    }

    /**
     * Validates the password and repeat password fields.
     * @returns A boolean indicating whether the form is valid or not.
     */
    private validatePasswordFields(): boolean {
        let isValid: boolean = true;

        if (this._password.trim() === "") {
            this._passwordError = "Please fill in the password field";
            this._visibleErrorPassword = true;
            isValid = false;
        }

        if (this._repeatPassword.trim() === "") {
            this._repeatPasswordError = "Please fill in the repeat password field";
            this._visibleErrorRepeatPassword = true;
            isValid = false;
        } else if (this._repeatPassword !== this._password) {
            this._repeatPasswordError = "Passwords do not match";
            this._visibleErrorRepeatPassword = true;
            isValid = false;
        }

        return isValid;
    }

    /**
     * Generates a 6-digit verification code.
     * @returns A string representing the 6-digit verification code.
     */
    private generateVerificationCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Handles submission of the password recovery form.
     * Validates user input and sends a verification code if the email is valid.
     */
    private async submitPasswordRecoveryForm(): Promise<void> {
        // Reset all error messages and visibility flags
        this.resetErrors();

        // Perform validation checks for email
        if (this.validateEmailField()) {
            // Check if email exists
            const emailExists: boolean = await this._userService.checkExistingEmail(this._email);

            if (!emailExists) {
                alert("We have sent you an email with a verification code. Please fill it in so you can change your password.");

                // Generate a 6-digit verification code
                this._verificationCode = this.generateVerificationCode();
                console.log(this._verificationCode);

                try {
                    const emailResult: string = await sendEmail({
                        from: { name: "RETRO GAME STORE", address: "no-reply@retrogamestore.com" },
                        to: [{ address: this._email }],
                        subject: "Verification Code for password recovery",
                        text: `Your verification code for password recovery is: ${this._verificationCode}`,
                        html: `<p>Your verification code for password recovery is: <strong>${this._verificationCode}</strong></p>`
                    });
                    console.log("Email sent successfully:", emailResult);
                    this._showVerificationCode = true;
                    this._showEmailField = false;
                } catch (emailError) {
                    console.error("Failed to send email:", emailError);
                }
            } else {
                alert("Email does not exist.");
            }
        }
    }

    /**
     * Handles verification code submission.
     * Validates the verification code and shows password fields if valid.
     */
    private verifyCode(): void {
        if (this._enteredVerificationCode === this._verificationCode) {
            this._showVerificationCode = false;
            this._showPasswordFields = true;
        } else {
            this._verificationCodeError = "Invalid verification code";
            this._visibleErrorVerificationCode = true;
            alert("Please fill in de verification code we have sent you to your email to change your password");
        }
    }

    /**
     * Validates an email address.
     * @param email The email address to validate.
     * @returns A boolean indicating whether the email is valid or not.
     */
    private validateEmail(email: string): boolean {
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private async submitPasswordUpdateForm(): Promise<void> {
        // Reset all error messages and visibility flags
        this.resetErrors();

        // Perform validation checks for passwords
        if (this.validatePasswordFields()) {
            // Update the password
            const success: boolean = await this._userService.updatePassword(this._email, this._password);

            if (success) {
                alert("Password updated successfully.");
                this.navigateTo(RouterPage.Login);
            } else {
                alert("Failed to update the password.");
            }
        }
    }

    /**
     * Renders the registration form.
     * @returns The HTML template for the registration form.
     */
    public render(): TemplateResult {
        return html`
            <div class="form">
                <h1>Password Recovery</h1>

                <!-- Email input field -->
                ${this._showEmailField ? html`
                    <custom-input-element type="email" id="email" @input=${this.input} .value=${this._email} placeholder="Email"></custom-input-element>
                    ${this._visibleErrorEmail ? html`<div class="error">${this._emailError}</div>` : ""}

                    <div class="button">
                        <button @click="${this.submitPasswordRecoveryForm}">Send Verification Code</button>
                    </div>
                ` : ""}

                <!-- Show verification code input field after email is submitted and verified -->
                ${this._showVerificationCode ? html`
                    <custom-input-element type="text" id="enteredVerificationCode" @input=${this.input} .value=${this._enteredVerificationCode} placeholder="Verification code"></custom-input-element>
                    ${this._visibleErrorVerificationCode ? html`<div class="error">${this._verificationCodeError}</div>` : ""}
                    
                    <div class="button">
                        <button @click="${this.verifyCode}">Verify Code</button>
                    </div>
                ` : ""}

                <!-- Show password and repeat password fields after verification code is validated -->
                ${this._showPasswordFields ? html`
                    <custom-input-element type="password" id="password" @input=${this.input} .value=${this._password} placeholder="Password"></custom-input-element>
                    ${this._visibleErrorPassword ? html`<div class="error">${this._passwordError}</div>` : ""}
                    
                    <custom-input-element type="password" id="repeatPassword" @input=${this.input} .value=${this._repeatPassword} placeholder="Repeat password"></custom-input-element>
                    ${this._visibleErrorRepeatPassword ? html`<div class="error">${this._repeatPasswordError}</div>` : ""}
                    
                    <div class="button">
                        <button @click=${this.submitPasswordUpdateForm}>Update Password</button>
                    </div>
                ` : ""}

                <div class="hrefText">
                    You don't have an account?
                    <a href="#" @click="${(): void => this.navigateTo(RouterPage.Register)}">Register here.</a>
                </div>
            </div>
        `;
    }

    /**
     * Navigates to a specified page.
     * @param page The page to navigate to.
     */
    private navigateTo(page: RouterPage): void {
        this.dispatchEvent(new CustomEvent("navigate", { detail: page }));
    }

    /**
     * Handles input events for form fields.
     * Updates corresponding state variables based on user input.
     * @param event The input event.
     */
    private input(event: InputEvent): void {
        const target: HTMLInputElement | HTMLTextAreaElement = event.target as HTMLInputElement | HTMLTextAreaElement;
        const id: string = target.id;
        const value: string = target.value;

        switch (id) {
            case "enteredVerificationCode":
                this._enteredVerificationCode = value;
                this._visibleErrorVerificationCode = false;
                break;
            case "email":
                this._email = value;
                this._visibleErrorEmail = false;
                break;
            case "password":
                this._password = value;
                this._visibleErrorPassword = false;
                break;
            case "repeatPassword":
                this._repeatPassword = value;
                this._visibleErrorRepeatPassword = false;
                break;
        }
    }
}