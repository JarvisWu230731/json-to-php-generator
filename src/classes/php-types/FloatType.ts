import PhpType from "@/classes/php-types/PhpType";
import Settings from "@/classes/dto/Settings";

export default class FloatType implements PhpType {
    private readonly name: string;
    private nullable = false;
    private settings: Settings | null = null;

    public constructor(name: string) {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public getType(): string {
        return 'float';
    }

    public getDocblockContent(): string {
        return "@var float";
    }

    public isDocblockRequired(): boolean {
        return false;
    }

    public isNullable(): boolean {
        return this.nullable;
    }

    public setNullable(nullable: boolean): void {
        this.nullable = nullable;
    }

    public setSettings(settings: Settings | null): void {
        this.settings = settings;
    }
}