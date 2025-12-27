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

### Note on hash's

- It may just be worth using UUIDs instead of hash, as hashes
  require understanding the contents of the files.
- Alternatively we generate hashes based on checksums at a very
  early stage of the build.

I am inclined to go with UUIDs as I don't really understand how
esbuild may determine a hash, but I wonder if I can specify the
output path for a bundle with a premptively determined UUID.

#### Decision on Hash vs UUIDs

Use content-based hashes (SHA-256 truncated to 8 hex chars).
Compute these in step 1 before any transformations. If esbuild's
native hashing can be configured to use pre-computed hashes,
prefer that; otherwise inject our hashes via output filename
templates

### Note on "static entry point"

this is term to describe a file that is part of the bundle
output but is ultimately just a static file likely just
loaded by fetch or used as an image or something, ultimately
we don't need to modify or analysis.

### Note on worker vs import()

In practise all assumptions that relate to entry points for
import or worker are shared unless specified otherwise. The
only difference is the annotation names (which still
behave identically).

Neither worker nor dynamic import calls accept custom
importmaps but they do inherit the importmaps.

Any condition that applies to `@akst::bundle::dyn-import:...`
also applies to `@akst::bundle::worker:...`

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
  - For javascript, we should use `swc` as a js parser as it
    also supports typescript. We are not using typescript but
    later on this may change and this could help reduce later
    friction at no cost to the present

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
   - If we are using hashes over uuid's
     - For every file (other than a page) that will be used in some
       kind of bundle, record the checksum or hash for each input

   - For annontations

     - In JS look for `@akst::bundle::dyn-import:path-constraint`
       (see below) and identify anything that matches a regex as
       an entry point (but perform this work after).
       - If `@akst::bundle::dyn-import:implict-bundle-generation`
         is also specified along side the path-constraint, then
         every match against the path constraint should be considered
         an entrypoint.
       - Otherwise, entry points are generated as they araise, such
         as js files being referenced `import.meta.resolve`.

     - In JS look for any instance of worker that takes a path
       or is annondated with `@akst::bundle::worker:path-constraint`
       - these can also use `@akst::bundle::worker:implict-bundle-generation`
       - as well as `@akst::bundle::worker:asset-name` works identically to
         `akst::bundle::dyn-import:asset-name`

     - In JS look for `@akst::bundle::html-path:declare`, this
       interpret the file system path as is if was loaded by
       a browser (see explaination below) and keep track of the
       fact this file references it (and will need it's path
       updated to reflect the actual file location).

     - In JS look for any instance of `import.meta.resolve` for
       static files, in many case it will be css, but it could also
       be a shader or something else.
       - If the path is inlined the call to `import.meta.resolve`
         cause a build error, and I will decide later if it's worth
         supporting the usecase that failed.
       - Otherwise
         1. If it's a JS file it is a js entry point, and we should
            check for an associated use of `import()` that has a
            matching `path-constraint` after this step at some point.
         2. If it's a different file type then it's just a typical
            assets.

     - In HTML look for files that, have a comment that fits this
       general layout `<!-- akst::bundle::meta output-path="..." -->`.
       Take note of this output path, it will be the relative path
       within the output directory, it will also be used at some
       point to update strings in js demarked with
       `@akst::bundle::html-path:declare`.

2. Perform any sanaity checks based on information learnt from
   the earlier step (see below but this could also be an additional lintting
   tool)
   1. Are all cases of explict js paths referenced in `import.meta.resolve`
      mentioned in at least in case of a `path-constraint` used with a
      `import()`/`new Worker`
   2. determine which files are entry points
      - Determine when a JS file specified in `import.meta.resolve` has
        not been mentioned in  at least one case of `path-constraint`
   3. Determine if any files references in many places have any
      conflict or gap in their importmaps, show build error when this
      is the case.
      - For example if `lib/ui` is imported in 2 different HTML files
        - if they specify scoped importmaps for `lib/ui` and there is
          any inconsistency between their import maps then this should
          be a build error.

3. (Optional) Whether this is done will be determined by whether
   this can be done in the 3rd step.
   - But update any strings (not in the source but in a copy) (if
     necessary create a directory like `out/bundle-partial`)
     before passing those files off to the underlying bundler.
     This includes:
     - Updating strings demarked by `@akst::bundle::html-path:declare` the
       output path can be determined by seeing what those html files decleared
       as their output-path

     - In the HTML files strip contents like
       `<!-- akst::bundle::meta output-path="..." -->`

   - This likely cannot be done till the end after checksums or hashs are
     generated but,

   - When possible this work should be deterred to the underlying
     bundler. Except when it places constraints on how the application
     must be written.

4. After which sequentially descend from the entry point file and
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

##### Optional Tool

I mentioned maybe 2 can also be an optional tool for sanity
checking things.

### Dynamic import

#### File Path Patterns

Near line 31 or 32 (maybe a few lines down) in `./index.js` I
was thinking maybe I could specify import paths like this
(note the specified regex may be technically incorrect)

