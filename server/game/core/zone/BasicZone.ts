import { Card } from '../card/Card';
import * as Contract from '../utils/Contract';
import { ZoneAbstract } from './ZoneAbstract';

export abstract class BasicZone extends ZoneAbstract {
    protected cards: Card[] = [];

    public override getCards(filter: (card: Card) => boolean = () => true): Card[] {
        return this.cards.filter(filter);
    }

    public addCard(card: Card) {
        Contract.assertFalse(this.cards.includes(card), `Attempting to add card ${card.internalName} to ${this.zoneName} twice`);

        this.cards.push(card);
    }

    public removeCard(card: Card) {
        const cardIdx = this.cards.indexOf(card);

        Contract.assertFalse(cardIdx === -1, `Attempting to remove card ${card.internalName} from ${this.zoneName} but it is not there. Its current location is ${card.location}.`);

        this.cards.splice(cardIdx, 1);
    }
}
