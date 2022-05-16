# Cluedo Game 

SEI 36 - Project 1

Turn-based Game

# Technologies & Tools Used 
- HTML
- CSS
- JavaScript
- Git & Github

# How to Play the Game: 
- the idea of cluedo is go from room to room to eliminate people, places and weapons before you make a final guess of WHO, WHAT & WHERE
- roll dice to start game and you enter a room based on the roll. 
- on each turn, you can select any one suspect & any one weapon. 
- the suggestion will include the room you are in. 
- you can click the accuse button at any time and select a who, what, where to accuse. 
- Game ends once you click the check envelope button to check if your accusation was right!!

The game is deployed on Vercel & you can play the game here: https://cluedo.vercel.app/

# Approach & Process
Did some research on how the game was played but due to time constraints, I had to alter the game rules & game play quite a bit. 
I would have planned out the steps in more detail & follow the time schedule more diligently. With good planning, I could avoid giving myself undue stress since I underestimated the time it would take and the difficulties I would face. 

Glad that I still managed to make a minimum viable product despite the fact that I scrapped the codes and rewrote 

Note to self, to look for help earlier next time when i get stuck! 

## Code and Code Design

### General Process Flow: 

<img width="956" alt="Process Flow" src="https://user-images.githubusercontent.com/103851181/168554002-464e676d-62b3-4eb1-865a-b68f930449db.png">

### What would I do differently next time?
- Start small first & make sure the game code really works! 
- Make it a habit to console.log consistently so you know that if something went wrong, it’s the last part you just added that is causing this bug
- Try to have a clear flow & logic before starting & keep thinking of ways to simplify! Dont complicate things

### What went well?
Initially this was 3 repetitive functions to randomly select the character, weapon and room cards in addition to another 3 functions of filtering & mapping the remaining cards. I realised that i could refactor my code such that it could be done in one for loop.

![Snippet](https://user-images.githubusercontent.com/103851181/168575141-c6f94463-29bc-4ab7-8d2b-40a7ff15a31b.png)

### Things I would do the same next time: 
Look through my codes with the mindset to improve consistently
 
# SEI Post Mortem
### Habits I used during this unit that helped me: 
- Took breaks to be refreshed & get back to it! 
- Broke down my to-do list into mini parts to celebrate small wins 
- Googled & ask around for help eventually
### Habits that I have during this unit that I can improve on:
- Not looking for help when I get stuck until it's almost too late...
- I need to comment on my codes more 
