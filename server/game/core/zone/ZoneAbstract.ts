import { Card } from '../card/Card';
import * as Contract from '../utils/Contract';
import { Location } from '../Constants';

export abstract class ZoneAbstract {
    public abstract readonly zoneName: Location;

    public abstract getCards(filter?: (card: Card) => boolean): Card[];

    public hasCard(card: Card): boolean {
        const cardCount = this.getCards((zoneCard: Card) => zoneCard === card).length;

        Contract.assertFalse(cardCount > 1, `Found ${cardCount} duplicates of ${card.internalName} in ${this.zoneName}`);

        return cardCount === 1;
    }
}
