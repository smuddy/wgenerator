import {AuthMessagePipe} from './auth-message.pipe';

describe('AuthMessagePipe', () => {
  it('create an instance', () => {
    const pipe = new AuthMessagePipe();
    expect(pipe).toBeTruthy();
  });
});
