// -----------------------------------------------------------------------------
// Deps
// -----------------------------------------------------------------------------

import { create } from '../index';
import { fakeResolver } from './helpers';

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe('option "pendingCssClass"', () => {
	test('default value', () => {
		const dmi = create({
			resolver: fakeResolver,
			modules: {},
			selector: '.js-import'
		});
		expect(dmi.pendingCssClass).toEqual('_dmi-is-pending');
	});
	test('custom value', () => {
		const dmi = create({
			resolver: fakeResolver,
			modules: {},
			selector: '.js-import',
			pendingCssClass: '_my-custom-pending-class-name'
		});
		expect(dmi.pendingCssClass).toEqual('_my-custom-pending-class-name');
	});
});

describe('option "loadedCssClass"', () => {
	test('default value', () => {
		const dmi = create({
			resolver: fakeResolver,
			modules: {},
			selector: '.js-import'
		});
		expect(dmi.loadedCssClass).toEqual('_dmi-is-loaded');
	});
	test('custom value', () => {
		const dmi = create({
			resolver: fakeResolver,
			modules: {},
			selector: '.js-import',
			loadedCssClass: '_my-custom-loaded-class-name'
		});
		expect(dmi.loadedCssClass).toEqual('_my-custom-loaded-class-name');
	});
});

describe('option "errorCssClass"', () => {
	test('default value', () => {
		const dmi = create({
			resolver: fakeResolver,
			modules: {},
			selector: '.js-import'
		});
		expect(dmi.errorCssClass).toEqual('_dmi-has-error');
	});
	test('custom value', () => {
		const dmi = create({
			resolver: fakeResolver,
			modules: {},
			selector: '.js-import',
			errorCssClass: '_my-custom-error-class-name'
		});
		expect(dmi.errorCssClass).toEqual('_my-custom-error-class-name');
	});
});

describe('option "selector"', () => {
	test('custom value', () => {
		const dmi = create({
			resolver: fakeResolver,
			modules: {},
			selector: '.js-import'
		});
		expect(dmi.selector).toEqual('.js-import');
	});
});

describe('option "debug"', () => {
	test('default value', () => {
		const dmi = create({
			resolver: fakeResolver,
			modules: {},
			selector: '.js-import'
		});
		expect(dmi.debug).toEqual(false);
	});
	test('custom value', () => {
		const dmi = create({
			resolver: fakeResolver,
			modules: {},
			selector: '.js-import',
			debug: true
		});
		expect(dmi.debug).toEqual(true);
	});
});
