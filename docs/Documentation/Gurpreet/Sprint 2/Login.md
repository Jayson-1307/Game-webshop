# Technische docuumentatie Login 

> ## UserService
> ```ts
> import { UserLoginFormModel } from "@shared/formModels/UserLoginFormModel";
> import { TokenService } from "./TokenService";
> 
> export class UserService {
>     private _tokenService: TokenService = new TokenService();
> 
>     public async login(formData: UserLoginFormModel): Promise<boolean> {
>         // Verzend een POST-verzoek naar het login-eindpunt met de verstrekte inloggegevens
>         // Als het antwoord OK is, retourneer true, anders retourneer false
>     }
> 
>     public async checkExistingEmail(email: string): Promise<boolean> {
>         // Verzend een POST-verzoek om te controleren of het e-mailadres al bestaat
>         // Retourneer true als het e-mailadres bestaat, anders retourneer false
>     }
> 
>     // Andere methoden...
> }
> ```
> De UserService-klasse is verantwoordelijk voor het verwerken van gebruikersgerelateerde functionaliteiten, zoals het inloggen en het controleren van bestaande e-mailadressen. De login-methode verzendt een POST-verzoek naar het inlog-eindpunt met de verstrekte inloggegevens en retourneert true als het antwoord OK is, anders false. De checkExistingEmail-methode controleert of het opgegeven e-mailadres al bestaat in de database door middel van een POST-verzoek naar het controle-eindpunt.

> ## Routes
> ```ts
> import { Router } from "express";
> import { UserController } from "./controllers/UserController";
> 
> export const router: Router = Router();
> const userController: UserController = new UserController();
> 
> router.post("/users/login", (req, res) => userController.login(req, res));
> router.post("/users/check-email", (req, res) => userController.checkExistingEmail(req, res));
> // Andere route handlers
> ```
> De router definieert verschillende eindpunten voor het afhandelen van gebruikersverzoeken. De eindpunten voor inloggen en het controleren van bestaande e-mailadressen worden gekoppeld aan de respectievelijke methoden in de UserController.

> ## UserController
> ```ts
> import { Request, Response } from "express";
> import { UserLoginFormModel } from "@shared/formModels";
> import { UserService } from "../services/UserService";
> 
> export class UserController {
> 
>     public async login(req: Request, res: Response): Promise<void> {
>         // Verwerk het POST-verzoek voor inloggen met de verstrekte formuliergegevens
>     }
> 
>     public async checkExistingEmail(req: Request, res: Response): Promise<void> {
>         // Verwerk het POST-verzoek om te controleren of het e-mailadres al bestaat
>     }
> 
>     // Andere methoden...
> }
> ```
> De UserController bevat methoden voor het verwerken van verzoeken met betrekking tot gebruikers, zoals het inloggen en het controleren van bestaande e-mailadressen. In de login-methode wordt het POST-verzoek voor inloggen verwerkt met de verstrekte formuliergegevens. De checkExistingEmail-methode verwerkt het POST-verzoek om te controleren of het opgegeven e-mailadres al bestaat.

> ## Authenticationmiddleware
> ```ts
> import { Request, Response, NextFunction } from "express";
> 
> export function AuthenticationMiddleware(req: Request, res: Response, next: NextFunction): void {
>     // Voer authenticatie uit op basis van het inkomende verzoek
>     // Als de gebruiker geauthenticeerd is, ga dan door naar de volgende middleware of route handler
>     // Anders, retourneer een foutreactie
> }
> ```
> De AuthenticationMiddleware voert authenticatie uit op basis van het inkomende verzoek en wordt gebruikt om te controleren of een gebruiker geauthenticeerd is voordat de toegang tot bepaalde routes wordt toegestaan.

> ## Login
>```ts
> import { LitElement, html, css, customElement, state } from "lit";
> import { UserService } from "../services/UserService";
> import { RouterPage } from "./RouterPage";
> 
> @customElement("webshop-login")
> export class Login extends LitElement {
>     // Methoden en logica voor het inlogformulier
> }
>```
> De login-component bevat het gebruikersinterface voor het inlogformulier. Het verwerkt gebruikersinvoer en communiceert met de UserService om inlogverzoeken te verzenden.