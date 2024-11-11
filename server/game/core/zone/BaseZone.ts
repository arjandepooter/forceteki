import { BaseCard } from '../card/BaseCard';
import { LeaderCard } from '../card/LeaderCard';
import { Location } from '../Constants';
import Player from '../Player';
import * as Contract from '../utils/Contract';
import { ICardFilterProperties, ZoneAbstract } from './ZoneAbstract';

export class BaseZone extends ZoneAbstract<LeaderCard | BaseCard> {
    public override readonly hiddenForPlayers: null;
    public override readonly owner: Player;
    public override readonly zoneName: Location.Base;

    private readonly base: BaseCard;
    private leader?: LeaderCard;

    public override get cards(): (LeaderCard | BaseCard)[] {
        return this.leader ? [this.base, this.leader] : [this.base];
    }

    public override get count() {
        return this.leader ? 2 : 1;
    }

    public override getCards(filter?: ICardFilterProperties): (LeaderCard | BaseCard)[] {
        return this.cards.filter(this.buildFilterFn(filter));
    }

    public constructor(owner: Player, base: BaseCard, leader: LeaderCard) {
        super(owner);

        this.base = base;
        this.leader = leader;
    }

    public unsetLeader() {
        Contract.assertNotNullLike(this.leader, `Attempting to remove leader from ${this} but it is in location ${this.owner.leader.location}`);

        this.leader = null;
    }

    public setLeader(leader: LeaderCard) {
        Contract.assertEqual(leader.controller, this.owner, `Attempting to add card ${leader.internalName} to ${this} but its controller is ${leader.controller}`);
        Contract.assertIsNullLike(this.leader, `Attempting to add leader ${leader.internalName} to ${this} but leader ${this.leader.internalName} is already there`);

        this.leader = leader;
    }
}
