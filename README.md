# @wezom/dynamic-modules-import

![Typescript first](https://img.shields.io/badge/TypeScript-First-blue)
[![BSD-3-Clause License badge](https://img.shields.io/github/license/WezomAgency/dynamic-modules-import)](https://github.com/WezomAgency/dynamic-modules-import/blob/master/LICENSE)
[![NPM package badge](https://img.shields.io/badge/npm-install-orange.svg)](https://www.npmjs.com/package/@wezom/dynamic-modules-import)
![Test and Build](https://github.com/WezomAgency/dynamic-modules-import/workflows/Test%20and%20Build/badge.svg)

_A library for defining the modules used on the page and loading them asynchronously on demand_

## Coverage

| Statements                                                         | Branches                                                            | Functions                                                         | Lines                                                         |
| ------------------------------------------------------------------ | ------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/Coverage-30%25-red.svg) | ![Branches](https://img.shields.io/badge/Coverage-40.91%25-red.svg) | ![Functions](https://img.shields.io/badge/Coverage-20%25-red.svg) | ![Lines](https://img.shields.io/badge/Coverage-30%25-red.svg) |

## Table of Content:

1. [Usage](#usage)
    1. [Install npm package](#install-npm-package)
    1. [Import to your codebase](#import-to-your-codebase)
    1. [Create](#create)
    1. [Modules that are imported](#modules-that-are-imported)
1. [Create options](#create-options)
    1. [selector](#selector)
    1. [modules](#modules)
    1. [debug](#debug)
    1. [pendingCssClass](#pendingcssclass)
    1. [loadedCssClass](#loadedcssclass)
    1. [errorCssClass](#errorcssclass)
1. [API](#api)
    1. [Properties](#properties)
    1. [Methods](#methods)

## Usage

### Install npm package

```bash
npm i @wezom/dynamic-modules-import
```

### Import to your codebase

By default, we distribute our lib as is - original TypeScript files, without transpiling to ES5 or ES6.

```ts
// Import original ts code
// but requires to be not exclude in `node_modules`.
// Chelk your `tsconfig.json`
import { create } from '@wezom/dynamic-modules-import';
```

You can import compiled files from special folders.

```js
// ES6: const, let, spread, rest and other modern JavaScript features
// but requires to be not exclude in `node_modules`.
// Check your `babebl-loader` (if your use webpack as bandler)
import { create } from '@wezom/dynamic-modules-import/dist/es-6';
// or ES5: no ES6 features but ready for use as is, without transpiling
import { create } from '@wezom/dynamic-modules-import/dist/es-5';
```

### Create

We recommend, that create and setup DMI object in a single module and then import it to your other modules for usage

```ts
// modules/dmi.ts
import { create } from '@wezom/dynamic-modules-import';

export default create({
	selector: '.my-js-selector',
	modules: {
		handleFormModule: {
			filter: 'form',
			importFn: () => import('modules/form-module')
		},
		handleSliderModule: {
			filter: '.js-slider',
			importFn: () => import('modules/slider-module')
		}
	}
});
```

```ts
// app.ts
import $ from 'jquery';
import DMI from 'modules/dmi';

$(() => {
	const $root = $('#root');
	DMI.importAll($root);
});
```

Also, you can import each module directly with your custom behavior

```ts
// modules/some-module.ts
import $ from 'jquery';
import DMI from 'modules/dmi';

export default () => {
	const $someModuleContainer = $('#some-module-container');
	const $button = $someModuleContainer.find('button');
	$button.on('click', () => {
		DMI.importModule('handleSomeModule', $someModuleContainer);
	});
};
```

#### Modules that are imported

Your dynamic modules must export `default` method!  
Method will receive jQuery elements as first argument.  
That will be elements for the current module filtered by `filter` prop (see "create" section)

```ts
// modules/slider-module.ts
import 'heavy-slider-from-node_modules';
export default ($elements: JQuery) => {
	$elements.slider({
		/* options */
	});
};
```

---

## Create options

### `selector`

_required_  
type: `JQuery.Selector`

### `modules`

_required_  
type: `Object<DMIModule>`

Each module provided by DMIModule interface

```ts
interface DMIModule {
	filter:
		| JQuery.Selector
		| JQuery.TypeOrArray<Element>
		| JQuery
		| ((this: Element, index: number, element: Element) => boolean);
	importFn(stats: DMIModuleStats): Promise<any>;
	importCondition?(
		$elements: JQuery,
		$container: JQuery,
		stats: DMIModuleStats
	): boolean;
}
```

#### `modules[moduleName].filter`

Method that has signature like [`jQuery.fn.filter`](https://api.jquery.com/filter/) and works in same way;

```ts
// example
const modules = {
    moduleA: {
        filter: 'form',
        // ...
    },
    moduleB: {
        filter(index) {
            return $("strong", this).length === 1;
        },
        // ...
    }
}
```

#### `modules[moduleName].importFn`

You own method for importing module

```ts
// example
const modules = {
    moduleA: {
        importFn: () => import('my-module'),
        // ...
    },
    moduleB: {
        importFn: async () => {
            await someGlobals();
            return import('my-dependent-module'); 
        },
        // ...
    }
}
```

#### `modules[moduleName].importCondition`

You own way to determinate for allowed importing

> Note! DMI will not observe by any changes that can be happen in your page or app.
> So you need yourself re-invoke DMI if something changed and you need to react that with your `importCondion`

```ts
// example
const modules = {
    moduleA: {
        importCondition: () => {
            // I want to load module only if there more than 20 HTML <p> elements on current invoke
            return $('p').length > 20; 
        },
        // ...
    }
}
```


### `debug`

_optional_  
type: `boolean`  
default: `false`

### `pendingCssClass`

_optional_  
type: `string`  
default: `'_dmi-is-pending'`

### `loadedCssClass`

_optional_  
type: `string`  
default: `'_dmi-is-loaded'`

### `errorCssClass`

_optional_  
type: `string`  
default: `'_dmi-has-error'`


---

## API

### Properties

All props are readonly. You cannot change them after creation.

#### `debug`

type: `boolean`  
value: depends on [create option `debug`](#debug)

#### `selector`

type: `JQuery.Selector`  
value: depends on [create option `selector`](#selector)

#### `pendingCssClass`

type: `string`  
value: depends on [create option `pendingCssClass`](#pendingcssclass)

#### `pendingEvent`

type: `string`  
value: `"dmi:pending"`

#### `loadedCssClass`

type: `string`  
value: depends on [create option `loadedCssClass`](#loadedcssclass)

#### `loadedEvent`

type: `string`  
value: `"dmi:loaded"`

#### `errorCssClass`

type: `string`  
value: depends on [create option `errorCssClass`](#errorcssclass)

#### `errorEvent`

type: `string`  
value: `"dmi:error"`

### Methods

#### importAll()

```
// signature
importAll(
    $container?: JQuery,
    awaitAll?: boolean,
    ignoreImportCondition?: boolean
): Promise<any>;
```

#### importModule()

```
// signature
importModule(
    moduleName: string,
    $container?: JQuery,
    ignoreImportCondition?: boolean
): Promise<any>;
```
