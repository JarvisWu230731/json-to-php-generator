import PhpType from '@/php-types/PhpType';

export default class FloatType extends PhpType {
    public getFieldContent(): string {
        return 'float';
    }

    public getType(): string {
        return 'float';
    }

    public getDocblockContent(): string {
        return 'float';
    }

    public isDocblockRequired(): boolean {
        return false;
    }
}