import PhpType from '@/php-types/PhpType';

export default class IntType extends PhpType {
    public getType(): string {
        return 'int';
    }

    public getDocblockContent(): string {
        return 'int';
    }

    public isDocblockRequired(): boolean {
        return false;
    }

    public getFieldContent(): string {
        return 'int';
    }
}