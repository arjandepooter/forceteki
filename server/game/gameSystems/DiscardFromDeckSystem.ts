import { AbilityContext } from '../core/ability/AbilityContext';
import { Card } from '../core/card/Card';
import { EventName } from '../core/Constants';
import { IPlayerTargetSystemProperties, PlayerTargetSystem } from '../core/gameSystem/PlayerTargetSystem';
import Player from '../core/Player';
import { DiscardSpecificCardSystem } from './DiscardSpecificCardSystem';
import * as Contract from '../core/utils/Contract';

export interface IDiscardFromDeckProperties extends IPlayerTargetSystemProperties {
    amount?: number;
}

export class DiscardFromDeckSystem<TContext extends AbilityContext = AbilityContext> extends PlayerTargetSystem<TContext, IDiscardFromDeckProperties> {
    public override readonly name = 'discardFromDeck';
    public override readonly eventName = EventName.OnDiscardFromDeck;

    protected override defaultProperties: IDiscardFromDeckProperties = {
        amount: 1
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public override eventHandler(_event): void { }

    // public eventHandler(event): void {
    //     for (let i = 0; i < event.amount; i++) {
    //         const topCard = event.player.getTopCardOfDeck();
    //         event.player.moveCard(topCard, Location.Discard);
    //     }
    // }

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

    public override queueGenerateEventGameSteps(events: any[], context: TContext, additionalProperties: Record<string, any> = {}): void {
        const properties = this.generatePropertiesFromContext(context, additionalProperties);
        for (const player of properties.target as Player[]) {
            const availableDeck = player.drawDeck;

            Contract.assertNonNegative(properties.amount);

            const amount = Math.min(availableDeck.length, properties.amount);

            if (amount === 0) {
                events.push(this.generateEvent(context, additionalProperties));
                return;
            }

            const topCards = player.getTopCardsOfDeck(amount);
            if (Array.isArray(topCards)) {
                topCards.forEach((card) => this.generateEventsForCard(card, context, events, additionalProperties));
            } else if (topCards !== null) {
                this.generateEventsForCard(topCards, context, events, additionalProperties);
            }

            // Add a final event to convey overall event resolution status.
            events.push(this.generateEvent(context, additionalProperties));
        }
    }

    private generateEventsForCard(card: Card, context: TContext, events: any[], additionalProperties: Record<string, any>): void {
        const specificDiscardEvent = new DiscardSpecificCardSystem({ target: card }).generateEvent(context);
        events.push(specificDiscardEvent);
        // TODO: Update this to include partial resolution once added for discards that could not be done to fullest extent.
    }
}
