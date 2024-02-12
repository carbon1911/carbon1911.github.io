---
layout: post
title:  "Making of: FAQ -- an open source music video"
date:   2023-11-03 22:30:45 +0100
# categories: jekyll update
---


# GDocs

1. music video development process (till release)
    * ✅mention platform (Processing)
        1. ~~(it was pain)~~
			* ✅missing debugger
            1. ~~pls never again~~
                1. ✅or at least – try javascript
        2. ✅ framework adjusted to the song length
            * ✅ play modes
            * ✅ need to take into the account the time to render the image
    2. ✅hand-drawn 2D assets
	* ✅expensive HDD operations arising from the image loading
		* ✅load the fireman images when necessary, not at the start of the sketch
    3. ✅Python scripts

        3. ✅video merging

            4. ✅e.g. mention that the images shall be loaded gradually, not all at once to not run out of memory
2. after release
3. refactor (fml)
	* No allocations

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
    7. ✅split the app according to the MVU pattern seen in ELM’s Playground: [https://elm-lang.org/examples/mario](https://elm-lang.org/examples/mario) – this attempt is unfinished, however large portion of the work has been done.

        8. Components were introduced – sorta like a state counterpart to the Drawable concept. Should sorta resemble Unity’s component system, but boy, I am not gonna write that! Used at some places but generally did not pay too much attention
        9. Model – get rid of global variables. Everything lives in the Model, thus if you want an interaction between some variables, you have to access the Model or some of its members
        10. Functional approach – mention an _attempt_ to design a functional interface, that is – this was an effort, not a final product.
        11. Drawable vs. Tickable (whatever name) – the first exists, while the second not and is up to the implementer to reflect the need to update the Model – discuss this design decision (start with e.g. makeGame’s Stream in the view vs List in the state).
			* Tickable exists
    8. example driven development

        12. “I had so many examples of drawables that I was just refactoring an existing implementation to be backwards compatible, that is to keep working even after making the changes”
	* 🔃CompletableFuture
		* Monads
			* Am I going too far for the scope of this project 😬?
4. HRL

    9. started by hand-written drawable definition, then continued in yml
        13. image
        14. chose yml due to being less verbose than json. Was this a good decision?
    10. grammar + python that consumes the language + hrl code -> DOM-structured hrl code for simpler parsing in the target language. Our target language is java because of the Processing
    11. mapped to the Drawable framework
    12. HRL transformation arguments are Suppliers
    13. to be finished
    14. some things to think
        15. e.g. functions to, e.g., not need to define the firetruck light all the time in each drawable

# Start of the text

# Purpose

I'm writing this text in order to summarize the work done on the music video. I found it weird telling my friends about a music video which I made 2 years ago, seeing a surprised look on their face, telling me, "why haven't you showed me that?" I would like to explain the work which I did after the video had been released. And also, if you find any hint in this text, which will help you not only in your programming efforts, that would be a win for me ☺🙂.

# Chapter 1 The Development

# Origins

I started to write this text on November 3rd 2023.

The idea to create a short video emerged in late 2019/early 2020 on the university after I took a lesson on animation. There, I created a short side-scrolling video which consisted of a single scene with the width of 8000 and height of 1080 pixels. The name of the video was not very thrilling -- cv05 (cv from "cvičenie" which means excercise). I decided to reuse the element of the gradual revelation of the scene from the cv05 in the FAQ music video too, this time using change of scale instead of the change of the the camera's position.

TODO: add the image/video of the school project

I visited various flats, some of which served as an inspiration for particular parts of the main scenery. I used to live in a flat which had quite unappealing, neon ceiling lights and some broken jealousie. My desk stood in a living room, combined with a kitchen and a hall. That might have served as an inspiration for the liminal, hall-like feeling which the scenery -- at least in my opionion -- produces. The kitchen unit comes from a different flat.

I also wanted the music video to feature various details, similar to the few featured in the cv05 -- the leaf taken by the wind and the flying birds.

I experimented with various zoom levels to display the scenery with. I was thinking what items should be visible at what zoom levels and also what should be the firemen's paths as they should enter and possibly also exit the building. I wanted the corresponding elements of the scenery to appear when they are first mentioned in the song, e.g., "choking on smoke" -- the smokes starts rising from the stove, "exit through the real door" -- the second door appears et al (TODO: add link to: https://genius.com/Unstrung-harp-faq-lyrics). The adherence to the song timing caused an unusual combination of a kitchen unit being trapped between a fire exit and a regular door. In my opinion, this always looked like that I would never see a place like this in a real world. Is it an office kitchen? I don't think that the fire exit would be placed in the kitchen if the scenery would be located in a household.

![ned](toilet.jpg) <!-- source: https://www.reddit.com/r/TheSimpsons/comments/zqvccf/was_that_uh_was_that_toilet_always_next_to_the/ -->

TODO: try to find the draft of the scenery

# (Roughly) Chapter 1 -- until release -- development

# The business decision

Time has come to choose software for the music video production. The cv05 was made in Adobe After Effects using university computers. After Effects is quite performance heavy application and my computer had a HDD which was sluggish in booting even the OS so the After Effects were scratched. Apart from that, I had a semester long experience with the animation software which I did not consider enough for a project of this scope. On the other hand, I've had some experience with game programming so I told to myself, "Let's script the behavior of all the actors in the scene instead!" Instead of the video editors I chose Processing. I had to think if I wanted to invest time in becoming a better animator or a better programmer.

What follows is a short analysis of this business decision. I will concentrate on the 2D features of Processing. From my POV

the pros of Processing are:

* Easy to use API
	* You just `im = loadImage("path/to/image.png")` and then draw it using `image(im, 0, 0)`. No additional libraries,
* Quick results
	* No environment set up -- contrary to, e.g., OpenGL. I would need at least some maths and texture loading library to display the images.

the cons of Processing are:

// TODO: mention missing stack trace in the examples
* Limited debugging support from the Processing IDE
	* e.g., you cannot create a breakpoint when the sketch is ran, so you need to stop it, add the breakpoint and re-run it. I don't want to spend too much time recalling why debugging was a not very happily and thus last used resort during the development. I just recall the desperate feeling when I was falling back to that option.
		* The question might be whether Processing is a suitable tool for a project where the developer needs to use a debugger? Isn't it meant to be used rather for simple generative sketches centered around a creative usage of a limited set of programming techniques instead of a complex net of an object-oriented class structure?
	* Maybe it would be more worth using p5.js and use the debugger in the web browser.
* Global variables
	* In the refactoring phase, I tried to get rid of these, I'll talk about that later.

In the beginning I thought that the video would be a small project, but in the time of the release it had around 2700 lines (commit `a41bc0cc7652ab736fbb7bac5fbb988366f3c7f3`, Aug 29th 2021). I think that the Processing IDE is not a very suitable tool for the projects of this size, mainly due to the encouragement of the usage of the global variables and poor debugging features. However what might be a good idea is to use Processing as a library. Had I made similar project again, or another video, I would try experimenting with the p5.js or spend some time setting up [Processing in Java](https://happycoding.io/tutorials/java/processing-in-java).

# Time

Quite unsurprisingly, the timing of the whole video is adjusted to the song which the video follows. As was mentioned in the previous section, certain elements appear upon the first mention in the song. This is reflected in the code with the resolution of seconds. I used Processing's [Sound](https://processing.org/reference/libraries/sound/index.html) library to load the song. For example, for the a snippet of code that would start drawing the stove smoke would look like
```java
if (song.position() > 16.0f)
{
	drawVerticalSmoke();
} 
```
(yeah, I used Allman brackets in Java 🤦‍♀️) The "choking on smoke" lyrics start at approximately 16th second.

The constantly changing scale of the video was adjusted to the song length too. The constraining factors were the initial, cropped scene view, and the final scene. The initial scene is magnified by the factor of 1.4055. This value was obtained empirically, I was just finding out what portion of the scene looks nice to be displayed in the beginning. I especially tried not to display the telephone or the exit door. The final scene is not scaled at all (factor 1.0). Of course, the scale at the end of the video is not 1 during every run, since the video is rendered in the real time.

The rendering was locked to 24 FPS. This would give us a constant Δ per second or frame. I also incorporated an empirically obtained constant to compensate for the frames which needed more than 1/24 of second to render, which is for example the first few frames of the video. I cannot explain this phenomenon, but I think that it is caused by the system warm-up.

# Play modes <a id="play_modes"></a>

If I remember correctly, the first animations produced were the fire exit and the hanging telephone. I bound the door animation triggering to the letter 'O' and played with the sketch, delighted by watching the door open and close when the 'O' was presseed. It was easy to confirm the things were working when it was possible to trigger them on the user input. The debugging process was getting more complicated with the debugging of more complicated firemen states. I think the most problematic thing was to check the firemen when they were returning back to the firetruck and entering it. First of all, there was a stack of additional transformations applied to the animation images. The firemen are getting gradually smaller as they are getting closer to the firetruck. The animation image is also mirrored. It took me some time (and approximative values) to align the firemen correctly with the firetruck door.

I implemented 3 play modes all of which would output the video in a different manner. The basic play mode called WITH_SONG renders the music video in the real time with a present constant scale change and the playing song. I used capital letters because it is one of the enumeration values of the PlayMode enum. (No, I'm noy yelling (for now).) The output of this game mode resembles the canonic version of the music video on the YouTube. In order to accelerate the development process a bit, I implemented an additional play mode called DEBUG. In the DEBUG play mode the song is not loaded, which on my current computer (IdeaPad 5 14ARE05) saves about 5 seconds per sketch run. The scale change is also disabled in the DEBUG mode. The last play mode is called EXPORT. This mode behaves has enabled scale change and does not load the song. It was used to obtain the final render of the video. The major change consists in a fact that this play mode also saves the rendered image to the disk which is a slow operation. It took something less than a second to render a single frame. I used Processing's `millis` function to measure the time elapsed since the sketch start and used it to trigger the events in the video. You can imagine that the tick functionality was broken, since, e.g., the mentioned smoke would start rendering some time around 16th frame, whereas we wanted it to start around 16th second. And so I overcame this by writing a function which would map elapsed frames to a corresponding elapsed time in milliseconds if the rendering ran exactly 24 FPS. (Now that I'm thinking about it, I could have used this approach in the WITH_SONG play mode too. TODO: check this).

# Graphical assets

So I drew all the assets in the music video. I drew most of the assets using a computer mouse, only later I realized I have a graphic tablet. The firemen were drawn as last. I used the graphic tablet for the second fireman, the one with the fire extinguisher. The other one was still drawn with the mouse.

After some time I realized that the drawing part are created faster than the code counterpart. I think, had I done the music video again, I would use a video editor for that purpose.

As was mentioned already, the asset loading is slow. The number of fireman animations was growing. All of them were loaded before the start of the video. The video loading was getting slower, so I reworked the fireman animation loading. The animation was loaded only when it was used for the first time. This caused slight stuttering in the DEBUG mode but sped up the video loading.

Before the refactor, the fireman's `display` method would look something like this:

```java
void display()
{
    if (animation == null)
    {
        animation = loadAnimation();
    }
    animation.display();
}
```

Later, during the refactor phase, I learned about the `CompletableFuture` class which simplified the above code to a simple `animation.join().display()`. I used the `CompletableFuture` with the default `ForkJoinPool.commonPool()`. Only later I realized that that this changes the video loading semantics. The common pool loads the `CompletableFuture` immediately, only this time all futures are loaded in parallel. Anyway, the `CompletableFuture` sped up the video loading and reduced the amount of code.

# Images ➕ soundtrack ➡ music video
After [the problems with the frame timing](#play_modes) were solved, I needed to convert the images to a video and add the soundtrack. I used Python language to achieve that (why haven't I used a video editor? I guess I was afraid of licensing?)

To merge the video, I used OpenCV. There's this [cv::VideoWriter](https://docs.opencv.org/4.x/dd/d9e/classcv_1_1VideoWriter.html) (sorry, I was too lazy to search for Python docs or TODO). Just very quick description of how to work with the `VideoWriter` in Python -- one creates an instance of the `writer = cv2.VideoWriter(...)`, then write all images that should be a part of the video `writer.write(img)`. After we're done with the images' writing, we dispose of the writer `writer.release()`.

Here I learned/realized two important things. The thing that I realized is that when reading a directory contents, the files are not sorted (in an alphabetical order.) This is important, since the images that made up the video were numbered. Thus it was necessary to load the images in the order in which they were numbered.

Next, I copied the video loading code snippet from some website, ~~I think it was something like geeks for geeks or similar~~. The snippet first loaded all the images from a directory into a list and only after wrote them to the `VideoWriter` instance. Now my computer started running out of memory in the process of the image loading. I had to rewrite the image loading loop so that it first loads the image, writes it into the `VideoWriter` instance, then loads the next image and so on. This way, only a single image is stored in the memory and then written to the `VideoWriter` instance immediately. This might be slower, but at least my laptop did not burn.

To add the sound to the merged video, I used [MoviePy](https://pypi.org/project/moviepy/). There was no interesting story related to working with that module :) Or at least I don't remember it anymore :D

# (Roughly) Chapter 2 -- after release

About the time when the video was released, there were still some refactoring actions in progress which I wanted to have finished. Main refactoring points were:

* Reduce the amount of code present in `faq.pde` file
* More object-oriented graphic transformation stack representation (TODO: reword "object-oriented") with automatic inverse transformation call (e.g. `push*` operation would call the corresponding `pop*` operation automatically).

# `faq.pde` refactor

I've seen many times in various Processing code snippets variables placed as attributes of the main `PApplet` derived class. Since in Processing IDE the main class definition is hidden, these attributes appear as global variables (🤢). I think this is an usual approach when writing Processing code, it gets messy when the program grows and as expected, it is difficult to track the state of the global variables which can be changed from any place in the program.

The removal of the "global" variables from the sketch was one of the main drivers of the refactoring effort. I tried to group variables which had something in common together. For example a portion of variables were moved to the FireTruck class. E.g., fire truck door, siren or driver images. Also, I tried making functions from some variables which drove the overall state of the sketch, e.g., variables which controlled an elapsed time of the sketch or similar.

# More refactoring

As a result of the inspiration by the Elm language I tried to do the refactoring in a more functional way, which might not seem as a very natural requirement in Java language. Overall, looking back I think that the decision to use the functional programming more over OOP approach slowed the development down. That was caused by the fact that I had to adapt to the functional programming style. I have had some experience with functional programming in the past and it was quite interesting to see the concepts from the languages like Elm or Haskell applied in Java, but that was also the point where one would appreciate greatly the brevity of the syntax of the functional languages. The discussed brevity is one of the factors why I mention that the functional approach is not very natural in Java.

On the other hand I have learned many new concepts and discovered new interesting classes which make functional programming in Java a bit more bearable. Some of them would be `Optional`, `Stream` and `CompletableFuture`. For example `Optional` class is designed in a monadic way so that the programmer can make complex queries on the `Optional` in a single line of code using a builder pattern and call multiple methods on a single instance of the `Optional` using methods. This is similar in `CompletableFuture`.

# MVU -- Model

The major mental break...through in the refactoring effort was the discovery of the MVU pattern in [ELM’s Playground](https://elm-lang.org/examples/mario). The way I used the MVU patter is that the Model is Updated by the update function. The model is then rendered by the view function. Maybe that's not the MVU pattern anymore, but I think that the MVU pattern is a good way to think about the sketch state. The model represents the state of the sketch.

After the refactor, the global variables were moved to the Model. The consequence of the refactor is the emerging order of the variables initialization. Let me explain with a snippet of code:

```java
class faq extends PApplet
{
    // image a, b and c are instances of different objects.
    Object a = new Object();

    // suppose c is a part of the b (composition in UML). E.g., c is a siren
    // and b is a fire truck, thus c can be a member of b.
    Object b = new Object();
    Object c = new Object();

    void tick()
    {
        // suppose b, c don't tick, only a ticks.
        a.moveTo(c.getPosition());
    }

    void draw()
    {
        a.display();
        b.display();
        c.display();
    }
}
```

vs.

```java

class Model
{
    // Note c is not a member anymore, just a local variable.
    // Also note that the order of the initialization of a, b, c matters now (c must be initialized before a, b).

    public Object a;
    public Object b;

    public Model()
    {
        var c = new Object();
        a = // initialize a from c
        b = // initialize b from c
    }
}

class faq extends PApplet
{
    Model m = new Model();

    void tick()
    {
        // the update logic is called in a's tick
        m.a.tick();
    }

    void draw()
    {
        m.a.display();
        m.b.display();
    }
}

```
Note that the first and last line of `faq` class definition is invisible for the Processing developer. I've left the lines just to make the code less confusing for a regular java programmer. The developer only sees the "guts" of the class. This is similar to the [C# Top-level statements](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/program-structure/top-level-statements).

In the end, my goal was that content of the `faq.pde` resembles the `main` function in the [Elm's Mario](https://elm-lang.org/examples/mario) project. That is, we only say what drawables/tickables will be there, their definitions shall lie elsewhere, e.g., in the `Model` class.

Of course, I considered OK keeping the constants in the `faq` file.

# MVU -- View

Similar to the `Model` class, I've created the `Drawable` interface to represent the View part of the MVU model. In fact, this interface had existed before the refactor and I an idea that every object which can be drawn, will be stored in a collection, and in the global `draw` method a `display` method will be called on every member of the collection. I decided to call the `Drawable` method `display` rather than `draw` to avoid confusion with the `draw` method of the `PApplet` class. The idea of the collection worked quite well, however, at the time of the video release, there was a crazy inheritance hierarchy of the classes representing the lights. As a result, the straightforward `display` method call on the collection items turned out to look like this:

```java
for (Drawable d : drawSequence)
{
    if (d instanceof TurnedOffLight)
    {
        TurnedOffLight dLight = (TurnedOffLight)d;
        dLight.setLightState(turnedOffLight);
    }
    d.display();
}
```

The biggest problem in the code, among other, is the use of `instanceof`. That is a code smell and I wanted to get rid of it. You can check out the commit `a41bc0cc7652ab736fbb7bac5fbb988366f3c7f3`, files `faq.pde` and `Light.pde`. See the latter to see the inheritance hierarchy of the light. I was trying to solve the inheritance problem with [Drawable decorators](), but I'll talk about that later.

One of the motivations of the refactor was that the update of the drawable collection would be placed in the `faq.pde` file, but the definition of every `Drawable` would lie elsewhere. For example a big part of the drawables is stored in the `Drawable.pde` and `Light.pde` files so you can check those out.

# MVU -- Update

The Update part turned out to be, similar to View, represented by a `Tickable` interface with a single `tick` method. You can place any code in the `tick` method, especially you're allowed to use a code which changes the state of some `Model` member, or would return a new `record` with an updated state, unfortunately, `record`s were not supported in Processing 4.2.

# GDocs

1. ✅music video development process (till release)
    * ✅mention platform (Processing)
        1. ~~(it was pain)~~
			* ✅missing debugger
            1. ~~pls never again~~
                1. ✅or at least – try javascript
        2. ✅ framework adjusted to the song length
            * ✅ play modes
            * ✅ need to take into the account the time to render the image
    2. ✅hand-drawn 2D assets
	* ✅expensive HDD operations arising from the image loading
		* ✅load the fireman images when necessary, not at the start of the sketch
    3. ✅Python scripts

        3. ✅video merging

            4. ✅e.g. mention that the images shall be loaded gradually, not all at once to not run out of memory
2. ✅after release
3. making code nicer (fml)

    4. ✅less code in faq file

        4. ✅in faq we only say what drawables and updates will there be, their definitions shall lie elsewhere
        5. ✅variables moved to the Model of the MVU architecture

    5. minimize the usage of OOP
        6. 🔃rather use functional programming
            5. ✅Optional & Stream – gj
            6. ✅not very natural requirement in Java
    6. automatic “destructors” for the transformations. The idea got gradually bigger. Defined a set of operations to handle the whole drawing part of the app

        7. Drawable framework (is it?)

            7. note – simple structure

                2. single functional interface
                3. + functions that consume and produce more complex drawables
                4. minimize OOP
                    1. use functional programming instead
            8. describe permitted operations in the Drawable fwk (ifDrawable, ifElseDrawable, etc.)

                5. mention uncertainty in stateful drawables (doOnceDrawable)
    7. 🔃split the app according to the MVU pattern seen in ELM’s Playground: [https://elm-lang.org/examples/mario](https://elm-lang.org/examples/mario) – this attempt is unfinished, however large portion of the work has been done.
        8. Components were introduced – sorta like a state counterpart to the Drawable concept. Should sorta resemble Unity’s component system, but boy, I am not gonna write that! Used at some places but generally did not pay too much attention
		
        9. 🔃Model – get rid of global variables. Everything lives in the Model, thus if you want an interaction between some variables, you have to access the Model or some of its members
        10. Functional approach – mention an _attempt_ to design a functional interface, that is – this was an effort, not a final product.
        11. 🔃Drawable vs. Tickable (whatever name) – the first exists, while the second not and is up to the implementer to reflect the need to update the Model – discuss this design decision (start with e.g. makeGame’s Stream in the view vs List in the state).
    8. example driven development

        12. “I had so many examples of drawables that I was just refactoring an existing implementation to be backwards compatible, that is to keep working even after making the changes”
	* 🔃CompletableFuture
		* Monads
			* Am I going too far for the scope of this project 😬?
4. HRL

    9. started by hand-written drawable definition, then continued in yml
        13. image
        14. chose yml due to being less verbose than json. Was this a good decision?
    10. grammar + python that consumes the language + hrl code -> DOM-structured hrl code for simpler parsing in the target language. Our target language is java because of the Processing
    11. mapped to the Drawable framework
    12. HRL transformation arguments are Suppliers
    13. to be finished
    14. some things to think
        15. e.g. functions to, e.g., not need to define the firetruck light all the time in each drawable