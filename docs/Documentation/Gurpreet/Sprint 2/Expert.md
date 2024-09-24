> # Expert (Sprint 2)
> In deze expert review heb ik een functionaliteit ontwikkeld voor een webshop, waarbij gebruikers interactie kunnen hebben met verschillende onderdelen. Dit omvat zowel front-end als back-end componenten. Hieronder volgt een samenvatting van wat ik heb gerealiseerd:

> ## [Login](./Login.md)
> Ik heb een login-functionaliteit geïmplementeerd waarbij de gebruiker kan inloggen via een formulier. De ``UserService`` handelt de inlogverzoeken af en controleert bestaande e-mailadressen. Er zijn routes en controllers opgezet om deze verzoeken te verwerken en een ``Login`` component voor de gebruikersinterface.

> ## [Register](./Register.md)
> Voor de registratie van nieuwe gebruikers heb ik een registratieformulier ontwikkeld. De ``UserService`` verwerkt de registratieverzoeken en controleert bestaande e-mailadressen. Ook hier zijn routes en controllers opgezet om de registratieverzoeken af te handelen en is er een ``Register`` component voor de gebruikersinterface.

> ## [GameOverview](./GameOverview.md)
> Ik heb een overzichtspagina gemaakt voor het weergeven van alle beschikbare games. De ``OrderItemService`` haalt de lijst van games op via een GET-verzoek. Routes en controllers zijn ingesteld om deze verzoeken te verwerken. Het ``GamesOverview`` component toont de spellen in een overzicht en handelt gebruikersinteracties af.

> ## [GameDetail](./GameDetail.md)
> Daarnaast heb ik een detailpagina ontwikkeld voor het weergeven van specifieke game-informatie. De ``OrderItemService`` bevat een methode om een spel op te halen op basis van de ID. Routes en controllers zijn ingesteld om deze verzoeken te verwerken. Het ``GameDetail`` component toont de details van een specifiek spel.
