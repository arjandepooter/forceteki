import { PlayableOrDeployableCard } from '../card/baseClasses/PlayableOrDeployableCard';
import { Location } from '../Constants';
import { SimpleZone } from './SimpleZone';

export class DiscardZone extends SimpleZone<PlayableOrDeployableCard> {
    public override readonly hiddenForPlayers: null;
    public override readonly zoneName: Location.Discard;
}
