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

            it('should heal a target with 1 damage to full', function () {
                const { context } = contextRef;

                // Attack
                context.player1.clickCard(context.gentleGiant);
                expect(context.gentleGiant).toBeInLocation('ground arena');
                expect(context.player1).toBeAbleToSelectExactly([context.p2Base, context.wampa]);
                context.player1.clickCard(context.p2Base);

                // Healing Target
                expect(context.player1).toBeAbleToSelectExactly([context.r2d2, context.c3po, context.wampa]);
                context.player1.clickCard(context.c3po);

                // Confirm Results
                expect(context.gentleGiant.exhausted).toBe(true);
                expect(context.c3po.damage).toBe(0);
            });

            it('should heal 1 damage from a unit', function () {
                const { context } = contextRef;

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
            });

            it('should be able to heal an enemy unit', function () {
                const { context } = contextRef;

                // Attack
                context.player1.clickCard(context.gentleGiant);
                expect(context.wampa.damage).toBe(1);
                expect(context.gentleGiant).toBeInLocation('ground arena');
                expect(context.player1).toBeAbleToSelectExactly([context.p2Base, context.wampa]);
                context.player1.clickCard(context.p2Base);

                // Healing Target
                expect(context.player1).toBeAbleToSelectExactly([context.r2d2, context.c3po, context.wampa]);
                context.player1.clickCard(context.wampa);

                // Confirm Results
                expect(context.gentleGiant.exhausted).toBe(true);
                expect(context.wampa.damage).toBe(0);
            });

            it('should be able to be passed', function () {
                const { context } = contextRef;

                expect(context.r2d2.damage).toBe(3);
                context.player1.clickCard(context.gentleGiant);
                context.player1.clickCard(context.p2Base);

                context.player1.clickPrompt('Pass ability');
                expect(context.gentleGiant.exhausted).toBe(true);
                expect(context.r2d2.damage).toBe(3);
            });
        });
    });
});
