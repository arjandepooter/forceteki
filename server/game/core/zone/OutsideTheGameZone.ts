import { Card } from '../card/Card';
import { Location } from '../Constants';
import { BasicZone } from './BasicZone';

export class OutsideTheGameZone extends BasicZone<Card> {
    public override readonly hiddenForPlayers: null;
    public override readonly zoneName: Location.OutsideTheGame;
}
