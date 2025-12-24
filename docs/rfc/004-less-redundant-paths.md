# RFC 004, less redundant paths

> Status: Done 12/06/2025

Currently if you go through the directory `lib/app` you'll
see this monstrosty of a directory layout.

```
lib/app
├── lib/app/prelude.js
├── lib/app/sec-1101
│   └── lib/app/sec-1101/app-1101.1
│       └── lib/app/sec-1101/app-1101.1/index.js
├── lib/app/sec-c
│   ├── lib/app/sec-c/sec-c.1
│   │   ├── lib/app/sec-c/sec-c.1/app-c.1.1
│   │   │   └── lib/app/sec-c/sec-c.1/app-c.1.1/index.js
│   │   ├── lib/app/sec-c/sec-c.1/app-c.1.2
│   │   │   └── lib/app/sec-c/sec-c.1/app-c.1.2/index.js
│   │   ├── lib/app/sec-c/sec-c.1/app-c.1.3
│   │   │   └── lib/app/sec-c/sec-c.1/app-c.1.3/index.js
│   │   └── lib/app/sec-c/sec-c.1/app-c.1.4
│   │       └── lib/app/sec-c/sec-c.1/app-c.1.4/index.js
│   ├── lib/app/sec-c/sec-c.2
│   │   └── lib/app/sec-c/sec-c.2/app-c.2.1
│   │       └── lib/app/sec-c/sec-c.2/app-c.2.1/index.js
│   ├── lib/app/sec-c/sec-c.3
│   │   └── lib/app/sec-c/sec-c.3/app-c.3.1
│   │       └── lib/app/sec-c/sec-c.3/app-c.3.1/index.js
│   ├── lib/app/sec-c/sec-c.4
│   │   └── lib/app/sec-c/sec-c.4/app-c.4.1
│   │       └── lib/app/sec-c/sec-c.4/app-c.4.1/index.js
│   ├── lib/app/sec-c/sec-c.5
│   │   └── lib/app/sec-c/sec-c.5/app-c.5.1
│   │       └── lib/app/sec-c/sec-c.5/app-c.5.1/index.js
│   ├── lib/app/sec-c/sec-c.6
│   │   └── lib/app/sec-c/sec-c.6/app-c.6.1
│   │       └── lib/app/sec-c/sec-c.6/app-c.6.1/index.js
│   ├── lib/app/sec-c/sec-c.7
│   │   └── lib/app/sec-c/sec-c.7/app-c.7.1
│   │       └── lib/app/sec-c/sec-c.7/app-c.7.1/index.js
│   └── lib/app/sec-c/sec-c.8
│       └── lib/app/sec-c/sec-c.8/app-c.8.1
│           └── lib/app/sec-c/sec-c.8/app-c.8.1/index.js
└── lib/app/sec-d
    ├── lib/app/sec-d/app-d.1
        │   └── lib/app/sec-d/app-d.1/index.js
            └── lib/app/sec-d/app-d.2
                    └── lib/app/sec-d/app-d.2/index.js
```

Lets Cleant this up so this:

```
lib/app
├── lib/app/prelude.js
├── lib/app/sec-1101
│   └── lib/app/sec-1101/app-1101.1
│       └── lib/app/sec-1101/app-1101.1/index.js
├── lib/app/sec-c
│   ├── lib/app/sec-c/sec-c.1
│   │   ├── lib/app/sec-c/sec-c.1/app-c.1.1
│   │   │   └── lib/app/sec-c/sec-c.1/app-c.1.1/index.js
```

Becomes this.

```
lib/app
├── lib/app/prelude.js
├── lib/app/sec-1101
│   └── lib/app/sec-1101/sec-1
│       └── lib/app/sec-1101/sec-1/index.js
├── lib/app/sec-c
│   ├── lib/app/sec-c/sec-1
│   │   ├── lib/app/sec-c/sec-1/sec-1
│   │   │   └── lib/app/sec-c/sec-1/sec-1/index.js
```

If it's not obvious this is the before and after of the first example

- before `lib/app/sec-1101/app-1101.1/index.js`
  - after `lib/app/sec-1101/sec-1/index.js`
- before `lib/app/sec-c/sec-c.1/app-c.1.1/index.js`
  - after `lib/app/sec-c/sec-1/sec-1/index.js`

It's not perfect but it's less worse.

## Idea Graveyard

An alternative layout. Maybe we'll pursue this if the current proposal is still annoying

```
lib/app
├── lib/app/sec-1101
│   ├── lib/app/app-1101.1/index.js
│   ├── lib/app/app-c.1.1/index.js
│   ├── lib/app/app-c.1.2/index.js
│   ├── lib/app/app-c.1.3/index.js
│   └── lib/app/app-c.1.4/index.js
```

## Implementation

1. Add script to show updated paths
2. Once it starts showing correct paths run it to update paths

