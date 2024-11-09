import { PlayableOrDeployableCard } from '../card/baseClasses/PlayableOrDeployableCard';
import { Location } from '../Constants';
import { BasicZone } from './BasicZone';

export class DiscardZone extends BasicZone<PlayableOrDeployableCard> {
    public override readonly hiddenForPlayers: null;
    public override readonly zoneName: Location.Discard;
}
