# Design

## Vague Proposal

So I want to add a build system to this to create minified
bundles, but I want the bundle entry points to be largely
emergent other than explicitly specified, and I don't want
it to constrain how I write the development build.

It will be knowable at build time, and based one certain things.

- Files imported in local html files
  - Some are linked via iframe, which are actually html files
    in the project
  - HTML files link to css or js files
  - HTML files can specify import maps which influence
    resolvable paths in the js it imports

- Files that could be passed to dynamic import, but there is
  always a clear pattern imports follow, yet files paths are
  dynamically generated and aren't statically analysable
  - The pattern used to find entry points will be specified
    in source by an annondation where dynamic import is used.

- Files specified as worker entry points
  - There aren't too many of these case.
  - There are some edges cases that aren't defined in the
    directory that should be ignored.

- There are CSS files as well which are fetched by fetch
  - In js they are often speified with import.meta.resolve
    and are rarely dynamically generated

Assume at any an import path can be specified it can be
specified. There are examples of html files defining their own
importmaps. Which could possibly cascade at some points not at
others (like an iframe)

Below I will expand further upon when a file path will be
replaced (mostly in referencing html)

### Implementation Details

#### Location of Source code for implementation

For the location for this logic for build system, I want a new
directory called `./src/cli/build`, but ultimately there should
be a build script in `./scripts`. Currently there's a script called
`./scripts/build.sh` just treat that name as a misnomer which
can be called from minimal js with a hashbang in `./scripts/bundle.js`
alternatively it could also be `./scripts/bundle.sh` If 90% of
the logic exists in `./src/cli/build` (which it should).

##### TSConfig

we will need a TSConfig it should extend the base tsconfig like
the at a similar nesting (I don't recall exactly which one that
is), but also we should extend `lib/base` with similar import
aliases.

This won't be written in typescript but down the line if I
move to `bun` it probably can be.

#### Reuse of existing libraries

I am entirely open to reusing libraries for this, I don't want
to entirely re-invent the wheel, I just don't the design of
my system and code base and application to be distorted by
assumptions a build system wants to make.

- I'm guessing the logic should wrap `esbuild` or something?
  - We might need to modify some of the files to update paths
    as well? So it's possible the source needs to be copied
    and modified? Unless it can be done entirely in memory?
    but pressumably that will make things expensive in terms
    of memory? Then again it's only `4.3MB` atm, but I don't
    know if I can hand off the file files in memory to `esbuild`
    - if they need to be saved to disc then I guess an output
      location like `./out/bundle-resolve-paths` is an option.

    - if not ideally we don't have to copy all the files.

  - After those transformations whether they happen in memory
    or not (provided the bundler even accepts the files in memory),
    the bundler can be informed of which of those files is an
    entry point and assemble the bundles.

- We will need to parse files as well, I am perfectly fine with
  adding a dependency for a html or js parsing library to pick
  up instances of dynamic import.

#### Extensibility (low priority)

At this stage I've written it all in plain JS with no
transpilation step which simplifies things a lot. However it
would be nice if a door was left open to add typescript
compliation, because I'm fast approaching the point of "I may
as well compile from typescript" with the complexity of types
and the fact I'm even adding a build system at this stage.

Down the line I think I want to add code that compiles to wasm
how that fits in at this stage I am not sure? I just ask that
archetecture doesn't close the door on that opportunity or when
archetecture tradeoffs are being considered and its split down
the middle on main priorities this is considered.

##### Impact on assumptions

- The logic of the bundler will not have to transpile anything
  before it identifies the entry points (at this stage).

- Do worry about resolving dependencies beyond what I'm
  actually working with at the moment.

#### Vague implementation

