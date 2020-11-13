# @wezom/dynamic-modules-import

![Typescript support badge](https://img.shields.io/badge/types-TypeScript-blue)
[![BSD-3-Clause License badge](https://img.shields.io/github/license/WezomAgency/dynamic-modules-import)](https://github.com/WezomAgency/dynamic-modules-import/blob/master/LICENSE)
[![NPM package badge](https://img.shields.io/badge/npm-install-orange.svg)](https://www.npmjs.com/package/@wezom/dynamic-modules-import)
![Test and Build](https://github.com/WezomAgency/dynamic-modules-import/workflows/Test%20and%20Build/badge.svg)

_A library for defining the modules used on the page and loading them asynchronously on demand_

## Coverage

| Statements                                                         | Branches                                                            | Functions                                                         | Lines                                                         |
| ------------------------------------------------------------------ | ------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/Coverage-30%25-red.svg) | ![Branches](https://img.shields.io/badge/Coverage-40.91%25-red.svg) | ![Functions](https://img.shields.io/badge/Coverage-20%25-red.svg) | ![Lines](https://img.shields.io/badge/Coverage-30%25-red.svg) |

## Usage

### Install npm package

```bash
npm i @wezom/dynamic-modules-import
```

### Import to your codebase

By default, we distribute our lib as is - original TypeScript files, without transpiling to ES5 or ES6.

```ts
// import original ts code
// but requires not to be exclude in `node_modules`
// chelk your `tsconfig.json`
import { create } from '@wezom/dynamic-modules-import';
```

You can import compiled files from special folders.

```js
// ES6: const, let, spread, rest and other modern JavaScript features
// but requires addinitoal transpiling with your codebase
// check your `babebl-loader` (if your use webpack as bandler)
import { create } from '@wezom/dynamic-modules-import/dist/es-6';
// or ES5: no ES6 features but ready for use without transpiling
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
// modules/some-module
import $ from 'jquery';
import DMI from 'modules/dmi';

export default () => {
    const $someModuleContainer = $('#some-module-container');
    const $button = $someModuleContainer.find('button');
    $button.on('click', () => {
        DMI.importModule('handleSomeModule', $someModuleContainer);
    });
}
```

#### Modules that are imported

Modules that are imported must export default method!  
Method will receive jQuery elements as first argument.  
That will be elements for the current module filtered by `filter` prop (see "create" section)

```ts
// modules/slider-module.ts
import 'heavy-slider-from-node_modules';
export default ($elements: JQuery) => {
    $elements.slider({/* options */});
}
```
