import AbilityHelper from '../AbilityHelper';
import { AbilityContext } from '../core/ability/AbilityContext';
import { Card } from '../core/card/Card';
import { EventName, Location } from '../core/Constants';
import { IPlayerTargetSystemProperties, PlayerTargetSystem } from '../core/gameSystem/PlayerTargetSystem';
import Player from '../core/Player';
import { GameEvent } from '../core/event/GameEvent';
import { DamageSystem } from './DamageSystem';

export interface IDiscardFromDeckProperties extends IPlayerTargetSystemProperties {
    amount?: number;
}

export class DiscardFromDeckSystem<TContext extends AbilityContext = AbilityContext> extends PlayerTargetSystem<TContext, IDiscardFromDeckProperties> {
    public override readonly name = 'discardFromDeck';
    public override readonly eventName = EventName.OnDiscardFromDeck;

    protected override defaultProperties: IDiscardFromDeckProperties = {
        amount: 1
    };

    public eventHandler(event): void {
        for (let i = 0; i < event.amount; i++) {
            const topCard = event.player.getTopCardOfDeck();
            event.card.controller.moveCard(topCard, Location.Discard);
        }
    }

    public override getEffectMessage(context: TContext): [string, any[]] {
        const properties = this.generatePropertiesFromContext(context);
        return ['discard ' + (properties.amount + (properties.amount > 1 ? ' cards' : ' card') + ' from deck'), []];
    }

    public override canAffect(player: Player, context: TContext, additionalProperties = {}): boolean {
        const properties = this.generatePropertiesFromContext(context, additionalProperties);
        return properties.amount !== 0 && super.canAffect(player, context);
    }

    public override defaultTargets(context: TContext): Player[] {
        return [context.player];
    }

    protected override addPropertiesToEvent(event, player: Player, context: TContext, additionalProperties): void {
        const { amount } = this.generatePropertiesFromContext(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
    }

    // protected override updateEvent(event, card: Card, context: TContext, additionalProperties): void {
    //     super.updateEvent(event, card, context, additionalProperties);

    //     // TODO: convert damage on draw to be a real replacement effect once we have partial replacement working
    //     event.setContingentEventsGenerator((event) => {
    //         // Add a contingent event to deal damage for any cards the player fails to draw due to not having enough left in their deck.
    //         const contingentEvents = [];
    //         if (event.amount > event.player.drawDeck.length) {
    //             const damageAmount = 3 * (event.amount - event.player.drawDeck.length);
    //             contingentEvents.push(new DamageSystem({
    //                 target: event.player.base,
    //                 amount: damageAmount
    //             }).generateEvent(context));
    //         }
    //         return contingentEvents;
    //     });
    // }
}
