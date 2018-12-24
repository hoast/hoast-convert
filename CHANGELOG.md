# Changelog

## 2.0.0 (2018-12-24)
For hoast `v1.1.5`.
### Changed
+ Instead of only being able to only convert utf-8 content, the file's entire data is made available using the first parameter of the engine function.
+ Rewrote existing test into multiple more specific tests.
### Removed
+ the `extension` option is removed and can be manually done by accessing the `path` property of the file. To replace an extension use the following code `file.path.substring(0, file.lastIndexOf('.')).concat('.extension')`, whereby `.extension` is the desired new extension.

> Do note options have changed, and are not backwards compatible.

## 1.1.1 (2018-10-24)
For hoast `v1.1.1`.
### Changed
+ Updated dependencies.
+ Updated to reflect changes to `hoast`'s helpers.

## 1.1.0 (2018-10-18)
For hoast `v1.1.0`.
### Changed
+ Reduced module complexity by using new `hoast.helper.parse` and `hoast.helper.match` helper functions.

## 1.0.1 (2018-09-28)
For hoast `v1.0.0`.
### Changed
+ Updated `planckmatch` module from version `1.0.0` to `1.0.1`.

## 1.0.0 (2018-09-26)
For hoast `v1.0.0`.
### Added
+ CodeCov coverage report added to CI workflow.
### Changed
+ Restructured project files.
+ Switched from using `nanomatch` to [`planckmatch`](https://github.com/redkenrok/node-planckmatch#readme) for filtering file paths.

> Do note options have changed, and are not backwards compatible.

## 0.1.0 (2018-08-21)
Initial release, for hoast `v0.1.0`.