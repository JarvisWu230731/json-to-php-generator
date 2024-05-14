import Settings from '@/dto/Settings';
import ArrayType from '@/php-types/ArrayType';
import PhpSetterPresenter from '@/presenters/PhpSetterPresenter';
import PhpDocblockPresenter from '@/presenters/PhpDocblockPresenter';
import PhpPropertyTypePresenter from '@/presenters/PhpPropertyTypePresenter';
import PhpProperty from '@/dto/PhpProperty';
import CodeWriter from '@/writers/CodeWriter';
import {PhpVisibility} from '@/enums/PhpVisibility';
import PhpClassType from '@/php-types/PhpClassType';
import StdClassType from '@/php-types/StdClassType';

export default class PhpClassToJsonMethodPresenter {
    private readonly paramName = 'data';
    private readonly paramVar = `$${this.paramName}`;
    private readonly propertyTypePresenter: PhpPropertyTypePresenter[];
    private readonly settings: Settings;

    public constructor(propertyTypePresenter: PhpPropertyTypePresenter[], settings: Settings) {
        this.propertyTypePresenter = propertyTypePresenter;
        this.settings = settings;
    }

    public write(codeWriter: CodeWriter): void {
        const paramType = this.settings.jsonIsArray ? new ArrayType() : new StdClassType();

        const arrayPresenter = new PhpPropertyTypePresenter(
            new PhpProperty(this.paramName).add(paramType),
            this.settings
        );

        (new PhpDocblockPresenter(this.settings, [arrayPresenter], 'self')).write(codeWriter);

        codeWriter.openMethod(
            PhpVisibility.Public,
            'toArray',
            'array',
            [`${paramType.getType()} ${this.paramVar}`],
            {isStatic: false}
        );

        this.writeWithConstructor(codeWriter);
        codeWriter.closeMethod();
    }

    private writeWithConstructor(codeWriter: CodeWriter): void {
        codeWriter.writeLine('return [');
        codeWriter.indent();

        for (let i = 0; i < this.propertyTypePresenter.length; i++) {
            const presenter = this.propertyTypePresenter[i];

            const lines = this.getPropertyFromData(presenter);

            if (lines[lines.length - 1] && i !== this.propertyTypePresenter.length - 1) {
                lines[lines.length - 1] += ',';
            }

            PhpClassToJsonMethodPresenter.writeLines(codeWriter, lines);
        }

        codeWriter.outdent();
        codeWriter.writeLine(');');
    }

    private static writeLines(codeWriter: CodeWriter, lines: string[]): void {
        for (let i = 0; i < lines.length; i++) {
            if (i === 0) {
                codeWriter.writeLine(lines[i]);

                if (lines.length > 1) {
                    codeWriter.indent();
                }
                continue;
            }

            if (i === lines.length - 1) {
                codeWriter.outdent();
                codeWriter.writeLine(lines[i]);
                continue;
            }

            codeWriter.writeLine(lines[i]);
        }
    }

    private getPropertyFromData(typePresenter: PhpPropertyTypePresenter): string[] {
        
        const property = typePresenter.getProperty();

        const classArrayType = property.getTypes()
            .find(type => type instanceof ArrayType && type.isPhpClassArray()) as ArrayType | undefined;

        if (classArrayType) {
            const lines: string[] = [];

            const phpClassType = classArrayType.getPhpClass();

            if (classArrayType.isPhpClassArray() && phpClassType) {
                lines.push(
                    `'${this.paramVar}' => array_map(static function(${property.getTypes().map(p => p.getFieldContent()).join('|') + (property.isNullable() ? '|null' : '')} $field) {`
                );
    
                let line ='return ';
                line += '$field->toArray();'
                lines.push(line);
            } else {
                lines.push(
                    `'${this.paramVar}' => array_map(static function($field) {`
                );
    
                let line ='return ';
                line += '$field;';
                lines.push(line);
            }
            lines.push(`}, $this->${typePresenter.getProperty().getName()}`);
            return lines;
        }

        return [`'${this.paramVar}' => $this->${typePresenter.getProperty().getName()}`];
    }
}