1. Concurrently read all files (the config says are relevant see
   below for how that's done) and identify the paths they specify
   (without resolving them), as well as any annotations specify.
   - For annontations

     - In JS look for `@akst::bundle::dyn-import:path-constraint`
       (see below) and identify anything that matches a regex as
       an entry point (but perform this work after).

     - In JS look for any instance of worker that takes a path
       or is annondated with `@akst::bundle::dyn-import:path-constraint`

     - In JS look for `@akst::bundle::html-path:declare`, this
       interpret the file system path as is if was loaded by
       a browser (see explaination below) and keep track of the
       fact this file references it (and will need it's path
       updated to reflect the actual file location).

     - In JS look for any instance of `import.meta.resolve` for
       static files, in many case it will be css, but it could also
       be a shader or something else.

     - In HTML look for files that, have a comment that fits this
       general layout `<!-- akst::bundle::meta output-path="..." -->`.
       Take note of this output path, it will be the relative path
       within the output directory, it will also be used at some
       point to update strings in js demarked with
       `@akst::bundle::html-path:declare`.

2. (Optional) Whether this is done will be determined by whether
   this can be done in the 3rd step.
   - But update any strings (not in the source but in a copy) (if
     necessary create a directory like `out/bundle-partial`)
     before passing those files off to the underlying bundler.
     This includes:
     - Updating strings demarked by `@akst::bundle::html-path:declare`
     - Stripping contents like `<!-- akst::bundle::meta output-path="..." -->`

   - When possible this work should be deterred to the underlying
     bundler. Except when it places constraints on how the application
     must be written.

3. After which sequentially descend from the entry point file and
   when ever an entry point is identified flag this and resolve the
   path with respect to the importmap, and generate any information
   needed for the tool to generate the relevant entry point.
   - Provide as much information as possible to the underlying build
     tool to resolve these paths.
   - Inform it where it must resolve the paths dynamically
   - Inform it where it paths files like HTML must be moved within the
     output directory

The underlying bundler should do the rest of the work for us, it should
create unique finger prints for each resource file so updates aren't
caught up in cache. Some kind of function to resolve runtime generated
dynamic import paths should be handled.

### Dynamic import

#### File Path Patterns

Near line 31 or 32 (maybe a few lines down) in `./index.js` I
was thinking maybe I could specify import paths like this
(note the specified regex may be technically incorrect)

```
loadModule: path => {
  /**
   * @akst::bundle::dyn-import:path-constraint {./lib/app/(sec-[^/]+/)+index.js}
   */
  return import(path);
},
```

This would tell the bundler what individual uses of import
in js can be statically narrow the bundle entry points down too.

### Config File

While I would like to keep things as declarative as possible
I probably do need a main config file, I probably need somewhere
to store anything assumption like

- root path, index.html assuming all paths are relative in respect
  to itself which is true, but if I rearrange the layout I would
  like to override that.

The file should be `config/akst-bundle.json`

> as an aside we should look at moving config files also into `config`
> when possible.

This is what is allowed to look like:

```json
{
  "root": ".",
  "entry": [
    "index.html"
  ],
  "output": {
    "dir": "out/bundle",
    "intermediary-dir": "out/bundle-partial",
    "assets": "out/bundle/__asset"
  },
  "source": [
    "index.html",
    "style.css",
    "index.js",
    "lib/**/*.{js,css,html}"
  ],
  "ignore": [
    "node_modules",
    "out/**",
    "*.test.js",
    "lib/cli",
    ...
  ]
}
```

Note we are not specifying any kind of glob or anything for entrypoints
and "source" is just a suggestion to proactively check for references,
but will not be resolvable without determining the importer. If the build
tool actually has some kind of location for "out/bundle/__asset" then
no drama but this is the path used for js, css, img, etc.

### Output

#### Location

Probably output to `out/bundle`

#### Structure of output

While the source code has the specific structure it has the output
structure can be significantly flatter, that some paths should be
nested.

- JS and CSS files can just exist in a directory of assets specified
  in the config such as `__assets` or whatever. But If the underlying
  dependency has a solution here I am not too worried.

- Where as html files cannot have a trivial path, as they are
  the main entry point for a browser and should be preserved.

##### HTML path declaration

In the html files maybe I can have some compile time attributes
that I specify this in one place and then strip it at compile time.

I will specify this below. However I would like to keep the source
representation of this path the location of the file in my project
after compiling it should be updated to reflect the path.

###### Annonating HTML paths in JS

I think it may be necessary to annonate internal paths for HTML
files. For example in `lib/app/sec-unsw/sec-2102/sec-01-1/remote.js`
on line 16 it specifies the path
`./lib/remote/app-embed/sec-2102-cobb-douglas?rho=0` (without the
trailing index.html file), and that references
`./lib/remote/app-embed/sec-2102-cobb-douglas/index.html` with
a query param.

No regular expression would pick up this was a link to a html only
semantics and familiarity with the projects runtime and the
heuristics of that config. Instead I should should just be able
to annotate it's a path with something like this:

```
/**
 * @akst::bundle::html-path:declare
 */
```

This just informs the bundler to make sense of this path as
a JS path specified in source. Like interpret the string as
part of a URI or URL, treat ? as query params (which should
retained in output) and consider there could be an omitted
/index.html (which should remain omitted in build output).
The goal here is to tell the bundler "hey this is a path to
a HTML file".

> If the path is resolved, please respect the way in which
> it was specified. If `index.html` is omitted, respect that
> however if the resolve path is at conflict with that like
> the fact it will not be called `index.html` then this should
> have a build error of some sort stating the desired resolution
> is ambigious and explain why, suggest the string needs specify
> a file path for c.

The output containing this file should update this string
to point to the actual file, which may be different from
this source compile path.

#### Representations of paths in output
##### Paths in HTML
I would hope paths in the bundler are handled by the bundler

- **CSS/JS Paths**: I hope the bundler will actually update
  these to be the post build path.

##### JS Paths

The answer to this might change depending on what the underlying
build system is if there is such one, but because import paths are
dynamically generated it would be nice if I think that might make
sense.

> I guess the specific response is an open question, and answer
> depends on a unknown like which build system is underlying this.

If this is built on top of anything like esbuild this may not be
a problem, however it's worth noting that because path I think it
would be nice if the runtime representations of the path was
preserved? And then the build system does something like mock import
and resolve the paths to the bundle path before being passed to the
real import.

##### HTML paths

Perhaps I need to add a docstring above the import. For example
the file `./lib/remote/app-embed/sec-2102-cobb-douglas/index.html`
we can add a tag like this to the head (which should be ignored at
runtime something like:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- akst::bundle::meta output-path="..." -->
    <!-- ... -->
  </head>
  <!-- ... -->
</html>
```

Some things of note

- The bundler should strip any reference to this namespace and its
  tags from the build.
- in the bundle output references in the source (annondated with
  `@akst::...`) to this should be updated to reference the
  destination location.
- The destination of any bundle created on their behalf doesn't
  need any special treatement it can go with all the other js
  bundles.

Lets try to avoid leaning too much on retaining too much of the
run time positions for determining the output file positions.

### HTML relative path declaration

Above I mentioned that HTML files will need to specify some
information the need for a config file, and i

### Sourcemaps

It would be nice if source maps were generated but this isn't
a priority, if it add nontrivial complexity I heistant to
prioritise it at this stage.
