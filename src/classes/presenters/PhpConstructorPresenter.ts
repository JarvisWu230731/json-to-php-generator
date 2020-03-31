import PhpTypePresenter from "@/classes/presenters/PhpTypePresenter";
import Settings from "@/classes/dto/Settings";
import PhpMethodDocblockPresenter from "@/classes/presenters/PhpMethodDocblockPresenter";

export default class PhpConstructorPresenter {
    private readonly typePresenters: PhpTypePresenter[];
    private readonly settings: Settings;

    public constructor(typePresenters: PhpTypePresenter[], settings: Settings) {
        this.typePresenters = typePresenters;
        this.settings = settings;
    }

    public toString(): string {
        let content = '\n';

        if (this.settings.addDocBlocks) {
            content += (new PhpMethodDocblockPresenter(this.typePresenters)).toString();
        }

        content += '\tpublic constructor(' + this.typePresenters.map(property => property.getPhpVarWithType()).join(', ') +') \n';
        content +='\t{\n';
        content += this.typePresenters.map(item => '\t\t$this->' + item.getPhpVarName() + ' = ' + item.getPhpVar()).join(';\n') + ';\n';
        content += '\t}\n';

        return content;
    }
}