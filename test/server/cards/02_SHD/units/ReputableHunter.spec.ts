describe('Reputable Hunter', function() {
    integration(function(contextRef) {
        describe('Reputable Hunter\'s decrease cost ability', function() {
            beforeEach(function() {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['reputable-hunter', 'top-target'],
                        groundArena: ['reinforcement-walker'],
                        base: 'energy-conversion-lab',
                        leader: 'luke-skywalker#faithful-friend'
                    },
                    player2: {
                        groundArena: ['battlefield-marine'],
                        hand: ['hylobon-enforcer'],
                    }
                });
            });

            it('should cost 3 if there are no bounties on enemy units', () => {
                const { context } = contextRef;

                context.player1.clickCard(context.reputableHunter);

                expect(context.player1.countExhaustedResources()).toBe(3);
            });


            it('should cost 2 after we play a bounty on a unit', () => {
                const { context } = contextRef;

                context.player1.clickCard(context.topTarget);
                context.player1.clickCard(context.battlefieldMarine)
                const exhaustedResourcesBeforePlay = context.player1.countExhaustedResources();
                context.player2.passAction();
                context.player1.clickCard(context.reputableHunter);

                expect(context.battlefieldMarine).toHaveExactUpgradeNames(['top-target']);
                expect(context.player1.countExhaustedResources() - exhaustedResourcesBeforePlay).toBe(2);
            });

            it('should cost 2 if opponent has a unit with a dedicated bounty in play', () => {
                const { context } = contextRef;

                context.player1.passAction();
                context.player2.clickCard(context.hylobonEnforcer);
                context.player1.clickCard(context.reputableHunter);

                expect(context.player1.countExhaustedResources()).toBe(2);
            });
        });
    });
});
