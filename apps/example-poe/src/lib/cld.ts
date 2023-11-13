import { LanguageIdentifier, loadModule } from "cld3-asm";

export class Cld3 {
	cld3Instance!: LanguageIdentifier;

	constructor() {
		this.init();
	}

	async init() {
		const factory = await loadModule();
		this.cld3Instance = factory.create();
	}

	findLanguage(text: string) {
		return this.cld3Instance.findLanguage(text);
	}
}

const cld3 = new Cld3();
export default cld3;
