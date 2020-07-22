---
layout: post
title:  "Breaking A Large Class to Smaller Classes"
summary: Smaller class can be clearer context, easier to maintain
author: Agi Maulana
date: '2020-07-22 6:00:00 +0000'
category: refactoring
thumbnail: /assets/img/posts/refactoring-thumbnail.jpg
---
In Justika engineering team we have an agenda in every week, Tech Talk, one by one from us in turns speaking about tech, as much as possible the topic is beneficial for our team.

The last week is my turn to bring the material, I have summarized the topic about [Refactoring: This class is too large][clare-sudbary] originally narated by Clare Sudbary.


## Common Problem in A Large Class
- Taking too much responsibility
- A lot of private nested code so it’s hard to test
- There is one large method that’s doing too much
- Repeating pattern with different details

## Why Refactor?
By breaking the large class into smaller classes. The benefits:
1. Know where to to go when want to make changes or fix issues
2. Don’t need to understand the whole system to when amending the code
3. Don’t worry changing a state in one area will affect the other

## Principle
    “Make the change easy, then make the easy change” - Kent Beck
    
Move in tiny steps with several connected aims: 
1. Run compiling and the tests at every step
2. If a change causes any tests to fail, we able to fix them instantly
3. Easy to keep track of where we are in

## How To Do It?
1. Rearrange methods

    Group the methods and properties without editing the code any way
    ![Rearrange methods][step-1]

2. Analyse relationship between methods

    Identify how the code is connected to the rest of the code in the class so we can create new classes with minimum coupling
    ![Relationship between methods][step-2]

3. Modify the methods that are staying behind

    Modify the methods that are stay in the parent class but currently called by those methods that are moving

    How to deal with this:
    - Make called method as public so we can call back to them from the new class.
    - Move the calls out of the new class code and into other native parent class’s methods instead.

4. Create covering test for the new classes

    For moving existing test to the specific test class.

    Assume we will extract the methods of File Loading group to a class named FileLoader, in this step we should prepare a test class for FileLoader, we can name it as FileLoaderTest.

5. Create a new class, move the code in a small amount then run the tests

6. Repeat the (5) action until all the rests are moved and passed the test.

7. Extract more new classes



## Reference:
- [Refactoring: This class is too large][clare-sudbary] by Clare Sudbery

[step-1]: https://martinfowler.com/articles/class-too-large/class-split-into-regions-v2.png "Rearrange Methods"

[step-2]: https://martinfowler.com/articles/class-too-large/File-loading-code-diagram-01-v2-small.png "Analyse relationship between methods"

[clare-sudbary]: https://martinfowler.com/articles/class-too-large.html