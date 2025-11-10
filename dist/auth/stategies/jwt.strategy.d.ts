import { JwtPayload } from '../dto/response/JwtPayload.dto';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: JwtPayload): Promise<{
        userId: string;
        role: string;
    }>;
}
export {};
