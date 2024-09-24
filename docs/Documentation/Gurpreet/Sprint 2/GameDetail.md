# Technische docuumentatie GameDetail 

> ## OrderItemService
> ```ts
> import { OrderItem } from "@shared/types";
> 
> /**
>  * Handles order item related functionality
>  */
> export class OrderItemService {
>     /**
>      * Get all games
>      * 
>      * @returns A list of all games when successful, otherwise `undefined`.
>      */
>     public async getAllGames(): Promise<any> {
>         // Verzend een GET-verzoek naar het game-overzicht-eindpunt
>         // Retourneer de lijst van games wanneer succesvol, anders `undefined`
>     }
>     
>     /**
>      * Get game by ID
>      * 
>      * @param id - The ID of the game
>      * @returns The game with the specified ID when successful, otherwise `undefined`.
>      */
>     public async getGameById(id: string): Promise<any> {
>         // Implementatie om een spel op te halen op basis van de ID
>     }
>     
>     // Andere methoden...
> }
> ```
> De OrderItemService-klasse handelt functionaliteiten af met betrekking tot orderitems, inclusief het ophalen van alle beschikbare games. De getAllGames-methode verzendt een GET-verzoek naar het game-overzicht-eindpunt en retourneert een lijst van games wanneer het verzoek succesvol is, anders undefined. De getGameById-methode haalt een specifiek spel op basis van de ID.

> ## Routes
> ```ts
> import { Router } from "express";
> import { OrderItemController } from "./controllers/OrderItemController";
> 
> export const router: Router = Router();
> const orderItemController: OrderItemController = new OrderItemController();
> 
> router.get("/game-overview", orderItemController.getAllGames);
> router.get("/game-detail/:id",  orderItemController.getGameById);
> // Andere route handlers
> ```
> De routes zijn verantwoordelijk voor het koppelen van HTTP-verzoekmethoden en URL-patronen aan de juiste controllermethoden. Hier worden de /game-overview- en /game-detail/:id-routes respectievelijk gekoppeld aan de getAllGames- en getGameById-methoden in de OrderItemController.

> ## OrderItemController
> ```ts
> import { Request, Response } from "express";
> import { getConnection, PoolConnection } from "mysql2/promise";
> import { queryDatabase } from "../services/databaseServices";
> 
> export class OrderItemController {
> 
>     public async getAllGames(_req: Request, res: Response): Promise<void> {
>         // Logica om alle spellen op te halen met productdetails
>     }
>     
>     /**
>      * Get game by ID
>      * 
>      * @param req - The request object
>      * @param res - The response object
>      */
>     public async getGameById(req: Request, res: Response): Promise<void> {
>         // Logica om een spel op te halen op basis van de ID uit het verzoek
>     }
>     
>     // Andere methoden...
> }
> ```
> De OrderItemController-klasse bevat methoden voor het afhandelen van verzoeken met betrekking tot orderitems, waaronder het ophalen van alle spellen en het ophalen van een specifiek spel op basis van de ID.

> ## GameOverview 
>```ts
> import { LitElement, html } from "lit";
> import { customElement } from "lit/decorators.js";
> import { RouterPage } from "../RouterPage";
> import { OrderItemService } from "../../services/OrderItemService";
> 
> @customElement("webshop-games-overview")
> export class GamesOverview extends LitElement {
>     private orderItemService: OrderItemService = new OrderItemService();
> 
>     private async getAllGames(): Promise<void> {
>         // Implementatie...
>     }
> 
>     private navigateTo(page: RouterPage, gameId?: string): void {
>         const event = new CustomEvent("navigate", {
>             detail: { page, gameId },
>             bubbles: true,
>             composed: true
>         });
>         this.dispatchEvent(event);
>     }
> 
>     public render(): TemplateResult {
>         // Implementatie...
>     }
> }
>```
> Het speloverzicht-component (GamesOverview) bevat de gebruikersinterface voor het weergeven van alle spellen. Het handelt gebruikersinteracties af en communiceert met de OrderItemService om spellen op te halen. Wanneer een gebruiker op een spel klikt, wordt een navigatiegebeurtenis verzonden met de game-ID, die wordt opgeslagen in het evenementdetail en doorgestuurd naar de handleNavigation-methode in het Root-component.

> ## Root 
> ```ts
> import { RouterPage } from "./RouterPage";
> import { UserService } from "../services/UserService";
> import { customElement, state } from "lit/decorators.js";
> import { LitElement, html, TemplateResult } from "lit";
> 
> @customElement("webshop-root")
> export class Root extends LitElement {
>     @state()
>     private _currentPage: RouterPage = RouterPage.Home;
> 
>     private gameId: number | undefined;
> 
>     private handleNavigation(event: CustomEvent): void {
>         let nextPage: RouterPage = event.detail;
>         this.gameId = event.detail.gameId;
> 
>         if (event.detail.gameId) {
>             nextPage = RouterPage.GameDetail;
>         }
> 
>         this._currentPage = nextPage;
>     }
> 
>     protected render(): TemplateResult {
>         let contentTemplate: TemplateResult;
> 
>         switch (this._currentPage) {
>             case RouterPage.GameDetail:
>                 contentTemplate = html`<webshop-game-detail .gameId="${this.gameId}"></webshop-game-detail>`;
>                 break;
> 
>             // ther pages if needed
>
>         }
> 
>         return html`${contentTemplate}`;
>     }
> }
> ```
> Het Root-component beheert de navigatie binnen de applicatie. De handleNavigation-methode behandelt navigatiegebeurtenissen en bepaalt de volgende pagina op basis van de huidige pagina en eventueel opgegeven game-ID. In de render-methode wordt de game-ID doorgegeven aan het GameDetail-component wanneer de RouterPage.GameDetail wordt weergegeven.

> ## GameDetail
>```ts
> import { LitElement, html } from "lit";
> import { customElement } from "lit/decorators.js";
> import { RouterPage } from "../RouterPage";
> import { OrderItemService } from "../../services/OrderItemService";
> 
> @customElement("webshop-game-detail")
> export class GameDetail extends LitElement {
>     // // Methoden en logica voor het weergeven van de specifieke spel met details
> }
>```
> Het GameDetail-component is verantwoordelijk voor het weergeven van de details van een specifiek spel. De game-ID wordt doorgegeven vanuit het Root-component om de juiste gamegegevens op te halen en weer te geven.