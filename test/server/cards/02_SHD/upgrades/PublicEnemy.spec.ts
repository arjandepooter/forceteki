describe('Public Enemy', function() {
    integration(function(contextRef) {
        describe('Public Enemy\'s Bounty ability', function() {
            it('should give a unit a shield', function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: [
                            { card: 'battlefield-marine' },
                            { card: 'atst' }
                        ]
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
                expect(context.player1).toBeAbleToSelectExactly([context.p2Base, context.wampa, context.republicTacticalOfficer]);
                // Destroys Wampa
                context.player1.clickCard(context.wampa);
                expect(context.atst.damage).toBe(4);
                // Checking Wampa is destroyed
                expect(context.wampa).toBeInLocation('discard');
                // Selecting Unit to give shield
                expect(context.player1).toHavePrompt('Choose a unit');
                expect(context.player1).toHavePassAbilityButton();
                expect(context.player1).toBeAbleToSelectExactly([context.battlefieldMarine, context.atst, context.republicTacticalOfficer]);
                context.player1.clickCard(context.battlefieldMarine);
                // Unit should have shield
                expect(context.battlefieldMarine).toHaveExactUpgradeNames(['shield']);

                // New round
                context.moveToNextActionPhase();
                context.player1.passAction();

                // Player two attacks shielded unit
                context.player2.clickCard(context.republicTacticalOfficer);
                expect(context.player2).toBeAbleToSelectExactly([context.p1Base, context.atst, context.battlefieldMarine]);
                context.player2.clickCard(context.battlefieldMarine);

                // Shield should be removed and unit takes no damage
                expect(context.battlefieldMarine.damage).toBe(0);
            });
        });
    });
});
