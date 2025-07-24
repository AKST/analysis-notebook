# RFC 009 Graph info for canvas 2d

When Canvas 2d widgets are used to plot graphs
currently they don't provide enough information
to inform the reader what graph they are looking
at is.

A Good Graph should have

- A Title
- Axis Labels
- Axis Ticks to see the scale
- Legends to show the contents

## Proposals

My 2 initial thoughts are

1. Extend the canvas widget to let stuff like titles
   be specified (this should be done regardless), so
   on multi widget layout they can be shown to the top
   left of each widget. The problem with the suggestion
   is it feels like it becomes messy the moment I
   consider everything else.

2. A variant of the Canvas2d widget for line graphs, but
   it is specialised to create graphs with fewer steps
   as well as making it easier to show 2 dimentional plot
   information, such as axises, their ticks, and their
   scale.
     - They should be able to modify their scale fairly
       effortlessly (log scalling, base 10 log scaling)

     - It should be fairly straight forward toggle certain
       elements on and off.

     - Get information of different curves at different
       x and y locations.

   Some technical challenges, how allow specifying different
   curves while allowing all of the above features?

   - Generally when you think of plots you don't think of
     points within an X & Y geometry plane you speak in
     terms of data, and the viewport of the plane you go
     with is computed in order to capture your data.

3. A graph renderer

  - Approach instead implements graphs instead as
    render that operates within the 2d render.

  - In a way it would act as a nested viewport, as
    if it has to adjust the scale of the plot to
    fit within the plot




