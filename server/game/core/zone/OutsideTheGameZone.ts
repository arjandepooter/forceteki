import { Location } from '../Constants';
import { BasicZone } from './BasicZone';

export class OutsideTheGameZone extends BasicZone {
    public override readonly zoneName: Location.OutsideTheGame;
}
