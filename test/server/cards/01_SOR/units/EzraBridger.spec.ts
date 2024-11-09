describe('Ezra Bridger', function() {
    integration(function(contextRef) {
        describe('Ezra Bridger\'s ability', function() {
            beforeEach(function () {
                contextRef.setupTest({
                    phase: 'action',
                    player1: {
                        hand: ['moisture-farmer'],
                        groundArena: ['ezra-bridger#resourceful-troublemaker'],
                        deck: ['moment-of-peace',
                            'wampa',
                            'atst',
                            'atst',
                            'atst',
                            'atst',
                            'atst',
                        ]
                    },
                    player2: {
                        base: 'dagobah-swamp',
                        groundArena: ['death-trooper']
                    }
                });
            });

            it('should trigger when he completes an attack', function () {
                const { context } = contextRef;
                const reset = () => {
                    context.ezraBridger.exhausted = false;
                    context.player2.passAction();
                };

                // CASE 1: We do nothing and put the top card back
                context.player1.clickCard(context.ezraBridger);
                context.player1.clickCard(context.deathTrooper);

                // TODO: we need a 'look at' prompt for secretly revealing, currently chat logs go to all players
                expect(context.getChatLogs(1)).toContain('Ezra Bridger sees Moment of Peace');
                expect(context.player1).toHaveExactPromptButtons(['Play it', 'Discard it', 'Leave it on top of your deck']);

                // check that the damage was done before player1 clicks prompt
                expect(context.ezraBridger.damage).toBe(3);
                expect(context.deathTrooper).toBeInLocation('discard');

                // Leave it on top of the deck
                const beforeActionDeck = context.player1.deck;
                context.player1.clickPrompt('Leave it on top of your deck');
                expect(context.player1.deck).toEqual(beforeActionDeck);

                // reset
                reset();

                // CASE 2: We discard the card.
                context.player1.clickCard(context.ezraBridger);
                // TODO: we need a 'look at' prompt for secretly revealing, currently chat logs go to all players
                expect(context.getChatLogs(1)).toContain('Ezra Bridger sees Moment of Peace');
                expect(context.player1).toHaveExactPromptButtons(['Play it', 'Discard it', 'Leave it on top of your deck']);

                // check that the damage was done before player1 clicks prompt
                expect(context.p2Base.damage).toBe(3);

                // Discard it
                context.player1.clickPrompt('Discard it');
                expect(context.momentOfPeace).toBeInLocation('discard');
                expect(context.player1.deck.length).toEqual(6);

                // reset
                reset();

                // CASE 3: We play the card from deck
                context.player1.clickCard(context.ezraBridger);
                // TODO: we need a 'look at' prompt for secretly revealing, currently chat logs go to all players
                expect(context.getChatLogs(1)).toContain('Ezra Bridger sees Wampa');
                expect(context.player1).toHaveExactPromptButtons(['Play it', 'Discard it', 'Leave it on top of your deck']);
                // check that the damage was done before player1 clicks prompt
                expect(context.p2Base.damage).toBe(6);

                context.player1.clickPrompt('Play it');

                // check board state
                expect(context.player1.countExhaustedResources()).toBe(4);
                expect(context.wampa).toBeInLocation('ground arena');
                expect(context.wampa.exhausted).toBe(true);
            });
        });
    });
});
