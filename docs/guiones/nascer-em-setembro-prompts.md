# Prompts de imagen — «Por que é chato nascer em setembro»

57 planos, uno cada **1,4 s** (~80 s). Formato **9:16 (1080×1920)**. Modelo: imágenes de Gemini, usando las fichas de personaje como **imágenes de referencia** en cada plano.
Los tiempos son orientativos: al grabar la voz, cada corte se ajusta a la palabra más cercana.

## Bloque de estilo (va delante de cada prompt)

```
Vertical 9:16 2D cartoon illustration, polished modern flat-vector style with chibi proportions
(head about half the body height, big expressive eyes, rosy cheeks), thick dark-brown outlines,
soft cel shading with gentle gradients, ambient occlusion and warm rim light, rich detailed pastel
backgrounds with depth (slightly blurred foreground props), cozy cinematic lighting.
Keep the top 15% and the bottom 30% of the frame calm (simple wall, sky or floor) for captions.
Absolutely no text, letters, numbers or logos anywhere in the image.
```

## Fichas de personaje (generar primero, fondo blanco, de frente / 3/4 / perfil)

| ref | personaje |
|---|---|
| **REF-LEO** | Boy «Leo», light-brown skin, messy dark-brown hair with a cowlick, round face, big brown eyes, **coral-orange hoodie** with a small yellow star patch, blue jeans, white sneakers. Sheets at ages: newborn (orange blanket), 5, 7, 9, 12, 16, 20 and 30 (short beard). |
| **REF-PAI** | Dad, tall, tan skin, thick black beard, round glasses, big warm smile, wearing an **ugly red knitted Christmas sweater** with a green pine tree, a reindeer and white pom-poms. Also aged ~55 (grey beard, same sweater). |
| **REF-MAE** | Mom, dark skin, big black curly hair, gold hoop earrings, mustard-yellow dress. |
| **REF-ESPOSA** | Leo's wife (age 30), fair skin, straight auburn hair in a bun, light-green hospital gown. |
| **REF-BEBÊ** | Newborn baby girl, tiny pink bow, wrapped in a pink blanket. |
| **REF-MATERNIDADE** | Hospital room: pastel mint walls, bed on the left, window on the right with a **flowering yellow ipê tree** outside, small tray with a red bell pepper. |

## Planos