```
loadModule: path => {
  /**
   * @akst::bundle::dyn-import:path-constraint {./lib/app/(sec-[^/]+/)+index.js}
   * @akst::bundle::dyn-import:asset-name {app-[strip:sec-:/][join:-]}
   * @akst::bundle::dyn-import:implict-bundle-generation
   */
  return import(path);
},
```

- `@akst::bundle::dyn-import:path-constraint {./lib/app/(sec-[^/]+/)+index.js}`
  This would tell the bundler what individual uses of import
  in js can be statically narrow the bundle entry points down too.
- `@akst::bundle::dyn-import:asset-name {app-[strip:sec-:/][join:-]}`
  This tells you how to format repeated matches of `(sec-[^/]+/)`
  from the `path-constraint` as part of the bundle name for a match like
  `sec-unsw` the syntax `[strip:sec-:/]` basically would transform
  `sec-unsw/` into `unsw`, and for more than one match `[join:-]`
  basically seperates them with `-`. So the example above with that
  asset-name annontation for the filename
  `lib/app/sec-unsw/sec-1101/sec-01/index.js` you'd get something like
  `app-unsw-1101-01-[hash].js`
  - The syntax of `[strip:sec-:/]` follows this
    - arguments are specified each `:`, so the first arugment is `sec-`
      and the second `/`. And the first argument is leading strip and
      the second argument is the trailing strip.
- `@akst::bundle::dyn-import:implict-bundle-generation`
  This means any file that matches the constraint will automatically
  have a bundle generated for it.
  - If this is not specified bundles will be generated as they are
    detected through uses of `import.meta.resolve`

### `import.meta.resolve`

Any file generally referenced by `import.meta.resolve`
Should be included in the build output as an entry point.
These are static entry points and do not have any imports.

#### Asset names of files referenced by `import.meta.resolve`

It doesn't matter, just use a checksum like everything else.

#### Changes to files that reference files with `import.meta.resolve`

Simply make sure the `import.meta.resolve` at runtime resolves to the
relevenat path.

How? Really just do whatever's simpler.
- In practise the actual path being used in `import.meta.resolve` will
  likley already be inlined, in which case you can just replace the call
  entirely with the correct path into `import.meta.resolve`.
  - Note seeing as our assets are saved to a flat directory, it shouldn't
    actually matter if the callee gets lumped into another bundle, also
    our output only really exists at one level as well, and if that path
    gets used at an arbirary callsite at least things that path remains
    consistnent.

#### Bundling files referenced by `import.meta.resolve`

- JS
  - This will likley be used as an entrypoint at somepoint somewhere, but
    there isn't enough information to determine exactly how. It's relevenat
    import maps should be determined by an earlier entry point, the onnerous
    is on cases of `import` to specify what it's being called with.
    - In order to valid this:
      1. When a js argument is used on `import.meta.resolve`, we should see
         if any case of `import` anticipates such a file with its path
         constraint annontation.
      2. If such a use of `import` is found, log the file as a entrypoint.

- CSS
  - If an `@import` statment is seen, do not inline the contents of the
    import into the file. But instead update the path to represent the file
    path in the bundle if it is a file within the project.

    - CSS @import statements are preserved rather than inlined. When
      stylesheets are shared across web components via adoptedStyleSheets,
      inlining would duplicate the imported content in each component's styles.
      Additionally, @import within adoptedStyleSheets behaves differently than
      in document-linked stylesheets (often ignored or producing warnings in
      shadow DOM contexts). Preserving @import and rewriting paths ensures
      shared CSS remains shared and behaves consistently between dev and prod.

- Other files
  - Every other file type used with `import.meta.resolve` should simply
    included in the bundle asset directory with all the js and css, with
    the appropiate path.


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

#### Source attribute

Ultimately the `source` attribute is about discovery not bundling.

The source globs determine which files are parsed in step 1 for annotations
and path references. JS files outside these globs will not be scanned, if at
any point they are this should be a build error, the error message should
encourage the user to complete this glob.

Non JS, CSS or HTML files later referenced but not mentioned are fine, but the
system will need to keep track of them as they'll need to be included as a
static file entry point and a file added to the outputs assets directory.

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

- Ideally the importmap after building is no redundant and
  can be disposed of.

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

##### Example

Say I reference the HTML path here:

```js
const k = {
  kind: 'iframe',
  /**
   * @akst::bundle::html-path:declare
   */
  src: './lib/remote/app-embed/sec-2102-cobb-douglas?rho=0',
};
```

In reality it is referencing `./lib/remote/app-embed/sec-2102-cobb-douglas/index.html`
with a URL Param of `rho=0`, In that HTML I have this at the start

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- akst::bundle::meta output-path="app-widget/cobb-douglas/index.html" -->
```

This says in the output, this file will create a HTML file called
`app-widget/cobb-douglas/index.html`. So Back in the original JS
the string in the output should resemble something like this:

```js
const k = {
  kind: 'iframe',
  src: './app-widget/cobb-douglas?rho=0',
};
```

Note in updating the path we
- we preserve the url params
- we preserve the omission of the explict index.html

### Sourcemaps

It would be nice if source maps were generated but this isn't
a priority, if it add nontrivial complexity I heistant to
prioritise it at this stage.

