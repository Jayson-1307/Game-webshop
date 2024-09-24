# Technische docuumentatie GameOverview 

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
>     // Andere methoden...
> }
> ```
> De OrderItemService-klasse handelt functionaliteiten af met betrekking tot orderitems, inclusief het ophalen van alle beschikbare games. De getAllGames-methode verzendt een GET-verzoek naar het game-overzicht-eindpunt en retourneert een lijst van games wanneer het verzoek succesvol is, anders undefined.

> ## Routes
> ```ts
> import { Router } from "express";
> import { OrderItemController } from "./controllers/OrderItemController";
> 
> export const router: Router = Router();
> const orderItemController: OrderItemController = new OrderItemController();
> 
> router.get("/game-overview", orderItemController.getAllGames);
> // Andere route handlers
> ```
> De routes zijn verantwoordelijk voor het koppelen van HTTP-verzoekmethoden en URL-patronen aan de juiste controllermethoden. Hier wordt de /game-overview-route gekoppeld aan de getAllGames-methode in de OrderItemController.

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
>     // Andere methoden...
> }
> ```
> De OrderItemController-klasse bevat methoden voor het afhandelen van verzoeken met betrekking tot orderitems, waaronder het ophalen van alle spellen. De getAllGames-methode behandelt het ophalen van alle spellen met productdetails.

> ## GameOverview
>```ts
> import { LitElement, html, css, customElement } from "lit";
> import { OrderItemService } from "../../services/OrderItemService";
> import { RouterPage } from "../RouterPage";
> 
> @customElement("webshop-games-overview")
> export class GamesOverview extends LitElement {
>     // Methoden en logica voor het weergeven van het speloverzicht
> }
>```
> Het speloverzicht-component (GamesOverview) bevat de gebruikersinterface voor het weergeven van alle spellen. Het handelt gebruikersinteracties af en communiceert met de OrderItemService om spellen op te halen.