# Service Meta

Loads configuration from text files in _JSON_ format.  
<small>(_YAML_ will come)</small>

- {file_name}.{env_name}.json
- {file_name}.{suffix_name}.json
- {file_name}.json

The sourced content will be available in the App's context in a key that reflects the file name without the extension:

```js
getContext("meta.{fileName}.key.key");
```

## Config

### meta.path

Change the source for the meta files that should be sourced.

Default: `/var/lib/meta`

### meta.local

Change the local suffix to look for when sourcing the file.

Default: `locale`

### meta.source

List of the files to source. Use full name with extension (.json) but without suffix.

Default: `[]`

## Extensions

### $META_SOURCE

```js
const f1 = {
  target: "$META_SOURCE",
  handler: () => "file_name.json"
};
```
