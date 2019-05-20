# API - Create Hook App

## UTF Icons

Those icons are uses as part of hooks names, the purpose is to facilitate the
reading of a trace in the console.

- ◇ reserved to createHookApp
- → services
- ▶ features
- ♦ high level hooks (es booting logs)

**NOTE:** if you don't agree with this, use whathever makes you happy :-)

## Booth Phases

1. register services
2. create startup hooks
3. register features
4. create init hooks
5. create start hooks
6. create cleanup hooks


## Boot Hooks

Startup Phase:

    name:   ◇ start
    async:  serie
    args:   { ...settings }
    
    name:   ◇ settings
    async:  serie
    args:   { settings }
    NOTES:  hooks can actually change the content of "settings"
            useful to let some high level logic to fetch settings from 
            `process.env` in a very visible way

Init Phase:

    name:   ◇ init::service
    async:  serie
    args:   { ...settings }

    name:   ◇ init::services
    async:  parallel
    args:   { ...settings }

    name:   ◇ init::feature
    async:  serie
    args:   { ...settings }

    name:   ◇ init::features
    async:  parallel
    args:   { ...settings }

Start Phase:

    name:   ◇ start::service
    async:  serie
    args:   { ...settings }

    name:   ◇ start::services
    async:  parallel
    args:   { ...settings }

    name:   ◇ start::feature
    async:  serie
    args:   { ...settings }

    name:   ◇ start::features
    async:  parallel
    args:   { ...settings }

Cleanup:

    name:   ◇ finish
    async:  serie
    args:   { ...settings }
