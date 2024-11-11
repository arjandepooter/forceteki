import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';

export default class ChopperMetalMenace extends NonLeaderUnitCard {
    protected override getImplementationId() {
        return {
            id: '6208347478',
            internalName: 'chopper#metal-menace'
        };
    }

    public override setupCardAbilities() {
        this.addOnAttackAbility({
            title: 'Discard a card from the defending player\'s deck. If the card is an event, exhaust a resource that player controls.',
            immediateEffect: AbilityHelper.immediateEffects.sequential([
                AbilityHelper.immediateEffects.discardFromDeck((context) => ({
                    amount: 1,
                    target: context.source.activeAttack.target.controller
                })),
                AbilityHelper.immediateEffects.conditional((context) => ({
                    condition: this.isDiscardedCardEvent(context.events),
                    onTrue: AbilityHelper.immediateEffects.exhaustResources({ amount: 1, isCost: false, target: context.source.activeAttack.target.controller }),
                    onFalse: AbilityHelper.immediateEffects.noAction()
                }))
            ])
        });
    }

    private isDiscardedCardEvent(events: any[]): boolean {
        // If nothing was discarded, return false
        if (events.length === 0) {
            return false;
        }
        return events[0].card.isEvent();
    }
}

ChopperMetalMenace.implemented = true;