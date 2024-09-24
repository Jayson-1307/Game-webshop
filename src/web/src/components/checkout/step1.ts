import { LitElement, TemplateResult, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { RouterPage } from "../RouterPage";
import { UserService } from "../../services/UserService";
import { OrderItemService } from "../../services/OrderItemService";

@customElement("step-one")
export class StepOne extends LitElement {

  public static styles = css`
    body {
      font-family: Arial;
      font-size: 17px;
      padding: 8px;
    }

    h1 {
      color: white;
      text-align: center;
      font-size: 70px;
    }

    .step1 {
      background-color: #9900ff;
      color: #fbfafd;
      position: relative;
      top: 1px;
      border: 1px #9900ff solid;
      width: 6%;
      height: 50px;
      text-align: center;
      border-radius: 8px 8px 0px 0px;
      cursor: pointer;
    }

    .step2 {
      color: #9900ff;
      position: relative;
      top: 1px;
      left: -4px;
      border: 1px #9900ff solid;
      width: 6%;
      height: 50px;
      text-align: center;
      border-radius: 8px 8px 0px 0px;
      cursor: pointer;
    }

    .step3 {
      color: #9900ff;
      position: relative;
      top: 1px;
      left: -9px;
      border: 1px #9900ff solid;
      width: 6%;
      height: 50px;
      text-align: center;
      border-radius: 8px 8px 0px 0px;
      cursor: pointer;
    }

    .step4 {
      color: #9900ff;
      position: relative;
      top: 1px;
      left: -13px;
      border: 1px #9900ff solid;
      width: 6%;
      height: 50px;
      text-align: center;
      padding: 0 5px;
      border-radius: 8px 8px 0px 0px;
      cursor: pointer;
    }

    * {
      box-sizing: border-box;
    }

    .row {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      margin: 0 -16px;
    }

    .col-25 {
      -ms-flex: -25%;
      flex: -25%;
    }

    .col-50 {
      -ms-flex: 50%; 
      flex: 50%;
    }

    .col-75 {
      -ms-flex: 75%;
      flex: 75%;
    }

    .col-25,
    .col-50,
    .col-75 {
      padding: 0 16px;
    }

    .container {
      background-color: transparent;
      padding: 5px 20px 15px 20px;
      border: 1px #9900ff solid;
      border-radius: 3px;
      width: 75%;
      position: static;
    }

    .container-two {
      background-color: transparent;
      padding: 5px 20px 15px 20px;
      border: 1px #9900ff solid;
      border-radius: 3px;
      width: 25%;
      position: absolute;
      right: 100px;
      top: 366px;
    }

    .container-three {
      background-color: transparent;
      width: 75%;
    }



    input[type="text"] {
      width: 100%;
      margin-bottom: 20px;
      padding: 12px;
      border: 1px solid #fdfbfb;
      border-radius: 3px;
    }

    .payment {
      width: 50%;
      border: 1px solid #fcfbfb;
      border-radius: 3px;
      padding: 6px;
    }

    label {
      margin-bottom: 10px;
      display: block;
    }

    .icon-container {
      margin-bottom: 20px;
      padding: 7px 0;
      font-size: 24px;
    }

    .btn {
      background-color: white;
      color: grey;
      padding: 12px;
      margin: 10px 0;
      border: none;
      width: 100%;
      border-radius: 3px;
      cursor: pointer;
      font-size: 17px;
    }

    .btn:hover {
      background-color: white;
    }

    a {
      color: white;
    }

    hr {
      border: 1px #9900ff solid;
    }

    span.price {
      float: right;
      color: white;
    }

    .error {
      color: red;
      margin-bottom: 20px;
    }

    @media (max-width: 800px) {
      .row {
        flex-direction: column-reverse;
      }
    }

    .img {
      width: 20%;
      height: 50px;
      object-fit: cover;

    }

    .cart-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #9900ff;
      margin-bottom: 5px;
    }

    .delete-button img {
      width: 20px;
      height: 100%;
      object-fit: contain;
    }

  `;

  public _cartItemsCount: number = 0;

  private _userService: UserService = new UserService();
  private _orderItemService: OrderItemService = new OrderItemService();

  @state() private selectedPaymentMethod: string = "";
  @state() private isDifferentShippingAddress: boolean = false;

  @state() private _cartItems: any[] = [];

  @state() private _firstName: string = "";
  @state() private _lastName: string = "";
  @state() private _email: string = "";

  @state() private _shipping_street: string = "";
  @state() private _shipping_houseNumber: string = "";
  @state() private _shipping_houseNumberAddition: string = "";
  @state() private _shipping_zip: string = "";
  @state() private _shipping_city: string = "";
  @state() private _shipping_country: string = "";

  @state() private _billing_street: string = "";
  @state() private _billing_houseNumber: string = "";
  @state() private _billing_houseNumberAddition: string = "";
  @state() private _billing_zip: string = "";
  @state() private _billing_city: string = "";
  @state() private _billing_country: string = "";

  public async connectedCallback(): Promise<void> {
    super.connectedCallback();
    await this.handleReload();

    window.addEventListener("add-quantity-cart-item", this.handleReloadSuccessWrapper);
    window.addEventListener("sub-quantity-cart-item", this.handleReloadSuccessWrapper);
    window.addEventListener("delete-cart-item", this.handleReloadSuccessWrapper);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("add-quantity-cart-item", this.handleReloadSuccessWrapper);
    window.removeEventListener("sub-quantity-cart-item", this.handleReloadSuccessWrapper);
    window.removeEventListener("delete-cart-item", this.handleReloadSuccessWrapper);
  }

  private handleReloadSuccessWrapper = (): void => {
    this.handleReload().catch(error => console.error("Error handling login success:", error));
  };

  private async handleReload(): Promise<void> {
    await this.showUserCartItems();
    await this.fetchUser();
    await this.fetchUserWithShippingAddress();
    await this.fetchUserWithBillingAddress();
    this.requestUpdate();
  };

  private async showUserCartItems(): Promise<void> {
    try {
      const cartItems: any = await this._orderItemService.showUserCartItems();
      this._cartItems = cartItems;
      this._cartItemsCount = cartItems.reduce((total: any, item: any) => total + item.quantity, 0);

    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
    this.requestUpdate();
  }

  private async addQuantityCartItems(gameId: number): Promise<void> {
    try {
      const cartItems: any = await this._orderItemService.addQuantityInCart(gameId);

      if (cartItems) {
        window.dispatchEvent(new Event("add-quantity-cart-item"));
      }

      this._cartItemsCount = cartItems.reduce((total: any, item: any) => total + item.quantity, 0);

    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
    this.requestUpdate();
  }

  private async subQuantityCartItems(gameId: number): Promise<void> {
    try {
      const cartItems: any = await this._orderItemService.subQuantityInCart(gameId);

      if (cartItems) {
        window.dispatchEvent(new Event("sub-quantity-cart-item"));
      }

      this._cartItemsCount = cartItems.reduce((total: any, item: any) => total + item.quantity, 0);

    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
    this.requestUpdate();
  }

  private async deleteUserCartItem(gameId: number): Promise<void> {
    try {
      const cartItems: any = await this._orderItemService.deleteUserCartItem(gameId);

      if (cartItems) {
        confirm("Are you sure you want to delete this product from your cart?");
        window.dispatchEvent(new Event("delete-cart-item"));
      }

    } catch (error) {
      console.error("Error delting item in cart:", error);
    }
    this.requestUpdate();
  }

  private handlePaymentMethodChange(event: Event): void {
    const target: any = event.target as HTMLSelectElement;
    this.selectedPaymentMethod = target.value;

    if (this.selectedPaymentMethod) {
      this._visibleErrorPaymentMethod = false; // Reset payment method error message

    }

    this._visibleErrorPaymentMethod = false;
  }

  private handleShippingAddressChange(event: Event): void {
    const target: any = event.target as HTMLInputElement;
    this.isDifferentShippingAddress = target.checked;
  }

  private async fetchUser(): Promise<void> {
    try {
      const userData: any = await this._userService.getUser();

      this._firstName = userData.first_name;
      this._lastName = userData.last_name;
      this._email = userData.email;

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  private async fetchUserWithShippingAddress(): Promise<void> {
    try {
      const userData: any = await this._userService.getUserWithAddressDelivery();

      console.log(userData);

      this._shipping_street = userData?.street;
      this._shipping_houseNumber = userData?.house_number;
      this._shipping_houseNumberAddition = userData?.house_number_addition;
      this._shipping_zip = userData?.zip;
      this._shipping_city = userData?.city;
      this._shipping_country = userData?.country;

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  private async fetchUserWithBillingAddress(): Promise<void> {
    try {
      const userData: any = await this._userService.getUserWithAddressBilling();

      console.log(userData);

      this._billing_street = userData?.street;
      this._billing_houseNumber = userData?.house_number;
      this._billing_houseNumberAddition = userData?.house_number_addition;
      this._billing_zip = userData?.zip;
      this._billing_city = userData?.city;
      this._billing_country = userData?.country;

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  private CustomerbillId: number | null = 0;

  @state() private _shippingStreetError: string | null = null;
  @state() private _visibleErrorShippingStreet: boolean = false;

  @state() private _shippingHouseNumberError: string | null = null;
  @state() private _visibleErrorShippingHouseNumber: boolean = false;

  @state() private _shippingHouseNumberAdditionError: string | null = null;
  @state() private _visibleErrorShippingHouseNumberAddition: boolean = false;

  @state() private _shippingZipError: string | null = null;
  @state() private _visibleErrorShippingZip: boolean = false;

  @state() private _shippingCityError: string | null = null;
  @state() private _visibleErrorShippingCity: boolean = false;

  @state() private _shippingCountryError: string | null = null;
  @state() private _visibleErrorShippingCountry: boolean = false;

  @state() private _billingStreetError: string | null = null;
  @state() private _visibleErrorBillingStreet: boolean = false;

  @state() private _billingHouseNumberError: string | null = null;
  @state() private _visibleErrorBillingHouseNumber: boolean = false;

  @state() private _billingHouseNumberAdditionError: string | null = null;
  @state() private _visibleErrorBillingHouseNumberAddition: boolean = false;

  @state() private _billingZipError: string | null = null;
  @state() private _visibleErrorBillingZip: boolean = false;

  @state() private _billingCityError: string | null = null;
  @state() private _visibleErrorBillingCity: boolean = false;

  @state() private _billingCountryError: string | null = null;
  @state() private _visibleErrorBillingCountry: boolean = false;

  @state() private _paymentMethodError: string | null = null;
  @state() private _visibleErrorPaymentMethod: boolean = false;

  /**
 * Resets all error messages and visibility flags.
 */
  private resetErrors(): void {
    this._shippingStreetError = null;
    this._visibleErrorShippingStreet = false;
    this._shippingHouseNumberError = null;
    this._visibleErrorShippingHouseNumber = false;
    this._shippingHouseNumberAdditionError = null;
    this._visibleErrorShippingHouseNumberAddition = false;
    this._shippingCityError = null;
    this._visibleErrorShippingCity = false;
    this._billingStreetError = null;
    this._visibleErrorBillingStreet = false;
    this._billingHouseNumberError = null;
    this._visibleErrorBillingHouseNumber = false;
    this._billingHouseNumberAdditionError = null;
    this._visibleErrorBillingHouseNumberAddition = false;
    this._billingZipError = null;
    this._visibleErrorBillingZip = false;
    this._billingCityError = null;
    this._visibleErrorBillingCity = false;
    this._billingCountryError = null;
    this._visibleErrorBillingCountry = false;
    this._paymentMethodError = null;
    this._visibleErrorPaymentMethod = false;
  }

  /**
   * Validates the registration form.
   * @returns A boolean indicating whether the form is valid or not.
   */
  private validateForm(): boolean {
    let isValid: boolean = true;

    if (this._shipping_street.trim() === "") {
      this._shippingStreetError = "Please fill in the shipping street field";
      this._visibleErrorShippingStreet = true;
      isValid = false;
    } else if (!this.validateStreet(this._shipping_street)) {
      this._shippingStreetError = "The shipping street can only contain letters, spaces, and hyphens.";
      this._visibleErrorShippingStreet = true;
      isValid = false;
    }

    if (this._shipping_houseNumber.trim() === "") {
      this._shippingHouseNumberError = "Please fill in the shipping house number field";
      this._visibleErrorShippingHouseNumber = true;
      isValid = false;
    } else if (!this.validateHouseNumber(this._shipping_houseNumber)) {
      this._shippingHouseNumberError = "The shipping house number can only contain numbers.";
      this._visibleErrorShippingHouseNumber = true;
      isValid = false;
    }

    if (this._shipping_houseNumberAddition && !this.validateHouseNumberAddition(this._shipping_houseNumberAddition)) {
      this._shippingHouseNumberAdditionError = "The shipping house number addition can only contain a single letter or number.";
      this._visibleErrorShippingHouseNumberAddition = true;
      isValid = false;
    }

    if (this._shipping_zip.trim() === "") {
      this._shippingZipError = "Please fill in the shipping zip field";
      this._visibleErrorShippingZip = true;
      isValid = false;
    } else if (!this.validateZip(this._shipping_zip)) {
      this._shippingZipError = "The shipping zip can only contain letters, numbers, spaces, and hyphens.";
      this._visibleErrorShippingZip = true;
      isValid = false;
    }

    if (this._shipping_city.trim() === "") {
      this._shippingCityError = "Please fill in the shipping city field";
      this._visibleErrorShippingCity = true;
      isValid = false;
    } else if (!this.validateStreet(this._shipping_city)) {
      this._shippingCityError = "The shipping city can only contain letters, spaces, and hyphens.";
      this._visibleErrorShippingCity = true;
      isValid = false;
    }

    if (this._shipping_country.trim() === "") {
      this._shippingCountryError = "Please fill in the shipping country field";
      this._visibleErrorShippingCountry = true;
      isValid = false;
    } else if (!this.validateStreet(this._shipping_country)) {
      this._shippingCountryError = "The shipping country can only contain letters, spaces, and hyphens.";
      this._visibleErrorShippingCountry = true;
      isValid = false;
    }

    if (this.isDifferentShippingAddress) {

      if (this._billing_street.trim() === "") {
        this._billingStreetError = "Please fill in the billing street field";
        this._visibleErrorBillingStreet = true;
        isValid = false;
      } else if (!this.validateStreet(this._billing_street)) {
        this._billingStreetError = "The billing street can only contain letters, spaces, and hyphens.";
        this._visibleErrorBillingStreet = true;
        isValid = false;
      }

      if (this._billing_houseNumber.trim() === "") {
        this._billingHouseNumberError = "Please fill in the billing house number field";
        this._visibleErrorBillingHouseNumber = true;
        isValid = false;
      } else if (!this.validateHouseNumber(this._billing_houseNumber)) {
        this._billingHouseNumberError = "The billing house number can only contain numbers.";
        this._visibleErrorBillingHouseNumber = true;
        isValid = false;
      }

      if (this._billing_houseNumberAddition && !this.validateHouseNumberAddition(this._billing_houseNumberAddition)) {
        this._billingHouseNumberAdditionError = "The billing house number addition can only contain a single letter or number.";
        this._visibleErrorBillingHouseNumberAddition = true;
        isValid = false;
      }

      if (this._billing_zip.trim() === "") {
        this._billingZipError = "Please fill in the billing zip field";
        this._visibleErrorBillingZip = true;
        isValid = false;
      } else if (!this.validateZip(this._billing_zip)) {
        this._billingZipError = "The billing zip can only contain letters, numbers, spaces, and hyphens.";
        this._visibleErrorBillingZip = true;
        isValid = false;
      }


      if (this._billing_city.trim() === "") {
        this._billingCityError = "Please fill in the billing city field";
        this._visibleErrorBillingCity = true;
        isValid = false;
      } else if (!this.validateStreet(this._billing_city)) {
        this._billingCityError = "The billing city can only contain letters, spaces, and hyphens.";
        this._visibleErrorBillingCity = true;
        isValid = false;
      }

      if (this._billing_country.trim() === "") {
        this._billingCountryError = "Please fill in the billing country field";
        this._visibleErrorBillingCountry = true;
        isValid = false;
      } else if (!this.validateStreet(this._billing_country)) {
        this._billingCountryError = "The billing country can only contain letters, spaces, and hyphens.";
        this._visibleErrorBillingCountry = true;
        isValid = false;
      }

    }

    if (this.selectedPaymentMethod.trim() === "") {

      console.log(this.selectedPaymentMethod);
      this._paymentMethodError = "Please select a payment method.";
      this._visibleErrorPaymentMethod = true;
      isValid = false;
    }

    return isValid;
  }

  private validateStreet(street: string): boolean {
    // Regular expression to match letters, spaces, and hyphens
    const streetRegex: RegExp = /^[A-Za-z\s\-]+$/;

    // Test if the street matches the regex pattern
    return streetRegex.test(street);
  }

  private validateHouseNumber(houseNumber: string): boolean {
    // Regular expression to match only numbers
    const houseNumberRegex: RegExp = /^[0-9]+$/;

    // Test if the house number matches the regex pattern
    return houseNumberRegex.test(houseNumber);
  }

  private validateHouseNumberAddition(houseNumberAddition: string): boolean {
    // Regular expression to match a single letter or number
    const houseNumberAdditionRegex: RegExp = /^[A-Za-z0-9]$/;

    // Test if the house number addition matches the regex pattern
    return houseNumberAdditionRegex.test(houseNumberAddition);
  }

  private validateZip(zip: string): boolean {
    // Regular expression to match alphanumeric ZIP codes
    const zipRegex: RegExp = /^[A-Za-z0-9\s\-]+$/;

    // Test if the ZIP code matches the regex pattern
    return zipRegex.test(zip);
  }

  private async handleConfirm(event: Event): Promise<void> {
    event.preventDefault();

    this.resetErrors();

    if (this.validateForm()) {

      const confirmation: boolean = confirm("Please check your order before confirming. Do you want to proceed?");

      if (confirmation) {
        try {
          const shippingData: any = {
            street: this._shipping_street,
            house_number: this._shipping_houseNumber,
            house_number_addition: this._shipping_houseNumberAddition,
            city: this._shipping_city,
            zip: this._shipping_zip,
            country: this._shipping_country,
          };

          if (this.isDifferentShippingAddress) {
            // Add or update billing address
            const billingData: any = {
              street: this._billing_street,
              house_number: this._billing_houseNumber,
              house_number_addition: this._billing_houseNumberAddition,
              city: this._billing_city,
              zip: this._billing_zip,
              country: this._billing_country,
            };

            const addShippingAddress: any = await this._userService.addorUpdateDeliveryAddress(shippingData);
            const addBillingAddress: any = await this._userService.addorUpdateBillingAddress(billingData);
            console.log("add billing address", addBillingAddress, addShippingAddress);
          } else {
            // Use shipping address as billing address
            const addShippingAddress: any = await this._userService.addorUpdateDeliveryAddress(shippingData);
            const addBillingAddress: any = await this._userService.addorUpdateBillingAddress(shippingData);
            console.log("billing address same as shipping address", addShippingAddress, addBillingAddress);

            this._billing_street = this._shipping_street;
            this._billing_houseNumber = this._shipping_houseNumber;
            this._billing_houseNumberAddition = this._shipping_houseNumberAddition;
            this._billing_zip = this._shipping_zip;
            this._billing_city = this._shipping_city;
            this._billing_country = this._shipping_country;

          }

          const billData: any = {
            shipping_street: this._shipping_street,
            shipping_house_number: this._shipping_houseNumber,
            shipping_house_number_addition: this._shipping_houseNumberAddition,
            shipping_zip: this._shipping_zip,
            shipping_city: this._shipping_city,
            shipping_country: this._shipping_country,
            billing_street: this._billing_street,
            billing_house_number: this._billing_houseNumber,
            billing_house_number_addition: this._billing_houseNumberAddition,
            billing_zip: this._billing_zip,
            billing_city: this._billing_city,
            billing_country: this._billing_country,
            total_price_excl_VAT: (this._cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)).toFixed(2),
            VAT_price: ((this._cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)) * 0.21).toFixed(2),
            total_price_incl_VAT: ((this._cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)) * 1.21).toFixed(2),
          };


          console.log("billData", billData);


          // Add cart items to bill
          const response: number | null = await this._orderItemService.addCartItemsToBillProducts(billData);

          this.CustomerbillId = response;

          if (response) {

            for (const product of this._cartItems) {
              if (product.item_type === "game") {
                const addedToLibrary: boolean = await this._orderItemService.addGameToLibrary(product.productId);

                if (addedToLibrary) {
                  // alert("Added successfully!");
                } else {
                  alert(`The game ${product.productName} is already in your library.`);
                }
              }
              await this._orderItemService.deleteAllUserCartItems();
              this.navigateTo(RouterPage.checkoutStepFour, this.CustomerbillId);
              window.dispatchEvent(new Event("after-confirmation"));

            }

          } else {
            console.error("Failed to add cart items to bill_products");
          }

          console.log("Cart items processed", this._cartItems);

        } catch (error) {
          console.error("Error adding address:", error);
        }
      }
    }
  }

  public render(): TemplateResult {
    return html`
          ${this._cartItems.length === 0 ? html`
          <h1>No items in cart</h1>
          <button @click=${(): void => this.navigateTo(RouterPage.Home)}>Clik here to go back to homepage</button>` : html`
      <div class="checkout">
        <h1>Checkout</h1>
      </div>

            <div class="container-two">
              ${this._cartItems.length === 0 ? html`
                  <div class="cart-item">No items in cart</div>
                    ` : this._cartItems.map(item => html`
                      <div class="cart-item">
                           <div class="quantity-container">
                             ${item.item_type === "game" || item.quantity === 1 ? nothing : html`<button class="quantity-btn" @click=${(): Promise<void> => this.subQuantityCartItems(item.productId)}>-</button>`}
                            <span class="quantity">${item.quantity}</span>
                             ${item.item_type === "game" ? nothing : html`<button class="quantity-btn" @click=${(): Promise<void> => this.addQuantityCartItems(item.productId)}>+</button>`}
                               </div>
                             <img class="img" src="${item.thumbnail}" alt="${item.productName}">
                             <span class="item-name">${item.productName}</span>
                            <span class="item-amount">${item.quantity} x € ${item.price}</span>
                             <button class="delete-button" @click=${(): Promise<void> => this.deleteUserCartItem(item.productId)}><img src="/assets/img/Icons/delete.png" alt="Logo" /></button>
                            </div>
                                `)}

                         ${this._cartItems.length === 0 ? nothing : html`
                         <div class="cart-bottom">
                          <div class="total-price">
                             <span class="total-label">Total price (Excl. VAT):</span>
                              <span class="price">€ ${this._cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
                             </div>
                             <div class="total-price">
                              <span class="total-label">VAT 21%:</span>
                               <span class="price">€ ${(this._cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.21).toFixed(2)}</span>
                                 </div>
                                <div class="total-price">
                                  <span class="total-label">Total price (Incl. VAT):</span>
                                  <span class="price">€ ${(this._cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * 1.21).toFixed(2)}</span>
                                </div>
                              </div>
                                `}
                              </div>
                            </div>
                          </div>
                        </div>
      <div class="col-75">
        <div class="container">
          <form>
            <div class="row">
              <div class="col-50">
                <h3>Delivery Address</h3>
                
                <div class="row">
                  <div class="col-50">
                    <label for="first_name"><i class="fa fa-user"></i> First name</label>
                    <input @input=${this.input} value="${this._firstName}" type="text" id="first_name" name="first_name" placeholder="First name" readonly required>
                  </div>
                  <div class="col-50">
                    <label for="last_name"><i class="fa fa-user"></i> Last name</label>
                    <input @input=${this.input} value="${this._lastName}" type="text" id="last_name" name="last_name" placeholder="Last name" readonly required>
                  </div>
                </div>

                <label for="email"><i class="fa fa-envelope"></i> Email</label>
                <input @input=${this.input} value="${this._email}" type="text" id="email" name="email" placeholder="Email" readonly required>

                <label for="shipping_street"><i class="fa fa-address-card-o"></i> Street</label>
                <input @input=${this.input} value="${this._shipping_street}" type="text" id="shipping_street" name="shipping_street" placeholder="Street" required>
                ${this._visibleErrorShippingStreet ? html`<div class="error">${this._shippingStreetError}</div>` : ""}

                <div class="row">
                  <div class="col-50">
                    <label for="shipping_house_number"><i class="fa fa-address-card-o"></i> House number</label>
                    <input @input=${this.input} value="${this._shipping_houseNumber}" type="text" id="shipping_house_number" name="shipping_house_number" placeholder="House number" required>
                    ${this._visibleErrorShippingHouseNumber ? html`<div class="error">${this._shippingHouseNumberError}</div>` : ""}
                  </div>
                  <div class="col-50">
                    <label for="shipping_house_number_addition"><i class="fa fa-address-card-o"></i> House number addition</label>
                    <input @input=${this.input} value="${this._shipping_houseNumberAddition}" type="text" id="shipping_house_number_addition" name="shipping_house_number_addition" placeholder="House number addition" required>
                    ${this._visibleErrorShippingHouseNumberAddition ? html`<div class="error">${this._shippingHouseNumberAdditionError}</div>` : ""}
                  </div>
                </div>

                <div class="row">
                  <div class="col-50">
                    <label for="shipping_zip">Zip</label>
                    <input @input=${this.input} value="${this._shipping_zip}" type="text" id="shipping_zip" name="shipping_zip" placeholder="Zip" required>
                    ${this._visibleErrorShippingZip ? html`<div class="error">${this._shippingZipError}</div>` : ""}
                  </div>
                  <div class="col-50">
                    <label for="shipping_city"><i class="fa fa-institution"></i> City</label>
                    <input @input=${this.input} value="${this._shipping_city}" type="text" id="shipping_city" name="shipping_city" placeholder="City" required>
                    ${this._visibleErrorShippingCity ? html`<div class="error">${this._shippingCityError}</div>` : ""}
                  </div>
                </div>

                <label for="shipping_country"><i class="fa fa-institution"></i> Country</label>
                <input @input=${this.input} value="${this._shipping_country}" type="text" id="shipping_country" name="shipping_country" placeholder="Country" required>
                ${this._visibleErrorShippingCountry ? html`<div class="error">${this._shippingCountryError}</div>` : ""}

              </div>

              <div class="col-50">
                <h3>Payment</h3>
                <label for="fname">Accepted Cards</label>
                <select class="payment" @change=${this.handlePaymentMethodChange} required>
                  <option value="">Select a payment method</option>
                  <option value="ideal">Ideal</option>
                  <option value="credit-card">Credit Card</option>
                  <option value="apple-pay">Apple Pay</option>
                  <option value="paypal">PayPal</option>
                  <option value="klarna">Klarna</option>
                  <option value="revolut">Revolut</option>
                  <option value="google-pay">Google Pay</option>
                </select>

                ${this._visibleErrorPaymentMethod ? html`<div class="error">${this._paymentMethodError}</div>` : ""}

                ${this.selectedPaymentMethod === "ideal" ? html`
                    <label for="bank">Select Bank</label>
                    <select id="bank" name="bank" required>
                      <option value="ing">ING</option>
                      <option value="abn-amro">ABN AMRO</option>
                      <option value="rabobank">Rabobank</option>
                      <option value="sns-bank">SNS Bank</option>
                      <option value="bunq">Bunq</option>
                      <option value="knab">Knab</option>
                    </select>
                  ` : nothing}

                ${this.selectedPaymentMethod === "credit-card" ? html`
                    <label for="cname">Name on Card</label>
                    <input type="text" id="cname" name="cardname" placeholder="Name">
                    <label for="ccnum">Credit card number</label>
                    <input type="text" id="ccnum" name="cardnumber" placeholder="Card number">
                    <label for="expmonth">Exp Month</label>
                    <input type="text" id="expmonth" name="expmonth" placeholder="Month">

                    <div class="row">
                      <div class="col-50">
                        <label for="expyear">Exp Year</label>
                        <input type="text" id="expyear" name="expyear" placeholder="EXP-Year">
                      </div>
                      <div class="col-50">
                        <label for="cvv">CVV</label>
                        <input type="text" id="cvv" name="cvv" placeholder="CVV">
                      </div>
                    </div>
                  ` : nothing}
              </div>
            </div>

            <label>
              <input type="checkbox" name="sameadr" @change=${this.handleShippingAddressChange}> Billing address is different from the delivery address
            </label>

            ${this.isDifferentShippingAddress ? html`
                <div class="container-three">
                  <h3>Billing Address</h3>
                      
                  <label for="billing_street"><i class="fa fa-address-card-o"></i> Street</label>
                <input @input=${this.input} value="${this._billing_street}" type="text" id="billing_street" name="billing_street" placeholder="Street" required>
                ${this._visibleErrorBillingStreet ? html`<div class="error">${this._billingStreetError}</div>` : ""}

                <div class="row">
                  <div class="col-50">
                    <label for="billing_house_number"><i class="fa fa-address-card-o"></i> House number</label>
                    <input @input=${this.input} value="${this._billing_houseNumber}" type="text" id="billing_house_number" name="billing_house_number" placeholder="House number" required>
                    ${this._visibleErrorBillingHouseNumber ? html`<div class="error">${this._billingHouseNumberError}</div>` : ""} 
                  </div>
                  <div class="col-50">
                    <label for="billing_house_number_addition"><i class="fa fa-address-card-o"></i> House number addition</label>
                    <input @input=${this.input} value="${this._billing_houseNumberAddition}" type="text" id="billing_house_number_addition" name="billing_house_number_addition" placeholder="House number addition" required>
                    ${this._visibleErrorBillingHouseNumberAddition ? html`<div class="error">${this._billingHouseNumberAdditionError}</div>` : ""}
                  </div>
                </div>

                <div class="row">
                  <div class="col-50">
                    <label for="billing_zip">Zip</label>
                    <input @input=${this.input} value="${this._billing_zip}" type="text" id="billing_zip" name="billing_zip" placeholder="Zip" required>
                    ${this._visibleErrorBillingZip ? html`<div class="error">${this._billingZipError}</div>` : ""} 
                  </div>
                  <div class="col-50">
                    <label for="billing_city"><i class="fa fa-institution"></i> City</label>
                    <input @input=${this.input} value="${this._billing_city}" type="text" id="billing_city" name="billing_city" placeholder="City" required>
                    ${this._visibleErrorBillingCity ? html`<div class="error">${this._billingCityError}</div>` : ""} 
                  </div>
                </div>

                <label for="billing_country"><i class="fa fa-institution"></i> Country</label>
                <input @input=${this.input} value="${this._billing_country}" type="text" id="billing_country" name="billing_country" placeholder="Country" required>
                ${this._visibleErrorBillingCountry ? html`<div class="error">${this._billingCountryError}</div>` : ""} 
                    </div>
                  </div>
                </div>
              ` : nothing}

            <button type="submit" @click=${this.handleConfirm}>confirm</button>

          </form>
        </div>
      </div>
      `}

    `;

  }

  /**
   * Navigates to a specified page.
   * @param page - The page to navigate to
   * @param gameId - (Optional) The ID of the game to view
   */
  private navigateTo(page: RouterPage, CustomerbillId?: number | null): void {
    console.log("Navigating to", page, "with gameId", CustomerbillId);

    // Dispatch a custom event named "navigate" with the detail containing the target page and game ID
    const check: boolean = this.dispatchEvent(new CustomEvent("navigate", { detail: { page, CustomerbillId } }));

    console.log(check);
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
      case "first_name":
        this._firstName = value;
        console.log("First name", this._firstName);
        break;
      case "last_name":
        this._lastName = value;
        console.log("Last name", this._lastName);
        break;
      case "email":
        this._email = value;
        console.log("Email", this._email);
        break;

      case "shipping_street":
        this._shipping_street = value;
        console.log("Street", this._shipping_street);
        this._visibleErrorShippingStreet = false;
        break;
      case "shipping_house_number":
        this._shipping_houseNumber = value;
        console.log("_shipping House number", this._shipping_houseNumber);
        this._visibleErrorShippingHouseNumber = false;
        break;
      case "shipping_house_number_addition":
        this._shipping_houseNumberAddition = value;
        this._visibleErrorShippingHouseNumberAddition = false;
        console.log("_shipping House number addition", this._shipping_houseNumberAddition);
        break;
      case "shipping_zip":
        this._shipping_zip = value;
        console.log("_shipping Zip", this._shipping_zip);
        this._visibleErrorShippingZip = false;
        break;
      case "shipping_city":
        this._shipping_city = value;
        console.log("_shipping City", this._shipping_city);
        this._visibleErrorShippingCity = false;
        break;
      case "shipping_country":
        this._shipping_country = value;
        this._visibleErrorShippingCountry = false;
        console.log("_shipping Country", this._shipping_country);
        break;


      case "billing_street":
        this._billing_street = value;
        console.log("billing_ Street", this._billing_street);
        this._visibleErrorBillingStreet = false;
        break;
      case "billing_house_number":
        this._billing_houseNumber = value;
        this._visibleErrorBillingHouseNumber = false;
        console.log("billing_ House number", this._billing_houseNumber);
        break;
      case "billing_house_number_addition":
        this._billing_houseNumberAddition = value;
        this._visibleErrorBillingHouseNumberAddition = false;
        console.log("billing_ House number addition", this._billing_houseNumberAddition);
        break;
      case "billing_zip":
        this._billing_zip = value;
        console.log("billing_ Zip", this._billing_zip);
        this._visibleErrorBillingZip = false;
        break;
      case "billing_city":
        this._billing_city = value;
        console.log("billing_ City", this._billing_city);
        this._visibleErrorBillingCity = false;
        break;
      case "billing_country":
        this._billing_country = value;
        this._visibleErrorBillingCountry = false;
        console.log("billing_ Country", this._billing_country);
        break;

    }
  }
}