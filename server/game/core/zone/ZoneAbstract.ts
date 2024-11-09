import { Card } from '../card/Card';
import * as Contract from '../utils/Contract';
import { Location, RelativePlayer } from '../Constants';
import Player from '../Player';
import Game from '../Game';

export abstract class ZoneAbstract<TCard extends Card> {
    public abstract readonly hiddenForPlayers: RelativePlayer | null;
    public abstract readonly zoneName: Location;

    public abstract get numCards(): number;

    public get cards(): TCard[] {
        return this.getCards();
    }

    public constructor(public readonly owner: Player | Game) { }

    public abstract getCards(filter?: (card: TCard) => boolean): TCard[];

    public hasCard(card: TCard): boolean {
        const cardCount = this.getCards((zoneCard: TCard) => zoneCard === card).length;

        Contract.assertFalse(cardCount > 1, `Found ${cardCount} duplicates of ${card.internalName} in ${this.zoneName}`);

        return cardCount === 1;
    }
}
