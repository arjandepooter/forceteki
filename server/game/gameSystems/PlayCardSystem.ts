import type { Card } from '../core/card/Card';
import AbilityResolver from '../core/gameSteps/AbilityResolver';
import { CardTargetSystem, ICardTargetSystemProperties } from '../core/gameSystem/CardTargetSystem';
import { AbilityContext } from '../core/ability/AbilityContext';
import * as Contract from '../core/utils/Contract';
import { CardType, PlayType, MetaEventName } from '../core/Constants';
import { isPlayable } from '../core/card/CardTypes';
import { PlayCardAction } from '../core/ability/PlayCardAction';
import { PlayUnitAction } from '../actions/PlayUnitAction';
import { PlayUpgradeAction } from '../actions/PlayUpgradeAction';
import { PlayEventAction } from '../actions/PlayEventAction';
import { TriggerHandlingMode } from '../core/event/EventWindow';
import { ICostAdjusterProperties } from '../core/cost/CostAdjuster';
import { PlayerPhaseLastingEffectSystem } from './PlayerPhaseLastingEffectSystem';
import * as AbilityLimit from '../core/ability/AbilityLimit';
import { modifyCost } from '../ongoingEffects/ModifyCost';

export interface IPlayCardProperties extends ICardTargetSystemProperties {
    ignoredRequirements?: string[];

    /** By default, the system will inherit the `optional` property from the activating ability. Use this to override the behavior. */
    optional?: boolean;
    entersReady?: boolean;
    playType?: PlayType;

    /** @deprecated not used or tested yet */
    nested?: boolean;
    costAdjusterProperties?: ICostAdjusterProperties;
}

// TODO: implement playing with smuggle and from non-standard zones(discard(e.g. Palpatine's Return), top of deck(e.g. Ezra Bridger), etc.) as part of abilties with another function(s)
/**
 * This system is a helper for playing cards from abilities (see {@link GameSystemLibrary.playCard}).
 */
export class PlayCardSystem<TContext extends AbilityContext = AbilityContext> extends CardTargetSystem<TContext, IPlayCardProperties> {
    public override readonly name = 'playCard';
    public override readonly eventName = MetaEventName.PlayCard;
    protected override readonly targetTypeFilter = [CardType.BasicUnit, CardType.BasicUpgrade, CardType.Event];
    protected override readonly defaultProperties: IPlayCardProperties = {
        ignoredRequirements: [],
        optional: false,
        entersReady: false,
        playType: PlayType.PlayFromHand,
        nested: false
    };

    public eventHandler(event, additionalProperties): void {
        const player = event.player;
        const newContext = (event.playCardAbility as PlayCardAction).createContext(player);
        if (this.properties.costAdjusterProperties) {
            this.queueApplyCostAdjusterGameSteps(this.properties.costAdjusterProperties, newContext);
        }
        event.context.game.queueStep(new AbilityResolver(event.context.game, newContext, event.optional));
    }

    private queueApplyCostAdjusterGameSteps(costAdjusterProperties: ICostAdjusterProperties, context: AbilityContext) {
        // TODO THIS PR: look into making a custom duration for this action only
        const applyCostAdjusterSystem = new PlayerPhaseLastingEffectSystem({
            effect: modifyCost(Object.assign(costAdjusterProperties, { limit: AbilityLimit.perGame(1), playingTypes: context.playType }))
        });
        const effectEvents = [];
        applyCostAdjusterSystem.queueGenerateEventGameSteps(effectEvents, context, {});
        context.game.queueSimpleStep(() => context.game.openEventWindow(effectEvents), 'open event window for application of cost adjuster');
    }

    public override getEffectMessage(context: TContext): [string, any[]] {
        const properties = this.generatePropertiesFromContext(context);
        return ['play {0}', [properties.target]];
    }

    protected override addPropertiesToEvent(event, target, context: TContext, additionalProperties = {}): void {
        const properties = this.generatePropertiesFromContext(context, additionalProperties);

        super.addPropertiesToEvent(event, target, context, additionalProperties);

        event.playCardAbility = this.generatePlayCardAbility(target, this.properties.playType);
        event.optional = properties.optional ?? context.ability.optional;
    }

    public override canAffect(card: Card, context: TContext, additionalProperties = {}): boolean {
        if (!(isPlayable(card))) {
            return false;
        }
        const properties = this.generatePropertiesFromContext(context, additionalProperties);
        if (!super.canAffect(card, context)) {
            return false;
        }

        const playCardAbility = this.generatePlayCardAbility(card, this.properties.playType);
        const newContext = playCardAbility.createContext(context.player);

        return !playCardAbility.meetsRequirements(newContext, properties.ignoredRequirements);
    }

    /**
     * Generate a play card ability for the specified card.
     */
    private generatePlayCardAbility(card: Card, playType: PlayType) {
        const triggerHandlingMode = this.properties.nested ? TriggerHandlingMode.ResolvesTriggers : TriggerHandlingMode.PassesTriggersToParentWindow;
        switch (card.type) {
            case CardType.BasicUnit: return new PlayUnitAction(card, playType, this.properties.entersReady, triggerHandlingMode);
            case CardType.BasicUpgrade: return new PlayUpgradeAction(card, playType, triggerHandlingMode);
            case CardType.Event: return new PlayEventAction(card, playType, triggerHandlingMode);
            default: Contract.fail(`Attempted to play a card with invalid type ${card.type} as part of an ability`);
        }
    }
}
