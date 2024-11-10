describe('Kanan Jarrus, Revealed Jedi', function() {
    integration(function(contextRef) {
        describe('Kanan\'s On Attack ability', function() {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        groundArena: ['kanan-jarrus#revealed-jedi']
                    },
                    player2: {
                        deck: 5
                    }
                });
            });

            it('should draw a card for each selected player', function () {
                const { context } = contextRef;
                expect(context.player2.deck.length).toBe(5);
                context.player1.clickCard(context.kananJarrus);
                expect(context.player2.base.damage).toBe(4);
            });
        });
    });
});