import { LitElement, TemplateResult, html, css } from "lit";
import { customElement } from "lit/decorators.js";


@customElement("step-two")   
export class StepTwo extends LitElement {

    public static styles = css`
body {
  font-family: Arial;
  font-size: 17px;
  padding: 8px;
}

.container {
  background-color: transparent;
  padding: 5px 20px 500px 20px;
  border: 1px #9900ff solid;
  border-radius: 3px;
}

.container2 {
    background-color: transparent;
    padding: 5px 20px 150px 20px;
    border: 3px #9900ff solid;
    border-radius: 30px;
}

.product {
  color: white;
}
    
    `;

    public render(): TemplateResult {

        return html`
                <div>
                    <h2>Order Summary</h2>
                </div>

                <div class="container">
    <span class="price" style="color:white"><i class="fa fa-shopping-cart"></i> <b></b></span>
      <p><a class="product" href="#">Product 1</a> <span class="order"></span></p>
      <div class="container2"></div>
      <p><a class="product" href="#">Product 2</a> <span class="order"></span></p>
      <div class="container2"></div>
      <p><a class="product" href="#">Product 3</a> <span class="order"></span></p>
      <div class="container2"></div>
      <p><a class="product" href="#">Product 4</a> <span class="order"></span></p>
      <div class="container2"></div>
    </div>
  
      
    </div>
        `;
    }
}