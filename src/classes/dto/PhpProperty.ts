import PhpType from '@/classes/php-types/PhpType';
import Settings from '@/classes/dto/Settings';
import NullType from '@/classes/php-types/NullType';

export default class PhpProperty {
    private readonly name: string;
    private types: PhpType[] = [];
    private nullable = false;
    private settings: Settings = new Settings;

    public constructor(name: string) {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public getTypes(): PhpType[] {
        return this.types;
    }

    public add(type: PhpType): this {
        if (type instanceof NullType) {
            this.nullable = true;
            return this;
        }

        if (this.types.some(t => t.constructor === type.constructor)) {
            return this;
        }

        this.types.push(type);

        return this;
    }

    public merge(property: PhpProperty): this {
        for (const type of property.getTypes()) {
            this.add(type);
        }

        if (property.isNullable()) {
            this.makeNullable();
        }

        return this;
    }

    public setSettings(settings: Settings): void {
        this.settings = settings;
        this.types.forEach(type => type.setSettings(settings));
    }

    public makeNullable(): void {
        this.add(new NullType);
    }

    public isNullable(): boolean {
        return this.nullable;
    }

    public isDocblockRequired(): boolean {
        return this.types.length > 1
            || this.types.some(type => type.isDocblockRequired());
    }
}
