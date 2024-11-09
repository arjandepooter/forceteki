import { PlayableCard } from '../card/CardTypes';
import { Location, RelativePlayer } from '../Constants';
import { BasicZone } from './BasicZone';

export class HandZone extends BasicZone<PlayableCard> {
    public override readonly hiddenForPlayers: RelativePlayer.Opponent;
    public override readonly zoneName: Location.Hand;
}
