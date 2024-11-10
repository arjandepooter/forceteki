import { AbilityRestriction, EventName, Location, PlayType } from '../core/Constants.js';
import { Card } from '../core/card/Card';
import * as Contract from '../core/utils/Contract.js';
import { PlayCardContext, PlayCardAction } from '../core/ability/PlayCardAction.js';
import { MoveCardSystem } from '../gameSystems/MoveCardSystem.js';
import { GameEvent } from '../core/event/GameEvent.js';
import { TriggerHandlingMode } from '../core/event/EventWindow.js';

export class PlayEventAction extends PlayCardAction {
    public constructor(
        card: Card,
        playType: PlayType = PlayType.PlayFromHand,
        triggerHandlingMode: TriggerHandlingMode = TriggerHandlingMode.ResolvesTriggers
    ) {
        super(card, 'Play this event', playType, triggerHandlingMode);
    }

    public override executeHandler(context: PlayCardContext): void {
        Contract.assertTrue(context.source.isEvent());

        context.game.addMessage(
            '{0} plays {1}',
            context.player,
            context.source,
        );

        this.moveEventToDiscard(context);
        context.game.resolveAbility(context.source.getEventAbility().createContext());
    }

    public override meetsRequirements(context = this.createContext(), ignoredRequirements: string[] = []): string {
        if (
            context.player.hasRestriction(AbilityRestriction.PlayEvent, context) ||
            context.source.hasRestriction(AbilityRestriction.Play, context)
        ) {
            return 'restriction';
        }
        return super.meetsRequirements(context, ignoredRequirements);
    }

    public moveEventToDiscard(context: PlayCardContext) {
        const moveCardEvent = new MoveCardSystem({
            target: context.source,
            destination: Location.Discard
        }).generateEvent(context);

        const cardPlayedEvent = new GameEvent(EventName.OnCardPlayed, context, {
            player: context.player,
            card: context.source,
            originalLocation: context.source.location,
            originallyOnTopOfDeck:
                context.player && context.player.drawDeck && context.player.drawDeck[0] === context.source,
            playType: context.playType,
            onPlayCardSource: context.onPlayCardSource,
            resolver: this
        });

        const events = [moveCardEvent, cardPlayedEvent];

        if (context.playType === PlayType.Smuggle) {
            events.push(this.generateSmuggleEvent(context));
        }

        context.game.openEventWindow(events);
    }
}
