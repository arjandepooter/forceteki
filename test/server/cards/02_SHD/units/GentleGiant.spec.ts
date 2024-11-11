describe('Gentle Giant', function() {
    integration(function(contextRef) {
        describe('Gentle Giant\'s ability', function() {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: [
                            { card: 'gentle-giant', damage: 1 },
                            { card: 'r2d2#ignoring-protocol', damage: 3 },
                            { card: 'c3po#protocol-droid', damage: 1 }],
                    },
                    player2: {
                        groundArena: [{ card: 'wampa', damage: 1 }]
                    }
                });
            });

            it('heal a target', function () {
                const { context } = contextRef;

                const reset = (passAction = true) => {
                    context.gentleGiant.exhausted = false;
                    context.r2d2.damage = 3;
                    if (passAction) {
                        context.player2.passAction();
                    }
                };

                // CASE 1: Heal a target
                // Attack
                context.player1.clickCard(context.gentleGiant);
                expect(context.gentleGiant).toBeInLocation('ground arena');
                expect(context.player1).toBeAbleToSelectExactly([context.p2Base, context.wampa]);
                context.player1.clickCard(context.p2Base);

                // Healing Target
                expect(context.player1).toBeAbleToSelectExactly([context.r2d2, context.c3po, context.wampa]);
                context.player1.clickCard(context.r2d2);

                // Confirm Results
                expect(context.gentleGiant.exhausted).toBe(true);
                expect(context.r2d2.damage).toBe(2);

                reset();

                // CASE 2: Should be able to pass
                // Attack
                expect(context.r2d2.damage).toBe(3);
                context.player1.clickCard(context.gentleGiant);
                context.player1.clickCard(context.p2Base);

                // Passing prompt to heal
                context.player1.clickPrompt('Pass ability');
                expect(context.gentleGiant.exhausted).toBe(true);
                expect(context.r2d2.damage).toBe(3);
            });
        });
    });
});
