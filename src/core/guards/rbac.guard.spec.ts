import { RbacGuard } from './rbac.guard';

describe('RbacGuard', () => {
  it('should be defined', () => {
    // @ts-ignore
    expect(new RbacGuard()).toBeDefined();
  });
});