| # | t (s) | Narración | Prompt (después del bloque de estilo) | refs |
|---|---|---|---|---|
| 1 | 0.0 | Por que é chato | Close-up of a big paper wall calendar with one day circled in thick red marker; a newborn in an orange blanket peeks up from below the calendar, surprised. | LEO(newborn) |
| 2 | 1.4 | nascer em setembro. | Maternity nursery, a newborn sleeps in a clear hospital crib; through the window a yellow ipê tree in full bloom, golden petals drifting. | LEO(newborn), MATERNIDADE |
| 3 | 2.8 | Você chega ao mundo | A smiling nurse lifts the newborn wrapped in an orange blanket, soft morning light, sparkles. | LEO(newborn) |
| 4 | 4.2 | num 9 de setembro. | Wide shot of the hospital room: tired happy mom in bed holding the baby, ipê tree in the window. | MAE, LEO(newborn), MATERNIDADE |
| 5 | 5.6 | Seu pai entra na maternidade | The door bursts open, dad rushes in beaming, arms wide, motion lines. | PAI, MATERNIDADE |
| 6 | 7.0 | de suéter de Natal, | Close-up of dad proudly pointing at his ugly red Christmas sweater (pine tree, reindeer, pom-poms), confident grin. | PAI |
| 7 | 8.4 | te ergue no colo: | Low angle, dad lifts the baby high above his head in triumph, light rays behind them. | PAI, LEO(newborn) |
| 8 | 9.8 | «Nosso presente de Natal!» | Dad shouting with joy, the baby has a big shiny red gift bow on its head. | PAI, LEO(newborn) |
| 9 | 11.2 | Sua mãe fica vermelha | Mom in the hospital bed, face bright red with embarrassment, pulling the blanket up to her nose. | MAE, MATERNIDADE |
| 10 | 12.6 | feito pimentão. | Comic split: mom's red face next to a shiny red bell pepper on the tray, both the exact same red. | MAE, MATERNIDADE |
| 11 | 14.0 | Aos cinco anos, | Leo age 5 wearing swim goggles, an inflatable duck swim ring and a party hat, jumping with excitement. | LEO(5) |
| 12 | 15.4 | você pede festa na piscina. | Leo tugging mom's dress in the living room, a dreamy thought bubble of a pool party with balloons. | LEO(5), MAE |
| 13 | 16.8 | A piscina fechou ontem. | Public pool gate locked with a heavy chain and padlock, the pool behind is drained; Leo in goggles stares through the bars. | LEO(5) |
| 14 | 18.2 | O verão acabou. | Leo sitting on the curb under a grey drizzle, holding a deflating duck swim ring, one leaf falling. | LEO(5) |
| 15 | 19.6 | Aos sete, | Bright primary-school classroom, Leo age 7 at his desk, backpack on the chair. | LEO(7) |
| 16 | 21.0 | mais três colegas | Three classmates (a girl with braids, a boy with glasses, a red-haired boy) stand up proudly, each holding a party invitation. | LEO(7) |
| 17 | 22.4 | fazem aniversário na mesma semana. | Top-down view of a school desk with four party invitations side by side, each with the same day circled in red. | — |
| 18 | 23.8 | Três festas. No mesmo sábado. | Leo alone at his party table with a cake and party hats on empty chairs, a single balloon drifting. | LEO(7) |
| 19 | 25.2 | A turma inteira vai | Group of kids running past Leo's house waving, Leo watching from the gate. | LEO(7) |
| 20 | 26.6 | na que tem pônei. | Backyard party: all the kids surround a fluffy white pony wearing a tiny party hat, confetti. | — |
| 21 | 28.0 | E não é azar: setembro é lotado. | Maternity nursery absolutely packed with dozens of cribs, nurses squeezing between them. | MATERNIDADE |
| 22 | 29.4 | Nos Estados Unidos, | Same packed nursery, a small US flag on the wall, babies in cribs. | — |
| 23 | 30.8 | nove dos dez aniversários | Infographic-style: ten cupcakes in a row on a pastel shelf, nine with purple candles, one with a green candle. | — |
| 24 | 32.2 | mais comuns caem em setembro. | A calendar page overflowing with cupcakes, balloons and confetti bursting out of it. | — |
| 25 | 33.6 | Só no dia 9, | Giant red-circled calendar day, nurses rushing past pushing cribs, motion blur. | — |
| 26 | 35.0 | nascem mais de doze mil bebês. | Overhead shot of a sea of hospital cribs stretching to the horizon, each with a sleeping baby. | — |
| 27 | 36.4 | Na Inglaterra e no País de Gales, | Cosy British maternity ward with small Union Jack bunting, rain on the window. | — |
| 28 | 37.8 | o campeão é o dia 26. | A baby in a crib wearing a tiny gold medal, holding a small golden trophy, spotlight. | — |
| 29 | 39.2 | Aos nove, | Leo age 9 pushing a shopping cart into a party store, excited. | LEO(9) |
| 30 | 40.6 | você vai comprar as coisas da festa. | Leo reading a long shopping list in the store aisle, pencil behind his ear. | LEO(9) |
| 31 | 42.0 | A loja só vende Halloween. | Store aisle full of orange pumpkins, skeletons, bats and witch hats; Leo shocked, list falling. | LEO(9) |
| 32 | 43.4 | No seu bolo, | Birthday table with a big chocolate cake and lit candles, warm light. | — |
| 33 | 44.8 | uma aranha de plástico. | Close-up: a black plastic spider on top of the cake; Leo's unimpressed face behind it. | LEO(9) |
| 34 | 46.2 | Aos doze, | Middle-school classroom, Leo age 12 at his desk. | LEO(12) |
| 35 | 47.6 | alguém pergunta o seu signo. | A curious girl classmate leans over to Leo, a thought bubble with a zodiac wheel. | LEO(12) |
| 36 | 49.0 | «Virgem.» | Leo answers innocently, small shrug, a tiny halo of innocence. | LEO(12) |
| 37 | 50.4 | A sala inteira cai na gargalhada. | The whole class laughing hard and pointing, tears of laughter; Leo bright red, sinking in his chair. | LEO(12) |
| 38 | 51.8 | Aos dezesseis, | Teen bedroom with posters (no text), Leo age 16 at his desk with headphones around his neck. | LEO(16) |
| 39 | 53.2 | você conta nove meses para trás. | Leo counting on his fingers in front of a wall calendar, flipping its pages backwards. | LEO(16) |
| 40 | 54.6 | Natal. O suéter do seu pai. | Thought bubble: dad in his ugly Christmas sweater winking next to a Christmas tree. | LEO(16), PAI |
| 41 | 56.0 | Ah, não. | Leo horrified, hands on his cheeks, face turning green, dramatic spotlight. | LEO(16) |
| 42 | 57.4 | Aos vinte, você mora longe. | Small city apartment at dusk, Leo age 20 by the window, city lights outside. | LEO(20) |
| 43 | 58.8 | No seu aniversário, chega uma caixa: | Doorstep: a cardboard parcel with a heart sticker, Leo picking it up. | LEO(20) |
| 44 | 60.2 | o suéter de Natal do seu pai e um bilhete. | Open box: the ugly red Christmas sweater folded inside, glowing softly, a small handwritten card with a heart on top. | — |
| 45 | 61.6 | «Ainda é o nosso melhor presente de Natal.» | Leo reading the card, teary smile; a framed photo of his parents on the shelf. | LEO(20) |
| 46 | 63.0 | Pela primeira vez, você ama setembro. | Leo wearing the sweater, hugging himself, little hearts floating, warm golden light, ipê petals outside the window. | LEO(20) |
| 47 | 64.4 | E tem notícia boa: | Sunny British school courtyard with bunting, kids in uniforms. | — |
| 48 | 65.8 | na Inglaterra, quem nasce em setembro é o mais velho da turma. | Kids lined up by height; the tallest one at the front wears a tiny golden crown. | — |
| 49 | 67.2 | E, em média, tira notas melhores | A test paper with a big red star and a smiley stamp (no letters), held up proudly. | — |
| 50 | 68.6 | do que quem nasce em agosto. | Two kids side by side: one confident with a star sticker, one sweating and scratching his head. | — |
| 51 | 70.0 | Aos trinta, sua filha nasce… | Hospital corridor, Leo age 30 pacing nervously. | LEO(30) |
| 52 | 71.4 | num 9 de setembro. | The same hospital room as before: newborn girl with a pink bow, the yellow ipê tree in the window. | BEBÊ, MATERNIDADE |
| 53 | 72.8 | Você chega de suéter de Natal, | The door bursts open: Leo age 30 in the same ugly Christmas sweater (a bit tight on him), arms wide. | LEO(30), MATERNIDADE |
| 54 | 74.2 | ergue ela no colo: «Nosso presente de Natal!» | Low angle, Leo lifts the baby girl high, same pose as his dad decades ago, light rays. | LEO(30), BEBÊ |
| 55 | 75.6 | Sua esposa fica vermelha feito pimentão. | The wife in bed, face bright red, next to the red bell pepper on the tray; grey-bearded dad in the doorway in his own sweater, laughing. | ESPOSA, PAI(55), MATERNIDADE |
| 56 | 77.0 | Nasceu em setembro? Marca alguém que nasceu. | The whole family together on the hospital bed, both men in matching ugly sweaters, everyone waving. | LEO(30), ESPOSA, BEBÊ, PAI(55), MAE |
| 57 | 78.4 | E segue pra ver o seu mês. | Twelve small calendar pages fanned out like cards, each decorated with a different month theme (flowers, sun, pumpkins, snow). | — |
