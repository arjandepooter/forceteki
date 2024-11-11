describe('Public Enemy', function() {
    integration(function(contextRef) {
        describe('Public Enemy\'s Bounty ability', function() {
            it('should give a unit a shield', function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: ['battlefield-marine', 'atst']
                    },
                    player2: {
                        groundArena: [
                            { card: 'wampa', upgrades: ['public-enemy'] },
                            { card: 'republic-tactical-officer' }
                        ]
                    }
                });

                const { context } = contextRef;

                context.player1.clickCard(context.atst);

                // Destroys Wampa
                context.player1.clickCard(context.wampa);

                // Damange from Wampa to be assigned
                expect(context.atst.damage).toBe(4);

                // Assigning shield to Battlefield Marine
                expect(context.player1).toHavePassAbilityButton();
                expect(context.player1).toBeAbleToSelectExactly([context.battlefieldMarine, context.atst, context.republicTacticalOfficer]);
                context.player1.clickCard(context.battlefieldMarine);

                // Unit should have shield
                expect(context.battlefieldMarine).toHaveExactUpgradeNames(['shield']);
            });
        });
    });
});
