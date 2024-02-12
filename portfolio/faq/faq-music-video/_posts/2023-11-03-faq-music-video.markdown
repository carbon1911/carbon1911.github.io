---
layout: post
title:  "Making of: FAQ -- an open source music video"
date:   2023-11-03 22:30:45 +0100
# categories: jekyll update
---

## Origins

The idea to create a short video emerged in late 2019/early 2020 on the university after I took a lesson on animation. There, I created a short side-scrolling video which consisted of a single scene with the width of 8000 and height of 1080 pixels. The name of the video was not very thrilling -- cv05 (cv from "cvičenie" which means excercise). I decided to reuse the element of the gradual revelation of the scene from the cv05 in the FAQ music video too, this time using change of scale instead of the change of the the camera's position.

TODO: add the image/video of the school project

I visited various flats, some of which served as an inspiration for particular parts of the main scenery. I used to live in a flat which had quite unappealing, neon ceiling lights and some broken jealousie. My desk stood in a living room, combined with a kitchen and a hall. That might have served as an inspiration for the liminal, hall-like feeling which the scenery -- at least in my opionion -- produces. The kitchen unit comes from a different flat.

I experimented with various zoom levels to display the scenery with. I was thinking what items should be visible at what zoom levels and also what should be the firemen's paths as they should enter and possibly also exit the building. I wanted the corresponding elements of the scenery to appear when they are first mentioned in the song, e.g., "choking on smoke" -- the smokes starts rising from the stove, "exit through the real door" -- the second door appears et al (TODO: add link to: https://genius.com/Unstrung-harp-faq-lyrics). The adherence to the song timing caused an unusual combination of a kitchen unit being trapped between a fire exit and a regular door. In my opinion, this always looked like that I would never see a place like this in a real world. Is it an office kitchen? I don't think that the fire exit would be placed in the kitchen if the scenery would be located in a household.

![ned](toilet.jpg) <!-- source: https://www.reddit.com/r/TheSimpsons/comments/zqvccf/was_that_uh_was_that_toilet_always_next_to_the/ -->

TODO: try to find the draft of the scenery

## The business decision

Time has come to choose software for the music video production. The cv05 was made in Adobe After Effects using university computers. After Effects is quite performance heavy application and my computer had a HDD which was sluggish in booting even the OS so the After Effects were scratched. Instead, I chose Processing. What follows is a short analysis of this business decision. I will concentrate on the 2D features of Processing.

The pros of Processing from my POV are:

* easy-to-learn API
	* 


## GDocs

1. music video development process (till release)
    * ✅ mention platform (Processing)
        1. (it was pain)
			* missing debugger
            1. pls never again
                1. or at least – try javascript
        2. framework adjusted to the song length

            2. play modes
            3. need to take into the account the time to render the image
    2. hand-drawn 2D assets
	* expensive HDD operations arising from the image loading
    3. Python scripts

        3. video merging
            4. e.g. mention that the images shall be loaded gradually, not all at once to not run out of memory
2. after release
3. making code nicer (fml)

    4. less code in faq file

        4. in faq we only say what drawables and updates will there be, their definitions shall lie elsewhere
        5. variables moved to the Model of the MVU architecture

    5. minimize the usage of OOP
        6. rather use functional programming
            5. Optional & Stream – gj
            6. not very natural requirement in Java
    6. automatic “destructors” for the transformations. The idea got gradually bigger. Defined a set of operations to handle the whole drawing part of the app

        7. Drawable framework (is it?)

            7. note – simple structure

                2. single functional interface
                3. + functions that consume and produce more complex drawables
                4. minimize OOP
                    1. use functional programming instead
            8. describe permitted operations in the Drawable fwk (ifDrawable, ifElseDrawable, etc.)

                5. mention uncertainty in stateful drawables (doOnceDrawable)
    7. split the app according to the MVU pattern seen in ELM’s Playground: [https://elm-lang.org/examples/mario](https://elm-lang.org/examples/mario) – this attempt is unfinished, however large portion of the work has been done.
        8. Components were introduced – sorta like a state counterpart to the Drawable concept. Should sorta resemble Unity’s component system, but boy, I am not gonna write that! Used at some places but generally did not pay too much attention
		
        9. Model – get rid of global variables. Everything lives in the Model, thus if you want an interaction between some variables, you have to access the Model or some of its members
        10. Functional approach – mention an _attempt_ to design a functional interface, that is – this was an effort, not a final product.
        11. Drawable vs. Tickable (whatever name) – the first exists, while the second not and is up to the implementer to reflect the need to update the Model – discuss this design decision (start with e. g. makeGame’s Stream in the view vs List in the state).
    8. example driven development
        12. “I had so many examples of drawables that I was just refactoring an existing implementation to be backwards compatible, that is to keep working even after making the changes”
	* 
4. HRL

    9. started by hand-written drawable definition, then continued in yml
        13. image
        14. chose yml due to being less verbose than json. Was this a good decision?
    10. grammar + python that consumes the language + hrl code -> DOM-structured hrl code for simpler parsing in the target language. Our target language is java because of the Processing
    11. mapped to the Drawable framework
    12. HRL transformation arguments are Suppliers
    13. to be finished
    14. some things to think
        15. e. g. functions to, e. g., not need to define the firetruck light all the time in each drawable