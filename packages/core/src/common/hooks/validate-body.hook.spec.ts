// std
import { notStrictEqual, ok, strictEqual } from 'assert';

// FoalTS
import { Context, getHookFunction, HttpResponseBadRequest, ServiceManager } from '../../core';
import { ValidateBody } from './validate-body.hook';

describe('ValidateBody', () => {

  it('should not return an HttpResponseBadRequest if ctx.request.body is validated '
      + ' by ajv for the given schema.', () => {
    const schema = {
      properties: {
        foo: { type: 'integer' }
      },
      type: 'object',
    };
    const hook = getHookFunction(ValidateBody(schema));
    const ctx = new Context({});
    ctx.request.body = {
      foo: 3
    };

    const actual = hook(ctx, new ServiceManager());
    strictEqual(actual instanceof HttpResponseBadRequest, false);
  });

  it('should return an HttpResponseBadRequest if ctx.request.body is not validated by '
      + ' ajv for the given schema.', () => {
    const schema = {
      properties: {
        foo: { type: 'integer' }
      },
      type: 'object',
    };
    const hook = getHookFunction(ValidateBody(schema));

    function context(body) {
      const ctx = new Context({});
      ctx.request.body = body;
      return ctx;
    }

    ok(hook(context(null), new ServiceManager()) instanceof HttpResponseBadRequest);
    ok(hook(context(undefined), new ServiceManager()) instanceof HttpResponseBadRequest);
    ok(hook(context('foo'), new ServiceManager()) instanceof HttpResponseBadRequest);
    ok(hook(context(3), new ServiceManager()) instanceof HttpResponseBadRequest);
    ok(hook(context(true), new ServiceManager()) instanceof HttpResponseBadRequest);
    ok(hook(context({ foo: 'a' }), new ServiceManager()) instanceof HttpResponseBadRequest);
  });

  it('should return an HttpResponseBadRequest with a defined `body` property if '
      + 'ctx.request.body is not validated by ajv.', () => {
    const schema = {
      properties: {
        foo: { type: 'integer' }
      },
      type: 'object',
    };
    const hook = getHookFunction(ValidateBody(schema));
    const ctx = new Context({});

    const actual = hook(ctx, new ServiceManager());
    ok(actual instanceof HttpResponseBadRequest);
    notStrictEqual((actual as HttpResponseBadRequest).body, undefined);
  });

});
