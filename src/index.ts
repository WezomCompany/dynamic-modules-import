import JQuery from 'jquery';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface DynamicModulesImportModule {
	fileName: string;
	filterSelector: JQuery.Selector;
	importCondition(
		$elements: JQuery,
		$container: JQuery,
		stats: {
			moduleName: string;
			importConditionAllowed: boolean;
		}
	): boolean;
}

interface DynamicModulesImportOptions {
	resolver(fileName: string): Promise<any>;
	selector: JQuery.Selector;
	modules: Record<string, DynamicModulesImportModule>;
	debug?: boolean;
	loadedCssClass?: string;
	pendingCssClass?: string;
	executedCssClass?: string;
}

interface DynamicModulesImport {
	readonly debug: boolean;
	readonly selector: JQuery.Selector;
	readonly pendingCssClass: string;
	readonly loadedCssClass: string;
	readonly executedCssClass: string;
	importModule(
		moduleFileName: string,
		$container: JQuery,
		force?: boolean
	): Promise<any>;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Create
// -----------------------------------------------------------------------------

export const create = ({
	modules,
	selector,
	debug,
	pendingCssClass,
	loadedCssClass,
	executedCssClass
}: DynamicModulesImportOptions): DynamicModulesImport => {
	const log = (message: string) => {
		if (debug) {
			console.log(message);
		}
	};

	const getElements = ($container: JQuery, selector: JQuery.Selector): JQuery => {
		const $elements = $container.find(selector);
		if ($elements.length <= 0) {
			log(`No import elements with selector "${selector}"`);
		}
		return $elements;
	};

	const resolveWithErrors = (moduleName: string) => {
		console.warn(
			`ModuleDynamicImport WARN! Module "${moduleName}" resolved width errors!!!`
		);
		return Promise.resolve();
	};

	const importFn = (
		moduleName: string,
		$elements: JQuery,
		$container: JQuery,
		force: boolean
	) => {
		// eslint-disable-next-line no-prototype-builtins
		if (modules.hasOwnProperty(moduleName)) {
			return Promise.resolve();
		} else {
			return resolveWithErrors(moduleName);
		}
	};

	const DMI: DynamicModulesImport = {
		get debug() {
			return debug === true;
		},
		get selector() {
			return selector;
		},
		get pendingCssClass() {
			return pendingCssClass || '_import-pending';
		},
		get loadedCssClass() {
			return loadedCssClass || '_import-loaded';
		},
		get executedCssClass() {
			return executedCssClass || '_import-executed';
		},
		importModule(moduleName: string, $container = JQuery('body'), force?: boolean) {
			const $elements = getElements($container, this.selector);
			if ($elements.length === 0) {
				return Promise.resolve();
			}
			return importFn(moduleName, $elements, $container, force === true);
		}
	};

	DMI.importModule.bind(DMI);
	return DMI;
};

const dmi = create();
