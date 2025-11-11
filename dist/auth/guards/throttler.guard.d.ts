import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';
export declare class CustomThrottlerGuard extends ThrottlerGuard {
    protected throwThrottlingException(context: ExecutionContext, throttlerLimitDetail: ThrottlerLimitDetail): Promise<void>;
}
