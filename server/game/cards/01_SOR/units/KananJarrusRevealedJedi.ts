import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { RelativePlayer } from '../../../core/Constants';

export default class KananJarrusRevealedJedi extends NonLeaderUnitCard {
    protected override getImplementationId() {
        return {
            id: '1662196707',
            internalName: 'kanan-jarrus#revealed-jedi'
        };
    }

    public override setupCardAbilities() {
        this.addOnAttackAbility({
            title: 'Discard a card from the defending player\'s deck for each Spectre you control. Heal 1 damage for each aspect among the discarded cards.',
            immediateEffect: AbilityHelper.immediateEffects.discardFromDeck((context) => ({
                amount: 1,
                target: context.source.activeAttack.target.controller
            }))
        });
    }
}

KananJarrusRevealedJedi.implemented = true;