import { Card } from '../card/Card';
import Player from '../Player';
import * as Contract from '../utils/Contract';
import { ZoneAbstract } from './ZoneAbstract';

export abstract class BasicZone<TCard extends Card> extends ZoneAbstract<TCard> {
    protected _cards: TCard[] = [];

    public override get cards(): TCard[] {
        return this._cards;
    }

    public override get numCards() {
        return this._cards.length;
    }

    public constructor(public override readonly owner: Player) {
        super(owner);
    }

    public override getCards(filter: (card: TCard) => boolean = () => true): TCard[] {
        return this._cards.filter(filter);
    }

    public addCard(card: TCard) {
        Contract.assertFalse(this._cards.includes(card), `Attempting to add card ${card.internalName} to ${this.zoneName} twice`);

        this._cards.push(card);
    }

    public removeCard(card: TCard) {
        const cardIdx = this._cards.indexOf(card);

        Contract.assertFalse(cardIdx === -1, `Attempting to remove card ${card.internalName} from ${this.zoneName} but it is not there. Its current location is ${card.location}.`);

        this._cards.splice(cardIdx, 1);
    }
}
